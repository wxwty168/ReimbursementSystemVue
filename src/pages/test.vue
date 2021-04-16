<template>
  <div class="demo-image__preview">
    <el-image
      class="avatar"
      :src="url"
      fit="contain"
      :preview-src-list="srcList">

    </el-image>
  </div>
</template>

<script>
export default {
  name:'test',
  data() {
    return {
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
