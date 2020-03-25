const express = require('express')
const router = express.Router()
const cookie = require('cookie');
const all = require('./metaInfo');

const pool = require('./db_connect')

router.get('/foro:likes', async(req, res)=>{
    var cookies = cookie.parse(req.headers.cookie || '');
    var {_name, _email, _password} = cookies;
    
    let { str } = req.params;
    
    // data = await pool.query(`SELECT * FROM login WHERE _email = '${_email}' AND _passwd = '${_password}';`);
    post_data = await pool.query(`SELECT * FROM postings ORDER BY _likes DESC;`);
    doneQuery = await  pool.query(`SELECT * FROM postings ORDER BY _views DESC;`);

    if(_name.length != 0 && _email.length != 0 && _password.length != 0){
        res.render('run_foro',{
             post_data:post_data.rows,
             title:all.foro.title,
             doneQuery:doneQuery.rows,
             name: _name
        });
    }

    else{
        res.redirect('/login#s1');
    }  
});


router.get('/foro:views', async(req, res)=>{
    var cookies = cookie.parse(req.headers.cookie || '');
    var {_name, _email, _password} = cookies;
    
    let { str } = req.params;
    
    // data = await pool.query(`SELECT * FROM login WHERE _email = '${_email}' AND _passwd = '${_password}';`);
    post_data = await pool.query(`SELECT * FROM postings ORDER BY _views DESC;`);
    doneQuery = await pool.query(`SELECT * FROM postings ORDER BY _views DESC;`);

    if(_name.length != 0 && _email.length != 0 && _password.length != 0){
        res.render('run_foro',{
             post_data:post_data.rows,
             title:all.foro.title,
             doneQuery:post_data.rows,
             name: _name
        });
    }

    else{
        res.redirect('/login#s1');
    }  
});
module.exports = router; 