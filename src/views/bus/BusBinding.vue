<template>
  <div id="bus_binding">
    <!-- 操作区 -->
    <el-row class="console">
      <el-form :inline="true" class="console-form">
        <el-form-item label="路线">
          <el-select v-model="consoleForm.routeId" placeholder="请选择路线名">
            <el-option v-for="item in routes" :label="item.sbrRouteName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="星期">
          <el-select v-model="consoleForm.sbbrWeek" placeholder="请选择星期">
            <el-option v-for="item in SearchWeekDays" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时间段">
          <el-input v-model="consoleForm.sbbrStartTime" placeholder="开始时间(例: 8:30)"></el-input>
        </el-form-item>
        <span class="dotted">---&nbsp;&nbsp;</span>
        <el-form-item>
          <el-input v-model="consoleForm.sbbrEndTime" placeholder="结束时间(例: 15:30)"></el-input>
        </el-form-item> -->
        <el-form-item >
          <el-button type="primary" @click="searchHandler()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 数据表 -->
    <table>
      <tr>
        <td colspan="7">{{curRouteName}}</td>
      </tr>
      <tr>
        <td>星期</td>
        <td>车牌</td>
        <td>司机</td>
        <td>电话</td>
        <td>发车时间</td>
        <td>到站时间</td>
        <td>操作</td>
      </tr>
      <tr v-for="item in totalData" :key="item.id">
        <td>
          <span v-if="item.state === 'edit'">{{item.sbbrWeek}}</span>
          <el-select v-else v-model="item.sbbrWeek" placeholder="请选择星期">
              <el-option 
                  v-for="child in weekDays" 
                  :key = "child"
                  :label="child" 
                  :value="child">
              </el-option>
          </el-select>
        </td>
        
        <td>
          <span>{{item.sbbPlateNumber}}</span>
        </td>
        <td>{{item.sbbDriverName}}</td>
        <td>{{item.sbbDriverTel}}</td>
        <td>
          <span v-if="item.state === 'edit'">{{item.sbbrStartTime}}</span>
          <el-input v-else v-model="item.sbbrStartTime" placeholder="请输入发车时间"></el-input>
        </td>
        <td>
          <span v-if="item.state === 'edit'">{{item.sbbrEndTime}}</span>
          <el-input v-else v-model="item.sbbrEndTime" placeholder="请输入到站时间"></el-input>
        </td>
        <td>
          <i :class="item.state === 'edit' ? 'el-icon-edit' : 'el-icon-finished'" @click="editBus(item)" ></i>
          <b class="el-icon-delete" @click="delBus(item)"></b>
        </td>
      </tr>
      <!-- 添加行 -->
      <tr>
        <td>
          <span v-if="addMode === 0">{{addForm.sbbrWeek}}</span>
          <el-select v-else v-model="addForm.sbbrWeek" placeholder="请选择星期">
              <el-option 
                  v-for="child in weekDays" 
                  :key = "child"
                  :label="child" 
                  :value="child">
              </el-option>
          </el-select>
        </td>
        
        <td>
          <el-select v-model="addForm.sbbPlateNumber" @change="plateNumberSelected" placeholder="请选择车牌号">
              <el-option 
                  v-for="child in buses" 
                  :key = "child.id"
                  :label="child.sbbPlateNumber" 
                  :value="child.sbbPlateNumber">
              </el-option>
          </el-select>
        </td>
        <td>{{addForm.sbbDriverName | emptyFilter}}</td>
        <td>{{addForm.sbbDriverTel | emptyFilter}}</td>
        <td>
          <el-input v-model="addForm.sbbrStartTime" placeholder="请输入发车时间"></el-input>
        </td>
        <td>
          <el-input v-model="addForm.sbbrEndTime" placeholder="请输入到站时间"></el-input>
        </td>
        <td>
          <i class="el-icon-plus save" @click="addBus"></i>
        </td>
      </tr>
      <!-- <tr>
        <td colspan="7">--暂无数据--</td>
      </tr> -->
    </table>
  </div>
</template>
<script>
export default {
  data(){
    return {
      consoleForm: {
        routeId: '',  // 路线名
        sbbrWeek: '全部',    // 星期
        sbbrStartTime: '',  // 开始时间
        sbbrEndTime: '',    // 结束时间
      },
      addForm: {
        busId: '',
        routeId: '',
        sbbrWeek: '',
        sbbrStartTime: '',
        sbbrEndTime: '',
        sbbPlateNumber: '',
        sbbDriverName: '',
        sbbDriverTel: '',
      },
      weekDays: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
      SearchWeekDays: ['全部','星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
      routes: [],
      buses: [],
      plateNumbers: [
        {plateNumber:'浙A8K420',plateId:1},
        {plateNumber:'沪J8C372',plateId:2},
        {plateNumber:'京B56974',plateId:3},
      ],
      totalData: [],
      curRouteName: '',
      routeId: '',
      addMode: 1, // 添加模式，1可选择星期，0不可选择星期
    }
  },
  created(){
    this.getAllBus();
    this.getAllRoutes()
      .then(routes=>{
        this.consoleForm.routeId = routes[0].id; // 默认选中第一条路线
        this.searchHandler();
      })
  },
  methods: {
    // 获取所有校车信息
    getAllBus(){
      this.$axios.get('/busposition/m/bus/list')
        .then(res=>{
          this.buses = res.data.data;
        })
    },
    // 获取所有路线信息
    getAllRoutes(){
      return this.$axios.get('/busposition/m/route/list')
        .then(res=>{
          this.routes = res.data.data;
          return Promise.resolve(res.data.data);
        })
    },
    // 查询
    searchHandler(){
      let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
      let start = this.consoleForm.sbbrStartTime;
      let end = this.consoleForm.sbbrEndTime;
      // 验证
      if(!start && end){
          this.open('请输入开始时间','warning');
          return false;
      }else if(start && !end){
          this.open('请输入结束时间','warning');
          return false;
      }
      if(start && end){
          if(!timeReg.test(this.consoleForm.sbbrStartTime) || !timeReg.test(this.consoleForm.sbbrEndTime)){
              this.open('请输入正确的时间格式','warning');
              return false;
          }
      }
      // 格式化时间
      if(start && end){
          this.consoleForm.sbbrStartTime = this.formatTime(this.consoleForm.sbbrEndTime);
          this.consoleForm.sbbrStartTime = this.formatTime(this.consoleForm.sbbrEndTime);
      }
      // 查询请求
      this.searchRequest()
        .then(data=>{
          // 修改addMode
          if(this.consoleForm.sbbrWeek === '全部'){
            this.addMode = 1;
          }else {
            this.addMode = 0;
          }
          // 添加state属性
          data.forEach(item=>{
            item.state = 'edit';
          })
          // 重置数据
          this.totalData = data;
          this.sortData(); // 重新排序
          // 保存routeId和星期
          this.addForm.routeId = this.consoleForm.routeId;
          if(this.addMode === 0){
            this.addForm.sbbrWeek = this.consoleForm.sbbrWeek;
          }
          //同步路线名称
          this.routes.find(item=>{
            if(item.id === this.consoleForm.routeId){
              this.curRouteName = item.sbrRouteName;
              return true;
            }
          })
        })
    },
    // 星期转换为数字
    weekToNumber(weekDay){
      let weekDays = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
      return weekDays.findIndex(item=>item === weekDay);
    },
    // 排序
    sortData(){
      this.totalData.sort((a,b)=>{
        let aWeek = this.weekToNumber(a.sbbrWeek);
        let bWeek = this.weekToNumber(b.sbbrWeek);
        // 日期比较
        if(aWeek > bWeek){
          return 1;
        }else if(aWeek < bWeek){
          return -1;
        }else {
          // 8:30 -> [8,30]
          let aStart = a.sbbrStartTime.split(':');
          aStart.forEach(item=>{
            item = parseInt(item);
          })
          let bStart = b.sbbrStartTime.split(':');
          bStart.forEach(item=>{
            item = parseInt(item);
          })
          // 时间比较
          if(aStart[0] > bStart[0]){
            return 1;
          }else if(aStart[0] < bStart[0]){
            return -1;
          }else {
            if(aStart[1] > bStart[1]){
              return 1;
            }else if(aStart[1] < bStart[1]){
              return -1;
            }else {
              return 0;
            }
          }
        }
      })
    },
    // 查询请求
    searchRequest(){
      let data = JSON.parse(JSON.stringify(this.consoleForm))
      if(data.sbbrWeek === '全部')
        data.sbbrWeek = '';
      return this.$axios.post('/busposition/m/busRoute/list',data)
        .then(res=>{
          return Promise.resolve(res.data.data);
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
    // 弹框
    open(msg,type) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
      })
    },
    //车牌修改事件
    plateNumberSelected(){
      console.log('change');
      this.buses.forEach(item=>{
        if(item.sbbPlateNumber === this.addForm.sbbPlateNumber){
          this.addForm.busId = item.id;
          this.addForm.sbbDriverName = item.sbbDriverName;
          this.addForm.sbbDriverTel = item.sbbDriverTel;
        }
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
    // 弹框
    open(msg,type) {
        this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type,
        })
    },
    // 时间验证
    validateTime(bus){
      // 验证
      let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
      if(bus.sbbrStartTime === ''){
        this.open('请输入发车时间','warning');
        return false;
      }else if(bus.sbbrEndTime === ''){
        this.open('请输入到站时间','warning');
        return false;
      }else if(!timeReg.test(bus.sbbrStartTime) || !timeReg.test(bus.sbbrEndTime)){
          this.open('请输入正确的时间格式','warning');
          return false;
      }
      return true;
    },
    // 修改校车绑定请求
    editBusRequest(data){
      return this.$axios.post('/busposition/m/busRoute/update',data)
        .then(res=>{
          this.$message({
            type: 'success',
            message: '校车绑定信息修改成功',
          })
          return Promise.resolve(res.data.data);
        })
    },
    // 删除校车绑定请求
    delBusRequest(id){
      return this.$axios.post('/busposition/m/busRoute/del',{id: id})
        .then(res=>{
          this.$message({
            type: 'success',
            message: '校车绑定信息删除成功',
          })
          return Promise.resolve();
        })
    },
    // 添加校车绑定请求
    addBusRequest(data){
      return this.$axios.post('/busposition/m/busRoute/save',data)
        .then(res=>{
          this.$message({
            type: 'success',
            message: '校车绑定信息添加成功',
          })
          return Promise.resolve(res.data.data);
        })
    },
    // 删除校车
    delBus(bus){
      this.delBusRequest(bus.id)
        .then(()=>{
          this.totalData.find((item,index,arr)=>{
            if(item.id === bus.id){
              arr.splice(index,1);
            }
          })
        })
    },
    // 添加校车
    addBus(){
      if(this.validateTime(this.addForm)){
        let data = {
          busId: this.addForm.busId,
          routeId: this.addForm.routeId,
          sbbrWeek: this.addForm.sbbrWeek,
          sbbrStartTime: this.addForm.sbbrStartTime,
          sbbrEndTime: this.addForm.sbbrEndTime,
        }
        this.addBusRequest(data)
          .then(data=>{
            // 添加现车绑定信息
            data.state = 'edit';
            this.totalData.push(data);
            // 重排序
            this.sortData();
            // 清空addForm
            if(this.addMode === 0){
              for(let key in this.addForm){
                if(key !== 'routeId' && key !== 'sbbrWeek'){
                  this.addForm[key] = '';
                }
              }
            }else{
              for(let key in this.addForm){
                if(key !== 'routeId'){
                  this.addForm[key] = '';
                }
              }
            }
            
          })
      }
    },
    // 修改校车
    editBus(bus){
      // 保存
      if(bus.state === 'save'){
          // 时间验证
          if(this.validateTime(bus)){
            // 时间格式化
            bus.startTime = this.formatTime(bus.sbbrStartTime);
            bus.endTime = this.formatTime(bus.sbbrEndTime);
            // 发送请求
            let data = {
              id: bus.id,
              sbbrWeek: bus.sbbrWeek,
              sbbrStartTime: bus.sbbrStartTime,
              sbbrEndTime: bus.sbbrEndTime,
            }
            this.editBusRequest(data)
              .then(()=>{
                this.sortData(); // 重新排序
              })
          }
      }
      // 切换状态
      bus.state = bus.state === 'edit' ? 'save' : 'edit';
    },
  },
  filters: {
      emptyFilter: function (text) {
          return text ? text : '暂无数据';
      }
  }
}
</script>
<style lang="less">
#bus_binding {
  padding: 15px;
  .console {
    .console-form {
      display: inline-block;
      .dotted {
        position: relative;
        top: 7px;
        left: 0;
      }
    }
  }
  table {
    width: 100%;
    border: 1px solid #EBEEF5; 
    border-radius: 3px;
    tr {
      display: flex;
      height: 49px;
      line-height: 49px;
      border-bottom: 1px solid #EBEEF5;
      font-size: 12px;
      &:nth-child(odd){
        background-color: #FAFAFA;
      }
      &:first-child {
        font-size: 16px;
        letter-spacing: 4px;
      }
      &:nth-child(2){
        font-size: 14px;
      }
      &:last-child {
        border-bottom: none;
      }
      td {
        flex: 1;
        text-align: center;
        .el-input__inner {
          width: 80%;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
        }
        .el-select .el-input .el-select__caret {
            position: relative;
            right: 1.2vw;
            top: -2px;
        }
        &:nth-child(1){
          width: 15%;
          min-width: 100px;
        }
        &:nth-child(2){
          width: 10%;
          min-width: 100px;
        }
        &:nth-child(3){
          width: 20%;
          min-width: 100px;
        }
        &:nth-child(4){
          width: 10%;
          min-width: 100px;
        }
        &:nth-child(5){
          width: 10%;
          min-width: 100px;
        }
        &:nth-child(6){
          width: 10%;
          min-width: 100px;
        }
        &:nth-child(7){
          width: 10%;
          min-width: 100px;
          i,b {
            color: #66b1ff;
            cursor: pointer;
          };
          b {
            margin-left: 10px;
          };
          .save {
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            border-radius: 5px;
            background-color: deepskyblue;
            color: #fff;
            cursor: pointer;
        }
        }
      }
    }
    
  }
}
</style>
