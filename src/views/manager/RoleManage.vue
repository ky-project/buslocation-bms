<template>
  <div id="role_manage">
    <!-- 操作区 -->
    <el-row class="console">
        <el-col :span="16">
            <el-form :inline="true" :model="searchForm" ref="searchForm" class="search-form">
                <el-form-item>
                    <el-form-item prop="startDate" class="startDate">
                        <el-date-picker 
                            type="date" 
                            placeholder="开始日期" 
                            v-model="searchForm.startDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <span>---&nbsp;&nbsp;</span>
                    <el-form-item prop="endDate" class="endDate" :span="8">
                        <el-date-picker 
                            type="date" 
                            placeholder="结束日期" 
                            v-model="searchForm.endDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('searchForm')">查询</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="8" class="console-btns">
            <el-button class='add-btn' type="primary" @click="addHandler">添加</el-button>
        </el-col>
    </el-row>
    <!-- 数据表 -->
    <el-row class="role-table">
        <el-table
            :data="pageData"
            border
            stripe
            style="width: 100%"
            size="small"
            empty-text="——暂无数据——"
            ref="roleTable"
            :header-cell-style="headerCellStyle"
            :cell-style="cellStyle"
            @expand-change="showMore">
            <el-table-column type="expand" >
                <template slot-scope="props">
                    <el-form label-position="left" class="role-table-expand">
                        <el-form-item v-for="(item,index) in props.row.authority" :label="index" :key="index">
                            <span>{{item | formatAuthority}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="srName"
                label="角色名"
                min-width="90">
            </el-table-column>
            <el-table-column
                prop="srSource"
                label="英文名"
                min-width="90">
            </el-table-column>
            <el-table-column
                prop="srManage"
                :formatter="formatManager"
                label="是否为管理员"
                min-width="130">
            </el-table-column>
            <el-table-column
                prop="srLevel"
                label="等级"
                min-width="80">
            </el-table-column>
            <el-table-column
                prop="createdDate"
                :formatter="formatDate"
                label="创建时间"
                min-width="150">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="描述"
                min-width="120">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                min-width="70">
                <template slot-scope="scope">
                <el-button 
                    @click="editHandler(scope.row)" 
                    type="text" 
                    size="small"
                    class="editBtn">
                    <i class="el-icon-edit"></i>
                </el-button>
                <el-button 
                    type="text" 
                    size="small"
                    class="delBtn"
                    @click="deleteHandler(scope.row)">
                    <i class="el-icon-delete"></i>
                </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageOption.currentPage"
        :page-sizes="pageOption.pageSizes"
        :page-size="pageOption.pageSize"
        :layout="pageOption.layout"
        :total="pageOption.total">
      </el-pagination>
    </el-row>
    <!-- 弹窗 -->
    <RoleDialog 
        :dialogOption="dialogOption"
        :rowData="rowData"
        @addData="addData"
        @editData="editData"/>
  </div>
</template>
<script>
import RoleDialog from './../../components/RoleDialog.vue';
import moment from 'moment';
export default {
    data(){
        return {
            headerCellStyle: {
                'background-color': '#FAFAFA',
                'font-size': '14px',
                'line-height': '32px',
                'text-align': 'center'
            },
            cellStyle: {
                'text-align': 'center'
            },
            searchForm: {
                startDate: '',
                endDate: '',
            },
            totalData: [],
            pageOption: {
                currentPage: 1,
                pageSizes: [5,10,20,50],
                pageSize: 5,
                layout: 'total, sizes, prev, pager, next, jumper',
                total: 0,
            },
            rowData: {
                srLevel: '1',
                srName: '',
                srManage: false,
                srSource: '',
                remark: ''
            },
            dialogOption: {
                visible: false,
                type: 'add',
                title: '添加'
            },
            authorityData: {}, //所有权限，仅用于添加权限
        }
    },
    components: {
        RoleDialog,
    },
    computed: {
        pageData: function(){
            let start = (this.pageOption.currentPage-1) * this.pageOption.pageSize;
            return this.totalData.filter((item,index)=>index >= start && index < start + this.pageOption.pageSize);
        },
    },
    created(){
        //初始化totalData，新添加的属性不会被监听
        let data = {}
        this.getAllUser()
            .then(allUser=>{
                data = allUser;
                return this.getAllAuthority();
            })
            .then(allAuthority=>{
                this.authorityData = allAuthority; //初始化authorityData
                data.forEach(item=>{
                    item.isLoad = false; //用于判断是否加载
                    item.authority = allAuthority;
                })
                this.totalData = data;
            })
    },
    watch: {
      totalData: function(newData){
        this.pageOption.total = newData.length;
      }
    },
    methods: {
        //获取所有角色信息
        getAllUser(){
            return this.$axios.get('/busposition/m/role/list')
                .then(res=>{
                    // this.totalData = res.data.data;
                    return Promise.resolve(res.data.data);
                })
        },
        getAllAuthority(){
            return this.$axios.get('/busposition/m/authority/list')
                .then(res=>{
                    // this.authorityData = res.data.data;
                    return Promise.resolve(res.data.data);
                })
        },
        formatManager(row, column){
            return row.srManage ? '是' : '否';
        },
        formatDate(row, column){
            return moment(row.createdDate).format('YYYY-MM-DD hh:mm:ss');
        },
        handleSizeChange(val){
            this.pageOption.pageSize = val;
        },
        handleCurrentChange(val){
            this.pageOption.currentPage = val;
        },
        deleteHandler(row){
            this.$axios.post('/busposition/m/role/del',{id:row.id})
                .then(res=>{
                    this.totalData.find((item,index,array)=>{
                        if(item.id == row.id){
                            array.splice(index,1);
                            if(!this.pageData.length && array.length){
                                this.pageOption.currentPage--;
                            }
                            return true;
                        }
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
        },
        addHandler(){
            //0. 重载权限
            // this.$axios.get('/busposition/m/authority/reload')
            //     .then(res=>{
            //         this.$message({
            //             message: '权限重载成功',
            //             type: 'success',
            //         })
            //     })
            //1. 设置弹窗属性
            this.dialogOption = {
                visible: true,
                title: '添加',
                type: 'add',
            }
            //2. 重置数据
            this.rowData = {
                srLevel: '1',
                srName: '',
                srManage: false,
                srSource: '',
                remark: '',
                authority: JSON.parse(JSON.stringify(this.authorityData)), //深拷贝所有权限
            }
        },
        editHandler(row){
            this.getAuthorityDataById(row.id)
                .then(authorityData=>{
                    //1.弹窗设置
                    this.dialogOption = {
                        visible: true,
                        title: '修改',
                        type: 'edit',
                    }
                    //2.重置数据
                    this.rowData = Object.assign({},row,{authority:authorityData});
                })
        },
        //根据id获取权限
        getAuthorityDataById(id){
            return this.$axios.post('/busposition/m/roleAuthority/role/authority',{id:id})
                .then(res=>{
                    return Promise.resolve(res.data.data);
                })
        },
        addData(rowData){
            this.totalData.push(rowData);
        },
        editData(rowData){
            //找到totalData中对应的数据，替换
            this.totalData.find((item,index,array)=>{
                if(item.id == rowData.id){
                    array.splice(index,1,rowData);
                    return true;
                }
            })
        },
        editRole(role){
            this.totalData.find((item,index,array)=>{
                if(item.id === role.id){
                    array.splice(index,1,role);
                    return true;
                }
            })
        },
        submitForm(formName){
            this.$axios.post('/busposition/m/role/f/query/date',this.searchForm)
                .then(res=>{
                    this.totalData = res.data.data;
                    this.pageOption.currentPage = 1;
                })
        },
        showMore(row,expandedRows){
            let isExpand = expandedRows.find(item => row === item);
            if(isExpand){
                if(!row.isLoad){
                    //1. 请求数据
                    this.getAuthorityDataById(row.id)
                        .then(authorityData=>{
                            this.totalData.find((item,index,array)=>{
                                if(row.id === item.id){
                                    //2. 设置isLoad为true
                                    item.isLoad = true;
                                    //3. 添加权限
                                    Object.assign(array[index],{authority: authorityData});
                                    return true;
                                }
                            })
                        })
                }
                //4. 关闭其他展开项
                let len = expandedRows.length;
                if(len > 1){
                    this.$refs.roleTable.toggleRowExpansion(expandedRows[0],false);                    
                }
            } 
            
        }
    },
    filters: {
        formatAuthority: function(value){
            let arr = [];   
            let count = 0;
            value.forEach(item=>{
                if(item.checked === true){
                    arr.push(item.saDisplayName);
                    count++;
                }
            })
            if(count === 0){
                return '无此权限'
            }else {
                return arr.join();
            }   
        }
    }
}
</script>
<style lang="less">
#role_manage {
    padding: 15px;
    .console {
        .console-btns {
            display: flex;
            justify-content: flex-end;
        }
        .startDate,.endDate {
            width: 30%;
        }
    }
    .role-table-expand {
        .el-form-item {
            margin-bottom: 0px;
        }
    }

    .el-form-item__label {
        color: #99a9bf;
    }

    .pagination-wrap {
        margin-top: 10px;
        text-align: center;
    }
}
</style>
