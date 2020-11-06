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
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="loginForm">
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
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
            <el-col :span="15"><el-input v-model.number="ruleForm.code"></el-input></el-col>
            <el-col :span="9"
              ><el-button type="success" class="block" minlength="6" maxlength="20"
                >获取验证码</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表单结束 -->
    </div>
  </div>
</template>

<script>
import { stringscript, validateEmail, validatePwd, validateVCode } from '@/utils/validate';
export default {
  name: 'login',
  data() {
    //验证用户名
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'));
      } else if (validateEmail(value)) {
        callback(new Error('格式有误'));
      } else {
        callback();
      }
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password = stringscript(value);
      value = this.ruleForm.password;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (validatePwd(value)) {
        callback(new Error('密码为6~12位数字+字母'));
      } else {
        callback();
      }
    };
    //验证重复密码
    var validatePasswords = (rule, value, callback) => {
      if (this.model === 'login') callback();
      this.ruleForm.passwords = stringscript(value);
      value = this.ruleForm.passwords;
      if (value === '') {
        callback(new Error('请再次输入验证码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次密码不一致，请重新输入'));
      } else {
        callback();
      }
    };

    //验证验证码
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else if (validateVCode(value)) {
        callback(new Error('请输入六位数的验证码'));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: '登录', current: true, model: 'login' },
        { txt: '注册', current: false, model: 'register' },
      ],
      ruleForm: {
        username: '',
        password: '',
        passwords: '',
        code: '',
      },
      model: 'login',
      rules: {
        username: [{ validator: checkUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        passwords: [{ validator: validatePasswords, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }],
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    menuClick(item) {
      this.menuTab.forEach(element => {
        element.current = false;
      });
      item.current = true;
      this.model = item.model;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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
