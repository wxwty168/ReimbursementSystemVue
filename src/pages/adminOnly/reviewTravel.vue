<template>
  <div class="fillcontain">
    <div class="container">
      <div>
        <h3 style="padding-left: 15px;float: left">审核报销</h3>
        <div class="btnRight" >
          <el-button size="mini" @click='handleGoBack' style="margin-right: 15px">返  回</el-button>
        </div>
        <el-divider class="el-divider--horizontal"></el-divider>
      </div>

<!--    需要提交的表单信息-->
      <div class="form">

        <el-form
          ref="form"
          :model="form"
          :label-width="formLabelWidth"
          style="margin:10px;width:auto;">

          <el-row>
            <el-col :span="12" >
              <el-form-item prop='travelId' label="单据序号 :" >
                {{form.travelId}}
<!--                {{form.travelId" style="width:96%" :disabled="isDisabled" readonly></el-input>-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='ename' label="报销人 :" >
                {{form.ename}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop='firstDepartureTime' label="出发时间 :" >
                {{form.firstDepartureTime}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='lastArrivalTime' label="返回时间 :" >
                {{form.lastArrivalTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop='daysOfTravel' label="天数 :" >
                {{form.daysOfTravel}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='totalReimbursement' label="报销金额 :" >
                {{form.totalReimbursement}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop='travelDescription' label="出差事由 :" >
                {{form.travelDescription}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='submitTime' label="报销时间 :" >
                {{form.submitTime}}
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>

<!--    ticketsData-->
      <div class="table_container" style="clear: both">
        <div>
          <h4 style="float: left;margin-bottom: 17px;">车票信息</h4>
        </div>


        <el-table
          :data="ticketsData"
          border
          height="300"
          style="width: 100%;height:100%"
          align='center'
          >
          <el-table-column
            type="index"
            label="序号"
            align='center'
            width="60">
          </el-table-column>

          <el-table-column
            prop="departureTime"
            label="出发时间"
            align='center'

            width="170">
          </el-table-column>

          <el-table-column
            prop="departure"
            label="出发地点"
            align='center'
          >
          </el-table-column>

          <el-table-column
            prop="arrivalTime"
            label="到达时间"
            align='center'

            width="170">
          </el-table-column>

          <el-table-column
            prop="destination"
            label="到达地点"
            align='center'
          >
          </el-table-column>


          <el-table-column
            prop="transportationName"
            label="交通工具"
            align='center'

          >

          </el-table-column>
          <el-table-column
            prop="reimbursementAmount"
            label="车票金额"
            align='center'

          >
          </el-table-column>
          <el-table-column
            prop="ticketPhotoUrl"
            label="车票照片"
            align='center'
          >
            <template slot-scope="scope">
              <div>
                <div v-if="scope.row.ticketPhotoUrl">
                  <el-button @click="handleShowTicketPhoto(scope.row)">预览</el-button>
                </div>
                <div v-if="!scope.row.ticketPhotoUrl">
                  <span>无照片</span>
                </div>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <div style="text-align: center;margin-bottom: 15px">
        <el-button type="primary" size="mini" @click='review(1)' style="margin-right: 30px">审核通过</el-button>
        <el-button type="danger" size="mini" @click='review(-1)'>不通过</el-button>
      </div>
      <el-image-viewer
        v-if="showImageViewer"
        :on-close="()=>{showImageViewer=false}"
        :url-list="srcList" />

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "reviewTravel",
  components: {
    'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data(){

    return{
      showImageViewer:false,
      srcList: [],
      isDisabled: true,
      showImage: false,
      form:{
        travelId:'',
        ename:'',
        eno:'',
        firstDepartureTime:'',// 出发时间
        lastArrivalTime:'',// 返回时间
        daysOfTravel:'',// 天数
        subsidyAmount:'',// 补助金额
        totalReimbursement:'',// 报销金额
        travelDescription:'',// 出差事由
        submitTime:'',//报销时间
        selectedTickets:[]// 选中的车票id列表, 将车票绑定在本次出差行程上
      },
      formLabelWidth: '120px',
      // 表格区域
      availableTicketsData:[],
      ticketsData: [],
      tableHeight:0,
      // dialog区域
      isVisible:false,
      dialogInfo: {
        title:'旅程信息选择',
        type:'add'
      },
    }
  },
  created(){
    this.$parent.changeActivatedMenu('3-1');
  },
  mounted() {
    this.checkQuery()
  },
  computed: {
    listenChange () {
      const {name1,name2} = this
      return {name1,name2}
    }
  },
  methods:{
    checkQuery(){
      let travelId = this.$route.query.travelId
      if (travelId){
        axios.get("/getTravelByTravelId/"+travelId).then(response => {
          this.form = response.data.travelInfo
          this.ticketsData = response.data.ticketList
          this.isDisabled = false
        })
      }
    },
    handleGoBack(){
      // this.$confirm(`数据暂未提交保存，是否返回？`).then(() => {
        this.$router.go(-1)
      // });
    },
    setTableHeight(){
      this.$nextTick(() => {
        this.tableHeight =  document.body.clientHeight - 322
      })
    },
    handleShowTicketPhoto(row){
      this.srcList[0] = "http://localhost:8088/downloadPicture/"+row.eno+"/ticketImg/"+row.ticketPhotoUrl
      this.showImageViewer = true
    },
    review(passed){
      axios.post("/submitReviewTravel/"+this.form.travelId+"/"+passed).then(res =>{
        if (res.data === 'success'){
          this.$message({type:"success",message:"提交成功!"})
          this.$router.go(-1)
        }else{
          this.$message({type:"error",message:"提交失败,请稍后再试"})

        }
      })
    }
  }
}
</script>

<style scoped>
  .container{
    padding: 10px;
    background: #fff;
    border-radius: 2px;
  }
  .el-divider--horizontal{
    clear: both;
    margin: 30px 0 25px 0;
  }
  .btnRight {
    margin-bottom: 10px;
    float: right;
    margin-right: 0px !important;
  }
  .table_container {
    padding: 30px;
    background: #fff;
    border-radius: 2px;
  }
</style>
