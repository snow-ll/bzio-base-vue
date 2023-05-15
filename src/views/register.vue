<template>
  <div class="register">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">{{ $t('common.register') }}</h3>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
            v-model="registerForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
            @keyup.enter="handleRegister"
        >
        </el-input>
      </el-form-item>
      <!-- 昵称名 -->
      <el-form-item prop="username">
        <el-input
            v-model="registerForm.nickname"
            type="text"
            auto-complete="off"
            placeholder="昵称"
            @keyup.enter="handleRegister"
        >
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
            v-model="registerForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter="handleRegister"
        >
        </el-input>
      </el-form-item>
      <!-- 确认密码 -->
      <el-form-item prop="cPassword">
        <el-input
            v-model="registerForm.cPassword"
            type="password"
            auto-complete="off"
            placeholder="确认密码"
            @keyup.enter="handleRegister"
        >
        </el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code" v-if="pageDate.captchaEnabled">
        <el-input
            v-model="registerForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleRegister"
        >
        </el-input>
        <div class="register-code">
          <img :src="pageDate.codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
            size="medium"
            type="primary"
            style="width:100%;"
            @click="handleRegister"
        >注 册</el-button>
      </el-form-item>

      <div style="float: right;" v-if="pageDate.register">
        <router-link class="link-type" :to="'/login'">登录</router-link>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { register, getCodeImg } from '@/api/system/login'
import { useRouter } from 'vue-router'

const router = useRouter()

const pageDate = reactive({
  register: true,
  captchaEnabled: false,
  codeUrl: '',
})
const registerFormRef = ref(null)
const registerForm = ref({
  username: '',
  nickname: '',
  password: '',
  cPassword: '',
  uuid:'',
})
const registerRules = ref({
  username: [
    {required: true, trigger: "blur", message: "请输入您的账号"}
  ],
  nickname: [
    {required: true, trigger: "blur", message: "请输入您的昵称"}
  ],
  password: [
    {required: true, trigger: "blur", message: "请输入您的密码"}
  ],
  cPassword: [
    {required: true, trigger: "blur", message: "请确认您的密码"}
  ],
  code: [
      {required: true, trigger: "blur", message: "请输入验证码"}
  ]
})

const getCode = () => {
  getCodeImg().then(res => {
    pageDate.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled
    if (pageDate.captchaEnabled) {
      pageDate.codeUrl = "data:image/gif;base64," + res.data.img
      registerForm.value.uuid = res.data.uuid
    }
  })
}
getCode()

const handleRegister = () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      if (registerForm.value.password !== registerForm.value.cPassword) {
        alert('密码不一致！')
      } else {
        await register(registerForm.value)
        await router.push({ path: '/login' })
      }
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("@/assets/image/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 360px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.register-code-img {
  height: 38px;
}
</style>
