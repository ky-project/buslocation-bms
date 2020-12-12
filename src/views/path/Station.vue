<template>
  <div id="station">
    <!-- 百度地图 -->
    <div class="left">
      <baidu-map 
      class="bm-view" 
      ak="Hn8yCUyLlsPxzhCIdG8wETGiGtViLCHI" 
      :center="center" 
      :zoom="zoom" 
      @ready="initMap">
      </baidu-map>
    </div>
    <!-- 站点列表 -->
    <div class="right">
      <transition name="slide">
        <component 
          :is="curComponent" 
          ref="childList" 
          :stations="stations"
          :stationForm="stationData"
          :type="type"
          @delMarker="delLandMarker"
          @addData="addData"
          @editData="editData"
          @editHandler="editHandler"
          @lngChange="lngChange"
          @latChange="latChange"
          @cancelEdit="cacelEdit"></component>
      </transition>
    </div>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import StationList from './../../components/StationList.vue';
import StationOperate from './../../components/StationOperate.vue';
export default {
    data () {
        return {
            center: {lng: 0, lat: 0},
            zoom: 3,
            BMap: null,
            map: null,
            stations: [],
            landMarkers: [],
            activeMarker: null,
            curComponent: 'StationList',
            type: 'add',
            stationData: {},
        }
    },
    components: {
        BaiduMap,
        StationList,
        StationOperate,
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

            //2. 地图点击事件
            this.map.addEventListener('click',this.mapClickCallback);

            //3. 初始化地标和站点列表
            this.getStationList()
              .then(()=>{
                //2.1 初始化地标
                this.stations.forEach(item=>{
                  let marker = this.addLandMarker(new this.BMap.Point(item.sbsLongitude,item.sbsLatitude));
                  //设置地标
                  let obj = this.initMarker(item.id,marker);
                  //保存
                  this.landMarkers.push(obj);
                })
              })
              .then(()=>{
                //定位到第一个地标
                let firstStation = this.stations[0];
                this.map.panTo(new this.BMap.Point(firstStation.sbsLongitude,firstStation.sbsLatitude));
              })
        },
        //地图点击回调函数
        mapClickCallback(e){
          //切换地标
          if(this.activeMarker){
            this.activeMarker.setPosition(e.point);
            //修改stationData
            this.stationData.sbsLongitude = this.activeMarker.getPosition().lng;
            this.stationData.sbsLatitude = this.activeMarker.getPosition().lat;
          } else {
            this.activeMarker = this.addLandMarker(e.point); //添加地标
            this.activeMarker.enableDragging(); //允许拖动
            // 拖动结束修改stationData
            this.activeMarker.addEventListener('dragend',()=>{
              this.stationData.sbsLongitude = this.activeMarker.getPosition().lng;
              this.stationData.sbsLatitude = this.activeMarker.getPosition().lat;
            })
            //重设stationData
            this.stationData = {
              sbsStation: "",
              sbsLongitude: e.point.lng,
              sbsLatitude: e.point.lat,
              sbsDesc: "",
            }
          }
          //逆地址解析
          this.addressResolution(e.point);
          //切换组件
          if(this.curComponent != 'StationOperate' || this.type != 'add'){
            this.changeComponent('StationOperate');
            //设置类型
            this.type = 'add';
          }
        },
        //逆地址解析
        addressResolution(point){
          var geoc = new this.BMap.Geocoder(); 
          geoc.getLocation(point, function(rs){
            // var addComp = rs.addressComponents;
            console.log(rs.address);
          });        
        },
        //初始化地标
        initMarker(id,marker){
          //添加id属性
          marker.id = id;
          //添加地标点击事件
          marker.addEventListener('click',(e)=>{
            //1. 获取id
            let id = e.target.id;
            //2. 根据id查找对应li
            let oStation = this.$refs.childList.getItemById(id);
            //3. 根据id查找对应站点信息
            let station = this.getStationMsgById(id);
            //3. 设置选定样式
            this.$refs.childList.addActiveStyle(oStation);
            //4. 滚动定位当前项
            this.$refs.childList.scrollToActive(oStation);
            //5. 显示信息窗口
            let stationMsg = this.getStationMsgById(id);
            let opt = {
              title: stationMsg.sbsStation,
              content: station.sbsDesc ? station.sbsDesc : '暂无详细地址信息',
            }
            this.openMarkerWindow(e.target,opt);
            e.domEvent.stopPropagation();//阻止冒泡
          })
          //添加地标拖拽事件
          marker.addEventListener('dragend',(e)=>{
            this.stationData.sbsLongitude = e.point.lng;
            this.stationData.sbsLatitude = e.point.lat;
          })
          return {[id]:marker};
        },
        //根据id查找对应地标
        getMarkerById(id){
          let landMarker = null;
          this.landMarkers.find(item=>{
            let key = Object.keys(item)[0];
            if(key == id){
              landMarker = item[key];
              return true;
            }
          })
          return landMarker;
        },
        //根据id查找站点信息
        getStationMsgById(id){
          return this.stations.find(item=>{
            if(item.id == id){
              return true;
            }
          })
        },
        //根据id修改站点信息
        editStationById(stationMsg){
          this.stations.find((item,index,arr)=>{
            if(item.id == stationMsg.id){
              arr.splice(index,1,stationMsg);
              return true;
            }
          })
        },
        //添加地标
        addLandMarker(point){
          let marker = new BMap.Marker(point);
          this.map.addOverlay(marker);
          return marker;
        },
        //根据id移除地标
        delLandMarker(id){
          //删除地图上的地标
          let landMarker = this.getMarkerById(id);
          this.map.removeOverlay(landMarker);
          //删除data中的地标
          this.landMarkers.find((item,index,arr)=>{
            let key = Object.keys(item)[0];
            if(key == id){
              arr.splice(index,1);
            }
          })
        },
        //获取所有站点信息
        getStationList(){
          return this.$axios('/busposition/m/station/list')
            .then(res=>{
              this.stations = res.data.data;
              return Promise.resolve();
            })
        },
        //打开指定地标信息窗口
        openMarkerWindow(landMarker,opt){
          let position = landMarker.getPosition();
          this.map.panTo(position);
          //打开信息窗口
          landMarker.openInfoWindow(this.createInfoWindow(opt.title,opt.content));
        },
        //创建信息窗口
        createInfoWindow(title,content){
          let infoWindow = new this.BMap.InfoWindow();
          let oTitle = document.createElement('h4');
          oTitle.innerText = title;
          let oContent = document.createElement('p');
          oContent.style.fontSize = '14px';
          oContent.innerText = content;
          infoWindow.setTitle(oTitle);
          infoWindow.setContent(oContent);
          return infoWindow;
        },
        //添加信息
        addData(stationData){
          //添加站点信息
          this.stations.push(stationData);
          //删除当前地标
          this.removeActiveMarker();
          //设置地标
          let landMarker = this.addLandMarker(new this.BMap.Point(stationData.sbsLongitude,stationData.sbsLatitude))
          let obj = this.initMarker(stationData.id,landMarker);
          this.landMarkers.push(obj);
        },
        //修改信息
        editData(station){
          //修改stations中的信息
          this.editStationById(station);
          //关闭拖动功能
          let landMarker = this.getMarkerById(station.id);
          landMarker.disableDragging();
          //重新绑定地图点击事件
          this.map.addEventListener('click',this.mapClickCallback);
        },
        //修改信息
        editHandler(stationData){
          //1.切换到修改界面
          this.stationData = JSON.parse(JSON.stringify(stationData)); //深拷贝
          this.type = 'edit';
          this.changeComponent('StationOperate');
          //2. 允许拖拽
          let landMarker = this.getMarkerById(stationData.id);
          landMarker.enableDragging();
          //3. 解绑地图点击事件
          this.map.removeEventListener('click',this.mapClickCallback);
        },
        //修改地标经度
        lngChange(id,lng){
          console.log('lng',lng);
          let marker = this.getMarkerById(id);
          let point = new this.BMap.Point(parseFloat(lng),marker.getPosition().lat)
          marker.setPosition(point);
          this.map.panTo(point);
        },
        //修改地标纬度
        latChange(id,lat){
          console.log('lat',lat);
          let marker = this.getMarkerById(id);
          let point = new this.BMap.Point(marker.getPosition().lng,parseFloat(lat))
          console.log('point',point);
          marker.setPosition(point);
          this.map.panTo(point);
        },
        //切换组件
        changeComponent(name){
          this.curComponent = name;
        },
        //移除activeMarker
        removeActiveMarker(){
          if(this.activeMarker){
            this.map.removeOverlay(this.activeMarker);
            this.activeMarker = null;
          }
        },
        //取消修改
        cacelEdit(station){
          //1. 获取地标
          let landMarker = this.getMarkerById(station.id);
          //2. 修改地标位置
          landMarker.setPosition(new this.BMap.Point(station.sbsLongitude,station.sbsLatitude))
          //3. 重新绑定地图点击事件
          this.map.addEventListener('click',this.mapClickCallback);
          //4. 取消拖拽
          landMarker.disableDragging();
        }
    },
}
</script>
<style lang="less">
#station {
  display: flex;
  .left {
    flex-grow: 1;
    min-width: 300px;
    height: calc(~"100vh -  131px");
    background-color: #ccc;
    .bm-view {
      height: calc(~"100vh -  131px");
    }
  }
  .right {
    flex-grow: 0;
    width: 200px;
    height: calc(~"100vh -  131px");
    border-left: 1px solid #DCDFE6;
    overflow: hidden;
    position: relative;
    .slide-enter {
      transform: translateX(200px);
      // opacity: 0;
    }
    .slide-leave-to {
      transform: translateX(-200px);
      // opacity: 0;
    }
    .slide-enter-active,
    .slide-leave-active {
      transition: all 0.3s;
    }
  }
}
</style>
