<template>
  <div class="personal">
      <div class="personal-container">
        <div class="base">
            <el-form 
                :model="baseForm" 
                :rules="baseRules" 
                :hide-required-asterisk="true" 
                ref="baseForm" 
                label-width="90px" 
                class="base-form"
                label-position="left"
            >
                <div class="base-title">
                    <i class="el-icon-s-custom"></i>
                    <span>基本信息</span>
                </div>
                <!-- <img src="./../assets/avatar.jpg"> -->
                    <!-- 部门名 真实姓名 电话号码 身份证 职工编号 邮箱 -->
                    <!-- departmentName realName phone idCard workId email-->
                    <el-form-item  label="部门名:">
                        <el-input disabled v-model="baseForm.departmentName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item  label="职工编号:">
                        <el-input disabled v-model="baseForm.workId" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item  label="真实姓名:" prop="realName">
                        <el-input v-model="baseForm.realName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item  label="电话号码:" prop="phone">
                        <el-input v-model="baseForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证:" prop="idCard">
                        <el-input v-model="baseForm.idCard"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱:" prop="email">
                        <el-input v-model="baseForm.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="baseEnable" type="primary" @click="saveForm('baseForm')">保存</el-button>
                    </el-form-item>
            </el-form>
        </div>
        <div class="modify-psw">
            <el-form 
                :model="pswForm" 
                :rules="pswRules" 
                :hide-required-asterisk="true" 
                ref="pswForm" 
                label-width="90px" 
                class="psw-form"
                label-position="left">
                <div class="base-title">
                    <i class="el-icon-lock"></i>
                    <!-- <i class="el-icon-s-custom"></i> -->
                    <span>修改密码</span>
                </div>
                <el-form-item label="密码:" prop="password">
                    <el-input type="password" v-model="pswForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newPsw">
                    <el-input type="password" v-model="pswForm.newPsw" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="confirmPsw">
                    <el-input type="password" v-model="pswForm.confirmPsw" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="pswEnable" type="primary" @click="saveForm('pswForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
      </div>
  </div>
</template>

<script>
import qs from 'querystring';
export default {
    name: 'personal',
    data: function(){
        let validateConfirmPsw = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pswForm.newPsw) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
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
        return {
            pswForm: {
                password: '',
                newPsw: '',
                confirmPsw: '',
            },
            baseForm: {
                departmentName: '',     //所在部门名
                realName: '',           //真实姓名
                phone: '',              //手机号
                idCard: '',             //身份证
                id: 1,                  //用户id-唯一识别码
                workId: '',             //教工编号
                email: '',              //邮箱
            },
            pswRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度为5-20个字符数字', trigger: 'blur'},
                ],
                newPsw: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度为5-20个字符数字', trigger: 'blur'},
                ],
                confirmPsw: [
                    { validator: validateConfirmPsw, trigger: 'blur' },
                ]
            },
            baseRules: {
                realName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },                    
                ],
                phone: [
                    { validator: validataPhone, trigger: 'blur' },
                ],
                idCard: [
                    { validator: validataIdCard, trigger: 'blur' },
                ],
                email: [
                    { validator: validataEmail, trigger: 'blur' },
                ],
            }
        };
        // user: {
        //     departmentName: "开发小组",     //部门名
        //     realName: "陆宇豪",            //真实姓名
        //     phone: "17758178532",         //电话号码
        //     idCard: "33108211111111111",  //身份证                   
        //     workId: "Xb16620208",         //职工编号
        //     email: "ludaye1112@163.com"   //邮箱
        //     password: "456",                //密码
        //     id: 1,                          //用户id
        // }
    },
    computed: {
        baseEnable: function(){
            if(!this.baseForm.realName || !this.baseForm.phone || !this.baseForm.idCard || !this.baseForm.email){
                return true;
            }else {
                return false;
            }
        },
        pswEnable: function(){
            if(!this.pswForm.password || !this.pswForm.newPsw || !this.pswForm.confirmPsw){
                return true;
            }else {
                return false;
            }
        },
    },
    created: function(){
        this.getBaseMes();
    },
    methods: {
        //根据id获取基本信息
        getBaseMes: function(){
            this.$axios.get('/busposition/user/self/info')
                .then(res=>{
                    this.baseForm = res.data.data[0];
                })
        },
        //保存基本信息
        saveForm: function(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    switch(formName){
                        case 'baseForm': 
                            this.saveUser();
                            break;
                        case 'pswForm': 
                            this.savePsw();
                            break;
                    }
                }
            });
        },
        saveUser: function(){
            //替换
            let data = {
                realName: this.baseForm.realName,
                phone: this.baseForm.phone,
                idCard: this.baseForm.idCard,
                email: this.baseForm.email,
                id: this.userId,
            }

            this.$axios.post('/busposition/m/self/update/info',data)
                .then(res=>{
                    console.log(res);
                    this.$message({
                        type: 'success',
                        message: '信息修改成功'
                    })
                })
        },
        savePsw: function(){
            // console.log('')
            let data = {
                oldPassword: this.pswForm.password,
                newPassword: this.pswForm.newPsw,
            }
            this.$axios.post('/busposition/m/self/modify/pwd',data)
                .then(res=>{
                    console.log(res);
                    this.$message({
                        type: 'success',
                        message: '密码修改成功'
                    })
                })
                .catch(err=>{
                    //密码错误，清空
                    this.pswForm = {
                        password: '',
                        newPsw: '',
                        confirmPsw: ''
                    }
                })
        }
    }
}
</script>

<style lang="less">
@firstText: #303133;
@secondText: #606266;
@thirdText: #909399;
@firstBorder: #DCDFE6;
@secondBorder: #E4E7ED;
@thirdBorder: #EBEEF5;

.personal {
    width: 100%;
    height: 100%;
    .personal-container {
        width: 350px;
        margin: 20px auto;
        // background-color: #ccc;
        .base,.modify-psw {
            width: 100%;
            // height: 300px;
            .base-title {
                color: @secondText;
                border-bottom: 1px solid @secondBorder;
                margin-bottom: 15px;
                line-height: 28px;
                i {
                    margin-right: 5px;
                }
            }
        }
        .modify-psw {
            margin-top: 30px;
        }
    }
    .el-button {
        width: 100%;
        line-height: 0.5;
        float: right;
    }
    .el-form-item__label {
        line-height: 28px;
    }
    .el-form-item__content {
        line-height: 28px;
    }
    .el-input__inner {
        height: 28px;
        line-height: 28px;
    }
}
</style>
