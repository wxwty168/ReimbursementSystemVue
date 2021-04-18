<template>
    <header class="head-nav rflex " :style="{'width':headNavWidth+'px'}" id='header_container'>
        <div class="right-nav" ref="rightNav" :style="{'width':right_nav_width+'px'}">
            <top-menu></top-menu>
            <div class="userinfo-right rflex">
                <div class="notify-row">

<!--                    <ul class="top-menu">-->
<!--                        <li class="li-badge">-->
<!--                            <el-tooltip class="item" effect="dark" content="访问github" placement="top">-->
<!--                                <a href='' target="_blank">-->
<!--                                      <icon-svg icon-class="iconGithub" />-->
<!--                                </a>-->
<!--                            </el-tooltip>-->
<!--                        </li>-->
<!--                        <li class="li-badge">-->
<!--                            <a href='' target="_blank" v-popover:qcode>-->
<!--                                <icon-svg icon-class="iconwechat" />-->
<!--                                <el-popover-->
<!--                                    ref="qcode"-->
<!--                                    popper-class="qcodepopper"-->
<!--                                    placement="bottom"-->
<!--                                    trigger="hover">-->
<!--                                        <div class="wechat-area cflex">-->
<!--                                            <p class="titles">加我微信</p>-->
<!--                                            <img src="" alt="加我微信"  />-->
<!--                                        </div>-->
<!--                               </el-popover>-->
<!--                            </a>-->
<!--                        </li>-->
<!--                        <li class="li-badge">-->
<!--                            <a href='' target="_blank" v-popover:qqcode>-->
<!--						        <icon-svg icon-class="iconqq" />-->
<!--                                 <el-popover-->
<!--                                    ref="qqcode"-->
<!--                                    popper-class="qcodepopper"-->
<!--                                    placement="bottom"-->
<!--                                    trigger="hover">-->
<!--                                        <div class="wechat-area cflex">-->
<!--                                            <p class="titles">加入qq群</p>-->
<!--                                            <img src="" alt="加入qq群"  />-->
<!--                                        </div>-->
<!--                                </el-popover>-->
<!--                            </a>-->
<!--                        </li>-->
<!--                    </ul>-->
                </div>
                <div class="userinfo">
                    <el-menu
                       class="el-menu-demo"
                       mode="horizontal"
                       >
                        <el-submenu index="1" popper-class="langItem">
                            <template slot="title">
<!--                                <img :src="langLogo" class='langAvatar' alt="">-->
                            </template>
                            <el-menu-item index="1-1" @click="changeLocale('zh')">
<!--                                <img :src="chinaImg" class='langAvatar' alt="">-->
<!--                                <span class="intro">中文</span>-->
                            </el-menu-item>
                            <el-menu-item index="1-2" @click="changeLocale('en')">
<!--                                <img :src="americaImg" class='langAvatar' alt="">-->
<!--                                <span class="intro">EngList</span>-->
                            </el-menu-item>
                        </el-submenu>

                        <el-submenu index="2"  popper-class="infoItem">
                            <template slot="title">
                                <div class='welcome'>
                                    <span class="name">你好,</span>
                                    <span class='name avatarname'>{{uName}}</span>
                                </div>
                                <el-image
                                  v-if="isShow"
                                  class="avatar"
                                  :src="url"
                                  fit="cover"
                                  >
                                </el-image>
                                <img src="../assets/img/user.png" class='avatar' alt="" v-if="!isShow">
                            </template>
<!--                            <el-menu-item index="2-1" @click="setDialogInfo('info')">test1</el-menu-item>-->
                            <el-menu-item index="4-2" @click="setDialogInfo('changePassword')">修改密码</el-menu-item>
                            <el-menu-item index="4-3" @click="setDialogInfo('logout')">退出登录</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from "vuex";
    // import * as mUtils from '@/utils/mUtils'
    // import { setToken,getToken } from '@/utils/auth'
    import store from "@/store";
    import topMenu from "./topMenu";



    export default {
          name: 'head-nav',
          data(){
            return{
              uName:sessionStorage.getItem("ename"),
              right_nav_width:100,
              headNavWidth:100,
              isShow: true,
              url: "http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/avatar/"+sessionStorage.getItem("avatar_url"),
              srcList: [
                "http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/ticketImg/"+'037632999d6c467fa05ae0ed63a14171_IMG_0123.jpg',
              ],
                // logo:logoImg,
                // langLogo:getToken('langLogo') || americaImg,
                // chinaImg:chinaImg,
                // americaImg:americaImg,
                // wechat:{
                //     wechatImg:wechatImg,
                //     isWechat:false
                // },
                // qq:{
                //     qqImg:qqImg,
                //     isQq:false,
                // },
                // github:github,
                menu:{
                    userBgcolor:'#f0f2f5'
                }
            }
          },
          components:{
            topMenu
          },
          computed:{
            ...mapGetters(['sidebar']),
            // ...mapGetters(['name','avatar','sidebar']),
             headNavWidth(){
                return document.body.clientWidth - this.sidebar.width
            }

          },
          created(){

          },
          mounted(){
            this.setRightNavWidth()
            this.setAvatarUrl()
            window.onresize = () => {
              this.setRightNavWidth();
              // if(!this.timer){ // 使用节流机制，降低函数被触发的频率
              //   this.timer = true;
              //   let that = this; // 匿名函数的执行环境具有全局性，为防止this丢失这里用that变量保存一下
              //   setTimeout(function(){
              //     that.setRightNavWidth();
              //     that.timer = false;
              //   },400)
              // }
            }
          },
          methods:{
            setAvatarUrl(){
              let avatarUrl = sessionStorage.getItem("avatar_url")
              this.isShow = (null !== avatarUrl && '' !== avatarUrl);
            },
            setRightNavWidth() {
              this.headNavWidth = document.body.clientWidth - this.sidebar.width
              let w = window.innerWidth;
              this.right_nav_width = w-180

            },
              logout(){
                  sessionStorage.clear()
                  this.$router.push("/")
                  // this.$store.dispatch('LogOut').then(() => {
                  //     location.reload();
                  // })
              },
             /**
             * 弹出框-修改密码或者系统设置
             * @param {string} cmditem 弹框类型
             */
            setDialogInfo(cmditem) {
                switch (cmditem) {
                    case 'info':
                        this.$router.push('/infoManage/infoShow/infoShow1');
                        break;
                    case 'changePassword':
                        this.$router.push('changePassword');
                        break;
                    case 'logout':
                        this.logout();
                        break;
                }
            }
          }
    }
</script>

<style scoped>
.right-nav {
  display: flex;
  flex: 1;
  /*width: calc(100% - 180px);*/
  padding-right: 15px;
  justify-content: space-between;
  box-shadow: 0px 2px 5px 0px rgba(237, 233, 233, 0.5);
}
.head-nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 29;
  transition: width .2s;
  justify-content: space-between;
  height: 60px;
  box-sizing: border-box;
  background: #fff;
}
.head-nav .logout {
  vertical-align: middle;
  cursor: pointer;
}
.middle {
  align-items: center;
  border: 1px solid;
}
.userinfo-right {
  width: 320px;
  padding: 0 10px;
  justify-content: space-between;
}
.userinfo {
  line-height: 60px;
  text-align: right;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.langAvatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  vertical-align: middle;
  padding: 0 5px;
}
.welcome .name {
  line-height: 20px;
  text-align: center;
  font-size: 12px;
}
.welcome .avatarname {
  color: #a9d86e;
  font-weight: bolder;
  font-size: 13px;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.border {
  border: 1px solid;
}
.notify-row {
  line-height: 60px;
  flex: 1;
}
.notify-row ul {
  display: flex;
  justify-content: space-around;
}
ul.top-menu > li {
  position: relative;
}

</style>
