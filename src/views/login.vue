<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ $t('common.login') }}</h3>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
            @keyup.enter="handleLogin"
        >
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            show-password
            @keyup.enter="handleLogin"
        >
        </el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code" v-if="pageDate.captchaEnabled">
        <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
        </el-input>
        <div class="login-code">
          <img :src="pageDate.codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
            size="medium"
            type="primary"
            style="width:100%;"
            @click="handleLogin"
        >登 录
        </el-button>
      </el-form-item>

      <div style="float: right;" v-if="pageDate.register">
        <router-link class="link-type" :to="'/register'">立即注册</router-link>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { getCodeImg } from '@/api/system/login'

const store = useStore()

const pageDate = reactive({
  register: true,
  captchaEnabled: false,
  codeUrl: '',
})
const loginFormRef = ref(null)
const loginForm = ref({
  username: 'admin',
  password: '123456',
  code: '',
  uuid: '',
})

const loginRules = ref({
  username: [
    {required: true, trigger: "blur", message: "请输入您的账号"}
  ],
  password: [
    {required: true, trigger: "blur", message: "请输入您的密码"}
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
      loginForm.value.uuid = res.data.uuid
    }
  })
}
getCode()

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      await store.dispatch('login', loginForm.value).catch(() => {
        if (pageDate.captchaEnabled) {
          getCode();
        }
      })
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.login {
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

.login-form {
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

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
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

.login-code-img {
  height: 38px;
}
</style>
