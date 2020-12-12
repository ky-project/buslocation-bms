<template>
  <div id="station_bind">
    <ul class="bind-list">
        <li class="list-item link" v-for="item in cloneStations" :key="item.stationId">
            <div class="name">
                <span>{{item.sbsStation}}</span>                    
            </div>  
            <div class="leave">
                <span v-if="item.state == 'edit'">{{item.sbsDepartTime}}</span>
                <el-input v-else v-model="item.sbsDepartTime" placeholder="请输入发车时间"></el-input>
            </div>
            <div class="desc">
                <span >{{item.sbsDesc | emptyFilter}}</span>
            </div>
            <div class="operator">
                <i :class="item.state === 'edit' ? 'el-icon-edit' : 'el-icon-finished'" @click="editStation(item)"></i>
                <b class="el-icon-delete" @click="delStation(item)"></b>
            </div>
        </li>
        <li class="list-item">
            <div class="name">
                <!-- <el-input v-model="addForm.sbsStation" @change="selectStation" placeholder="请输入站点名"></el-input> -->
                <el-select v-model="addForm.stationId" @change="selectStation(addForm)" placeholder="请选择站点名" style="width: 100%;">
                    <el-option 
                        v-for="station in stations" 
                        :key = "station.stationId"
                        :label="station.sbsStation" 
                        :value="station.stationId">
                    </el-option>
                </el-select>
            </div>
            <div class="leave">
                <el-input v-model="addForm.sbsDepartTime" placeholder="请输入发车时间"></el-input>
            </div>
            <div class="desc">
                <span >{{addForm.sbsDesc | emptyFilter}}</span>
            </div>
            <div class="operator">
                <i class="el-icon-plus save" @click="addStation"></i>
            </div>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
    props: {
        stations: Array,
        bindStations: Array,
        routeId: Number,
    },
    
    watch: {
        bindStations: {
            handler: function(newVal){
                this.cloneStations = JSON.parse(JSON.stringify(newVal));
                this.sortByDepartTime(this.cloneStations);
            },
            deep: true,
            immediate: true,
        }
    },
    data(){
        return {
            cloneStations: [],
            addForm: {
                sbsStation: '',
                stationId: '',
                sbsDepartTime: '',
                sbsDesc: '',
            }
        }
    },
    methods: {
        // 强制更新
        update(){
            this.$forceUpdate();
        },
        // 根据id获取数据
        getBindStationById(id){
            return this.cloneStations.find((item,index,arr)=>item.id === id)
        },
        // 修改站点
        editStation(station){
            // 保存
            if(station.state === 'save'){
                // 验证
                let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
                if(station.sbsDepartTime === ''){
                    this.open('请输入发车时间','warning');
                    return false;
                }else if(!timeReg.test(station.sbsDepartTime)){
                    this.open('请输入正确的时间格式','warning');
                    return false;
                }
                // 时间格式化
                station.sbsDepartTime = this.formatTime(station.sbsDepartTime);
                let data = {
                    routeId: this.routeId,
                    stationId: station.stationId,
                    sbsDepartTime: station.sbsDepartTime,
                };
                this.$axios.post('/busposition/m/routeStation/update',data)
                    .then(res=>{
                        // 显示提示消息
                        this.$message({
                            type: 'success',
                            message: '路线站点修改成功'
                        })
                        // 重新排序
                        this.sortByDepartTime(this.cloneStations);
                        // 路线重载
                        this.$emit('routeReload');
                    })
            }
            station.state = station.state === 'edit' ? 'save' : 'edit';
            this.update();
        },
        // 删除站点
        delStation(station){
            this.$axios.post('/busposition/m/routeStation/del',{routeId:this.routeId,stationId:station.stationId})
                .then(res=>{
                    // 删除自身数据
                    this.cloneStations.forEach((item,index,arr)=>{
                        if(item.stationId == station.stationId){
                            arr.splice(index,1);
                        }
                    })
                    // 显示提示消息
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    // 路线重载
                    this.$emit('routeReload');
                })
        },
        // 按照发车时间排序
        sortByDepartTime(obj){
            obj.sort((a,b)=>{
                let t1 = this.convertTimestr(a.sbsDepartTime);
                let t2 = this.convertTimestr(b.sbsDepartTime);
                if(t1[0]>t2[0]){
                    return 1;
                }else if(t1[0]<t2[0]){
                    return -1;
                }else {
                    if(t1[1]>t2[1]){
                        return 1;
                    }else if(t1[1]<t2[1]){
                        return -1;
                    }else {
                        return 0;
                    }
                }
            })
        },
        // 时间转换为整数数组
        convertTimestr(timeStr){
            let arr = timeStr.split(':');
            arr.forEach((item,index,arr)=>{
                arr[index] = parseInt(arr[index]);
            })
            return arr;
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
        // 添加站点
        addStation(){
            // 1. 验证
            let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
            if(this.addForm.sbsStation === ''){
                this.open('请选择站点名','warning');
                return false;
            }else if(this.addForm.sbsDepartTime === ''){
                this.open('请输入发车时间','warning');
                return false;
            }else if(!timeReg.test(this.addForm.sbsDepartTime)){
                this.open('请输入正确的时间格式','warning');
                return false;
            }

            // 2. 时间格式化
            this.addForm.sbsDepartTime = this.formatTime(this.addForm.sbsDepartTime);
            
            let data = {
                routeId: this.routeId,
                stationId: this.addForm.stationId,
                sbsDepartTime: this.addForm.sbsDepartTime,
            }
            this.$axios.post('/busposition/m/routeStation/add',data)
                .then(res=>{
                    // 2. 添加数据
                    res.data.data.state = 'edit';
                    this.cloneStations.push(res.data.data);
                    // 3. 重新排序
                    this.sortByDepartTime(this.cloneStations);
                    // 4. 清空addForm
                    this.clearAddForm();
                    // 5. 显示提示信息
                    this.$message({
                        type: 'success',
                        message: '添加站点成功',
                    })
                    // 6. 路线重载
                    this.$emit('routeReload');
                })
        },
        //清空addForm
        clearAddForm(){
            this.addForm.stationId = '';
            this.addForm.sbsDepartTime = '';
            this.addForm.sbsDesc = '';
        },
        // 弹框
        open(msg,type) {
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: type,
            })
        },
        // 根据stationId获取数据
        getStationById(id){
            return this.stations.find(item=>item.stationId === id);
        },
        // 选择站点事件
        selectStation(item){
            let stationId = item.stationId;
            let station = this.getStationById(stationId);
            item.sbsDesc = station.sbsDesc; //修改desc
            item.sbsStation = station.sbsStation; // 修改name

            console.log(item);
        }
    },
    filters: {
        emptyFilter: function (desc) {
            return desc ? desc : '暂无站点描述';
        }
    }
}
</script>
<style lang="less">
#station_bind {
    width: 100%;
    height: 100%;
    .bind-list {
        .list-item {
            display: flex;
            height: 40px;
            line-height: 40px;
            padding: 5px;
            box-sizing: border-box;
            border-bottom: 1px solid #e5e5e5;
            position: relative;
            &.link {
                &::before {
                    display: block;
                    position: absolute;
                    content: '';
                    left: -30px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 50%;
                    width: 6px;
                    height: 6px;
                    border: 2px solid #ccc;
                }
                &::after {
                    display: block;
                    position: absolute;
                    content: '';
                    left: -26px;
                    top: 25px;
                    width: 2px;
                    height: 30px;
                    background-color: #ccc;
                }
            }
            
            &:last-child {
                border: none;
            }
            &>div {
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                &.name {
                    width: 20%;
                    min-width: 80px;
                    .el-select .el-input .el-select__caret {
                        position: relative;
                        right: 1.8vw;
                        top: -4px;
                    }
                }
                &.leave {
                    width: 25%;
                    min-width: 100px;
                } 
                &.desc {
                    width: 45%;
                    min-width: 140px;
                    .el-input__inner {
                        width: 60%;
                    }
                }
                &.operator {
                    width: 10%;
                    min-width: 80px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    i,b {
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
                    .save {
                        float: right;
                        margin-right: 5px;
                        text-align: center;
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
                span {
                    white-space: nowrap;
                    text-align: center;
                    font-size: 12px;
                }
                .el-input__inner {
                    width: 70%;
                    height: 29px;
                    line-height: 30px;
                    padding:5px;
                    font-size: 12px;
                    vertical-align: top;
                }
            }
        }
    }
}
</style>

