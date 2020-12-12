<template>
    <div id="station_list">
        <div class="search">
            <input type="text" v-model="stationName" placeholder="请输入站点名">
            <button @click="searchStation"><i class="el-icon-search"></i></button>
        </div>
        <div class="msg">
            <span>共{{stations.length}}个站点</span>
        </div>
        <happy-scroll class="stations" resize>
            <ul class='station-list' ref="stationList">
            <li 
                class="item" 
                v-for="item in stations" 
                :stationId="item.id"
                :key="item.id"
                @click="selectStation($event,item)">
                <div class="title">
                  <span>{{item.sbsStation}}</span>
                  <b class="el-icon-delete" @click="delStation($event,item)"></b>
                  <i class="el-icon-edit" @click="$emit('editHandler',item)"></i>
                </div>
                <!-- <p class="address">浙江省杭州市宝龙广场学生公寓12幢</p> -->
                <p class="address">{{item.sbsDesc ? item.sbsDesc : '暂无详细地址信息'}}</p>
            </li>
            </ul>
        </happy-scroll>
    </div>
</template>
<script>
export default {
    props: {
        stations: Array,
    },
    data(){
        return {
            activeStation: null,
            stationName: '',
        }
    },
    methods: {
        // selectStation(e,item){
        //     this.$emit('itemClick',e,item);
        // }

        //站点列表点击事件
        selectStation(e,station){
            //设定选中样式
            e.path.find(item=>{
                if(item.className === 'item'){
                    this.addActiveStyle(item);
                }
            })
            //打开指定地标信息窗口
            let landMarker = this.$parent.getMarkerById(station.id);
            this.$parent.openMarkerWindow(landMarker,{title: station.sbsStation,content: station.sbsDesc ? station.sbsDesc : '暂无详细地址信息'});
        },
        //添加active样式
        addActiveStyle(ele){
            //修改前一个选定项样式
            if(this.activeStation){
                this.activeStation.className = this.activeStation.className.replace(' active','');
            }
            //设置当前选定项样式
            this.activeStation = ele;
            ele.className += ' active';
        },
        //根据id查找对应li
        getItemById(id){
          let oStation = null;
          let childrens = this.$refs.stationList.children;
          for(let i = 0; i < childrens.length; i++){
            let item = childrens[i];
            if(item.tagName.toLowerCase() === 'li'){
              if(item.getAttribute('stationId') == id){
                oStation = item;
                break;
              }
            }
          }
          return oStation;
        },
        //滚动定位当前项
        scrollToActive(item){
          //1. 判断item是否在视眼内
          let oContainer = document.querySelector('.happy-scroll-container');
          let containerHeight = oContainer.offsetHeight; 
          let offsetTop = item.offsetTop;
          let scrollTop = oContainer.scrollTop;
          let top = offsetTop-scrollTop; //距离container顶部的距离
          if(top < 0 || top > containerHeight){
            //设置scrollTop
            oContainer.scrollTop += top - 100;
          }
        },
        //站点查询
        searchStation(){
          let stationMsg = this.getStationMsgByName(this.stationName);
          if(stationMsg){
            //获取id
            let id = stationMsg.id;
            //根据id获取li
            let oStation = this.getItemById(id);
            //添加选中项
            this.addActiveStyle(oStation);
            //滚动定位
            this.scrollToActive(oStation);
            //触发点击事件
            oStation.click();
          }
        },
        //根据站点名模糊查找站点信息
        getStationMsgByName(stationName){
          return this.stations.find(item=>{
            if(item.sbsStation.includes(stationName)){
              return true;
            }
          })
          return null;
        },
        //删除站点
        delStation(e,station){
          let id = station.id;
          this.$axios.post('/busposition/m/station/del',{id:id})
            .then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 删除站点
              this.delStationById(id);
              // 删除地标
              this.$emit('delMarker',id);
            })
          e.stopPropagation();
        },
        //根据id删除站点
        delStationById(id){
          this.stations.find((item,index,array)=>{
            if(item.id === id){
              array.splice(index,1);
              return true;
            }
          })
        }
    }
}
</script>
<style lang="less">
#station_list {
    width: 201px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    .search {
        margin: 10px 10px;
        display: flex;
        height: 30px;  
        input {
            flex-grow: 1;
            min-width: 50px;
            text-indent: 5px;
            border-radius: 5px 0 0 5px;
            border: none;
            border: 1px solid #E4E7ED;       
            border-right: none; 
            &:focus {
                outline: none;
            }
        }
        button {
            flex-grow: 0;
            width: 42px;
            color: #fff;
            border-radius: 0 5px 5px 0;
            border: none;
            border: 1px solid #E4E7ED;       
            border-right: none; 
            background-color: #66b1ff;
            cursor: pointer;
            &:focus {
                outline: none;
            }
        }
    }
    .msg {
        height: 25px;
        line-height: 25px;
        padding: 0 15px;
        background-color: #eee;
        font-size: 13px;
        border: 1px solid #E4E7ED;
        border-left: none;
        border-right: none;
    }
    .stations {
        height: calc(~"100vh - 209px");
        .happy-scroll-container {
            height: calc(~"100vh - 209px") !important;
        }
        .station-list {
            width: 100%;
            .item {
            overflow: hidden;
            padding: 5px 15px;
            box-sizing: border-box;
            border-bottom: 1px solid #EBEEF5;
            cursor: pointer;
            &:hover {
                background-color: #eee;
            }
            .title {
                height: 20px;
                line-height: 20px;
                span {
                    display: inline-block;
                    width: 130px;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                }
                i,b {
                    float: right;
                    width: 14px;
                    height: 14px;
                    font-size: 14px;
                    border: 1px solid deepskyblue;
                    background: skyblue;
                    color: #fff;
                    border-radius: 3px;
                    cursor: pointer;
                }
                b {
                    margin-left: 5px;
                    border: 1px solid orangered;
                    background-color: orange;
                }
            }
            .address {
                width: 170px;
                font-size: 12px;
                white-space: nowrap;
                overflow-x: hidden;
                text-overflow: ellipsis;
            }
            }
            .active {
                background-color: #eee;
            }
        }
    }
}
</style>
