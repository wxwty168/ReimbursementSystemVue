<template>
  <div class="search_container searchArea ">
    <el-form
      :inline="true"
      :model='listQuery'
      ref="listQuery"
      class="demo-form-inline search-form"
    >
      <!--        左侧搜索区域-->
      <el-form-item label="单据序号" class="">
        <el-input size="mini" v-model="listQuery.travelId" @keyup.enter.native="handleScreenOutTickets" clearable></el-input>
      </el-form-item>
      <el-form-item label="报销日期" class="">
        <div class="block">
          <el-date-picker
            v-model="listQuery.submitTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%;"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item class="">
        <el-button type="primary" size ="mini" icon="search" @click='handleScreenOutTickets'>筛选</el-button>
      </el-form-item>
      <!--        右侧删除添加区域-->
      <el-form-item class="btnRight">
        <el-button type="primary" size ="mini" icon="view" @click='handleDeleteTicketsOnBatch()' :disabled="IS_DEL_ON_BATCH_BTN_DISABLED">批量删除</el-button>
        <!-- <el-button type="success" size ="mini" icon="view">导出Elcel</el-button> -->
        <el-button type="primary" size ="mini" icon="view" @click='handleOpenAddTicketDialog()'>添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'test',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      listQuery:{
        limit: 10, //默认每页显示10条
        page: 1, //当前页码
        travelId:'', //查询关键词
        submitTime:'',
        eno:sessionStorage.getItem("eno")
      }, //查询条件
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

</style>
