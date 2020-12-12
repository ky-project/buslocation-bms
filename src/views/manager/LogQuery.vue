<template>
  <div id="log_query">
    <!-- 操作区 -->
    <el-row class="console">
      <el-form :inline="true" class="console-form">
        <el-form-item label="工号">
          <el-input v-model="consoleForm.userNumber" placeholder="请输入工号"></el-input>          
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="consoleForm.name" placeholder="请输入用户名"></el-input>          
        </el-form-item>
        <el-form-item label="操作模块">
          <el-input v-model="consoleForm.operator" placeholder="请输入操作模块"></el-input>   
        </el-form-item>
        <el-form-item label="日期">
            <el-date-picker
                v-model="consoleForm.createdDate"
                type="date"
                placeholder="请选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="searchHandler">查询</el-button>
        </el-form-item>
      </el-form>
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
                prop="slName"
                label="用户名"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="slUser"
                label="工号"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="slDepartment"
                label="部门"
                min-width="100">
            </el-table-column>
            <el-table-column
                label="时间"
                min-width="80">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.createdDate | formatDate}}
                  </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="slIp"
                label="ip"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="slOperator"
                label="操作模块"
                min-width="120">
            </el-table-column>
            <el-table-column
                prop="slContent"
                label="操作内容"
                min-width="150">
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
          consoleForm: {
              userNumber: '',   //用户编号
              name: '',     //姓名
              operator: '', //操作
              createdDate: '', //日期
          },
          totalData: [],
          pageOption: {
            currentPage: 1,
            pageSizes: [5,10,20,50],
            pageSize: 5,
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0
          },
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
  filters: {
    formatDate(date){
      let parseDate = new Date(date);
      return parseDate.toLocaleDateString();
    }
  },
  created(){
    this.searchHandler();
  },
  methods: {
    // 查询日志信息
    searchHandler(){
      this.$axios.post('/busposition/m/log/list',this.consoleForm)
        .then(res=>{
          this.totalData = res.data.data;
          this.pageOption.currentPage = 1;
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
<style lang="less">
#log_query {
  padding: 15px;
  .console {
    .console-form {
      display: inline-block;
    }
  }
  .pagination-wrap {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
