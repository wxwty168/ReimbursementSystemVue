<template>

  <div class="back" style="height: 700px">
    <div style="text-align: center;width: 100%;height: 100%;">
      <div class="loginContainer">
        <p style="font-size: 20px;line-height: 1.7;">欢迎登陆员工管理系统</p>

        <!--表单信息-->
        <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="eno">
            <el-input v-model="form.eno"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">提交</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  // name: "Login",
  data(){
    return{
      // 表单数据
      form:{
        eno:"",
        password:""
      },
      rules: {// 表单验证规则
        eno: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    var _this = this;
    document.onkeyup = function(e) {   //按下回车提交
      let key = window.keyCode;
      //事件中keycode=13为回车事件
      if (key == 13) {
        _this.login();
      }
    };
  },
  methods:{



    login:function (){
      //判断表单验证是否通过，然后提交数据到后台
      this.$refs["loginForm"].validate((valid) => {
        if (valid){
          // 提交
          axios.post("/login",this.form).then(res => {
            debugger
            if (res.data[0] == 0){
              //
              sessionStorage.setItem("eno",res.data[1]["eno"])
              sessionStorage.setItem("ename",res.data[1]["ename"])
              sessionStorage.setItem("is_admin",res.data[1]["isAdmin"])
              this.$router.push({path: "/home"})
              // this.$message({message: "登录成功",type: 'success'})
            }else{
              this.$message({message: "用户名或密码错误",type: 'error'})
            }
          })
        }else {
          this.$message({message: "用户名或密码不能为空",type: 'error'})
        }
      })
    }
  }
}
</script>

<style scoped>
.back{
  background:url(../../assets/img/login_background.jpg) repeat center center;
}
.loginContainer{
  width: 350px;
  position:relative;
  left: 35%;
  top: 160px;
  background-color: aliceblue;
  padding: 10px 30px 20px 10px
}
</style>
