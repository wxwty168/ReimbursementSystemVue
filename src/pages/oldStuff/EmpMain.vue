<template>
  <div>
    <el-container>
      <el-header>欢迎登录员工管理系统</el-header>
      <el-main>
        <div align="left">
          <el-input v-model="listQuery.filter" placeholder="请输入员工姓名" style="width: 200px"></el-input>
          <el-button type="primary" @click="queryEmps">查询</el-button>
        </div>
        <div align="right">
          <el-button type="primary" @click="showAdd">新增</el-button>
          <el-button type="primary" @click="delBatch">删除</el-button>
        </div>

        <!--新增和编辑的对话框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form :model="form" label-position="right" :rules="rules" ref="empForm">
            <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="ename">
              <el-input v-model="form.ename" autocomplete="off" style="width: 400px;float: left"></el-input>
            </el-form-item>
            <el-form-item label="员工年龄" :label-width="formLabelWidth" prop="age">
              <el-input v-model.number="form.age" autocomplete="off" style="width: 400px;float: left"></el-input>
            </el-form-item>
            <el-form-item label="入职日期" :label-width="formLabelWidth" prop="hiredate">
              <el-date-picker
                v-model="form.hiredate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择入职日期"
                style="width: 400px;float: left">
              </el-date-picker>
              <!--value-format="yyyy-MM-dd"这个属性必须加，否则日期后台用不了-->
            </el-form-item>
            <el-form-item label="所属部门" :label-width="formLabelWidth" prop="deptid">
              <el-select v-model="form.deptid" placeholder="请选择所属部门" style="width: 400px;float: left">
<!--                <el-option label="区域一" value="shanghai"></el-option>-->
<!--                <el-option label="区域二" value="beijing"></el-option>-->
                <el-option v-for="dept in this.deptList" :label="dept.dname" :value="dept.deptid"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateEmp">确 定</el-button>
          </div>
        </el-dialog>

        <el-table
          :data="tableData"
          border
          stripe
          height="520"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column align="center"
            type="selection"
            width="100">
          </el-table-column>
          <el-table-column align="center"
            type="index"
            width="100"
            label="序号">
          </el-table-column>
          <el-table-column header-align="center"
            prop="ename"
            label="员工姓名">
          </el-table-column>
          <el-table-column align="center"
            prop="age"
            label="员工年龄"
            >
          </el-table-column>
          <el-table-column align="center"
            prop="hiredate"
            label="入职日期">
          </el-table-column>
          <el-table-column align="center"
            prop="dname"
            label="所属部门">
          </el-table-column>

          <el-table-column align="center"
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
<!--              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
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
          :pager-count="page.pageCount"
          :page-size="this.listQuery.limit"
          :total="total"
          layout="prev,pager,next,sizes,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>

      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "EmpMain",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 1 || value > 120) {
            callback(new Error('年龄必须在1-120之间'));
          } else {
            callback();
          }
        }
      });
    };
    return {
      // 表格分页查询等相关数据
      // 数据初始化
      tableData: [],
      page: {
        currentPage: 1, //当前页码
        pageCount: 0, //总页数，分页操作时从后台获取
        sizes: [10,20]
      },
      listQuery: { // 初始查询条件
        limit: 10, //默认每页显示10条
        page: 1, //当前页码
        filter: ""//查询关键字
      },
      total: 0, //总条数

      // 新增或者编辑功能相关数据
      dialogTitle:"新增员工",
      // 控制对话框的显示和隐藏
      dialogFormVisible: false,
      form:{
        empno:"",
        ename:"",
        age:"",
        hiredate:"",
        deptid:""
      },
      formLabelWidth:'150px', //输入框显示宽度,一定要加双引号
      deptList:[], // 部门信息
      rules: {
        ename:[
          {required:true,message:"请输入员工姓名",trigger:'blur'}
        ],
        age: [
          {required:true, validator: checkAge, trigger: 'blur' }
        ],
        hiredate:[
          {required:true,message:"请选择入职日期",trigger:'blur'}
        ],
        deptid:[
          {required:true,message:"请选择所属部门",trigger:'change'}
        ]
      },
      isAddDialog:true,
      // 用于存储被选中的员工信息
      checkData: []
    }
  },
  methods:{
    getEmps:function (){
      this.$message({message: sessionStorage.getItem("ename"),type: 'success'})
      // this.$message({message: sessionStorage.getItem("eno"),type: 'success'})
      // this.$message({message: sessionStorage.getItem("is_admin"),type: 'success'})
      // 获取所有的员工信息
      // 使用/ 传参，如果查询关键词为空，会出现路径匹配不上的情况，因此不能用 / 拼接，使用 ？拼接则无问题
      // axios.get("/getEmps/" + this.listQuery.limit + "/" +this.listQuery.page+"/"+this.listQuery.filter).then(res => {
      // 参数过多时，推荐使用post方式传参
      var currentPageTmp = this.page.currentPage
      axios.post("/getEmps",this.listQuery).then(res => {
        // res.data返回的是对象数组
        this.tableData = res.data.emps
        this.total = res.data.total
        this.page.pageCount = res.data.pageCount
        // 如果原始查询页面大于总共的页面数，更新查询页码，重新查询
        if (res.data.pageCount<currentPageTmp){
          if (res.data.pageCount!==0){
            this.page.currentPage = res.data.pageCount
            this.listQuery.page = res.data.pageCount
            debugger
            this.getEmps()
          }

        }

      })
      this.getDepts()
    },
    queryEmps:function(){
      // 设置传递到后台的页码为1
      this.listQuery.page=1
      // 设置页面的页码为1
      this.page.currentPage= 1
      this.getEmps()


    },
    handleSizeChange: function (val) {
      // 当每页显示条数发送变化时，触发该事件
      // 需要根据当前参数重新去后台查询数据
      this.listQuery.limit = val
      // 切换每页显示条数后必须从第一页开始查询
      this.listQuery.page = 1
      this.page.currentPage = 1 // 默认显示第一页
      this.getEmps()

    },
    handleCurrentChange: function (val) {
      // 当前页码发生变化时，触发该事件
      // 获取当前页码，赋值给this.listQuery.page
      // val代表当前页码
      this.listQuery.page = val
      this.getEmps()
    },
    // 获取全部的部门信息
    getDepts:function (){
      axios.get("/getDepts").then(response => {
        this.deptList = response.data
      })
    },
    //打开对话框
    showAdd: function(){

      this.dialogTitle = "新增员工"
      this.form = {};
      this.isAddDialog = true
      this.dialogFormVisible = true
      this.$refs.empForm.clearValidate();
    },
    // 新增对话框中的取消按钮事件
    closeDialog:function (){
      // 清空数据，直接将对象置空
      this.form = {};
      this.dialogFormVisible = false
    },
    saveOrUpdateEmp:function (){
      this.$refs['empForm'].validate((valid) => {
        if (valid){
          axios.post("/saveOrUpdateEmp",this.form).then(response => {
            this.closeDialog()
            this.getEmps()
            if (response.data == "success"){
              // 弹框提示成功
              if (this.isAddDialog){
                this.$message({message:"新增成功",type:"success"})
              }else{
                this.$message({message:"修改成功",type:"success"})
              }
            }else{
              // 弹框提示
              if (this.isAddDialog){
                this.$message({message:"新增失败",type:"error"})
              }else{
                this.$message({message:"修改失败",type:"error"})
              }
            }
          })
        }
      })
    },
    handleEdit:function (rowData){

      this.dialogTitle = "编辑员工"
      this.form = {};
      // 根据员工编号获取员工的详细信息，展示到对话框中
      axios.get("/getEmpById/"+rowData.empno).then(response => {
        this.form = response.data
        this.isAddDialog = false
        this.dialogFormVisible = true
      })
      this.$refs.empForm.clearValidate();
    },
    handleSelectionChange:function (val){
      // val为被选中的数据，行对象数组
      this.checkData = val
    },
    delBatch:function (){
      if (this.checkData.length === 0){
        this.$message({message:"请选择要删除的记录",type:"warning"});
        return ;
      }
      this.$confirm('确认删除选中的记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { //确定
        var arrEmpnos = []
        for (var i=0; i<this.checkData.length; i++){
          arrEmpnos.push(this.checkData[i].empno)
        }
        axios.post("/delBatchEmp",arrEmpnos).then(response => {
          if (response.data === 'success'){
            this.getEmps()
            this.$message({type: 'success',message: '删除成功!'});
          }else{
            this.$message({type: 'error',message: '删除失败!'});
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created(){
    // alert("Vue实例已经创建完成")
  },
  mounted() {
    this.getEmps()

  }
}
</script>

<style scoped>

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  /*.el-aside {*/
  /*  background-color: #D3DCE6;*/
  /*  color: #333;*/
  /*  text-align: center;*/
  /*  line-height: 200px;*/
  /*}*/

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /*line-height: 500px;*/
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
