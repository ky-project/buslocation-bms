import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';
import store from './store';

//全局配置axios
axios.defaults.withCredentials = true;

let loading; //定义loading变量

function startLoading() { //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading() { //使用Element loading-close 方法
    loading.close()
}

//请求拦截
axios.interceptors.request.use(config => { //config是什么（应该是请求配置）
    // 加载
    startLoading();
    /* 在请求头中设置token
     if (localStorage.eletoken)
         config.headers.Authorization = localStorage.eletoken
    */
    return config; //返回给下一个promise成功处理
}, err => {
    return Promise.reject(error) //返回给下一个promise错误处理
})

//响应拦截
axios.interceptors.response.use(response => {
    endLoading();
    return response;
}, error => {
    const response = error.response;
    // 错误提醒
    endLoading();
    Message.error(response.data.message);
    // 401处理
    if (response.status == 401) {
        //清除用户信息
        store.dispatch('setUser', {});
        //清除登录状态
        localStorage.removeItem('bmsLogin');
        //页面跳转
        router.push('/login');
    }
    return Promise.reject(error)
})

export default axios;