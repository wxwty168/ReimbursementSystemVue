<template>
  <div class="fillcontain">
    <!--    搜索，批量删除，添加    -->
    <!--    <div class="search_container searchArea">-->
    <div class=" searchArea">
      <el-form
        :inline="true"
        :model='listQuery'
        ref="listQuery"
        class="demo-form-inline search-form"
      >
        <!--        左侧搜索区域-->
        <el-form-item label="单据序号" class="">
          <el-input size="mini" style="width: 120px" v-model="listQuery.travelId" @keyup.enter.native="handleScreenOutTravels" clearable></el-input>
        </el-form-item>
        <el-form-item label="报销人" class="">
          <el-input size="mini" style="width: 120px" v-model="listQuery.ename" @keyup.enter.native="handleScreenOutTravels" clearable></el-input>
        </el-form-item>
        <el-form-item label="报销日期" class="">
          <div class="block">
            <el-date-picker
              v-model="submitTimeRange"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM"
              value-format="yyyy-MM-dd"
              style="width: 200px;padding:initial;box-sizing: initial;height: initial;line-height: initial"
              @keyup.enter.native="handleScreenOutTravels"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="">
          <el-button type="primary" size ="mini" icon="search" @click='handleScreenOutTravels'>筛选</el-button>
        </el-form-item>
        <!--        右侧删除添加区域-->
<!--        <el-form-item class="btnRight">-->
<!--          <el-button type="primary" size ="mini" icon="view" @click='handleDeleteTravelsOnBatch()' :disabled="IS_DEL_ON_BATCH_BTN_DISABLED">批量删除</el-button>-->
<!--          &lt;!&ndash; <el-button type="success" size ="mini" icon="view">导出Elcel</el-button> &ndash;&gt;-->
<!--          <el-button type="primary" size ="mini" icon="view" @click='handleOpenAddTravelDialog()'>添加</el-button>-->
<!--        </el-form-item>-->
      </el-form>
    </div>


    <!--    表格-->
    <div class="table_container" style="clear: both">
      <el-table
        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
        :header-cell-style="{'text-align':'center'}"
        style="width: 100%;height:100%"
        align='center'
        border
        >
        <!--        @select="selectTable"-->
        <!--        @select-all="selectAll"-->
        <!--      >-->
<!--        <el-table-column-->
<!--          type="selection"-->
<!--          align='center'-->
<!--          width="60">-->
<!--        </el-table-column>-->
        <el-table-column
          prop="travelId"
          label="单据序号"
          align='center'
          width="78"
        >
        </el-table-column>
        <el-table-column
          prop="ename"
          label="报销人"
          align='center'
          width="75"
        >
        </el-table-column>
        <el-table-column
          prop="travelDescription"
          label="出差事由"
          align='left'
        >
        </el-table-column>
        <el-table-column
          v-if="isShow"
          prop="eno"
          label="员工工号"
          align='center'
          width="180">
        </el-table-column>

        <el-table-column
          prop="firstDepartureTime"
          label="出发时间"
          align='center'
          width="170"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="lastArrivalTime"
          label="到达时间"
          align='center'
          width="170"
          sortable
        >
          <!--          <template slot-scope="scope">-->
          <!--            <span style="color:#00d053">+ {{ scope.row.tableAddress || scope.row.address }}</span>-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="daysOfTravel"
          label="出差天数"
          align='center'
          width="90"
        >
          <!--          <template slot-scope="scope">-->
          <!--            <el-icon name="time"></el-icon>-->
          <!--            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="totalReimbursement"
          label="报销金额"
          align='right'
          width="90"

        >
          <!--          <template slot-scope="scope">-->
          <!--            <span style="color:#f56767">{{ scope.row.pay }}</span>-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="submitTime"
          label="报销日期"
          align='center'
          width="115"
        >

        </el-table-column>
        <el-table-column
          prop="passed"
          label="状态"
          align='center'
          width="75"
        >
          <template slot-scope="scope">

            <span v-if="scope.row.passed===0" >{{ scope.row.passed }}未审核</span>
            <span v-if="scope.row.passed===1" style="color:#00d053">已通过</span>
            <span v-if="scope.row.passed===-1" style="color:#F56C6C">未通过</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          align='center'
          label="操作"
          width="100">
          <template slot-scope='scope'>
            <el-button
              type="primary"
              icon='edit'
              size="mini"
              @click='handleOpenReviewTravelDialog(scope.row)'
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <!--total是总数量
      current-page.sync:当前页码
      page-sizes
      page-size：每页显示条数
      pager-count：总页数
      layout：样式-->
      <el-pagination
        background
        :current-page.sync="page.currentPage"
        :page-sizes="page.sizes"
        :page-count="page.pageCount"
        :page-size="this.listQuery.limit"
        :total="total"
        align="center"
        layout="total,prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "reviewTravelList",
  data() {
    return {
      submitTimeRange:[],
      listQuery:{
        limit: 10, //默认每页显示10条
        page: 1, //当前页码
        travelId:'', //查询关键词
        ename:'',
        timeStart:'',
        timeEnd:'',
        passed:''
      }, //查询条件
      // 表格区域
      tableData: [],
      page: {
        currentPage: 1, //当前页码
        pageCount: 0, //总页数，分页操作时从后台获取
        sizes: [10,20]
      },
      total: 0, //总条数
      // IS_DEL_ON_BATCH_BTN_DISABLED:true, // 批量删除按钮disabled控制
      tableHeight:0,
      loading:true, // 表格加载状态, true为正在加载中
      isShow:false, // 是否显示id等不需要显示的内容
      // rowIds:[],//存储选中的行
      // selectedData:[],// 用于存储当前选中的数据
    }
  },
  created() {
    // 修改默认选中的左菜单
    // this.$parent.changeActivatedMenu(2);
  },
  mounted() {
    this.setTableHeight()
    this.listQuery.passed = this.$route.query.passed
    this.getTravelList();
    // alert(this.$route.query.passed)
  },
  watch:{
    // 必须添加路由监听,否则在只改变query值时,不会调用mounted内方法
    $route(){
      this.listQuery.passed = this.$route.query.passed
      this.getTravelList();
    },
  },
  methods: {
    /**
     * 获取数据的多种方法
     */
    // 获取资金列表数据
    getTravelList(){
      this.loading = true
      var currentPageTmp = this.page.currentPage
      if (this.submitTimeRange[0]){
        this.listQuery.timeStart = this.submitTimeRange[0]
      }
      if (this.submitTimeRange[1]){
        this.listQuery.timeEnd = this.submitTimeRange[1]
      }

      axios.post("/getTravelsToReview",this.listQuery).then(res => {
        this.tableData = res.data.travels
        this.total = res.data.total
        this.page.pageCount = res.data.pageCount
        // 如果原始查询页面大于总共的页面数，更新查询页码，重新查询
        if (res.data.pageCount<currentPageTmp){
          if (res.data.pageCount!==0){
            this.page.currentPage = res.data.pageCount
            this.listQuery.page = res.data.pageCount
            debugger
            this.getTravelList()
          }
        }
        this.loading = false
      })
    },

    /**
     * 上方工具区域的方法
     */
    // 关键词查询
    handleScreenOutTravels(){
      // 设置传递到后台的页码为1
      this.listQuery.page=1
      // 设置页面的页码为1
      this.page.currentPage= 1
      this.getTravelList()
    },

    /**
     * 车票数据表格区域方法
     */
    setTableHeight(){
      this.$nextTick(() => {
        this.tableHeight =  document.body.clientHeight - 271
      })
    },
    // 页码改变
    handleCurrentChange(val){
      // 当前页码发生变化时，触发该事件
      // 获取当前页码，赋值给this.listQuery.page
      // val代表当前页码
      this.listQuery.page = val
      this.getTravelList()
    },
    // 每页显示多少条
    handleSizeChange(val){
      // 当每页显示条数发送变化时，触发该事件
      // 需要根据当前参数重新去后台查询数据
      this.listQuery.limit = val
      // 切换每页显示条数后必须从第一页开始查询
      this.listQuery.page = 1
      this.page.currentPage = 1 // 默认显示第一页
      this.getTravelList()
    },
    // 审核操作方法
    handleOpenReviewTravelDialog(row){
      this.$router.push({path:'reviewTravel',query: {travelId:row.travelId}})
    },

  },
}
</script>

<style scoped>
.search_container {
  margin-bottom: 10px;
}
.btnRight {
  float: right;
  margin-right: 0px !important;
}
.searchLeft{
  float: left;
  margin-left: 0px !important;
}
.searchArea {
  background: #ffffff;
  border-radius: 2px;
  padding: 18px 18px 0;
}
.table_container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: left;
  margin-top: 10px;
}
</style>
