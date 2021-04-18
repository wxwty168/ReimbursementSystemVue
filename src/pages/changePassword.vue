<template>
  <div class="fillcontain" ref="fillcontain" >
    <div class="info_container" ref="info_container" style="height: 570px">
      <el-row class="info_row row" :gutter="10">
        <el-col :span="8" :offset="8">
          <div class="area">
            <div class="pwdarea">
              <p class="title">修改密码</p>
              <el-form class="form"  :model="pwdForm" :rules="pwdRules" ref="pwdForm" label-width="100px">
                <el-form-item label="原密码" prop="password">
                  <el-input type="password" v-model="pwdForm.password" auto-complete="off" size="large" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" v-model="pwdForm.newPassword" auto-complete="off" size="large" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="surePassword">
                  <el-input type="password" v-model="pwdForm.surePassword" auto-complete="off" size="large" placeholder="请输入确认新密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('pwdForm')">提交</el-button>
                  <el-button @click="resetForm('pwdForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "changePassword",
  data(){
    // validateField:对部分表单字段进行校验的方法
    let validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.pwdForm.surePassword !== '') {
          this.$refs.pwdForm.validateField('surePassword');
        }
        callback();
      }
    };
    let validateSurePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      pwdForm:{
        eno:sessionStorage.getItem("eno"),
        password:'',
        newPassword:'',
        surePassword:''
      },
      pwdRules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, validator:validateNewPassword, trigger: 'blur' },
        ],
        surePassword: [
          { required: true, validator:validateSurePassword, trigger: 'blur' },
        ],
      },
    };


  },
  created(){
    this.$parent.changeActivatedMenu('4-2');
  },
  mounted() {
  },
  methods: {
    showMessage(type,message){
      this.$message({
        type: type,
        message: message
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交
          axios.post("/changePassword",this.pwdForm).then(res => {
            if (res.data === 0){
              this.showMessage('success','修改密码成功~');
            }else if (res.data === 1){
              this.showMessage('error','修改密码失败,请稍后再试');
            }else {
              this.showMessage('error','原密码不正确');
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>
.info_container {
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  overflow: auto;
}
.title {
  text-align: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  background-color: #3bc5ff;
  border: 1px solid #3bc5ff;
  color: white;
  display: block;
}
.info_row .area {
  border: 1px solid #dfdfdf;
  height: 100%;
  font-size: 14px;
  padding: 10px;
}
.info_row .area .form {
  width: 90%;
  margin-top: 20px;
}

</style>
