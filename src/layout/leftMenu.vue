<template>
   <div class="menu_left cflex" :style="{width:sidebar.width+'px'}">


       <div class="menu_page_top rflex">
            <img :class='["logo",{"closeLogo":!sidebar.opened}]' :src="logo" alt="小爱admin" >
            <span class='title' v-show="sidebar.opened">Vue<i>admin</i></span>
        </div>
        <div class="menu_page_bottom is-scroll-left">
          <el-menu
            :default-active="activatedMenu"
            class="el-menu-vertical-demo"
            mode="vertical"
            theme="dark"
            :show-timeout="200"
            :collapse="isCollapse"
            :background-color="menuObj.bgColor"
            :text-color="menuObj.textColor"
            :active-text-color="menuObj.activeTextColor"
            @open="handleOpen"
            @close="handleClose"
            :style="{width:sidebar.width+'px',paddingLeft:'0px'}">
<!--              <el-menu-item class="dropItem"-->
<!--                            :index="item.path+'/'+item.children[0].path"-->
<!--              >-->
<!--                <icon-svg v-if="item.meta.icon" :icon-class="item.meta.icon" />-->
<!--                <span v-if="item.meta.title" slot="title">{{ $t(`commons.${item.name}`)}}</span>-->
<!--              </el-menu-item>-->



<!--              <el-submenu index="1">-->
<!--                <template slot="title">-->
<!--                  <i class="el-icon-location"></i>-->
<!--                  <span slot="title">导航一</span>-->
<!--                </template>-->
<!--                  <el-menu-item index="1-1">-->
<!--                    <span slot="title">选项1</span>-->
<!--                  </el-menu-item>-->
<!--                  <el-menu-item index="1-2">-->
<!--                    <span slot="title">选项2</span>-->
<!--                  </el-menu-item>-->
<!--              </el-submenu>-->

              <el-menu-item index="1" class="dropItem" @click="gotoTicketList">
                <i class="el-icon-tickets"></i>
                <span slot="title">车票信息</span>
              </el-menu-item>
              <el-menu-item index="2" class="dropItem" @click="gotoTravelList">
                <i class="el-icon-suitcase"></i>
                <span slot="title">差旅信息</span>
              </el-menu-item>
              <el-menu-item index="3" disabled class="dropItem">
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="4" class="dropItem">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
        </div>

    </div>
</template>

<script>

import { mapGetters } from 'vuex'
// import * as mUtils from "@/utils/mUtils";
import logoImg from "../assets/img/logo.png";


export default {
  name: "left-Menu",
  data() {
    return {
      activatedMenu:'1',
       menuObj:{
         bgColor:'#fff',
         textColor:'#666',
         activeTextColor:'#ff6428',
       },
       logo:logoImg
    };
  },
  computed:{
    ...mapGetters([
      // 'permission_routers',
      'isCollapse',
      'sidebar',
      // 'menuIndex'
    ]),
  },
  created(){
  },
  mounted(){
  },
  methods: {
    changeActivatedMenu(menuIndex){
      this.activatedMenu = menuIndex.toString()
    },
    gotoTicketList(){
      this.$router.push({path: "/home/ticketList"})
    },
    gotoTravelList(){
      this.$router.push({path: "/home/travelList"})
    }
    // getIindex(citem,item,cindex){
    //   return (citem.meta.titleList)?item.path+'/'+citem.path+'/'+citem.meta.titleList[0].path:item.path+'/'+citem.path;
    // }
  }
};
</script>


<style scoped>
.cflex{
  display: flex;
  flex-direction: column;
}
.menu_left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
.menu_page_top {
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  text-transform: uppercase;
  box-sizing: border-box;
  box-shadow: 0px 2px 5px 0px rgba(230, 224, 224, 0.5);
}
.menu_page_top .logo {
  height: 36px;
  width: 36px;
  vertical-align: middle;
  display: inline-block;
}
.menu_page_top .closeLogo {
  width: 30px;
  height: 30px;
}
.menu_page_top .title {
  font-size: 22px;
}
.menu_page_top .title i {
  color: #ff6c60;
}
.menu_page_bottom {
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1;
  margin-top: 3px;
  z-index: 10;
  box-shadow: 0 0 10px 0 rgba(230, 224, 224, 0.5);
}
/*el-submenu{*/
/*  padding-left: 0px;*/
/*}*/

</style>
