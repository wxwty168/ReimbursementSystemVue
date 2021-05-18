import Vue from 'vue'
import Router from 'vue-router'
import Login from "../pages/login";
import home from "../layout/home";
import TicketList from "../pages/ticketList";
import test from "../pages/test";
import page404 from '../pages/errorPages/404'
import page401 from '../pages/errorPages/401'
import travelList from "../pages/travelList";
import addOrUpdateTravel from "../pages/addOrUpdateTravel";
import reviewTravelList from "../pages/adminOnly/reviewTravelList";
import reviewTravel from "../pages/adminOnly/reviewTravel";
import viewTravel from "../pages/viewTravel";
import changePassword from "../pages/changePassword";
import manageEmployees from "../pages/adminOnly/manageEmployees";
import reimbursementStatistics from "../pages/adminOnly/reimbursementStatistics";


Vue.use(Router)
//定义路由
const router = new Router({
  mode: 'history',// 用于去除路径中的# ，参考https://www.cnblogs.com/zhuzhenwei918/p/6892066.html
  routes: [
    {path: '*', name: 'page404',component: page404 },// 覆盖所有的路由情况，给出 404 页面
    {path: '/', name: 'Login', component: Login},
    {path: '/home', name: 'home', component: home,
      children: [
        {path: 'ticketList', name: TicketList, component : TicketList},
        {path: 'travelList', name: travelList, component: travelList},
        {path: 'viewTravel', name: viewTravel, component: viewTravel},
        {path: 'addOrUpdateTravel', name: addOrUpdateTravel, component: addOrUpdateTravel},
        {path: 'reviewTravelList', name: reviewTravelList, component: reviewTravelList},
        {path: 'reviewTravel', name: reviewTravel, component: reviewTravel},
        {path: 'manageEmployees', name: manageEmployees, component: manageEmployees},
        {path: 'reimbursementStatistics', name: reimbursementStatistics, component: reimbursementStatistics},
        {path: 'changePassword', name: changePassword, component: changePassword},
        {path: '404', name: page404, component: page404},
        {path: '401', name: page401, component: page401},
        {path: '*', name: page404, component: page404},
      ]
    },
    // {path: '/ticketList', name: 'TicketList', component: TicketList},
    {path: '/test', component: test, name: 'test'}
  ],

})
const adminOnly = ["/home/reviewTravelList","/home/reviewTravel","/home/manageEmployees",
  "/home/reimbursementStatistics",]
//拦截器
router.beforeEach((route, redirect, next) => {
  if (!sessionStorage.getItem("eno") && route.path !== '/') {
    next({
      path: '/',
      query: {redirect: route.fullPath}
    })
  } else if (sessionStorage.getItem("is_admin") !== '1' && adminOnly.indexOf(route.path) !== -1){
    next({
      path: '/home/401'
    })
  }else if (sessionStorage.getItem("eno") && route.path === '/'){
    if (sessionStorage.getItem("is_admin") !== '1'){
      next({
        path: '/home/ticketList',
      })
    }else{
      next({
        path: '/home/reimbursementStatistics',
        // path: '/home/manageEmployees?isDeleted=0',
        // path: '/home/reviewTravelList?passed=0',
      })
    }

  }else{
    console.log("-------------------",route,redirect);
    next()
  }
})
export default router
