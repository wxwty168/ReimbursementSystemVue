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
      style="text-align: left">
<!--        左侧搜索区域-->
        <el-form-item label="出发地点" class="">
          <el-input size="mini" v-model="listQuery.departure" @keyup.enter.native="handleScreenOutTickets" clearable></el-input>
        </el-form-item>
        <el-form-item label="到达地点" class="">
          <el-input size="mini" v-model="listQuery.destination" @keyup.enter.native="handleScreenOutTickets"  clearable></el-input>
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


    <!--新增和编辑的对话框-->
    <el-dialog
      :visible.sync="isVisible"
      :title="dialogInfo.title"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      top="8vh"
      :before-close="handleClose"
      >
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          :label-width="dialog.formLabelWidth"
          style="margin:10px;width:auto;">

          <el-row>
            <el-col :span="12">
              <el-form-item prop='departureProvince' label="出发省份" >
                <el-select v-model="form.departureProvince" placeholder="请选择省份" style="width: 90%" @change="handleDepartureProvinceChange">
                  <el-option
                    v-for="item in provinces"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='departure' label="出发城市" >
                <el-select v-model="form.departure" placeholder="请选择城市" style="width: 90%">
                  <el-option
                    v-for="item in departureCities"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item prop='destinationProvince' label="到达省份" >
                <el-select v-model="form.destinationProvince" placeholder="请选择省份" style="width: 90%" @change="handleArrivalProvinceChange">
                  <el-option
                    v-for="item in provinces"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop='destination' label="到达城市" >
                <el-select v-model="form.destination" placeholder="请选择城市" style="width: 90%">
                  <el-option
                    v-for="item in arrivalCities"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="出发时刻" prop="departureTime">
                <el-date-picker
                  v-model="form.departureTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择出发时刻"
                  style="width: 90%"
                  >
                </el-date-picker>
                <!--value-format="yyyy-MM-dd"这个属性必须加，否则时刻后台用不了style="width: 400px;float: left"-->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到达时刻" prop="arrivalTime">
                <el-date-picker
                  v-model="form.arrivalTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择到达时刻"
                  style="width: 90%"
                >
                </el-date-picker>
                <!--value-format="yyyy-MM-dd"这个属性必须加，否则时刻后台用不了style="width: 400px;float: left"-->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col  :span="12">
              <el-form-item prop='transportationId' label="交通工具" >
                <el-select v-model="form.transportationId" placeholder="请选择交通工具" style="width: 90%">
                  <el-option
                    v-for="item in transportations"
                    :key="item.transportationId"
                    :label="item.transportationName"
                    :value="item.transportationId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col  :span="12">
              <el-form-item prop='reimbursementAmount'  label="车票金额" >
                <el-input v-model.number="form.reimbursementAmount" style="width: 90%" placeholder="请输入车票金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item prop='tripDescription' label="出差说明">
                <el-input type="text" v-model="form.tripDescription" style="width:96%" placeholder="请输入出差说明"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item prop='ticketPhotoUrl' label="车票照片">
                <el-upload
                  class="upload-demo"
                  action="http://localhost:8088/uploadTicketPic"
                  :data="userInfo"
                  name="ticketPhoto"
                  :before-remove="beforeRemovePicture"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :on-preview="handlePreview"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
<!--                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item  class="text_right">
                <el-button @click="handleCloseDialog">取 消</el-button>
                <el-button type="primary" @click='handleSaveOrUpdateTicket'>提  交</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
    </el-dialog>


  <!--    表格-->
    <div class="table_container" style="clear: both">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%;height:100%"
        align='center'
        @selection-change="handleSelectionChange">
<!--        @select="selectTable"-->
<!--        @select-all="selectAll"-->
<!--      >-->
        <el-table-column
          v-if="isShow"
          prop="ticketId"
          label="车票id"
          align='center'
          width="180"
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
          type="selection"
          align='center'
          width="60">
        </el-table-column>
        <el-table-column
          prop="departure"
          label="出发地点"
          align='center'
          >
        </el-table-column>
        <el-table-column
          prop="destination"
          label="到达地点"
          align='center'
        >
<!--          <template slot-scope="scope">-->
<!--            <span style="color:#00d053">+ {{ scope.row.tableAddress || scope.row.address }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="departureTime"
          label="出发时间"
          align='center'
          sortable
          width="170">
<!--          <template slot-scope="scope">-->
<!--            <el-icon name="time"></el-icon>-->
<!--            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="arrivalTime"
          label="到达时间"
          align='center'
          sortable
          width="170">
        </el-table-column>
        <el-table-column
          prop="transportationName"
          label="交通工具"
          align='center'
          width="100"
          >
<!--          <template slot-scope="scope">-->
<!--            <span style="color:#00d053">+ {{ scope.row.income }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="reimbursementAmount"
          label="车票金额"
          align='center'
          width="100"
          >
<!--          <template slot-scope="scope">-->
<!--            <span style="color:#f56767">{{ scope.row.pay }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="ticketPhotoUrl"
          label="车票照片"
          align='center'
          width="80"
          :formatter="ticketPhotoFormatter"
          >
<!--          <template slot-scope="scope">-->
<!--            <span style="color:#4db3ff">{{ scope.row.accoutCash }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="tripDescription"
          label="出差说明"
          align='center'
          width="130"
          >
        </el-table-column>
        <el-table-column
          v-if="isShow"
          prop="travelId"
          label="差旅Id"
          align='center'
          width="130"
          sortable>
        </el-table-column>
        <el-table-column
          prop="operation"
          align='center'
          label="操作"
          width="180">
          <template slot-scope='scope'>
            <el-button
              type="warning"
              icon='edit'
              size="mini"
              @click='handleOpenEditTicketDialog(scope.row)'
            >编辑</el-button>
            <el-button
              type="danger"
              icon='delete'
              size="mini"
              @click='handleDeleteTicket(scope.row,scope.$index)'
            >删除</el-button>
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
  name:"TicketList",
  data(){
    let validateData = (rule, value, callback) => {
      if(value === ''){
        let text;
        if(rule.field == "reimbursementAmount"){
          text='车票金额';
        }
        callback(new Error(text+'不能为空!'));
      }else{
        let numReg = /^[0-9]+.?[0-9]*$/;
        if(!numReg.test(value)){
          callback(new Error('请输入正数值!'));
        }else{
          callback();
        }
      }
    };
    return {
      listQuery:{
        limit: 10, //默认每页显示10条
        page: 1, //当前页码
        departure:'', //查询关键词
        destination:'',
        eno:sessionStorage.getItem("eno")
      }, //查询条件
      // 表格区域
      tableData: [],
      page: {
        currentPage: 1, //当前页码
        pageCount: 0, //总页数，分页操作时从后台获取
        sizes: [10,20]
      },
      total: 0, //总条数
      IS_DEL_ON_BATCH_BTN_DISABLED:true, // 批量删除按钮disabled控制
      tableHeight:0,
      loading:true, // 表格加载状态, true为正在加载中
      isShow:false, // 是否显示id等不需要显示的内容
      // rowIds:[],//存储选中的行
      selectedData:[],// 用于存储当前选中的数据

// 新增和修改车票数据
      dialogInfo: {
        title:'新增车票信息',
        type:'add'
      },
      // 下拉框数据
      provinces:[],
      departureCities:[],
      arrivalCities:[],
      transportations:[],
      fileList: [],
      userInfo:{eno:sessionStorage.getItem("eno")},
      isVisible: false,
      form:{
        eno:sessionStorage.getItem("eno"),
        departureProvince:'',//出发省编号
        departure:'',// 出发城市编号
        destinationProvince:'',// 到达省编号
        destination:'',// 到大城市编号
        departureTime:'',// 出发时间
        arrivalTime:'',// 到达时间
        transportationId:'',// 交通工具编号
        reimbursementAmount:'',// 车票金额
        ticketPhotoUrl:'',// 车票照片本地名称
        tripDescription:'',// 行程描述
      },
      form_rules: {
        departureProvince   : [
          {required: true, message : '出发省份不能为空！',trigger : 'blur'}
        ],
        departure   : [
          {required: true, message : '出发城市不能为空！',trigger : 'blur'}
        ],
        destinationProvince   : [
          {required: true, message : '到达省份不能为空！',trigger : 'blur'}
        ],
        destination   : [
          {required: true, message : '到达城市不能为空！',trigger : 'blur'}
        ],
        departureTime   : [
          {required: true, message : '出发时刻不能为空！',trigger : 'blur'}
        ],
        arrivalTime   : [
          {required: true, message : '到达时刻不能为空！',trigger : 'blur'}
        ],
        transportationId   : [
          {required: true, message : '交通工具不能为空！',trigger : 'blur'}
        ],
        reimbursementAmount   : [
          { required: true, validator:validateData,trigger: 'blur'}
        ],
        tripDescription   : [
          {required: true, message : '出差描述不能为空！',trigger : 'blur'}
        ],
        ticketPhotoUrl   : [
          {required: false, message : '车票照片不能为空！',trigger : 'blur'}
        ],
      },
      //详情弹框信息
      dialog: {
        width:'400px',
        formLabelWidth:'120px'
      }
    }
  },
  components:{
  },
  computed:{
  },
  mounted() {
    this.setTableHeight()
    this.getTicketList();
    this.getAllProvinces();
    this.getAllTransportations();
    // let _this = this;
    // document.onkeydown = function(e) {   //按下回车提交
    //   let key = window.event.keyCode;
    //   //事件中keycode=13为回车事件
    //   if (key == 13) {
    //     _this.handleScreenOutTickets();
    //   }
    // };
  },
  methods: {
    /**
     * 获取数据的多种方法
     */
    // 获取资金列表数据
    getTicketList(){
      this.loading = true
      var currentPageTmp = this.page.currentPage
      axios.post("/getTickets",this.listQuery).then(res => {
        this.tableData = res.data.tickets
        this.total = res.data.total
        this.page.pageCount = res.data.pageCount
        // 如果原始查询页面大于总共的页面数，更新查询页码，重新查询
        if (res.data.pageCount<currentPageTmp){
          if (res.data.pageCount!==0){
            this.page.currentPage = res.data.pageCount
            this.listQuery.page = res.data.pageCount
            debugger
            this.getTicketList()
          }
        }
        this.loading = false
      })
    },
    // 获取所有的省数据
    getAllProvinces(){
      axios.get('/getAllProvinces').then(res => {
        this.provinces = res.data;
      })
    },
    // 获取所有交通工具数据
    getAllTransportations(){
      axios.get("/getAllTransportations").then(res => {
        this.transportations = res.data;
      })
    },
    // 选中的省改变时,获取市数据(出发)
    handleDepartureProvinceChange(){
      this.form.departure = ''
      this.getDepartureCities()
    },
    // 获取市的数据(出发)
    getDepartureCities(){
      axios.get("/getDepartureCities/"+this.form.departureProvince).then(res => {
        this.departureCities = res.data
      })
    },
    // 选中的省改变时,获取市数据(到达)
    handleArrivalProvinceChange(){
      this.form.destination = ''
      this.getArrivalCities()
    },
    // 获取市数据(出发)
    getArrivalCities(){
      axios.get("/getArrivalCities/"+this.form.destinationProvince).then(res => {
        this.arrivalCities = res.data
      })
    },

    /**
     * 上方工具区域的方法
     */
    // 关键词查询
    handleScreenOutTickets(){
      // 设置传递到后台的页码为1
      this.listQuery.page=1
      // 设置页面的页码为1
      this.page.currentPage= 1
      this.getTicketList()
    },
    delTicketsOnBatch(ticketIds){
      axios.post("/delTicketsOnBatch",ticketIds).then(response => {
        if (response.data === 'success'){
          this.getTicketList()
          this.$message({type: 'success',message: '删除成功!'});
        }else{
          this.$message({type: 'error',message: '删除失败!'});
        }
      })
    },
    // 批量删除车票
    handleDeleteTicketsOnBatch(){
      this.$confirm('确认批量删除记录吗?', '提示', {
        type: 'warning'
      })
        .then(_ => {
          let ticketIds = []
          for (let i=0; i<this.selectedData.length; i++){
            ticketIds.push(this.selectedData[i].ticketId)
          }
          this.delTicketsOnBatch(ticketIds)
        })
        .catch(_ => {})
    },
    // 打开新增车票对话框
    handleOpenAddTicketDialog(){
      this.dialogInfo.title='新增车票信息'
      this.dialogInfo.type='add'
      this.isVisible = true
      // this.$refs.form.clearValidate();
    },

    /**
     * 新增修改车票表单的方法
     */
    // 重置表单
    resetForm(formName) {
      this.form = {}
      this.form = this.$options.data().form
      this.$refs['form'].resetFields();
      this.fileList = []
      this.departureCities = []
      this.arrivalCities = []
    },
    // element ui 自带的对话框关闭方法
    handleClose(done) {
      this.$confirm('数据暂未提交保存，是否退出编辑？')
        .then(_ => {
          done();
          this.handleRemovePictureBeforeDialogClose()
          this.resetForm("form")
        })
        .catch(_ => {});
    },
    // 用户自定义的关闭对话框按钮方法
    handleCloseDialog(){
      return this.$confirm(`数据暂未提交保存，是否退出编辑？`).then(() => {
        this.isVisible = false
        this.handleRemovePictureBeforeDialogClose()
        this.resetForm("form")
        // this.form = {}
      });
    },
    // 提交新增或更新车票
    handleSaveOrUpdateTicket(){
      this.$refs['form'].validate((valid) => {
        if (valid){
          axios.post("/saveOrUpdateTicket",this.form).then(response => {
            if (response.data == "success"){
              // 弹框提示成功
              if (this.dialogInfo.type === 'add'){
                this.$message({message:"新增成功",type:"success"})
              }else{
                this.$message({message:"修改成功",type:"success"})
              }
              this.isVisible = false
              this.resetForm("form")
              this.getTicketList()
            }else{
              // 弹框提示
              if (this.dialogInfo.type === 'add'){
                this.$message({message:"新增失败",type:"error"})
              }else{
                this.$message({message:"修改失败",type:"error"})
              }
            }
          })
        }
      })
    },
    // 在关闭对话框时删除照片
    handleRemovePictureBeforeDialogClose(){
      if (this.dialogInfo.type === 'add'){
        this.handleRemovePicture()
      }
    },
    // 删除照片方法
    handleRemovePicture(file, fileList) {
      if (this.form.ticketPhotoUrl !== '' && this.form.ticketPhotoUrl){
        axios.post('/delPic',{eno:sessionStorage.getItem("eno"),picName:this.form.ticketPhotoUrl}).then(res => {
        })
        this.form.ticketPhotoUrl = "";
      }

    },
    // 超出限制上传数量方法
    handleExceed(files, fileList) {
      this.$message.warning(`限制上传一张图片`)
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 删除确认方法
    beforeRemovePicture(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.handleRemovePicture()
        this.$message.success("移除成功");
      });
    },
    // 提交成功方法
    handleSuccess(response, file, fileList){
      this.form.ticketPhotoUrl = response.message
      let photoName = response.message
      file.name = photoName.substr(photoName.indexOf("_")+1)
      file.url = "http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/ticketImg/"+photoName
      // this.fileList[0] = {
      //   name : photoName.substr(photoName.indexOf("_")+1),
      //   url:"http://localhost:8088/"+sessionStorage.getItem("eno")+"/ticketImg/"+photoName
      // }
    },
    handlePreview(file) {
      var a = document.createElement('a');
      var event = new MouseEvent('click');
      a.download = file.name;
      a.href = file.url;
      a.dispatchEvent(event);
      // console.log(file);
    },
    handleError(response, file, fileList){
      this.$message.error('上传失败')
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
      this.getTicketList()
    },
    // 每页显示多少条
    handleSizeChange(val){
      // 当每页显示条数发送变化时，触发该事件
      // 需要根据当前参数重新去后台查询数据
      this.listQuery.limit = val
      // 切换每页显示条数后必须从第一页开始查询
      this.listQuery.page = 1
      this.page.currentPage = 1 // 默认显示第一页
      this.getTicketList()
    },
    // 编辑操作方法
    handleOpenEditTicketDialog(row){
      this.dialogInfo.title='编辑车票信息'
      this.dialogInfo.type='edit'
      // this.$refs.form.clearValidate();
      // 根据员工编号获取员工的详细信息，展示到对话框中
      axios.get("/getTicketById/"+row.ticketId).then(response => {
        // done 重新写填入表格的方法,省市下拉框
        this.form = response.data//为表格填入数据
        this.getDepartureCities()
        this.getArrivalCities()
        let photoName = response.data.ticketPhotoUrl
        // 判断原来是否有照片
        if (photoName){
          this.fileList.push({name : photoName.substr(photoName.indexOf("_")+1),
            url:"http://localhost:8088/downloadPicture/"+sessionStorage.getItem("eno")+"/ticketImg/"+photoName})
        }
        // console.log(this.fileList)
      })
      this.isVisible = true
    },
    // 车票照片显示格式化
    ticketPhotoFormatter(row, column) {
      if (row.ticketPhotoUrl) {
        return '有'
      } else  {
        return '无'
      }
    },
    // 删除单条车票记录
    handleDeleteTicket(row,index){
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          let ticketIds = []
          ticketIds.push(row.ticketId)
          this.delTicketsOnBatch(ticketIds)
        })
        .catch(() => {})
    },
    // 处理复选框变化
    handleSelectionChange:function (val){
      this.selectedData = val
      this.setDelOnBatchBtn(val)
    },
    // 用于设置批量删除按钮是否可以点击
    setDelOnBatchBtn(val){
      this.IS_DEL_ON_BATCH_BTN_DISABLED = val.length <= 0;
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


