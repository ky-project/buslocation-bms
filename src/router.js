import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

//避免NavigationDuplicated错误
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/index',
        }, {
            path: '/index',
            component: () =>
                import ('./views/Index.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ('./views/Login.vue')
        },
        {
            path: '*',
            name: '404',
            component: () =>
                import ('./views/Notfind.vue'),
        }
    ]
});

//路由守卫
router.beforeEach((to, from, next) => {
    //检查是否登录
    let isLogin = localStorage.getItem('bmsLogin') ? true : false;
    if (to.path == '/login') {
        next();
    } else {
        isLogin ? next() : next('/login');
    }
})

export default router