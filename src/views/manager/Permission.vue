<template>
  <div id="permission">
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
              <el-option v-for="item in departments" :label="item.deptName" :value="item.deptId" :key="item.deptId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHandler">查询</el-button>
          </el-form-item>
        </el-form>
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
                prop="workId"
                label="职工编号"
                min-width="100">
            </el-table-column>
            <el-table-column
                label="角色"
                min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.state === 'edit'">{{scope.row.srNames}}</span>
                  <el-select v-else style="width:100%" v-model="scope.row.role" multiple placeholder="请选择">
                    <el-option
                      v-for="item in roles"
                      :key="item.id"
                      :label="item.srName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
                
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                min-width="70">
              <template slot-scope="scope">
                <el-button 
                  @click="editHandler(scope.row)" 
                  type="primary" 
                  size="small"
                  plain>
                  {{scope.row.state === 'edit' ? '修改' : '保存'}}
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
  </div>
</template>
<script>
export default {
    data(){
        return {
          //表格样式
          headerCellStyle: {
            'background-color': '#FAFAFA',
            'font-size': '14px',
            'line-height': '32px',
            'text-align': 'center'
          },
          cellStyle: {
            'text-align': 'center'
          },
          departments: [],
          consoleForm: {
              realName: '',
              departmentId: '',
              workId: '',
          },
          totalData: [],
          pageOption: {
            currentPage: 1,
            pageSizes: [5,10,20,50],
            pageSize: 5,
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
          },
          roles: [],
        }
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
    created(){
      this.getAllData();
      this.getDepartment();
      this.getAllRoles();
    },
    methods: {
      //获取表格数据
      getAllData: function(){
        /*
        [
          {
              "realName": "陆宇豪",      //用户名
              "srNames": "超级管理员,教师",  //用户拥有的所有角色名，以逗号分隔
              "workId": "Xb16620208"      //用户工号
          },
          {
              "realName": "管理员",
              "srNames": "管理员,超级管理员",
              "workId": "admin"
          },
        ]
        */
        this.$axios.get('/busposition/m/userRole/list')
          .then(res=>{
            this.totalData = this.addExtraProperty(res.data.data);
          })
      },
      //添加额外属性
      addExtraProperty(data){
        data.forEach(item=>{
          item.state = 'edit'; //添加操作按钮状态
          item.role = []; //添加所选角色
        })
        return data;
      },
      //获取所有权限
      getAllRoles(){
        // [
        //     {
        //         "srName": "超级管理员",      //角色名
        //         "id": 1                         //角色id
        //     },
        //     {
        //         "srName": "教师",
        //         "id": 2
        //     }
        // ]
        this.$axios.get('/busposition/m/role/list')
            .then(res=>{
              let data = [];
              res.data.data.forEach(item=>{
                data.push({
                  srName: item.srName,
                  id: item.id,
                })
              });
              this.roles =  data;
            })
      },
      //获取部门信息
      getDepartment(){
          this.$axios.get('/busposition/m/department/base/info')
              .then(res => {
                  //deptId: 1
                  //deptName: "开发小组"
                  this.departments = res.data.data;
                  this.departments.unshift({deptId: null,deptName: "全部"})
              })
      },
      //监听页面大小变化事件
      handleSizeChange(val){
        this.pageOption.pageSize = val;
      },
      //监听当前页改变事件
      handleCurrentChange(val){
        this.pageOption.currentPage = val;
      },
      //监听查询按钮点击事件
      searchHandler(){
        // 获取参数
        if(this.consoleForm.departmentId === ''){
            this.consoleForm.departmentId = null;
        }
        this.$axios.post('/busposition/m/userRole/f/query',this.consoleForm)
          .then(res=>{
            this.$message({
              message: '查询成功',
              type: 'success',
            })
            this.pageOption.currentPage = 1;
            this.totalData = this.addExtraProperty(res.data.data);
          })
      },
      //获取角色对照表
      getRoleComparision(){
        let table = {};
        this.roles.forEach(item=>{
          let key = item.srName;
          let value = parseInt(item.id);
          table[key] = value;
        })
        return table;
      },
      editHandler(row){
        let roleComparision = this.getRoleComparision();
        //1. 如果是修改
        if(row.state === 'edit'){
          //将权限字符串转换成权限id数组
          row.srNames = row.srNames || '';
          let roleNames = row.srNames.split(',');
          let roleIds = [];
          roleNames.forEach(roleName=>{
            for(let key in roleComparision){
              if(key === roleName){
                roleIds.push(roleComparision[key])
                break;
              }
            }
          })
          this.totalData.forEach(item=>{
            if(item.id === row.id){
              item.role = roleIds;
            }
          })
        } else {
          //2. 如果是保存
          //根据用户id更新用户角色
          let data = {id: row.id,roles: row.role};
          this.$axios.post('/busposition/m/userRole/update',data)
            .then(res=>{
              //将权限id数组转换成权限字符串
              //ids: item.role
              let roleNames = [];
              row.role.forEach(roleId=>{
                for(let key in roleComparision){
                  if(roleComparision[key] === roleId){
                    roleNames.push(key);
                    break;
                  }
                }
              })
              this.totalData.forEach(item=>{
                if(item.id === row.id){
                  item.srNames = roleNames.join();
                }
              })
            })

        }
        //3. 切换按钮样式
        row.state = row.state === 'edit' ? 'save' : 'edit';
      }
    }
}
</script>
<style lang="less" scoped>
#permission {
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
