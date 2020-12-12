<template>
  <div id="historical_track">
    <!-- 操作区 -->
    <el-row class="console">
        <el-form :inline="true" class="console-form">
            <el-form-item>
                <el-select v-model="consoleForm.routeId" placeholder="请选择路线">
                    <el-option v-for="item in routes" :label="item.sbrRouteName" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="consoleForm.recodeTime"
                    type="date"
                    placeholder="请选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchHandler">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <!-- 地图 -->
    <!-- 百度地图 -->
    <div class="map">
      <baidu-map 
        class="bm-view" 
        ak="Hn8yCUyLlsPxzhCIdG8wETGiGtViLCHI" 
        :center="center" 
        :zoom="zoom" 
        @ready="initMap">
      </baidu-map>
    </div>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
export default {
  data(){
      return {
          consoleForm: {
              routeId: '',
              recodeTime: '',
          },
          path: [],
          routes: [],
          zoom: 0,
          center: {
              lng: '',
              lat: '',
          },
          BMap: {},
          map: {},
      }
  },
  created(){
    this.getAllRoutes();
  },
  components: {
    BaiduMap,
  },
  methods: {
    initMap({BMap, map}){
        //1. 初始化地图
        this.center.lng = 116.404;
        this.center.lat = 39.915;
        this.zoom = 15;
        
        this.BMap = BMap;
        this.map = map;

        this.map.addControl(new BMap.NavigationControl());
        this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));  
    },
    searchHandler(){
        // 验证
        if(this.consoleForm.routeId === ''){
          this.open('请选择路线','warning');
          return false;
        }
        if(this.consoleForm.recodeTime === ''){
          this.open('请选择日期','warning');
          return false;
        }
        // 查询
        let date = new Date(this.consoleForm.recodeTime);
        let y = date.getFullYear(); 
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let data = {
          routeId: this.consoleForm.routeId,
          recodeTime: `${y}-${m}-${d}`,
        }
        this.$axios.post('/busposition/m/positionHis/list',data)
          .then(res=>{
            // 保存历史路线数据
            this.path = [];
            res.data.data.forEach(item=>{
              let point = new this.BMap.Point(item.sbp_longitude,item.sbp_latitude);
              this.path.push(point);
            })
            // 清空地图内容
            this.map.clearOverlays();
            // 画轨迹
            var line = new this.BMap.Polyline(this.path,{strokeWeight: 3});
            this.map.addOverlay(line);
            // 画起止点
            let labelOffset = new this.BMap.Size(-5,28);
            let startLabel = new this.BMap.Label('起点',{offset: labelOffset});
            startLabel.setStyle({ border: 'none', backgroundColor: 'transparent'});
            let endLabel = new this.BMap.Label('终点',{offset: labelOffset});
            endLabel.setStyle({ border: 'none', backgroundColor: 'transparent'})

            let startMarker = new BMap.Marker(this.path[0]);
            startMarker.setLabel(startLabel);
            let endMarker = new BMap.Marker(this.path[this.path.length - 1])
            endMarker.setLabel(endLabel);

            this.map.addOverlay(startMarker);
            this.map.addOverlay(endMarker);
            // 移动到轨迹初始点
            this.map.panTo(this.path[0]);
          })
    },
    // 弹框
    open(msg,type) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
      })
    },
    // 获取路线信息
    getAllRoutes(){
      return this.$axios.get('/busposition/m/route/list')
        .then(res=>{
          this.routes = res.data.data;
        })
    }
  }
}
</script>
<style lang="less">
#historical_track {
  .console {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;   
    .console-form {
      display: inline-block;
    }
    input,select,button {
        box-shadow: 2px 2px 2px #ccc;
    }
  }
  .map {
    min-width: 300px;
    height: calc(~"100vh -  131px");
    background-color: #ccc;
    .bm-view {
      height: calc(~"100vh -  131px");
    }
  }
}
</style>
