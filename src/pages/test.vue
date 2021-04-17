<template>
  <div>
    <div class="demo-image__preview">
      <el-image
        class="avatar"
        :src="url"
        fit="contain"
        :preview-src-list="srcList">

      </el-image>
    </div>
    <el-divider></el-divider>
    <el-button @click="showViewer=true">预览</el-button>
    <el-image-viewer
      v-if="showViewer"
      :on-close="()=>{showViewer=false}"
      :url-list="srcList" />
  </div>

</template>

<script>
export default {
  name:'test',
  components: {
    'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    return {
      showViewer:false,
      url: "http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/ticketImg/"+'037632999d6c467fa05ae0ed63a14171_IMG_0123.jpg',
      srcList: [
        "http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/ticketImg/"+'037632999d6c467fa05ae0ed63a14171_IMG_0123.jpg',
      ]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
</style>
