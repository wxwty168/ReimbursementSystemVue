<template>
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
</template>

<script>
import axios from "axios";

export default {
  name: "addTravel",
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
    return{
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
  methods:{
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
  }
}
</script>

<style scoped>

</style>
