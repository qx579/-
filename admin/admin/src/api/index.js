import ajax from './ajax'

// 1. 定义基础路径
const BASE_URL = 'http://192.168.43.16:3000';

// 2. 请求的方法
// 7. 用户名和密码登录
export const pwdLogin = (params)=> ajax(BASE_URL + '/login', {...params}, 'POST');
export const getnogoods = (params) => ajax(BASE_URL + '/getnogoods', {...params}, 'POST')
export const getwarning = ()=> ajax(BASE_URL + '/getwarning');
export const addwarning = (params)=> ajax(BASE_URL + '/addwarning', {...params}, 'POST');
export const getgoodByid = (params)=> ajax(BASE_URL + '/getgoodByid', {...params}, 'POST');
export const editgoodstatus = (params)=> ajax(BASE_URL + '/editgoodstatus', {...params}, 'POST');
export const delwarning = (params)=> ajax(BASE_URL + '/delwarning', {...params}, 'POST');
export const editwarning = (params)=> ajax(BASE_URL + '/editwarning', {...params}, 'POST');
export const getd = (params)=> ajax(BASE_URL + '/getd', params, 'POST');
export const getstatus = (params)=> ajax(BASE_URL + '/getstatus', params, 'POST');
export const allsuccess = (params)=> ajax(BASE_URL + '/allsuccess', params, 'POST');
export const allgoods = (params)=> ajax(BASE_URL + '/allgoods', params, 'POST');
export const getimg = (params)=> ajax(BASE_URL + '/getimg', params, 'POST');
export const deleteimg = (params)=> ajax(BASE_URL + '/deleteimg', params, 'POST');
export const deleteimgs = (params)=> ajax(BASE_URL + '/deleteimgs', params, 'POST');
export const editimg = (params)=> ajax(BASE_URL + '/editimg', params, 'POST');
export const addimg = (params)=> ajax(BASE_URL + '/addimg', params, 'POST');
export const editsort = (params)=> ajax(BASE_URL + '/editsort', params, 'POST');
export const getimgbyid = (params)=> ajax(BASE_URL + '/getimgbyid', params, 'POST');
export const getusercount = (params)=> ajax(BASE_URL + '/getusercount', params, 'POST');
export const getsuggest = (params) => ajax(BASE_URL + '/getsuggest',params,'POST')
export const getw = (params) => ajax(BASE_URL + '/getw',params,'POST')
export const email = (params) => ajax(BASE_URL + '/email',params,'POST')
export const getusers = (params) => ajax(BASE_URL + '/getusers',params,'POST')
export const getuser = (params) => ajax(BASE_URL + '/getuser',params,'POST')
export const register = (params) => ajax(BASE_URL + '/register',params,'POST')
export const edituser = (params) => ajax(BASE_URL + '/edituser',params,'POST')
export const deluser = (params) => ajax(BASE_URL + '/deluser',params,'POST')