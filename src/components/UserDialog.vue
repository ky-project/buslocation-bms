<template>
  <div id="user_dialog">
    <el-dialog 
        :title="formOption.title" 
        :visible.sync="formOption.visible"
        width="30%">
        <el-form 
            :model="formData" 
            :rules="rules"
            ref="formData"
            size="mini">
            <el-form-item label="所在部门" label-width="80px" prop="department.id">
                <el-select v-model="formData.department.id" placeholder="请选择部门" style="width: 100%">
                    <el-option 
                        v-for="item in departments" 
                        :key = "item.deptId"
                        :label="item.deptName" 
                        :value="item.deptId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职工编号" label-width="80px" prop="workId">
                <el-input v-model="formData.workId" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" label-width="80px" prop="realName">
                <el-input v-model="formData.realName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="80px" prop="password">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="身份证" label-width="80px" prop="idCard">
                <el-input v-model="formData.idCard" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" label-width="80px" prop="phone">
                <el-input v-model="formData.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="80px" prop="email">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOption.visible = false" size="mini">取 消</el-button>
            <el-button type="primary" :disabled="enable" @click="submit('formData')" size="mini">{{formOption.type === 'add' ? '添加' : '修改'}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
    props: {
      dialogOption: Object,
      dialogData: Object,
      departments: Array,
    },
    watch: {
        dialogOption: function(newVal){
            this.formOption = JSON.parse(JSON.stringify(newVal)); //深度克隆dialogOption
        },
        dialogData: function(newVal){
            this.formData = JSON.parse(JSON.stringify(newVal)); //深度克隆dialogData
        },
        'formOption.visible'(newData){
            if(!newData){
                this.$refs.formData.resetFields(); //关闭重置表单
            }
        },
    },
    computed: {
        enable: function(){
            let flag = false;
            for(let key in this.formData){
                if(key === 'department'){
                    if(!this.formData.department.id){
                        flag = true;
                        break;
                    }
                }else if(!this.formData[key]){
                    flag = true;
                    break;
                }
            }
            return flag;
            return true;
        }
    },
    data(){
        //手机号验证
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        let validataPhone = (rule, value, callback) => {
            if(value.trim() === ''){
                callback(new Error('请输入电话号码'));
            }else if(!phoneReg.test(value)){
                callback(new Error('电话号码格式错误'));
            }else {
                callback();
            }
        };
        //身份证号验证
        let idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        let validataIdCard = (rule, value, callback) => {
            if(value.trim() === ''){
                callback(new Error('请输入身份证号'));
            }else if(!idCardReg.test(value)){
                callback(new Error('身份证号格式错误'));
            }else {
                callback();
            }
        };
        //邮箱验证
        let emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        let validataEmail = (rule, value, callback) => {
            if(value.trim() === ''){
                callback(new Error('请输入邮箱'));
            }else if(!emailReg.test(value)){
                callback(new Error('邮箱格式错误'));
            }else {
                callback();
            }
        };
        //密码验证
        let validataPsw = (rule, value, callback) => {
            if(value.trim() === ''){
                callback(new Error('请输入密码'));
            }else if(value.trim().length > 20 || value.trim().length < 5){
                callback(new Error('长度为5-20数字字符串'));
            }else if(value.trim() === '*****' && this.formOption.type === 'add'){
                callback(new Error('密码不能为"*****"'));
            }else {
                callback();
            }
        }
      return {
        formOption: {
            title: '添加',
            type: 'add',
            visible: false
        },
        formData: {
            department: {
                id: '',
            },
            workId: '',
            realName: '',
            password: '',
            idCard: '',
            phone: '',
            emial: '',
        },
        rules: {
            'department.id': [
                {required: true, message: '请选择部门', trigger: ['blur','change']}
            ],
            workId: [
                {required: true, message: '请输入工号', trigger: 'blur'}
            ],
            realName: [
                {required: true, message: '请输入姓名', trigger: 'blur'}
            ],
            password: [
                {required: true, validator: validataPsw, trigger: 'blur'},
            ],
            idCard: [
                {required: true, validator: validataIdCard, trigger: 'blur'}
            ],
            phone: [
                {required: true, validator: validataPhone, trigger: 'blur'}
            ],
            email: [
                {required: true, validator: validataEmail, trigger: 'blur'}
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
                            this.addUser();
                            break;
                        case 'edit':
                            this.editUser();
                            break;
                    }
                }
            })
        },
        //根据deptId获取部门名
        getDeptName(){
            let deptName = '';
            this.departments.find(item=>{
                if(item.deptId === this.formData.department.id){
                    deptName = item.deptName;
                }
            })
            return deptName;
        },
        //添加用户
        addUser(){
            this.$axios.post('/busposition/m/user/add',this.formData)
                .then(res=>{
                    //设置数据
                    // let user = {
                    //     departmentName: this.getDeptName(),
                    //     email: this.formData.email,
                    //     idCard: this.formData.idCard,
                    //     phone: this.formData.phone,
                    //     realName: this.formData.realName,
                    //     workId: this.formData.workId
                    // }
                    //关闭弹窗
                    this.formOption.visible = false;
                    //显示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    //添加数据
                    this.$emit('add',res.data.data);
                })
        },
        //修改用户信息
        editUser(){
            //密码处理
            let data = JSON.parse(JSON.stringify(this.formData));
            if(data.password === '*****'){
                data.password = '';
            }
            //用户修改请求
            this.$axios.post('/busposition/m/user/update',data)
                .then(res=>{
                    //关闭弹窗
                    this.formOption.visible = false;
                    //显示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    //设置数据
                    // let user = {
                    //     departmentName: this.getDeptName(),
                    //     email: data.email,
                    //     idCard: data.idCard,
                    //     phone: data.phone,
                    //     realName: data.realName,
                    //     workId: data.workId,
                    //     id: data.id,
                    // }
                    this.$emit('edit',res.data.data);
                })
        },
    },
}
</script>
<style lang="less">
#user_dialog {
    .el-dialog {
        min-width: 280px;
    }
    .el-dialog__body {
        padding: 10px 20px;
    }
}
</style>
