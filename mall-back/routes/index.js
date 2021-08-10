var express = require('express');
var router = express.Router();
var models = require('./db.js');
var request=require('request');
var mysql = require('mysql');
var multer = require('multer');
var jwt = require("jsonwebtoken");
var fs = require('fs');
var path = require('path')
var UUID = require('uuid')
var datetime=require('silly-datetime');
// 引入SVG的验证码文件
var svgCaptcha = require('svg-captcha');
// 邮箱验证码
const nodemailer = require("nodemailer");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var storage = multer.diskStorage({  
  destination: function (req, file, cb) {  
    console.log('123')
      cb(null, '../public/images')  
  },  
  filename: function (req, file, cb) {  
      var str = file.originalname.split('.');  
      cb(null, UUID.v1()+'.'+str[1]);  
  }  
})
var upload = multer({storage: storage})

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
      res.json({
          code: '1',
          msg: '操作失败'
      });
  } else {
      res.json(ret);
  }
};

/* 获取随机图形验证码*/
router.get('/captcha', (req, res)=>{
   // 1. 生成随机的验证码
   var captcha = svgCaptcha.create({
       color: true,
       noise: 2,
       size: 4, // 验证码长度
       ignoreChars: '0o1i', // 验证码字符中排除 0o1i
   });
   // 2. 保存验证码到session
   req.session.captcha = captcha.text.toLocaleLowerCase();
   // 3. 返回给客户端
   res.type('svg');
   res.status(200).send(captcha.data);
});
// 邮箱验证码
router.post('/email',(req,res) =>{
  var params = req.body;
  let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: "qq", // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    //   port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: "2323374271@qq.com",
      pass: "myaormqafppqebbc", //授权码，并非QQ密码
    },
  });
  if(params.type=="capture"){
    var code = Math.random().toString().substr(2, 4)//从第二位开始截取，截取4位（当然也可以6位）
    var text=`您的验证码是${code},验证码在10分钟内有效`
  }
  else if(params.type=="check"){
    if(params.status=="1"){
      var text="亲爱的花生二手车用户您好，你在本平台发布的二手车已经通过审核，通过审核的二手车已经在本平台发布，您可以登陆进行查看。"
    } else if(params.status=="-1"){
      var text="亲爱的花生二手车用户您好，抱歉你在本平台发布的二手车审核失败，请您尽快登陆本平台进行信息修改，给您带来的麻烦请谅解。"
    }
  }
  let mailOptions = {
    from: '2323374271@qq.com', // 发送地址
    to: params.userName, // 接收列表（可多个）
    subject: "花生二手车", // 主题
    // 发送text或者html格式（任选一个）
    text: text
  };
  
  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    // 保存验证码到session
    if(params.type=="capture"){
      req.session.email = code;
    }
    jsonWrite(res, {
      code: 200
  });
  });
})
// 注册
router.post('/register',(req,res)=>{
  var params = req.body;
  conn.query("select *from user where userName=?", [params.userName], function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        if (result.length > 0) {
            jsonWrite(res, {
                code: -1,
                msg: '该账号已注册！'
            });
        } else {
          var type=''
          if(params.type!=null&&params.type!=''){
            type=params.type
          } else{
            type='user'
          }
            conn.query("INSERT INTO user(userName,password,regist_time,type) VALUES(?,?,?,?)", 
            [params.userName, params.userPwd,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),type], function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res,{
                      code:200,
                      result
                    });
                }
            })
        }
    }
})
})
// 验证码登陆
router.post('/captchaLogin',(req,res) =>{
  var params=req.body;
  conn.query("select * from user where userName=?", [params.userName], function (err, result) {
    if (err) {
      jsonWrite(res, {
        code:-1,
        msg:'登录失败'
      });
    }
    if (result) {
      if (result.length == 0) {
        conn.query("INSERT INTO user(userName) VALUES(?)", [params.userName], function (err) {
          if (err) {
            console.log(err)
          }
        })
      } 
      if(params.captcha!=req.session.email) {
        jsonWrite(res, {
          code: -1,
          msg: '验证码错误'
        });
      }
      else{
        var token= jwt.sign({ userName: params.userName }, 'abcd', {
          // 过期时间
          expiresIn: "3000s"
       });
        jsonWrite(res, {
          code:200,
          token:token
        });
      }  
    }
})
})
// 密码登录
router.post('/login', (req, res) => {
  var params = req.body;
  conn.query("select * from user where userName=?", [params.userName], function (err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          if (result.length == 0) {
              jsonWrite(res, {
                  code: -1,
                  msg: '用户名不存在！'
              });
          } else {
              if (result[0].password == params.password) {
                var token= jwt.sign({ userName: params.userName }, 'abcd', {
                  // 过期时间
                  expiresIn: "3000s"
                 });
                  jsonWrite(res, {
                    code:200,
                    token:token,
                    data:result
                  });
              }
              else {
                  jsonWrite(res, {
                      code: -1,
                      msg: '密码不正确！'
                  });
              }
          }
      }
  })
});
// 得到用户信息
router.post('/getuser',(req,res)=>{
  var params=req.body
  conn.query("select * from user where userName=?",[params.userName],function(err,result){
    if(err){
      console.log(err)
    } else{
      jsonWrite(res,{
        code:200,
        data:result
      })
    }
  })
})

function uploadfile(file){
  let file_n=file.filename+path.extname(file.originalname); //拼接   重新定义的文件名+尾缀
  let newfile=file.path+path.extname(file.originalname);  // 把上传的图片文件重命名-->添加尾缀 
  var goods_picture ='http://192.168.43.16:3000/images/'+file_n; //之后用于存储在数据库的路径
  fs.rename(file.path,newfile,function (err) {  // 将上传的文件重命名   因为上传之后req.files[0].path是没有尾缀的
    if (err){
      console.log('上传失败'+err)
    }else{
        console.log("上传成功")
        
    }
  })
  return goods_picture;
}

// 添加商品
router.post('/addgoods',(req,res)=>{
  var params=req.body;
  var u=UUID.v1();
  var goods_picture="";
  for(var i=0;i<=req.files.length-1;i++){
     goods_picture+=uploadfile(req.files[i])+'#'
  }
  goods_picture=goods_picture.substring(0,goods_picture.length-1)
  conn.query("insert into goodscheck(goods_id,status) value(?,?)",[u,'0'],function(err,result){
    if(err){
      console.log(err);
      rentun
    }
  })
  conn.query("insert into goods(goods_id,name,phone,address,urgent,vin,brand,color,firstTime,mile,guohuPrice,price,descrip,checkYear,traffic,insurance,diya,baoyang,hightlights,times,goods_picture,addtime,userName) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
  [u,params.name,params.phone,params.address,params.urgent,params.vin,params.brand,
    params.color,params.firstTime,params.mile,params.guohuPrice,params.price,params.descrip,params.checkYear,params.traffic,params.insurance,params.diya,params.baoyang,params.hightlights,params.times
    ,goods_picture,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),params.userName], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res, {
          code:200,
          data:result
        });
    }
  })
})

// 修改商品
router.post('/editgoods',(req,res)=>{
  var params=req.body;
  var goods_picture=params.picture?params.picture:'';
  for(var i=0;i<=req.files.length-1;i++){
    goods_picture+=uploadfile(req.files[i])+'#'
  }
  conn.query("insert into goodscheck(goods_id,status) value(?,?)",[params.goods_id,'0'],function(err,result){
    if(err){
      console.log(err);
    }
  })
  conn.query("update  goods set name=?,phone=?,address=?,urgent=?,vin=?,brand=?,color=?,firstTime=?,mile=?,guohuPrice=?,price=?,descrip=?,checkYear=?,traffic=?,insurance=?,diya=?,baoyang=?,hightlights=?,times=?,goods_picture=?,addtime=? where goods_id=?" ,
  [params.name,params.phone,params.address,params.urgent,params.vin,params.brand,
    params.color,params.firstTime,params.mile,params.guohuPrice,params.price,params.descrip,params.checkYear,params.traffic,params.insurance,params.diya,params.baoyang,params.hightlights,params.times
    ,goods_picture,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),params.goods_id], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res, {
          code:200,
          data:result
        });
    }
  })
})

//根据id查询商品
router.post('/getgoodByid',(req,res)=>{
  var params=req.body;
  conn.query("select * from goods join goodscheck on goods.goods_id=goodscheck.goods_id where goods.goods_id=?", [params.goods_id], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result){
      jsonWrite(res,{
        code:200,
        data:result
      })
    }
  })
})

// 根据用户查找商品
router.post('/getgoodbyuser',(req,res)=>{
  var params=req.body;
  conn.query("select * from goods join goodscheck ON goods.goods_id=goodscheck.goods_id where userName=? and status!=3", [params.userName], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result){
      jsonWrite(res,{
        code:200,
        data:result
      })
    }
  })
})

// 得到不同状态审核车辆
router.post('/getnogoods',(req,res)=>{
  var params=req.body;
  var currentPage = params.currentPage;
  var size = params.size;
  var m=(currentPage-1)*size
  
  var sql="select * from goods join goodscheck ON goods.goods_id=goodscheck.goods_id where "
  var arr=[]
  var one=''
  if(params.status=='12'){
    one+="(status='1' or status=-'1')"
  } else {
    one+='status=? '
    arr.push(params.status)
  }
  if(params.del_reason!=null&&params.del_reason!=''){
    one+=' and del_reason =?'
    arr.push(params.del_reason)
  }
  if(params.goods_id!=null&&params.goods_id!=''){
    one+=" and goodscheck.goods_id like '"+params.goods_id+"%'"
    
  }
  sql=sql+one+" limit "+m+','+size;
  console.log(sql,arr)
  var count ='select  COUNT(1)  from goods join goodscheck on goods.goods_id=goodscheck.goods_id where  '+one;
  conn.query(count,arr,function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
    conn.query(sql,arr,function(err,result2){
          if(err){
            console.log(err)
          } else{
            jsonWrite(res,
              {
                code:200,
                data:result2,
                total:result[0]['COUNT(1)']
              });
          }
        })
    }
  })
});
  

// 首页商品
  
router.post('/headgoods',(req,res)=>{
  var params=req.body;
  var sql=''
  // 1.前六条
  if(params.type=='1'){
    sql="select * from goods join goodscheck on goods.goods_id=goodscheck.goods_id where status=1 order by addtime desc limit 6"
  }
  //2.价格低于10w车辆
  else if(params.type=='2'){
    sql="select * from goods join goodscheck on goods.goods_id=goodscheck.goods_id where status=1 and price<=10 order by addtime desc limit 6"
  }
  //3.最近成交
  else if(params.type=='3'){
    sql="select * from goods join goodscheck on goods.goods_id=goodscheck.goods_id where status=3 and del_reason='已卖出' order by selltime desc limit 6"
  }
   //3.今日推荐
   else if(params.type=='0'){
    sql="select * from goods join goodscheck on goods.goods_id=goodscheck.goods_id where status=1 and address like '%北京%' order by addtime desc limit 6"
  }
  conn.query(sql,function(err,result){
    if(err){
      console.log(err)
    } else{
      jsonWrite(res,
        {
          code:200,
          data:result
        }
      )
    }
  })
})
  
  
// 修改审核状态
router.post('/editgoodstatus',(req,res)=>{
  var params=req.body;
  conn.query("update goodscheck set status=?,reason=?,checktime=? where goods_id=?",[params.status,params.reason,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),params.goods_id] ,function(err,result){
        if(err){
          console.log(err)
        } else{
          jsonWrite(res,
            {
              code:200,
              data:result
            })
        }
      })
})

// 删除商品
router.post('/delgood',(req,res)=>{
  var params=req.body;
  var sql='';
  var arr='';
  if(params.market_price){
    sql='update  goodscheck set status=?,del_reason=?,market_price=?,selltime=? where goods_id=?';
    arr=[3,params.del_reason,params.market_price,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),params.goods_id]
  } else{
    sql='update  goodscheck set status=?,del_reason=?,selltime=? where goods_id=?'
    arr=[3,params.del_reason,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss'),params.goods_id]
  }
  conn.query(sql,arr,function(err,result){
    if(err){
      console.log(err)
    }
    else{
      jsonWrite(res, {
        code:200
      });
    }
  })
})

//加入收藏夹
router.post('/addcollect',(req,res)=>{
  var params = req.body;
  conn.query('select *from collect where userName=? and goods_id=?',[params.userName,params.goods_id],function(err,result){
    if (err) {
      console.log(err);
    }
    if(result){
      if(result.length>0){
        jsonWrite(res, {
          code: -1,
          msg: '该商品已在收藏夹中！'
        });
      }
      else{
        conn.query("insert into collect(userName,goods_id) value(?,?)",[params.userName,params.goods_id],function(err, result){
          if(err){
            console.log(err)
          }
          else{
            jsonWrite(res, {
              code:200
            });
          }
        })
      }
    }
  })
  
})
// 查询收藏
router.post('/getcollect',(req,res)=>{
  var params=req.body;
  conn.query("select goods_id from collect where userName=?",[params.userName],function(err,result){
    let arr=[]
    for(let i=0;i<result.length;i++){
      
      conn.query('select goods_id,brand,price,goods_picture from goods where goods_id=?',[result[i].goods_id],function(err,result2){

        arr.push(result2[0])
        if(i==result.length-1){
          jsonWrite(res,{
            code:200,
            arr
          })
        }
      })
      
    }
  })

})

// 删除收藏
router.post('/delcollect',(req,res)=>{
  var params=req.body;
  conn.query("delete from collect where userName=? and goods_id=?", [params.userName,params.goods_id],function(err,result){
    if(err){
      console.log(err)
    }
    else{
      jsonWrite(res,{
        code:200
      })
    }
  })
})

// 批量删除收藏
router.post('/delcollects',(req,res)=>{
  var params=req.body;
  var re=true;
  for(var i=0;i<params.multipleSelection.length;i++){
    conn.query("delete from collect where userName=? and goods_id=?", [params.userName,params.multipleSelection[i].goods_id],function(err,result){
      if(err){
        console.log(err);
      } 
    })
  }
  if(re){
    jsonWrite(res,{
      code:200
    })
  }

})

// 修改头像
router.post('/edituser',(req,res)=>{
  var params=req.body
  var one=''
  var arr=[]
  if(req.files){
    var headphoto=uploadfile(req.files[0])
    conn.query("update user set headphoto=? where userName=?", [headphoto,params.userName], function (err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res, {
            code:200,
            headphoto:headphoto
          });
      }
    })
  } 
  else{
    if(params.phone){
      one='phone=?'
      arr.push(params.phone)
    }
    if(params.type!=null&&params.type!=''){
      if(one){
        one+=',type=?'
      } else{
        one='type=?'
      }
      arr.push(params.type)
    }
    if(params.password!=null&&params.password!=''){
      if(one){
        one+=',password=?'
      } else{
        one='password=?'
      }
      arr.push(params.password)
    }
    if(params.name){
     if(one){
       one+=',name=?'
     } else{
       one='name=?'
     }
     arr.push(params.name)
    }
    arr.push(params.userName)
    conn.query("update user set "+one+"where userName=?", arr, function (err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res, {
            code:200,
            data:result
          });
      }
    })
  }
  
})
// 修改密码
router.post('/modifyPsd', (req, res) => {
  var params = req.body;
  conn.query("select *from user where userName=?",[params.userName],function(err,result){
      if(err){
          console.log(err);
      }
      if(result){
          if(result[0].password!=params.oldpsd){
              jsonWrite(res,{
                  code:-1,
                  msg:"原密码不正确！"
              })
          }else{
              conn.query("update user set password=? where userName=?",[params.newpsd,params.userName],function(err,result){
                  if(err){
                      console.log(err);
                  }
                  if(result){
                      jsonWrite(res,{
                          code:200,
                          msg:"修改密码成功！"
                      })
                  }
              })
          }
      }
  })
});

// 汽车品牌
router.get('/gettask',function(req, res){
  var e=request({url:'http://apis.juhe.cn/cxdq/brand?key=3de89934c1861cc8713d5bb860ebb85c&first_letter=',
  method:'GET',
  headers:{'Content-Type':'text/json' }
  },function(error,response,body){
      if(!error && response.statusCode==200){
        jsonWrite(res, {
          code:200,
          data:JSON.parse(body)
        });
      }
  });
})
// 根据条件获取商品
router.post('/getGoodsinfo', (req, res) => {
  var params = req.body;
  var search=params.search;
  var currentPage = params.currentPage;
  var size = params.size;
  var m=(currentPage-1)*size
  var color=params.color;
  var brand=params.brand;
  var mile=Number(params.mile);
  var year=params.year;
  var d=new Date();
  var nowtime=d.getFullYear();
  var time=Number(nowtime-year);
  var sqlc=''
  var one='where status=1';
  var two=''
  var arr=[];
  if(color!=null && color!=""){
    one+=' and color =?'
    arr.push(color)
  }
  if(search!=null && search!=""){
    var str=search;
    var re=''
    for(var i=0;i<str.length;i++){
      re+='%'+str[i]
    }
    re+='%'
    one+=" and CONCAT(address,brand)  like '" +re+"'"
  }
  if(brand!=null&&brand!=''){
    one+=' and brand =?'
    arr.push(brand)
  }
  if(mile!=null&&mile!=''){
    one+=' and mile <=?'
    arr.push(mile)
  }
  if(year!=null&&year!=''){
    one+=' and firstTime>=?'
    arr.push(time)
  }
  if(params.sort==1){
    two=" order by price asc"
  } else if(params.sort==-1){
    two=" order by price desc"
  }
  if(params.pricemin){
    one+=" and price>=?"
    arr.push(params.pricemin)
  }
  if(params.pricemax){
    one+=" and price<=?"
    arr.push(params.pricemax)
  }
  var count ='select  COUNT(1)  from goods join goodscheck on goods.goods_id=goodscheck.goods_id  '+one;
  var sqlc='select  * from goods join goodscheck on goods.goods_id=goodscheck.goods_id '+one+two+' limit '+m+','+size;
  conn.query(count,arr,function(err,result){
    if (err) {
      console.log(err);
  }
  if (result) {
    conn.query(sqlc,arr,function (err, result2) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res, {
            code:200,
            data:result2,
            total:result[0]['COUNT(1)']
          });
      }
  })
  }
  })


});
// 获取商品数量
router.get('/getgoodcount',(req,res)=>{
  conn.query("select count(1) from goods",(err,result)=>{
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          code:200,
          count:result[0]['count(1)']
        });
    }
    })
})
// 添加公告
router.post('/addwarning',(req,res)=>{
  var params=req.body;
  conn.query('insert into warning (warning_id,content,warning_time) value(?,?,?)',[UUID.v1(),params.content,
    datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss')],function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          code:200,
          data:result
        });
    }
  })
})

//获取公告
router.get('/getwarning',(req,res)=>{
  conn.query('select * from warning order by warning_time asc',function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          code:200,
          data:result
        });
    }
  })
})

//删除公告
router.post('/delwarning',(req,res)=>{
  var params=req.body
  conn.query('delete from warning where warning_id=?',[params.warning_id],function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          code:200,
          data:result
        });
    }
  })
})

//修改公告
router.post('/editwarning',(req,res)=>{
  var params=req.body
  conn.query('update  warning set content=? where warning_id=?',[params.content,params.warning_id],function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          code:200,
          data:result
        });
    }
  })
})

// 获取汽车信息
router.get('/getCartinfo', (req, res) => {
  conn.query("select *from goods", function (err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res,result);
      }
  })
});

// 数据查询
router.post('/getd', (req, res) => {
  var params=req.body;
  var time=new Date()
  var yesterday=new Date(time);
  var m=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1));
  yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
  var sql=""
  //昨日成交
  if(params.type=='success'){
    sql="select count(*) from goodscheck where status='3' and selltime like '"+yesterday+"%'"
  }
  //昨日新增
  if(params.type=='goodsup'){
    sql="select count(*) from goods where addtime like '"+yesterday+"%'"
  }
  //日新增人数
  if(params.type=='userupd'){
    sql="select count(*) from user where regist_time like '"+yesterday+"%'"
  }
  //月新增
  if(params.type=='userupm'){
    sql="select count(*) from user where regist_time like '"+m+"%'"
}
  conn.query(sql, function (err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res,{
            cose:200,
            data:result[0]['count(*)']
          });
      }
  })
});
//周统计
router.post('/getw', (req, res) => {
  var params=req.body;
  var sql=""
  if(params.type=='user'){
    sql="select count(*) from user where regist_time like '"+params.date+"%'"
    // sql="SELECT regist_time,count(*)  FROM user where DATE_SUB(CURDATE(),INTERVAL 7 day) <=date(regist_time) group by date(regist_time)"
  } else if(params.type=="goods"){
    sql="select count(*) from goods where addtime like '"+params.date+"%'"
    // sql="SELECT addtime,count(*)  FROM goods where DATE_SUB(CURDATE(),INTERVAL 7 day) <=date(addtime) group by date(addtime)"
  }
  conn.query(sql,function(err,result){
    jsonWrite(res,{
      code:200,
      data:result[0]['count(*)']
    });
  })
})
//总用户查询
router.post('/getusercount', (req, res) => {
  conn.query("select count(*) from user",function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result[0]['count(*)']
        });
    }
  })
})

router.post('/getstatus', (req, res) => {
  var params=req.body;
  conn.query("select count(*) from goodscheck where status=?",[params.status] ,function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result[0]['count(*)']
        });
    }
  })
})
router.post('/allsuccess', (req, res) => {
  var params=req.body;
  conn.query("select count(*) from goodscheck where status='3' and del_reason='已卖出'",[params.status] ,function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result[0]['count(*)']
        });
    }
  })
})
router.post('/allgoods', (req, res) => {
  conn.query("select count(*) from goodscheck",function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result[0]['count(*)']
        });
    }
  })
})

// image增删改查
router.post('/addimg', (req, res) => {
  var params=req.body;
  var url=uploadfile(req.files[0])
  conn.query("select max(sort) from images where position='首页轮播'",function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      var count
      if(params.position=='首页轮播'){
        console.log(result)
        count=result[max(sort)]+1
      } else{
        count=99999
      }
      conn.query('insert into images (image_id,sort,image_name,position,url,image_status) value(?,?,?,?,?,?)',
      [UUID.v1(),count,params.image_name,params.position,url,params.image_status],function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res,{
              data:result
            });
        }
      })
    }
  })
  
})
router.post('/editimg', (req, res) => {
  var params=req.body;
  var url
  if(req.files){
    url=uploadfile(req.files[0])
  } else{
    url=params.url
  }
  conn.query("update images set image_name=?,position=?,url=?,image_status=? where image_id=?",
  [params.image_name,params.position,url,params.image_status,params.image_id],function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result
        });
    }
  })
})
router.post('/deleteimg', (req, res) => {
  var params=req.body;
  conn.query("update images set image_status=? where image_id=?",[params.image_status,params.image_id],function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
        jsonWrite(res,{
          data:result
        });
    }
  })
})
// 批量删除图片信息
router.post('/deleteimgs',(req,res)=>{
  var params=req.body;
  var re=true;
  for(var i=0;i<params.multipleSelection.length;i++){
    conn.query("delete from images where image_id=?", [params.multipleSelection[i].image_id],function(err,result){
      if(err){
        console.log(err);
      } 
    })
  }
  if(re){
    jsonWrite(res,{
      code:200
    })
  }

})
router.post('/getimg', (req, res) => {
  var params=req.body;
  var sql="select * from images where image_status!=3"
  var arr=[]
  if(params.image_name!=null&&params.image_name!=""){
    sql+= " and image_name like '%" +params.image_name+"%'"
  }
  if(params.position!=null&&params.position!=""){
    sql+= ' and position=?'
    arr.push(params.position)
  }
  sql+=" order by sort asc"
  conn.query(sql,arr,function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      conn.query("select count(*) from images where position='首页轮播' and image_status!='3'",function (err, result2) {
        if (err) {
            console.log(err);
        }
        if (result2) {
        jsonWrite(res,{
          data:result,
          count:result2[0]['count(*)']
        });
      }})
    }
  })
})
router.post('/editsort', (req, res) => {
  var params=req.body;
  conn.query("update images set sort=? where image_id=?",[params.sort1,params.image_id1],function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      conn.query("update images set sort=? where image_id=?",[params.sort2,params.image_id2],function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
          jsonWrite(res,{
            data:result
          });
        }
      })
    }
  })
})
router.post('/getimgbyid',(req,res)=>{
  var params=req.body;
  conn.query("select * from images where image_id=?",[params.image_id],function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      jsonWrite(res,{
        data:result
      });
    }
  })
})
//意见增删改查
//增加
router.post('/addsuggest',(req,res)=>{
  var params=req.body;
  conn.query("insert into suggest(userName,suggest,score,time) value(?,?,?,?)",
  [params.userName,params.suggest,params.score,datetime.format(new Date(),'YYYY-MM-DD HH:mm:ss')],
  function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      jsonWrite(res,{
        code:200,
        data:result
      });
    }
  })
})
// 查
router.post('/getsuggest',(req,res)=>{
  var params=req.body;
  console.log(params)
  var currentPage = params.currentPage;
  var size = params.size;
  var m=(currentPage-1)*size;
  conn.query("select COUNT(1) from suggest",function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
      conn.query("select * from suggest order by time limit "+m+","+size,function (err, result2) {
        if (err) {
            console.log(err);
        }
        if (result2) {
          jsonWrite(res,{
            code:200,
            data:result2,
            total:result[0]['COUNT(1)']
          });
        }
      })
    }
  })
})

//得到管理员
router.post('/getusers',(req,res)=>{
  var params=req.body;
  var currentPage = params.currentPage;
  var size = params.size;
  var m=(currentPage-1)*size
  conn.query("select COUNT(1) from  user where type='admin' or type='super'",function(err,result){
    if (err) {
      console.log(err);
    }
    if (result) {
      conn.query("select * from user where type='admin' or type='super' limit "+m+','+size,function (err, result2) {
        if (err) {
            console.log(err);
        }
        if (result2) {
          jsonWrite(res,{
            code:200,
            data:result2,
            total:result[0]['COUNT(1)']
          });
        }
      })
    }
  })
})
router.post('/deluser',(req,res)=>{
  var params=req.body;
  conn.query("delete from  user where userName=?",[params.userName],function (err, result) {
    if (err) {
        console.log(err);
    }
    if (result) {
      jsonWrite(res,{
        code:200,
        data:result
      });
    }
  })
})
module.exports = router;
