<template>
    <div id="station_operate">
        <div class="head">
            <i class="el-icon-back" @click="back"></i>
            {{type === 'add' ? '添加站点' : '修改站点'}}
        </div>
        <el-form 
            :model="stationForm" 
            :rules="rules" 
            ref="stationForm" 
            class="station-form" 
            size="mini">
            <el-form-item label="站点名" prop="sbsStation">
                <el-input v-model.trim="stationForm.sbsStation"></el-input>
            </el-form-item>
            <!-- <el-form-item label="经度" prop="sbsLongitude"> -->
            <el-form-item label="经度">
                <!-- <el-input disabled v-model.trim="stationForm.sbsLongitude" @blur="$emit('lngChange',stationForm.id,stationForm.sbsLongitude)"></el-input> -->
                <el-input disabled v-model.trim="stationForm.sbsLongitude"></el-input>
            </el-form-item>
            <!-- <el-form-item label="纬度" prop="sbsLatitude"> -->
            <el-form-item label="纬度">
                <!-- <el-input disabled v-model.trim="stationForm.sbsLatitude" @blur="$emit('latChange',stationForm.id,stationForm.sbsLatitude)"></el-input> -->
                <el-input disabled v-model.trim="stationForm.sbsLatitude"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="sbsDesc" class="desc">
                <el-input type="textarea" v-model.trim="stationForm.sbsDesc"></el-input>
            </el-form-item>
            <el-form-item class="btn">
                <el-button type="primary" @click="submitForm('stationForm')" style="width:100%">
                    {{type === 'add' ? '添加' : '修改'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props: {
        type: String,
        stationForm: {
            sbsStation: String,
            sbsLongitude: Number,
            sbsLatitude: Number,
            sbsDesc: String,
        }
    },
    data() {
        /*var checkLng = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入经度'));
            }else if(!(/^(-?\d+)(\.\d+)?$/.test(value))){
                return callback(new Error('请输入浮点数'))
            }else {
                return callback();
            }
        };
        var checkLat = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入纬度'));
            }else if(!(/^(-?\d+)(\.\d+)?$/.test(value))){
                return callback(new Error('请输入浮点数'))
            }else {
                return callback();
            }
        };*/
        return {
            copyForm: JSON.parse(JSON.stringify(this.stationForm)),
            rules: {
                sbsStation: [
                    { required: true, message: '请输入站点名', trigger: 'blur' },
                ],
                /*sbsLongitude: [
                    {required: true, validator:checkLng, trigger: 'blur'}
                ],
                sbsLatitude: [
                    {required: true, validator:checkLat, trigger: 'blur'}
                ]*/
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    switch(this.type){
                        case 'add': 
                            this.addStation();
                            break;
                        case 'edit':
                            this.editStation();
                            break;
                    }
                    
                } 
            });
        },
        //添加站点
        addStation(){
            this.$axios.post('/busposition/m/station/add',this.stationForm)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    })
                    this.$emit('addData',res.data.data);
                    this.$parent.changeComponent('StationList');
                })
        },
        //修改站点
        editStation(){
            this.$axios.post('/busposition/m/station/update',this.stationForm)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '修改成功',
                    })
                    this.$emit('editData',this.stationForm);
                    this.$parent.changeComponent('StationList');
                })
        },
        //返回
        back(){
            if(this.type === 'add'){
                this.$parent.removeActiveMarker(); //取消添加
            }else {
                //取消修改
                this.$emit('cancelEdit',this.copyForm);
            }
            this.$parent.changeComponent('StationList');
        }
    }
}
</script>
<style lang="less">
#station_operate {
    position: absolute;
    width: 201px;
    height: 100%;
    .head {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        font-size: 16px;
        color: #fff;        
        background-color: #409EFF;
        i {
            font-size: 20px;
            margin-right: 5px;
            cursor: pointer;
        }        
    }
    .station-form {
        padding: 5px 10px;
        .desc {
            textarea {
                resize: none;
            }
        }
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
        margin-bottom: 10px;
    }
    .el-form-item--mini .el-form-item__content, 
    .el-form-item--mini .el-form-item__label {
        line-height: 22px;
    }
    .el-input__inner {
        padding: 0px 5px;
    }
    .el-textarea__inner {
        padding: 5px 5px;
    }
}
</style>
