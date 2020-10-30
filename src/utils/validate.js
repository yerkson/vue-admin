// 过滤特殊字符
export function stringscript(s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]"
  );
  var rs = '';
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

export function validateEmail(value) {
  let reg = /^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return !reg.test(value) ? true : false;
}

export function validatePwd(value) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !reg.test(value) ? true : false;
}

export function validateVCode(value) {
  let reg = /^[a-z0-9]{6}$/;
  return !reg.test(value) ? true : false;
}
