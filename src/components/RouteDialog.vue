<template>
  <div id="route_dialog">
      <el-dialog 
        :title="formOption.title" 
        :visible.sync="formOption.visible"
        width="30%">
        <el-form 
            :model="cloneData" 
            :rules="rules"
            ref="formData"
            size="mini">
            <el-form-item label="路线名" label-width="80px" prop="sbrRouteName">
                <el-input v-model.trim="cloneData.sbrRouteName" autocomplete="off"></el-input>                
            </el-form-item>
            <el-form-item label="起始站" label-width="80px" prop="sbrStartStation">
                <el-select v-model="cloneData.sbrStartStation" placeholder="请选择车类型" style="width: 100%;">
                    <el-option 
                        v-for="item in formStations" 
                        :key = "item"
                        :label="item" 
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="终点站" label-width="80px" prop="sbrEndStation">
                <el-select v-model="cloneData.sbrEndStation" placeholder="请选择车类型" style="width: 100%;">
                    <el-option 
                        v-for="item in formStations" 
                        :key = "item"
                        :label="item" 
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发车时间" label-width="80px" prop="sbrDepartTime">
                <el-input v-model.trim="cloneData.sbrDepartTime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路线描述" label-width="80px" class="desc">
                <el-input type="textarea" v-model="cloneData.sbrDesc" row="3" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOption.visible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="submit('formData')" size="mini">{{formOption.type === 'add' ? '添加' : '修改'}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
    props: {
        formOption: Object,
        formData: Object,
        formStations: Array,
    },
    watch: {
        'formOption.visible'(newData){
            if(!newData){
                this.$refs.formData.resetFields(); //关闭重置表单
            }
        },
        formData(newVal){
            this.cloneData = newVal;
        }
    },
    data(){
        let departTimeCheck = (rule, value, callback) => {
            let timeReg = /^([0-2][0-9]|[0-9]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?$/;
            if(value === ''){
                callback(new Error('请输入发车时间'));
            }else if(!timeReg.test(value)){
                callback(new Error('请输入正确的时间格式'));
            }else {
                callback();
            }
        }
        return {
            cloneData: {},
            rules: {
                sbrRouteName: [
                    {required: true, message: '请输入路线名', trigger: 'blur'}
                ],
                sbrStartStation: [
                    {required: true, message: '请选择发车站', trigger: 'blur'}
                ],
                sbrEndStation: [
                    {required: true, message: '请选择终点站', trigger: 'blur'}
                ],
                sbrDepartTime: [
                    {required: true, validator: departTimeCheck, trigger: 'blur'}
                ],
            }
        }
    },
    methods: {
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
        // 提交
        submit(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    // 格式化时间
                    this.cloneData.sbrDepartTime = this.formatTime(this.cloneData.sbrDepartTime);
                    switch (this.formOption.type){
                        case 'add': 
                            this.addData();
                            break;
                        case 'edit':
                            this.editData();
                            break;
                    }
                }
            })
        },
        addData(){
            this.$axios.post('/busposition/m/route/add',this.cloneData)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '路线添加成功',
                    })
                    this.$emit('addRoute',res.data.data);
                    this.formOption.visible = false;
                })
        },
        editData(){
            this.$axios.post('/busposition/m/route/update',this.cloneData)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '路线修改成功',
                    })
                    this.$emit('editRoute',res.data.data);
                    this.formOption.visible = false;
                })
        },
    }
}
</script>
<style lang="less">
#route_dialog {
    .desc {
        margin-bottom: 0 !important;
        textarea {
            resize: none;
        }
    }
    .el-dialog {
        min-width: 280px;
    }
    .el-dialog__body {
        padding: 10px 20px;
    }
}
</style>
