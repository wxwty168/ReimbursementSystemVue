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
        <el-form-item label="员工编号" class="">
          <el-input size="mini" v-model="listQuery.eno" @keyup.enter.native="handleScreenOutEmployees" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" class="">
          <el-input size="mini" v-model="listQuery.ename" @keyup.enter.native="handleScreenOutEmployees"  clearable></el-input>
        </el-form-item>
        <el-form-item class="">
          <el-button type="primary" size ="mini" icon="search" @click='handleScreenOutEmployees'>筛选</el-button>
        </el-form-item>
        <!--        右侧删除添加区域-->
        <el-form-item class="btnRight">
          <el-button type="primary" size ="mini" icon="view" @click='handleDeleteOrUndeleteEmployeesOnBatch()' :disabled="IS_DEL_ON_BATCH_BTN_DISABLED">
            <template>
              <span v-if="isShow">批量删除</span>
              <span v-if="!isShow">批量恢复</span>
            </template>

          </el-button>
          <!-- <el-button type="success" size ="mini" icon="view">导出Elcel</el-button> -->
          <el-button type="primary" size ="mini" icon="view" @click='handleOpenAddEmployeeDialog()' v-if="isShow">添加</el-button>
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
      width="40%"
      :before-close="handleClose"
    >
      <!--      新增和编辑的表格-->
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          :label-width="dialog.formLabelWidth"
          style="margin:10px;width:auto;">


          <el-form-item prop='eno' label="员工编号">
            <el-input type="text" v-model="form.eno" style="width:96%" :disabled="isDisabled" readonly></el-input>
          </el-form-item>

          <el-form-item prop='ename' label="员工姓名">
            <el-input type="text" v-model="form.ename" style="width:96%" placeholder="请输入员工姓名"></el-input>
          </el-form-item>

          <el-form-item prop='sex' label="性别">
            <el-select v-model="form.sex" placeholder="请选择性别" style="width: 96%">
              <el-option
                :key=0
                label="女"
                :value=0>
              </el-option>
              <el-option
                :key=1
                label="男"
                :value=1>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop='phone' label="联系方式">
            <el-input type="text" v-model="form.phone" style="width:96%" placeholder="请输入联系方式"></el-input>
          </el-form-item>

          <el-form-item prop='rank' label="职称" >
            <el-select v-model="form.rank" placeholder="请选择职称" style="width: 96%">
              <el-option
                v-for="item in employeeRanks"
                :key="item.rank"
                :label="item.title"
                :value="item.rank">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop='password' label="密码" v-if="this.dialogInfo.type==='edit'">
            <el-button type="primary" size ="small" icon="view" @click='resetPassword' >重置密码</el-button>
          </el-form-item>

          <el-form-item  class="text_right">
            <el-button @click="handleCloseDialog">取 消</el-button>
            <el-button type="primary" @click='handleSaveOrUpdateEmployee'>提  交</el-button>
          </el-form-item>


        </el-form>
      </div>
    </el-dialog>


    <!--    表格-->
    <div class="table_container" style="clear: both">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        :key="isShow"
        :height="tableHeight"
        style="width: 100%;height:100%"
        align='center'
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align='center'
          width="60"

        >
        </el-table-column>
        <el-table-column
          prop="eno"
          label="员工编号"
          align='center'
          >
        </el-table-column>
        <el-table-column
          prop="ename"
          label="员工姓名"
          align='center'
        >
        </el-table-column>
        <el-table-column
          prop="sex"
          label="员工性别"
          align='center'
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sex===0">女</span>
            <span v-if="scope.row.sex===1">男</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align='center'
          >
          <!--          <template slot-scope="scope">-->
          <!--            <el-icon name="time"></el-icon>-->
          <!--            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="title"
          label="职称"
          align='center'
          >
        </el-table-column>

        <el-table-column
          prop="operation"
          align='center'
          label="操作"
          width="180"
        >
          <template slot-scope='scope'>
            <el-button
              type="warning"
              icon='edit'
              size="mini"
              @click='handleOpenEditEmployeeDialog(scope.row)'
              v-if="isShow"
            >编辑</el-button>
            <el-button
              type="danger"
              icon='delete'
              size="mini"
              @click='handleDeleteOrUndeleteEmployee(scope.row,scope.$index)'>
              <template>
                <span v-if="isShow">删除</span>
                <span v-if="!isShow">恢复</span>
              </template>
            </el-button>
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
    <el-image-viewer
      v-if="showImageViewer"
      :on-close="()=>{showImageViewer=false}"
      :url-list="srcList" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "manageEmployees",
  components: {
    'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data(){
    let validatePhone = (rule, value, callback) => {
      if(value == ''){
        callback(new Error('请输入手机号码~'));
      }{
        let phoneRegex = /^1[34578]\d{9}$/;
        if (!phoneRegex.test(value)) {
          callback(new Error('手机号码格式不正确！'))
        } else {
          callback();
        }
      }
    };
    return {
      listQuery:{
        limit: 10, //默认每页显示10条
        page: 1, //当前页码
        eno:'', //查询关键词
        ename:'',
        isDeleted:''
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
      isShow:true, // 是否显示id等不需要显示的内容
      // rowIds:[],//存储选中的行
      selectedData:[],// 用于存储当前选中的数据

// 新增和修改员工数据
      dialogInfo: {
        title:'新增员工',
        type:'add'
      },
      isDisabled:true,
      // 下拉框数据
      employeeRanks:[],
      fileList: [],
      userInfo:{eno:sessionStorage.getItem("eno")},
      isVisible: false,
      form:{
        eno:'',
        ename:'',
        sex:'',
        phone:'',
        rank:''
      },
      form_rules: {
        ename   : [
          {required: true, message : '请输入姓名~',trigger : 'blur'}
        ],
        sex   : [
          {required: true, message : '请选择性别~',trigger : 'blur'}
        ],
        phone   : [
          { required: true, validator:validatePhone,trigger: 'blur'}
        ],
        rank   : [
          {required: true, message : '请选择职称~',trigger : 'blur'}
        ],
      },
      //详情弹框信息
      dialog: {
        width:'400px',
        formLabelWidth:'120px'
      },
      showImageViewer:false,
      srcList: [],
    }
  },
  created() {
    // 修改默认选中的左菜单
    switch (this.$route.query.isDeleted) {
      case '0':
        this.$parent.changeActivatedMenu('5-1');
        break
      case '1':
        this.$parent.changeActivatedMenu('5-2');
        break
    }
  },
  mounted() {
    this.listQuery.isDeleted = this.$route.query.isDeleted
    switch (this.$route.query.isDeleted) {
      case '0':
        this.isShow = true
        break
      case '1':
        this.isShow = false
        break
    }
    this.setTableHeight()
    this.getEmployeeList();
    this.getEmployeeRanks()
  },
  watch:{
    // 必须添加路由监听,否则在只改变query值时,不会调用mounted内方法
    $route(){
      this.listQuery.isDeleted = this.$route.query.isDeleted
      switch (this.$route.query.isDeleted) {
        case '0':
          this.isShow = true
          break
        case '1':
          this.isShow = false
          break
      }
      this.getEmployeeList();
    },
  },
  methods: {
    /**
     * 获取数据的多种方法
     */
    // 获取资金列表数据
    getEmployeeList(){
      this.loading = true
      let currentPageTmp = this.page.currentPage
      axios.post("/getEmployees",this.listQuery).then(res => {
        this.tableData = res.data.employeeList
        this.total = res.data.total
        this.page.pageCount = res.data.pageCount
        // 如果原始查询页面大于总共的页面数，更新查询页码，重新查询
        if (res.data.pageCount<currentPageTmp){
          if (res.data.pageCount!==0){
            this.page.currentPage = res.data.pageCount
            this.listQuery.page = res.data.pageCount
            debugger
            this.getEmployeeList()
          }
        }
        this.loading = false
      })
    },
    // 获取所有可以选择的员工职称
    getEmployeeRanks(){
      axios.get("/getEmployeeRanks").then(res => {
        this.employeeRanks = res.data
        this.employeeRanks.splice(this.employeeRanks.findIndex(e => e.rank === 0), 1)
        console.log(this.employeeRanks)
      })
    },

    /**
     * 上方工具区域的方法
     */
    // 关键词查询
    handleScreenOutEmployees(){
      // 设置传递到后台的页码为1
      this.listQuery.page=1
      // 设置页面的页码为1
      this.page.currentPage= 1
      this.getEmployeeList()
    },
    deleteOrUndeleteEmployeesOnBatch(enos){
      axios.post("/deleteOrUndeleteEmployeesOnBatch/"+this.$route.query.isDeleted,enos).then(response => {
        if (response.data === 'success'){
          this.getEmployeeList()
          if (this.$route.query.isDeleted==='0'){
            this.$message({type: 'success',message: '删除成功!'});
          }else {
            this.$message({type: 'success',message: '恢复成功!'});
          }
        }else{
          if (this.$route.query.isDeleted==='0'){
            this.$message({type: 'error',message: '删除失败!'});
          }else {
            this.$message({type: 'error',message: '恢复失败!'});
          }
        }
      })
    },
    // 批量删除车票
    handleDeleteOrUndeleteEmployeesOnBatch(){
      let confirmMessage = ''
      if (this.$route.query.isDeleted==='0'){
        confirmMessage = '确认批量删除记录吗?'
      }else {
        confirmMessage = '确认批量恢复记录吗?'
      }
      this.$confirm(confirmMessage, '提示', {
        type: 'warning'
      })
        .then(_ => {
          let enos = []
          for (let i=0; i<this.selectedData.length; i++){
            enos.push(this.selectedData[i].eno)
          }
          this.deleteOrUndeleteEmployeesOnBatch(enos)
        })
        .catch(_ => {})
    },
    // 打开新增车票对话框
    handleOpenAddEmployeeDialog(){
      this.dialogInfo.title='新增员工'
      this.dialogInfo.type='add'
      this.isDisabled = true
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
          this.resetForm("form")
        })
        .catch(_ => {});
    },
    // 用户自定义的关闭对话框按钮方法
    handleCloseDialog(){
      return this.$confirm(`数据暂未提交保存，是否退出编辑？`).then(() => {
        this.isVisible = false
        this.resetForm("form")
        // this.form = {}
      });
    },
    // 重置密码
    resetPassword(){
      return this.$confirm(`确定要重置密码吗？`).then(() => {
        axios.post("/resetPassword/"+this.form.eno).then(response => {
          if (response.data === "success"){
            this.$message({message:"密码重置成功",type:"success"})
          }else{
            // 弹框提示
            this.$message({message:"密码重置失败",type:"error"})
          }
        })

      })
    },
    // 提交新增或更新车票
    handleSaveOrUpdateEmployee(){
      this.$refs['form'].validate((valid) => {
        if (valid){
          axios.post("/saveOrUpdateEmployee",this.form).then(response => {
            if (response.data === "success"){
              // 弹框提示成功
              if (this.dialogInfo.type === 'add'){
                this.$message({message:"新增成功",type:"success"})
              }else{
                this.$message({message:"修改成功",type:"success"})
              }
              this.isVisible = false
              this.resetForm("form")
              this.getEmployeeList()
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

    /**
     * 车票数据表格区域方法
     */
    // checkBoxT(row, rowIndex){
    //   return row.isDeleted===0;
    // },
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
      this.getEmployeeList()
    },
    // 每页显示多少条
    handleSizeChange(val){
      // 当每页显示条数发送变化时，触发该事件
      // 需要根据当前参数重新去后台查询数据
      this.listQuery.limit = val
      // 切换每页显示条数后必须从第一页开始查询
      this.listQuery.page = 1
      this.page.currentPage = 1 // 默认显示第一页
      this.getEmployeeList()
    },
    // 编辑操作方法
    handleOpenEditEmployeeDialog(row){
      this.dialogInfo.title='编辑员工'
      this.dialogInfo.type='edit'
      this.isDisabled = false
      // this.$refs.form.clearValidate();
      // 根据员工编号获取员工的详细信息，展示到对话框中
      axios.get("/getEmployeeByEno/"+row.eno).then(response => {
        // done 重新写填入表格的方法,省市下拉框
        this.form = response.data//为表格填入数据
        console.log(this.form)

      })
      this.isVisible = true
    },
    // 编辑操作方法
    handleOpenViewTicketPhoto(row){
      this.srcList[0] = "http://localhost:8088/downloadPicture/"+row.eno+"/ticketImg/"+row.ticketPhotoUrl
      this.showImageViewer = true
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
    handleDeleteOrUndeleteEmployee(row,index){
      let confirmMessage = ''
      if (this.$route.query.isDeleted==='0'){
        confirmMessage = '确认删除该记录吗?'
      }else {
        confirmMessage = '确认恢复该记录吗?'
      }
      this.$confirm(confirmMessage, '提示', {
        type: 'warning'
      })
        .then(() => {
          let enos = []
          enos.push(row.eno)
          this.deleteOrUndeleteEmployeesOnBatch(enos)
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
