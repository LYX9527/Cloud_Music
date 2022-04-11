<script lang="ts" setup>
import api from "@/api/login"
import Cookies from "js-cookie";
import {ICtrlUserInfo, setUserInfo} from "@/hooks/index";
import {UserInfo} from "@/typings";
onUnmounted(()=>{
  clearInterval(timer)
})
//获取保存用户登陆信息
const {setuserinfo}: ICtrlUserInfo = setUserInfo();
const router = useRouter();
const {getKey, getQrCode, getQrCodeStatus, phoneLogin, emailLogin, getCheck, getLoginStatus} = api
//cookie字符串
const cookieStr = ref("");
//二维码登陆提示
const loginMsg = ref("");
//登陆二维码img
const loginQc = ref("");
//当前登陆方式
const nowLoginMethod = ref("AccountLogin");
//手机登陆方式切换
const isPhoneLogin = ref(true)
//账号登陆表单
const AccountForm = reactive({
  phone: "",
  password: "",
  captcha: "",
})
//邮箱登陆表单
const EmailForm = reactive({
  email: '',
  password: ''
})
//检测状态定时器
let timer: NodeJS.Timer;
//登陆方式切换
const checkMethod = (method: string) => {
  nowLoginMethod.value = method
  if (method === "QcLogin") {
    QcLogin()
  } else {
    clearInterval(timer)
  }
}
//二维码登陆方式
const QcLogin = async () => {
  await getKey({date: Date.now()}).then((data: { data: { unikey: string; } }) => {
    const key = data.data.unikey
    getQrCode({key, qrimg: true, date: Date.now()}).then((data: { data: { qrimg: string } }) => {
      loginQc.value = data.data.qrimg
    })
    timer = setInterval(() => {
      getQrCodeStatus({key, date: Date.now()}).then((data: { code: number, cookie: string, nickname: string }) => {
        if (data.code === 800) {
          alert('二维码已过期,请重新获取')
          clearInterval(timer)
        }
        if (data.code === 802) {
          if (loginMsg.value === "") {
            loginMsg.value = '欢迎你：' + data.nickname + "\n" + "请在手机上确认登陆"
          }
        }
        if (data.code === 803) {
          clearInterval(timer)
          loginMsg.value = ""
          Cookies.set("User-Cookie", data.cookie, {
            expires: new Date(new Date().getTime() + 15 * 60 * 1000)
          })
          cookieStr.value = encodeURIComponent(data.cookie)
          getLoginStatus({date: Date.now(), cookie: cookieStr.value}).then((data:{data:UserInfo}) => {
            setuserinfo(data.data)
            router.push({
              path:'/'
            })
          })
        }
      })
    }, 1000)
  })
}
//账号密码登陆
const AccountLogin = () => {
  phoneLogin(AccountForm).then((data: UserInfo) => {
    console.log(data)
    if (data.code === 200) {
      Cookies.set("User-Token", data.token, {
        expires: new Date(new Date().getTime() + 15 * 60 * 1000)
      })
      ElMessage({
        message: '登陆成功正在跳转到主页',
        type: 'success',
      })
      setuserinfo(data)
      setTimeout(() => {
        router.push({
          path: '/'
        })
      }, 1000)
    }
  })
}
//邮箱登陆
const EmailLogin = () => {
  emailLogin(EmailForm).then((data: UserInfo) => {
    console.log(data)
    if (data.code === 200) {
      Cookies.set("User-Token", data.token, {
        expires: new Date(new Date().getTime() + 15 * 60 * 1000)
      })
      ElMessage({
        message: '登陆成功正在跳转到主页',
        type: 'success',
      })
      setuserinfo(data)
      setTimeout(() => {
        router.push({
          path: '/'
        })
      }, 1000)
    }
  })
}
//获取验证码
const getCheckCode = () => {
  getCheck({phone: AccountForm.phone})
}
//切换登陆方式
const checkPhoneLoginMethods = () => {
  isPhoneLogin.value = !isPhoneLogin.value
  AccountForm.captcha = ''
  AccountForm.password = ""
}
</script>
<template>
  <div class="loginPage">
    <div class="box" v-if="nowLoginMethod==='QcLogin'">
      <img class="QCimg" :src="loginQc" alt="" v-show="loginQc">
      <div class="cover" v-if="loginMsg">{{ loginMsg }}</div>
      <div class="tip">请使用手机App扫码登陆</div>
    </div>
    <div class="box" v-if="nowLoginMethod==='AccountLogin'">
      <img src="@/assets/netease-music.png" alt="" class="w-4 h-4 mx-auto my-1.5">
      <p class="text-center leading-loose">登陆网易云音乐</p>
      <div class="rounded-md shadow-sm -space-y-px">
        <div class="h-2">
          <input v-model="AccountForm.phone"
                 class="my_input_up"
                 placeholder="手机号">
        </div>
        <div v-show="isPhoneLogin">
          <input v-model="AccountForm.password" type="password"
                 class="my_input_down"
                 placeholder="密码">
        </div>
        <div v-show="!isPhoneLogin">
          <input v-model="AccountForm.captcha"
                 class="my_input_down"
                 placeholder="验证码">
        </div>

        <div class="w-full h-2">
          <span class="block leading-[60px] text-s h-full w-full text-right" style="cursor: pointer"
                @click.stop="checkPhoneLoginMethods">
            <span v-show="!isPhoneLogin" class="xl:text-indigo-500" @click.stop="getCheckCode">获取验证码</span>
            {{ isPhoneLogin ? "切换验证码登陆" : "切换密码登陆" }}</span>
        </div>
        <button class="my_button"
                @click="AccountLogin">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-0.5 w-0.5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
          登陆
        </button>
      </div>
    </div>
    <div class="box" v-if="nowLoginMethod==='EmailLogin'">
      <img src="@/assets/netease-music.png" alt="" class="w-4 h-4 mx-auto my-1.5">
      <p class="text-center leading-loose">登陆网易云音乐</p>
      <div class="rounded-md shadow-sm -space-y-px">
        <div class="h-2">
          <label for="email-address" class="sr-only">Email address</label>
          <input v-model="EmailForm.email" id="email-address" name="email" type="email" autocomplete="email" required
                 class="my_input_up"
                 placeholder="网易163邮箱">
        </div>
        <div class="h-2">
          <label for="password" class="sr-only">Password</label>
          <input v-model="EmailForm.password" id="password" name="password" type="password"
                 autocomplete="current-password" required
                 class="my_input_down"
                 placeholder="邮箱密码">
        </div>
        <div class="w-full h-2"></div>
        <button class="group my_button"
                @click="EmailLogin">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-0.5 w-0.5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"/>
            </svg>
          </span>
          登陆
        </button>
      </div>
    </div>
    <p class="checkMethod" v-if="nowLoginMethod==='QcLogin'"><span
        @click="checkMethod('EmailLogin')">邮箱登陆</span>｜<span @click="checkMethod('AccountLogin')">账号密码登陆</span></p>
    <p class="checkMethod" v-if="nowLoginMethod==='AccountLogin'"><span
        @click="checkMethod('QcLogin')">扫码登陆</span>｜<span @click="checkMethod('EmailLogin')">邮箱登陆</span></p>
    <p class="checkMethod" v-if="nowLoginMethod==='EmailLogin'"><span
        @click="checkMethod('QcLogin')">扫码登陆</span>｜<span @click="checkMethod('AccountLogin')">账号密码登陆</span></p>
  </div>
</template>
<style lang="scss" scoped>
.loginPage {
  width: 500px;
  height: 500px;
  @include Middle;
  user-select: none;

  .box {
    position: relative;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 12px;
    @include shadow;
    @include Middle;
    background-color: rgb(231, 237, 253);

    .QCimg {
      width: 90%;
      //height: 216px;
      width: 400px;
      height: 400px;
      position: absolute;
      top: 0;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 24px;
      border-radius: 15px;
    }

    .tip {
      position: absolute;
      bottom: 8px;
      right: 0;
      width: 100%;
      height: 20px;
      text-align: center;
      line-height: 20px;
    }

    .cover {
      height: 90%;
      width: 90%;
      position: absolute;
      top: 0;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fffe;
      color: #42b983;
      text-align: center;
      line-height: 270px;
    }
  }

  .checkMethod {
    width: 100%;
    height: 50px;
    text-align: center;
    position: absolute;
    bottom: 0;
    user-select: none;

    span {
      cursor: pointer;

      &:hover {
        text-decoration-line: underline;
      }
    }
  }
}

.my_input_down{
  @apply appearance-none rounded-none relative block w-full px-[30px] py-[10px] border border-gray-300 placeholder-gray-500
  text-gray-900 rounded-b-[10px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-[18px]
}
.my_input_up{
  @apply appearance-none rounded-none relative block w-full px-[30px] py-[10px] border border-gray-300 placeholder-gray-500
  text-gray-900 rounded-t-[10px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-[18px]
}
.my_button{
  @apply  relative w-full flex justify-center px-[30px] py-[10px] border border-transparent text-[18px] font-medium rounded-[18px]
  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
}
</style>