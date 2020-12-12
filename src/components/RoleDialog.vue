<template>
  <div id="role_dialog">
    <el-dialog
        :visible.sync="formOption.visible"
        :title="formOption.title"
        width="50%">
        <div class="content-outer">
            <div class="content-inner">
                <div class="line">
                    <MyInput
                        title="角色名"
                        :error="errorMessage.roleNameError"
                        :required="true"
                        :val="form.srName"
                        @blur = "validateRoleName"
                        v-model="form.srName"/>
                    <el-switch
                        v-model="form.srManage"
                        active-text="管理员"
                        inactive-text="普通用户"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </div>
                <MyInput
                    title="英文名"
                    :error="errorMessage.englishNameError"
                    :required="true"
                    :val="form.srSource"
                    v-model="form.srSource"
                    @blur="validateEnglishName"/>
                <MyInput
                    title="等级(1-10)"
                    v-model="form.srLevel"
                    :val="form.srLevel"
                    :error="errorMessage.levelError"
                    :required="true"
                    @blur="validateLevel"/>
                <div class="privilege">
                    <div class="title">拥有权限</div>
                    <table class="table">
                        <tr class="row" v-for="(item,index) in form.authority" :key="index">
                            <td class="group-name">
                                <span>
                                    <input type="checkbox" v-model="groupCheck" :value="index" @change="changeAll($event,index)">{{index}}
                                </span>
                            </td>
                            <td class="group-items">
                                <span v-for="child in item" :key="child.id">
                                    <input type="checkbox"  @change="child.checked = $event.target.checked" :checked="child.checked">
                                    {{child.saDisplayName}}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="description">
                    <div class="title">描述</div>
                    <textarea v-model="form.remark" placeholder="请输入内容"></textarea>
                </div>
                <div slot="footer"  class="dialog-footer">
                    <el-button @click="formOption.visible = false" size="mini">取 消</el-button>
                    <el-button type="primary" size="mini" @click="submit" :disabled="disabled">{{formOption.type === 'add' ? '添加' : '修改'}}</el-button>
                </div>
            </div>
        </div>
        
    </el-dialog>
  </div>
</template>
<script>
import MyInput from './../components/MyInput.vue';
export default {
    props: {
        dialogOption: Object,
        rowData: Object,
    },
    watch: {
        dialogOption: {
            handler: function(newVal){
                this.formOption = JSON.parse(JSON.stringify(newVal));
            },
            deep: true,
            immediate: true,
        },
        rowData: {
            handler: function(newVal){
                //不要使用箭头函数
                this.form = JSON.parse(JSON.stringify(newVal));
            },
            deep: true,
            immediate: true,
        },
        'formOption.visible': function(newVal){
            if(!newVal){
                this.groupCheck = [];
            }
        }
    },
    computed: {
        disabled(){
            if(!this.form.srLevel || !this.form.srName || !this.form.srSource)
                return true;
            return false;
        },
    },
    data(){
        return {
            errorMessage: {
                roleNameError: '',
                englishNameError: '',
                levelError: '',
            },
            formOption: {},
            form: {},
            groupCheck: [],
        }
    },
    methods: {
        validateRoleName(){
            let flag = true;
            if(this.form.srName === ''){
                this.errorMessage.roleNameError = '请输入角色名';
                flag = false;
            }
            else    
                this.errorMessage.roleNameError = '';
            return flag;
        },
        validateEnglishName(){
            let flag = true;
            if(this.form.srSource === ''){
                this.errorMessage.englishNameError = '请输入角色名';
                flag = false;
            }
            else    
                this.errorMessage.englishNameError = ''
            return flag;
        },
        validateLevel(){
            let flag = true;
            if(!/^\d+$/.test(this.form.srLevel)){
                this.errorMessage.levelError = '请输入1-10范围内的整数';
                flag = false;
            }else if(this.form.srLevel > 10 || this.form.srLevel < 1){
                this.errorMessage.levelError = '请输入1-10范围内的整数';
                flag = false;
            }else {
                this.errorMessage.levelError = '';
            }
            return flag;
        },
        submit(){
            //表单验证
            if(!this.validateRoleName() || !this.validateEnglishName() || !this.validateLevel())
                return false;
            //判断类型
            switch(this.formOption.type){
                case 'add': 
                    this.addRequest(); //添加角色
                    break;
                case 'edit':
                    this.editRequest();
                    break;
            }
        },
        formatToAuthority(roleId){
            /*{
                "部门管理": [                       //权限组
                    {"id": 1,"saDisplayName": "部门查询","checked": false},
                    {"id": 2,"saDisplayName": "部门查询","checked": false},
                    {"id": 3,"saDisplayName": "部门查询","checked": false},
                ],
            }
            {
                id: 1
                authority: [
                    {"id": 1,"saDisplayName": "用户筛选","checked": true},
                    {"id": 2,"saDisplayName": "用户筛选","checked": true},
                    {"id": 3,"saDisplayName": "用户筛选","checked": true},
                ]
            }*/
            let array = [];
            for(let key in this.form.authority){
                this.form.authority[key].forEach(item=>{
                    array.push(item);
                })
            }
            
            return {
                id: roleId,
                authority: array,
            }
        },
        addRequest(){
            //添加请求
            this.$axios.post('/busposition/m/role/add',this.form)
                .then(res => {
                    //1. 添加角色成功
                    return res.data.data; 
                })
                .then(roleData=>{
                    //2. 转换对象
                    let data = this.formatToAuthority(roleData.id);
                    //3. 角色绑定权限
                    this.$axios.post('/busposition/m/roleAuthority/add',data)
                        .then(res=>{
                            this.formOption.visible = false; 
                            this.$message({
                                type:'success',
                                message: '角色添加成功',
                            });
                            this.form.id = roleData.id;
                            this.$emit('addData',this.form); //添加数据表项
                        })
                })
        },
        editRequest(){
            //修改请求
            this.$axios.post('/busposition/m/role/update',this.form)
                .then(res => {
                    //1. 修改角色成功
                    return res.data.data; 
                })
                .then(roleData=>{
                    console.log(roleData.id);
                    //2. 转换对象
                    let data = this.formatToAuthority(roleData.id);
                    //3. 角色绑定权限
                    this.$axios.post('/busposition/m/roleAuthority/update',data)
                        .then(res=>{
                            this.formOption.visible = false; 
                            this.$message({
                                type:'success',
                                message: '角色修改成功',
                            });
                            this.$emit('editData',this.form); //添加数据表项
                        })
                })
        },
        changeAll(e,groupName){
            let isChecked = e.target.checked;
            for(let key in this.form.authority){
                if(key === groupName){
                    this.form.authority[key].forEach(item=>{
                        item.checked = isChecked;
                    })
                }
            }
        }
    },
    components: {
        MyInput,
    }
}
</script>
<style lang="less">
@bgc: #FBFBFB;
@bdColor: #eee;

#role_dialog {
    .content-outer {
        position: relative;
        max-height: 60vh;
        overflow-x: hidden;
        overflow-y: scroll;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
        &::-webkit-scrollbar { width: 0 !important }
        .line {
            display: flex;
            justify-content: space-between;
        }
        .privilege {
            width: 100%;
            border-radius: 2px;
            margin-bottom: 15px;
            .title{
                height: 38px;
                padding: 8px 15px;
                box-sizing: border-box;
                background-color: @bgc;
                border: 1px solid @bdColor;
                border-bottom: none;
            }
            .table {
                width: 100%;
                border-collapse: collapse; 
                border-spacing: 0; 
                .row {
                    td {
                        border: 1px solid @bdColor;
                        padding: 9px 15px;
                    }
                    .group-name {
                        width: 25%;
                    }
                    .group-items {
                        width: 75%;
                    }
                }
            }
        }
        .description {
            margin-bottom: 15px;
            .title{
                height: 38px;
                padding: 8px 15px;
                box-sizing: border-box;
                background-color: @bgc;
                border: 1px solid @bdColor;
                border-bottom: none;
            }
            textarea {
                width: 100%;
                padding: 6px 10px;
                box-sizing: border-box;
                resize: none;
                height: 100px;
                line-height: 20px;
                border: 1px solid @bdColor;
                &:focus {
                    outline: none;
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: flex-end;
        }
    }
    .el-dialog {
        margin: 0 auto 15px;
    }
    .el-switch {
        height: 38px;
    }
    .el-dialog__body {
        padding: 20px 20px;
    }
    .el-dialog__header {
        padding: 10px 20px 10px;
        background-color: @bgc;
        border-bottom: 1px solid @bdColor;
        border-radius: 2px 2px 0 0;
        .el-dialog__headerbtn{
            top: 13px;
        }
    }
}
</style>
