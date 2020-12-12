<template>
  <div id="bus_dialog">
    <el-dialog 
        :title="formOption.title" 
        :visible.sync="formOption.visible"
        width="30%">
        <el-form 
            :model="formData" 
            :rules="rules"
            ref="formData"
            size="mini">
            <el-form-item label="车类型" label-width="80px" prop="sbbBusType">
                <el-select v-model="formData.sbbBusType" placeholder="请选择车类型" style="width: 100%">
                    <el-option 
                        v-for="item in formBusTypes" 
                        :key = "item"
                        :label="item" 
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车牌" label-width="80px" prop="sbbPlateNumber">
                <el-input v-model.trim="formData.sbbPlateNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="座位数" label-width="80px" prop="sbbSeatNum">
                <el-input v-model.trim="formData.sbbSeatNum" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="司机" label-width="80px" prop="sbbDriverName">
                <el-input v-model.trim="formData.sbbDriverName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="80px" prop="sbbDriverTel">
                <el-input v-model.trim="formData.sbbDriverTel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" label-width="80px" prop="remark" class="desc">
                <el-input type="textarea" v-model="formData.remark" row="3" ></el-input>
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
        formBusTypes: Array,
    },
    watch: {
        'formOption.visible'(newData){
            if(!newData){
                this.$refs.formData.resetFields(); //关闭重置表单
            }
        }
    },
    data(){
        //电话验证
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        let validataPhone = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('请输入电话号码'));
            }else if(!phoneReg.test(value)){
                callback(new Error('电话号码格式错误'));
            }else {
                callback();
            }
        };
        //整数验证
        let numberReg = /^\d+$/;
        let validataNumber = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('请输入座位数'));
            }else if(!numberReg.test(value)){
                callback(new Error('请输入正整数'));
            }else {
                callback();
            }
        }
        return {
            rules: {
                sbbBusType: [
                    {required: true, message: '请选择校车类型', trigger: 'blur'}
                ],
                sbbPlateNumber: [
                    {required: true, message: '请输入工号', trigger: 'blur'}
                ],
                sbbSeatNum: [
                    {required: true, validator: validataNumber, trigger: 'blur'}
                ],
                sbbDriverName: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ], 
                sbbDriverTel: [
                    {required: true, validator: validataPhone,  trigger: 'blur'}
                ],
            }
        }
    },
    methods: {
        submit(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
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
            this.$axios.post('/busposition/m/bus/add',this.formData)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '校车添加成功',
                    })
                    this.$emit('addBus',res.data.data);
                    this.formOption.visible = false;
                })
        },
        editData(){
            this.$axios.post('/busposition/m/bus/update',this.formData)
                .then(res=>{
                    this.$message({
                        type: 'success',
                        message: '校车修改成功',
                    })
                    this.$emit('editBus',res.data.data);
                    this.formOption.visible = false;
                })
        }
    }
}
</script>
<style lang="less">
#bus_dialog {
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
