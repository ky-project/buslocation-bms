<template>
  <div id="route_binding">
    <!-- 操作区 -->
    <el-row class="console">
      <el-col :span="20">
        <el-form :inline="true" class="console-form">
          <el-form-item label="路线名">
            <el-input v-model="consoleForm.sbrRouteName" placeholder="请输入路线名称"></el-input>
          </el-form-item>
          <el-form-item label="发车时间">
            <el-input v-model="consoleForm.startTime" placeholder="开始时间(例: 8:30)"></el-input>
          </el-form-item>
          <span class="dotted">---&nbsp;&nbsp;</span>
          <el-form-item>
            <el-input v-model="consoleForm.endTime" placeholder="结束时间(例: 15:30)"></el-input>
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
            ref="routeBindForm"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            @expand-change="showMore">
            <!-- 折叠项 -->
            <el-table-column 
              type="expand">
              <template slot-scope="props">
                <StationBindList
                  :stations="totalStations"
                  :bindStations="bindStations"
                  :routeId="props.row.id"
                  @routeReload="routeReload(props.row)"/>
              </template>
            </el-table-column>
            <el-table-column
                prop="sbrRouteName"
                label="路线名"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="sbrDepartTime"
                label="发车时间"
                min-width="60">
            </el-table-column>
            <el-table-column
                prop="sbrStartStation"
                label="起始站"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbrEndStation"
                label="终点站"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="sbrDesc"
                label="描述"
                min-width="140">
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="70">
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
    <route-dialog
      :formOption="formOption"
      :formData="formData"
      :formStations="stationNames"
      @addRoute="addRoute"
      @editRoute="editRoute"/>
  </div>
</template>
<script>
import RouteDialog from './../../components/RouteDialog.vue';
import StationBindList from './../../components/StationBindList.vue';
export default {
  data(){
      return {
        consoleForm: {
            sbrRouteName: '',
            startTime: '',
            endTime: '',
        },
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
        formOption: {
          type: '',
          visible: false,
          title: ''
        },
        formData: {
            sbrStartStation: '',    //起始站
            sbrRouteName: '',       //路线名
            sbrDesc: '',            //描述
            id: '',                 //路线id
            sbrDepartTime: '',      //发车时间
            sbrEndStation: ''       //终点站
        },
        stationNames: [],

        totalStations: [],
        bindStations: [
          // {
          //   sbsDesc: null,            //站点描述
          //   sbsDepartTime: "6:30",    //发车时间
          //   sbsStation: "雅仕苑",       //站点名
          //   stationId: 31,             //站点id
          //   state: 'edit',
          // },
        ],
        routeId: -1,
      }
  },
  components: {
    RouteDialog,
    StationBindList,
  },
  created(){
      this.getAllRoutes();
      this.getAllStationNames();
      this.getAllStations();
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
    // 获取所有站点名称
    getAllStationNames(){
      this.$axios.get('/busposition/m/station/names')
        .then(res=>{
          this.stationNames = res.data.data;
        })
    },
    // 获取所有路线
    getAllRoutes(){
        this.$axios.get('/busposition/m/route/list')
          .then(res=>{
            //添加额外属性
            res.data.data.forEach(item=>{
              item.isLoad = false; // 是否加载站点
              item.stations = [];
            })
            this.totalData = res.data.data;
          })
    },
    // 获取所有站点信息
    getAllStations(){
      this.$axios.get('/busposition/m/station/list')
        .then(res=>{
          //进一步处理
          res.data.data.forEach(item=>{
            let obj = {
              stationId: item.id,
              sbsStation: item.sbsStation,
              sbsDesc: item.sbsDesc,
            }
            this.totalStations.push(obj);
          })
        })
    },
    // 路线查询
    searchHandler(){
      let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
      let start = this.consoleForm.startTime;
      let end = this.consoleForm.endTime;
      // 验证
      if(!start && end){
          this.open('请输入开始时间','warning');
          return false;
      }else if(start && !end){
          this.open('请输入结束时间','warning');
          return false;
      }
      if(start && end){
          if(!timeReg.test(this.consoleForm.startTime) || !timeReg.test(this.consoleForm.endTime)){
              this.open('请输入正确的时间格式','warning');
              return false;
          }
      }
      // 格式化时间
      if(start && end){
          this.consoleForm.startTime = this.formatTime(this.consoleForm.startTime);
          this.consoleForm.endTime = this.formatTime(this.consoleForm.endTime);
      }
      // 查询请求
      this.$axios.post('/busposition/m/route/f/nameAndTime',this.consoleForm)
          .then(res=>{
              this.$message({
                  type: 'success',
                  message: '查询成功',
              })
              // 设置当前页
              this.pageOption.currentPage = 1;
              this.totalData = res.data.data;
          })
    },
    //格式化时间
    formatTime(strTime){
      //分割
      let arr = strTime.split(':');
      // 舍弃秒
      if(arr.length === 3){
        arr.pop(); 
      }
      // 填充0
      arr.forEach((item,index,arr)=>{
          if(item.length < 2){
              arr[index] = '0' + item;
          }
      })
      return arr.join(':');
    },
    // 路线添加
    addHandler(){
      this.formOption = {
        type: 'add',
        visible: true,
        title: '路线添加'
      };
      this.formData = {
        sbrStartStation: '',    //起始站
        sbrRouteName: '',       //路线名
        sbrDesc: '',            //描述
        id: '',                 //路线id
        sbrDepartTime: '',      //发车时间
        sbrEndStation: ''       //终点站
      };
    },
    // 修改路线
    editHandler(route){
      this.formOption = {
        type: 'edit',
        visible: true,
        title: '路线修改'
      };
      this.formData = JSON.parse(JSON.stringify(route));
    },
    // 删除路线
    deleteHandler(route){
        this.$axios.post('/busposition/m/route/del',{id:route.id})
          .then(res=>{
              this.totalData.find((item,index,arr)=>{
                  if(item.id == route.id){
                      arr.splice(index,1);
                      if(!this.pageData.length && arr.length){
                          this.pageOption.currentPage--;
                      }
                      return true;
                  }
              });
              this.$message({
                  type: 'success',
                  message: '删除成功',
              })
          })
    },
    // 添加路线数据
    addRoute(route){
      this.totalData.push(route);
    },
    // 修改路线数据
    editRoute(route){
      let item = this.getDataById(route.id);
      // item = route;
      this.totalData.find((item,index,arr)=>{
        if(item.id == route.id){
          arr.splice(index,1,route);
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
    // 弹框
    open(msg,type) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
      })
      // .then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });          
      // });
    },
    //根据id获取路线数据项
    getDataById(id){
      return this.totalData.find(item=>item.id === id);
    },
    // 设置要传递给展开表的数据
    passStationData(item){
      let obj = JSON.parse(JSON.stringify(item.stations));
      obj.forEach(item=>{
        item.state = 'edit';
      })
      this.bindStations.splice(0);
      Object.assign(this.bindStations,obj);
    },
    // 显示展开项
    showMore(row,expandedRows){
      let isExpand = expandedRows.find(item => row === item);
      if(isExpand){
        // 清空bindStation
        this.bindStations.splice(0);
        // 根据id 获取数据项
        let item = this.getDataById(row.id);
        // 如果没有加载过权限
        if(!item.isLoad){
          //1. 请求站点数据
          this.$axios.post('/busposition/m/routeStation/list',{routeId: item.id})
            .then(res=>{
              //2. 设置isLoad为true
              item.isLoad = true;
              //3. 添加站点
              item.stations = res.data.data;
              //4. 传递数据
              this.passStationData(item);
            })
        } else {
          //4. 传递数据
          this.passStationData(item);
        }
        //5. 关闭其他展开项
        let len = expandedRows.length;
        if(len > 1){
            this.$refs.routeBindForm.toggleRowExpansion(expandedRows[0],false);                    
        }
      }
    },
    // 重载路线站点
    routeReload(route){
      route.isLoad = false;
    },
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    },
  },
}
</script>
<style lang="less" scoped>
#route_binding {
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
  .dotted {
      position: relative;
      top: 7px;
      left: 0;
  }
}
</style>
