<template>
  <div id="login" class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="menuClick(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表單開始 -->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="loginForm">
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwords" class="item-form" v-show="model === 'register'">
          <label>确认密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>

          <el-row :gutter="20">
            <el-col :span="15"><el-input v-model="ruleForm.code"></el-input></el-col>
            <el-col :span="9"
              ><el-button
                type="success"
                class="block"
                minlength="6"
                maxlength="20"
                @click="getSms()"
                :disable="codeBtnStatus.status"
                >{{ codeBtnStatus.text }}</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disable="loginBtnStatus"
            >{{ model.value === 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表单结束 -->
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import { GetSms, Register, Login } from '@/api/login';
import { reactive, ref, onMounted } from '@vue/composition-api';
import { stringscript, validateEmail, validatePwd, validateVCode } from '@/utils/validate';
export default {
  name: 'login',
  setup(props, { refs, root }) {
    //验证用户名
    let checkUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'));
      } else if (validateEmail(value)) {
        callback(new Error('格式有误'));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stringscript(value);
      value = ruleForm.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePwd(value)) {
        callback(new Error('密码为6~12位数字+字母'));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      if (model.value === 'login') callback();
      ruleForm.passwords = stringscript(value);
      value = ruleForm.passwords;
      if (value === '') {
        callback(new Error('请再次输入验证码'));
      } else if (value !== ruleForm.password) {
        callback(new Error('两次密码不一致，请重新输入'));
      } else {
        callback();
      }
    };

    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (validateVCode(value)) {
        callback(new Error('请输入六位数的验证码'));
      } else {
        callback();
      }
    };
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' },
    ]);
    const model = ref('login');
    //登录按钮禁用状态
    const loginBtnStatus = ref(false);
    const timer = ref(null);
    const codeBtnStatus = reactive({
      status: false,
      text: '获取验证码',
    });
    //表单绑定数据
    const ruleForm = reactive({
      username: '',
      password: '',
      passwords: '',
      code: '',
    });
    const rules = reactive({
      username: [{ validator: checkUsername, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      passwords: [{ validator: validatePasswords, trigger: 'blur' }],
      code: [{ validator: validateCode, trigger: 'blur' }],
    });
    const resetFormdata = () => {
      refs.loginForm.resetFields();
    };
    // 声明函数
    const menuClick = item => {
      menuTab.forEach(element => {
        element.current = false;
      });
      item.current = true;
      model.value = item.type;
      resetFormdata();
      clearCountDown();
    };
    //更新按钮状态
    const updataBtnStatus = ({ params }) => {
      codeBtnStatus.status = params.status;
      codeBtnStatus.text = params.text;
    };
    const getSms = () => {
      if (ruleForm.username === '') {
        root.$message.error('邮箱不能为空!');
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error('邮箱格式错误，请重新输入！');
        return false;
      }
      //获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value,
      };
      updataBtnStatus({ status: true, text: '发送中' });

      GetSms(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: 'success',
          });
          loginBtnStatus.value = false;
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };
    //提交表单
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          model.value === 'login' ? login() : register();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    };

    const login = () => {
      const requestData = {
        username: ruleForm.value,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
      };
      Login(requestData)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    };
    const register = () => {
      let requestdata = {
        username: ruleForm.value,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: 'register',
      };
      Register(requestdata)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: 'success',
          });
          menuClick(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
    };

    const countDown = number => {
      let time = number;
      if (timer.value) {
        clearInterval(timer.value);
      }
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearTimeout(timer.value);
          codeBtnStatus.status = false;
          codeBtnStatus.text = '再次获取';
        } else {
          codeBtnStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    const clearCountDown = () => {
      codeBtnStatus.status = false;
      codeBtnStatus.text = '获取验证码';
      clearInterval(timer.value);
    };

    onMounted(() => {
      console.log(process.env.VUE_APP_NEW);
    });
    return {
      menuTab,
      model,
      ruleForm,
      rules,
      timer,
      menuClick,
      submitForm,
      getSms,
      loginBtnStatus,
      codeBtnStatus,
    };
  },
};
</script>

<style lang="scss">
.login {
  height: 100vh;
  background-color: #344af5;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    color: #ffffff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba($color: #000000, $alpha: 0.1);
  }
}
.loginForm {
  margin-top: 29px;
  label {
    display: block;
    font-size: 14px;
    color: #ffffff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
