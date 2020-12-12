<template>
  <div id="bus">
    <!-- 操作区 -->
    <el-row class="console">
      <el-col :span="20">
        <el-form :inline="true" class="console-form">
          <el-form-item label="车类型">
            <el-select v-model="consoleForm.sbbBusType" placeholder="请选择车类型">
              <el-option v-for="item in busTypes" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="司机">
            <el-input v-model="consoleForm.sbbDriverName" placeholder="请输入司机名称"></el-input>
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
                prop="sbbBusType"
                label="车类型"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbbPlateNumber"
                label="车牌"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbbSeatNum"
                label="座位数"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbbDriverName"
                label="司机"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbbDriverTel"
                label="电话"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
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
    <BusDialog
      :formData="formData"
      :formOption="formOption"
      :formBusTypes="formBusTypes"
      @addBus="addBus"
      @editBus="editBus"/>
  </div>
</template>
<script>
import BusDialog from './../../components/BusDialog.vue';
export default {
  data(){
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
      consoleForm: {
        sbbBusType: '',
        sbbDriverName: '',
      },
      busTypes: [],
      totalData: [],
      pageOption: {
        currentPage: 1,
        pageSizes: [5,10,20,50],
        pageSize: 5,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
      },
      formData: {
        sbbSeatNum: '',          //座位数
        sbbDriverName: '',      //司机
        sbbPlateNumber: '',     //车牌
        sbbBusType: '',         //车类型
        sbbDriverTel: '',       //司机电话
        remark: '',             //描述/备注
        id: '',                  //id
      },
      formOption: {
        type: '',
        visible: false,
        title: ''
      },
      formBusTypes: [],
    }
  },
  components: {
    BusDialog,
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
    this.getBusTypes();
    this.getAllBusData();
  },
  methods: {
    // 获取所有校车类型
    getBusTypes(){
      this.$axios.get('/busposition/m/bus/type')
        .then(res=>{
          this.formBusTypes = JSON.parse(JSON.stringify(res.data.data));
          this.busTypes = res.data.data;
          this.busTypes.unshift("全部");
        })
    },
    // 获取所有校车信息
    getAllBusData(){
      this.$axios.get('/busposition/m/bus/list')
        .then(res=>{
          this.totalData = res.data.data;
        })
    },
    // 监听查询按钮点击事件
    searchHandler(){
      let data = JSON.parse(JSON.stringify(this.consoleForm));
      if(data.sbbBusType === '全部')
        data.sbbBusType = '';
      this.$axios.post('/busposition/m/bus/f/nameAndType',data)
        .then(res=>{
          this.$message({
              message: '查询成功',
              type: 'success',
          })
          this.pageOption.currentPage = 1;
          this.totalData = res.data.data;
        })
    },
    // 添加校车
    addHandler(){
      this.formOption = {
        title: '校车添加',
        type: 'add',
        visible: true,
      };
      this.formData = {
        sbbSeatNum: '',          //座位数
        sbbDriverName: '',      //司机
        sbbPlateNumber: '',     //车牌
        sbbBusType: '',         //车类型
        sbbDriverTel: '',       //司机电话
        remark: '',             //描述/备注
      };
    },
    // 修改校车
    editHandler(bus){
      this.formOption = {
        title: '修改校车',
        type: 'edit',
        visible: true,
      };
      this.formData = JSON.parse(JSON.stringify(bus));
    },
    // 删除校车
    deleteHandler(bus){
      this.$axios.post('/busposition/m/bus/del',{id:bus.id})
        .then(res=>{
          this.totalData.find((item,index,arr)=>{
            if(item.id == bus.id){
              arr.splice(index,1);
              if(!this.pageData.length && arr.length){
                  this.pageOption.currentPage--;
              }
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
    },
    // 添加校车数据
    addBus(bus){
      this.totalData.push(bus);
    },
    // 修改校车数据
    editBus(bus){
      this.totalData.find((item,index,arr)=>{
        if(item.id == bus.id){
          arr.splice(index,1,bus);
          return true;
        }
      })
    },
    // 监听每页显示记录条数变化
    handleSizeChange(val){
      this.pageOption.pageSize = val;
    },
    // 监听页码切换事件
    handleCurrentChange(val){
      this.pageOption.currentPage = val;
    },
  }
}
</script>
<style lang="less" scoped>
#bus {
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
