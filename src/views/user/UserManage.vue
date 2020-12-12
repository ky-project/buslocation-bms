<template>
  <div id="user_manager">
    <!-- 操作区 -->
    <el-row class="console">
      <el-col :span="20">
        <el-form :inline="true" class="console-form">
          <el-form-item label="姓名">
            <el-input v-model="consoleForm.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="consoleForm.workId" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="consoleForm.departmentId" placeholder="请选择部门">
              <el-option v-for="item in searchDepartments" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHandler">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button class='add-btn' type="primary" @click="addHandler">添加</el-button>
      </el-col>
    </el-row>
    <!-- 数据表 -->
    <el-row class="table-wrap">
        <el-table
            :data="pageData"
            border
            stripe
            style="width: 100%"
            size="small"
            empty-text="——暂无数据——"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle">
            <el-table-column
                prop="departmentName"
                label="部门"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="realName"
                label="真实姓名"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话号码"
                min-width="120">
            </el-table-column>
            <el-table-column
                prop="idCard"
                label="身份证"
                min-width="150">
            </el-table-column>
            <el-table-column
                prop="workId"
                label="职工编号"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                min-width="150"
            >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                min-width="70"
            >
              <template slot-scope="scope">
                <el-button 
                  @click="editHandler(scope.row)" 
                  type="text" 
                  size="small"
                  class="editBtn">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button 
                  type="text" 
                  size="small"
                  class="delBtn"
                  @click="deleteHandler(scope.row)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageOption.currentPage"
        :page-sizes="pageOption.pageSizes"
        :page-size="pageOption.pageSize"
        :layout="pageOption.layout"
        :total="pageOption.total">
      </el-pagination>
    </el-row>
    <!-- 弹窗 -->
    <UserDialog 
      :dialogOption="dialogOption"
      :dialogData="dialogData"
      :departments="departments"
      @add="addUser"
      @edit="editUser"/>
  </div>
</template>
<script>
export default {
    data() {
        return {
          headerCellStyle: {
            'background-color': '#FAFAFA',
            'font-size': '14px',
            'line-height': '32px',
            'text-align': 'center'
          },
          cellStyle: {
            'text-align': 'center'
          },
          totalData: [],
          pageOption: {
            currentPage: 1,
            pageSizes: [5,10,20,50],
            pageSize: 5,
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
          },
          dialogOption: {
            visible: false,
            title: '',
            type: '',
          },  
          dialogData: {
            department: {
              id: '',
            },
            workId: '',
            realName: '',
            password: '',
            idCard: '',
            phone: '',
            email: '',
          },
          searchDepartments: [],
          departments: [],
          consoleForm: {
            realName: '',
            departmentId: '',
            workId: '',
          }
        }
    },
    components: {
      UserDialog: () => import ('./../../components/UserDialog.vue') //懒加载
    },
    created: function(){
      this.getAllData();
      this.getDepartment();
    },
    computed: {
      pageData: function(){
        let start = (this.pageOption.currentPage-1) * this.pageOption.pageSize;
        return this.totalData.filter((item,index)=>index >= start && index < start + this.pageOption.pageSize);
      },
    },
    watch: {
      totalData: function(newData){
        this.pageOption.total = newData.length;
      }
    },
    methods: {
      //获取所有用户信息
      getAllData: function(){
        this.$axios.get('/busposition/m/user/list')
          .then(res=>{
            console.log(res.data.data);
            this.totalData = res.data.data;
          })
      },
      //获取部门信息
      getDepartment(){
          this.$axios.get('/busposition/m/department/base/info')
              .then(res => {
                  //deptId: 1
                  //deptName: "开发小组"
                  this.departments = res.data.data;
                  this.searchDepartments = JSON.parse(JSON.stringify(res.data.data));
                  this.searchDepartments.unshift({deptId: null,deptName: "全部"})
              })
      },
      handleSizeChange(val){
        this.pageOption.pageSize = val;
      },
      handleCurrentChange(val){
        this.pageOption.currentPage = val;
      },
      searchHandler(){
        //获取参数
        if(this.consoleForm.departmentId === '')
          this.consoleForm.departmentId = null;
        this.$axios.post('/busposition/m/user/f/query',this.consoleForm)
          .then(res=>{
            this.$message({
              message: '查询成功',
              type: 'success',
            })
            this.pageOption.currentPage = 1;
            this.totalData = res.data.data;
          })
      },  
      addHandler(){
        this.dialogOption = {
          visible: true,
          title: '添加用户',
          type: 'add',
        };
        this.dialogData = {
          department: {
              id: '',
          },
          workId: '',
          realName: '',
          password: '',
          idCard: '',
          phone: '',
          email: '',
        }
      },
      deleteHandler(row){
        // let self = this;
        this.$axios.post('/busposition/m/user/del',{userId: row.id})
          .then(res=>{
            this.totalData.find((item,index,array)=>{
              if(item.id == row.id){
                array.splice(index,1);
                if(!this.pageData.length && array.length){
                  this.pageOption.currentPage--;
                }
                return true;
              }
            })
            //显示提示消息
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
      },
      editHandler(row){
        //deptId: 1
        //deptName: "开发小组"
        let deptId;
        this.departments.find(item=>{
          if(item.deptName == row.departmentName){
            deptId = item.deptId;
            return true;
          }
        })
        this.dialogOption = {
          visible: true,
          title: '修改用户',
          type: 'edit',
        };
        this.dialogData = {
          department: {
              id: deptId,
          },
          workId: row.workId,
          realName: row.realName,
          password: '*****',
          idCard: row.idCard,
          phone: row.phone,
          email: row.email,
          id: row.id,
        }
      },
      addUser(user){
        this.totalData.push(user);
      },
      editUser(user){
        //根据id遍历寻找
        this.totalData.find((item,index,array)=>{
          console.log(item.id,user.id);
          if(item.id == user.id){
            array.splice(index,1,user);
            return true;
          }
        })
      },
      
    }
}
</script>
<style lang="less" scoped>
#user_manager {
  padding: 15px;
  .console {
    .console-form {
      display: inline-block;
    }
    .add-btn {
      float: right;
    }
  }
  .pagination-wrap {
    margin-top: 10px;
    text-align: center;
  }
  .el-table--small td, .el-table--small th {
    padding: 5px 0;
  }
}
</style>
