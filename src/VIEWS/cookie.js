var cookie = require('cookie');
var escapeHtml = require('escape-html');
var http = require('http');
var url = require('url');
var express = require('express');
let server = express();

server.use(express.urlencoded({extended:false}));

const crypto = require('crypto');
function encriptar(pass){  
  var mykey = crypto.createCipher('aes-128-cbc', '');
  mystr = mykey.update(pass, 'utf8', 'hex');
  mystr += mykey.final('hex');

  return mystr;
}


function desencriptar(pass_encrypted){
  var mykey = crypto.createDecipher('aes-128-cbc', '');
  var hola = mykey.update(pass_encrypted, 'hex', 'utf8');
  hola += mykey.final('utf8');

  return hola;
}


server.get('/', (req, res)=>{

  var cookies = cookie.parse(req.headers.cookie || '');
  var {_email, _password} = cookies;

  res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    res.write(`<style>
      p{
        font-family:Arial;
      }
      </style>`);

  if (_email, _password) {
    res.write('<p>Welcome back, <b>' + escapeHtml(_email) +' '+  escapeHtml(_password) + '</b>!</p>');
  } else {
    res.write('<p>Hello, new visitor!</p>');
   
    res.write(`
      <form method="post" action="/"> 
      <input style="padding:15px 24px; border-radius:2px; border:solid 1px rgba(0,0,0,.2);" placeholder="enter your email" name="email" type="email">
      <input style="padding:15px 24px; border-radius:2px; border:solid 1px rgba(0,0,0,.2);" placeholder="enter a passwd" name="pass" type="password">
      <input style="padding:15px 24px; border-radius:2px; border:solid 1px rgba(0,0,0,.2); background:#33699B; color:#fff;" type="submit" value="Set number">
      </form>  
      `);
  }

  res.end('<a href="logout">log out</a>');
  console.log(req.url)
});


server.post('/', (req, res)=>{
   // Parse the query string
  var query = url.parse(req.url, true, true).query;

  var { email, pass } = req.body;
  if (email && pass) {

    // // Set a new cookie with the name
    // var cookies = cookie.parse(`name = ${cookie_value}`);
    // console.log(cookies.name);

    // res.setHeader('Set-Cookie', cookie.serialize('name', String(cookie_value),{
    //   httpOnly: true,
    //   maxAge: 60 * 60 * 24 * 7 // 1 week
    // }));

     res.setHeader('Set-Cookie',  [`_email=${email}`, `_password=${encriptar(pass)}`],{
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    
  }

    res.redirect('/');
    
  });

server.get('/logout', (req, res)=>{
    res.setHeader('Set-Cookie', [`_email=""`, `_password=""`]);
    res.redirect('/');

});

// http.createServer(onRequest).listen(3000);

server.listen(2000, ()=>{
 console.log('server started at port 2000')
});