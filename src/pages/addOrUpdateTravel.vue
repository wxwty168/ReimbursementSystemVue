<template>
  <div class="fillcontain">
    <div class="container">
      <div>
        <h3 style="padding-left: 15px;float: left">差旅报销</h3>
        <div class="btnRight" >
          <el-button type="primary" size="mini" @click='handleSaveOrUpdatTravel' >保  存</el-button>
          <el-button size="mini" @click='handleGoBack' style="margin-right: 15px">返  回</el-button>
        </div>
        <el-divider class="el-divider--horizontal"></el-divider>
      </div>

<!--    需要提交的表单信息-->
      <div class="form">

        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          :label-width="formLabelWidth"
          style="margin:10px;width:auto;">

          <el-row>
            <el-col :span="12" >
              <el-form-item prop='travelId' label="单据序号" >
                <el-input type="text" v-model="form.travelId" style="width:96%" :disabled="isDisabled" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='ename' label="报销人" >
                <el-input type="text" v-model="form.ename" style="width:96%" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop='firstDepartureTime' label="出发时间" >
                <el-input type="text" v-model="form.firstDepartureTime" style="width:96%" readonly placeholder="选择车票信息后自动填写"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='lastArrivalTime' label="返回时间" >
                <el-input type="text" v-model="form.lastArrivalTime" style="width:96%" readonly placeholder="选择车票信息后自动填写"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop='daysOfTravel' label="天数" >
                <el-input type="text" v-model="form.daysOfTravel" style="width:96%" readonly placeholder="选择车票信息后自动填写"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='totalReimbursement' label="报销金额" >
                <el-input type="text" v-model="form.totalReimbursement" style="width:96%" readonly placeholder="点击计算补助后自动填写"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop='travelDescription' label="出差事由" >
                <el-input type="text" v-model="form.travelDescription" style="width:96%" placeholder="请输入出差事由"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='submitTime' label="报销时间" >
                <el-input type="text" v-model="form.submitTime" style="width:96%" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>

<!--    可以选择的车票列表-->
      <el-dialog
        :visible.sync="isVisible"
        :title="dialogInfo.title"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
        width="70%"
        top="8vh"
        :before-close="handleClose"
      >

        <div class="table_container" style="clear: both;padding-top: 0px">
          <div class="btnRight" >
            <el-button type="primary" size="mini" @click='handleChooseTickets' >确  定</el-button>
          </div>
          <el-table
            :data="availableTicketsData"
            ref="availableTicketsTable"
            border
            height="420"
            style="width: 100%;height:100%"
            align='center'
          >
            <el-table-column
              type="selection"
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

          </el-table>
        </div>
      </el-dialog>

<!--    ticketsData-->
      <div class="table_container" style="clear: both">
        <div>
          <h4 style="float: left">车票信息</h4>
          <span style="color:#E6A23C;padding-left: 10px">填写格式 : 威海 → 目的地……目的地 → 威海</span>
          <div class="btnRight">
            <el-button type="primary" size="mini" @click='handleOpenChooseTicketsDialog'>选择车票信息</el-button>
            <el-button size="mini" @click='handleClearTable' >清  空</el-button>
          </div>
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

        </el-table>
      </div>

<!--    subsidyData-->
      <div class="table_container" style="clear: both">
        <div>
          <h4 style="float: left">补助信息</h4>
          <span style="color:#E6A23C;padding-left: 10px">补助 : {{ this.dailySubsidy }}/天</span>
          <div class="btnRight">
            <el-button type="primary" size="mini" @click='handleCalcSubsidy' >计算补助</el-button>
          </div>
        </div>


        <el-table
          :data="subsidyData"
          height="300"
          border
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
            prop="workCity"
            label="工作地"
            align='center'
          >
          </el-table-column>

          <el-table-column
            prop="startTime"
            label="起始时间"
            align='center'
            width="170">
          </el-table-column>

          <el-table-column
            prop="endTime"
            label="截止时间"
            align='center'

            width="170">
          </el-table-column>

          <el-table-column
            prop="subsidyDays"
            label="补助天数"
            align='center'
          >
          </el-table-column>


          <el-table-column
            prop="subsidyAmount"
            label="补助总额"
            align='center'
          >
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "addOrUpdateTravel",
  data(){

    return{
      dailySubsidy:sessionStorage.getItem("dailyAllowance"),
      isDisabled: true,
      form:{
        travelId:'',
        ename:sessionStorage.getItem("ename"),
        eno:sessionStorage.getItem("eno"),
        firstDepartureTime:'',// 出发时间
        lastArrivalTime:'',// 返回时间
        daysOfTravel:'',// 天数
        subsidyAmount:'',// 补助金额
        totalReimbursement:'',// 报销金额
        travelDescription:'',// 出差事由
        submitTime:'',//报销时间
        selectedTickets:[]// 选中的车票id列表, 将车票绑定在本次出差行程上
      },
      form_rules: {
        firstDepartureTime   : [
          {required: true, message : '出发时间不能为空！请添加车票',trigger : 'change'}
        ],
        lastArrivalTime   : [
          {required: true, message : '返回时间不能为空！请添加车票',trigger : 'change'}
        ],
        daysOfTravel   : [
          {required: true, message : '差旅天数不能为空！请添加车票',trigger : 'change'}
        ],
        totalReimbursement   : [
          {required: true, message : '报销金额不能为空！请点击计算补助按钮',trigger : 'change'}
        ],
        travelDescription   : [
          {required: true, message : '出差事由不能为空！',trigger : 'blur'}
        ],
      },
      formLabelWidth: '120px',
      // 表格区域
      availableTicketsData:[],
      ticketsData: [],
      tableHeight:0,
      subsidyData:[],
      // dialog区域
      isVisible:false,
      dialogInfo: {
        title:'旅程信息选择',
        type:'add'
      },
    }
  },
  mounted() {
    this.calcSubmitTime()
    this.checkQuery()
  },
  computed: {
    listenChange () {
      const {name1,name2} = this
      return {name1,name2}
    }
  },
  watch: {
    // 监听车票列表变化,对顺序排序
    ticketsData: function (newVal, oldVal) {
      // 判断是否增加数据.防止死循环
      if(newVal.length !== oldVal.length){ // 数据增加 进行排序
        // 对新数据的departureTime属性排序
        newVal.sort(function (a, b) {
          return (new Date(a.departureTime) - new Date(b.departureTime));
        });
        this.form.totalReimbursement = ''// 清空报销总额,强制要求用户点击计算补贴按钮

        let departureTime = new Date(newVal[0].departureTime)
        let arrivalTime = new Date(newVal[newVal.length-1].arrivalTime)
        // 到达时间比出发时间早,不符合规范
        if ((arrivalTime-departureTime)<0){
          this.ticketsData = []
          this.$message({type: 'error',message: '出发时间晚于到达时间,请检查数据!'});
          return
        }

        // 填写出发时间,出差天数
        this.form.firstDepartureTime = newVal[0].departureTime
        this.form.lastArrivalTime = newVal[newVal.length-1].arrivalTime
        // 获取出发/到达的小时和日期
        let hour1 = departureTime.getHours()
        let hour2 = arrivalTime.getHours()
        let departureDate = new Date(newVal[0].departureTime.split(' ')[0])
        let arrivalDate = new Date(newVal[newVal.length-1].arrivalTime.split(' ')[0])

        // 计算天数
        let firstDay = hour1<12 ? 1:0.5
        let lastDay = hour2<12 ? 0.5:1
        let middleDays = (arrivalDate-departureDate)/(24*60*60*1000)

        if (middleDays === 0){// 当天去当天回
          if (hour1<12 && hour2<12 || hour1>12 && hour2>12){
            this.form.daysOfTravel = 0.5
          }else{
            this.form.daysOfTravel = 1
          }
        }else{// 不是当天去,当天回
          this.form.daysOfTravel = firstDay+lastDay+middleDays-1
        }
      }
    },
    subsidyData: function (newVal, oldVal) {
      let subsidy = 0
      let reimbursement = 0
      // 计算补贴金额
      newVal.forEach(function (item) {
        subsidy += item.subsidyAmount
      })
      // 计算总报销金额:车票金额＋补贴金额
      reimbursement += subsidy
      this.ticketsData.forEach(function (item) {
        reimbursement += item.reimbursementAmount
      })
      this.form.subsidyAmount = subsidy
      if (reimbursement === 0){
        this.form.totalReimbursement = ''
      }else{
        this.form.totalReimbursement = reimbursement
      }
    }
  },
  methods:{
    checkQuery(){
      let travelId = this.$route.query.travelId
      if (travelId){
        axios.get("/getTravelByTravelId/"+travelId).then(response => {
          this.form = response.data.travelInfo
          this.form.ename = sessionStorage.getItem("ename");
          this.form.firstDepartureTime = this.form.firstDepartureTime.split('.')[0]
          this.form.lastArrivalTime = this.form.lastArrivalTime.split('.')[0]
          this.ticketsData = response.data.ticketList
          this.handleCalcSubsidy()
          this.isDisabled = false
        })
      }
    },
    calcSubmitTime(){
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let date = now.getDate()
      this.form.submitTime = year + '-' + month + '-' + date
    },
    calcTotalReimbursement(){
    },
    // 提交新增或更新车票
    handleSaveOrUpdatTravel(){
      this.$refs['form'].validate((valid) => {
        if (valid){
          // 存储已经选中的车票id
          let chosenTickets = []
          this.ticketsData.forEach(function (item) {
            chosenTickets.push(item.ticketId)
          })
          this.form.selectedTickets = chosenTickets
          console.log(this.form.selectedTickets)
          axios.post("/saveOrUpdateTravel",this.form).then(response => {
            if (response.data === "success"){
              // 弹框提示成功
              this.$message({type:'success', message:'保存成功!'})
              this.$router.push("travelList")
            }else{
              // 弹框提示
              this.$message({type:'error', message:'操作失败!请稍后再试'})
            }
          })
        }
      })
    },
    handleGoBack(){
      this.$confirm(`数据暂未提交保存，是否返回？`).then(() => {
        this.$router.go(-1)
      });
    },
    setTableHeight(){
      this.$nextTick(() => {
        this.tableHeight =  document.body.clientHeight - 322
      })
    },
    // 打开选择车票对话框
    handleOpenChooseTicketsDialog(){
      this.availableTicketsData = []
      // 存储已经选中的车票id
      let chosenTickets = []
      this.ticketsData.forEach(function (item) {
        chosenTickets.push(item.ticketId)
      })

      let listQuery = {
        eno: sessionStorage.getItem("eno"),
        travelId: this.form.travelId,
        chosenTickets: chosenTickets
      }
      // 后台获取可选车票列表
      axios.post("/getAvailableTickets",listQuery).then(res => {
        this.availableTicketsData = res.data
      })
      this.isVisible = true
    },
    handleChooseTickets(){
      let selectedTickets = this.$refs.availableTicketsTable.selection
      this.ticketsData = this.ticketsData.concat(selectedTickets)
      // 清空选中内容 关闭对话框
      this.$refs.availableTicketsTable.clearSelection()
      this.isVisible = false
    },
    handleClose(done){
      this.$refs.availableTicketsTable.clearSelection()
      done()
    },
    handleClearTable(){
      this.ticketsData = []
      this.subsidyData = []
      this.form.firstDepartureTime = ''
      this.form.lastArrivalTime = ''
      this.form.daysOfTravel = ''
    },
    handleCalcSubsidy(){
      if (this.ticketsData.length<2){
        this.$message({type: 'error',message: '请至少添加两条车票数据!'})
        return
      }
      let workPlaces = ''
      workPlaces+= this.ticketsData[0].destination.split(' ')[1]
      for (let i=1; i<this.ticketsData.length-1; i++){
        workPlaces+= ', '+this.ticketsData[i].destination.split(' ')[1]
      }
      let subsidyInfoDemo = {
        workCity: workPlaces,
        startTime:this.form.firstDepartureTime,
        endTime:this.form.lastArrivalTime,
        subsidyDays:this.form.daysOfTravel,
        subsidyAmount: this.form.daysOfTravel*this.dailySubsidy
      }
      this.subsidyData.push(subsidyInfoDemo)
      let totalSubsidyAmount = this.form.daysOfTravel*this.dailySubsidy
      this.form.subsidyAmount = totalSubsidyAmount
      let totalTicketPrice = 0
      this.ticketsData.forEach(function (item) {
        totalTicketPrice += item.reimbursementAmount
      })
      this.form.totalReimbursement = totalSubsidyAmount + totalTicketPrice
    },

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
