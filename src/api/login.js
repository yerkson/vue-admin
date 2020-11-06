import service from '@/utils/request';
// 获取验证码
export function GetSms(data) {
  return service.request({
    methods: 'post',
    url: '/getSms/',
    data,
  });
}

// 登录
export function Login(data) {
  return service.request({
    methods: 'post',
    url: '/login/',
    data,
  });
}
// 注册
export function Register(data) {
  return service.request({
    methods: 'post',
    url: '/register/',
    data,
  });
}
