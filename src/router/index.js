import Vue from 'vue'
import Router from 'vue-router'
import Login from "../pages/login";
import home from "../layout/home";
import TicketList from "../pages/ticketList";
import test from "../pages/test";
import page404 from '../pages/404'
import travelList from "../pages/travelList";
import addOrUpdateTravel from "../pages/addOrUpdateTravel";
import reviewTravelList from "../pages/adminOnly/reviewTravelList";
import reviewTravel from "../pages/adminOnly/reviewTravel";


Vue.use(Router)

export default new Router({
  mode: 'history',// 用于去除路径中的# ，参考https://www.cnblogs.com/zhuzhenwei918/p/6892066.html
  routes: [
    {path: '*', name: 'page404',component: page404 },// 覆盖所有的路由情况，给出 404 页面
    {path: '/', name: 'Login', component: Login},
    {path: '/home', name: 'home', component: home,
      children: [
        {path: 'ticketList', name: TicketList, component : TicketList},
        {path: 'travelList', name: travelList, component: travelList},
        {path: 'addOrUpdateTravel', name: addOrUpdateTravel, component: addOrUpdateTravel},
        {path: 'reviewTravelList', name: reviewTravelList, component: reviewTravelList},
        {path: 'reviewTravel', name: reviewTravel, component: reviewTravel},
        {path: '404', name: page404, component: page404},
        {path: '*', name: page404, component: page404},
      ]
    },
    // {path: '/ticketList', name: 'TicketList', component: TicketList},
    {path: '/test', component: test, name: 'test'}
  ]
})
