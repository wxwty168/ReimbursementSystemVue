<template>
  <div class="fillcontain">
      <div class="contain" ref="contain">
        <div class="errPage-container cflex wflex">
            <img class="errorImg" :src="errorImg" />
            <p class="errorTitle">404</p>
            <p class="errorTro">抱歉，你访问的页面不存在。</p>
            <router-link :to="{path: '/'}">
              <el-button size="mini" type="primary">返回首页</el-button>
            </router-link>
        </div>
      </div>
  </div>
</template>

<script>
import errorImg from "@/assets/img/404.png"
// import * as mutils from '@/utils/mUtils'


export default {
    name: 'page404',
    data() {
      return {
        errorImg:errorImg
      }
    },
  	mounted(){
       this.setContentHeight(this,this.$refs.contain,250);
		},
    methods: {
      setContentHeight: function(that,ele,height) {
        that.$nextTick(() => {
          ele.style.height =   (document.body.clientHeight - height)+'px'
        })
      }
    }
}
</script>

<style scoped>
.contain {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.contain .errPage-container {
  align-items: center;
}
.contain .errPage-container p {
  line-height: 30px;
}
.contain .errPage-container .errorImg {
  width: 286px;
  height: 325px;
  margin-bottom: 10px;
}
.contain .errPage-container .errorTitle {
  color: rgba(0, 0, 0, 0.85);
  font-size: 24px;
}
.contain .errPage-container .errorTro {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
.contain .errPage-container a {
  text-decoration: underline;
}
.contain .errPage-container .rows {
  height: 100%;
}
.contain .errPage-container .rows .el-col {
  text-align: center;
  height: 100%;
}
.contain .errPage-container .rows .title {
  font-size: 170px;
  line-height: 1.2;
  color: #a9d86e;
}
.contain .errPage-container .rows .neirongItem {
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.contain .errPage-container .rows .neirongItem .tip {
  font-size: 30px;
  font-weight: bold;
  text-align: left;
}
.contain .errPage-container .rows .neirongItem .neirong {
  font-size: 20px;
  text-align: left;
}
.contain .errPage-container .home {
  text-align: center;
}
.contain .errPage-container .router-link-active:hover {
  color: #a9d86e;
  text-decoration: underline;
}


</style>
