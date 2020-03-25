const express = require('express');
const router = express.Router();
const compression = require('compression');
const all = require('./config/metaInfo');
const bodyparser = require('body-parser');
const pool = require('./config/db_connect');	
let fs = require('fs');
let date = require('./config/datePost.js');
let upt = express();
upt.use(compression);
// COOKIE WORK
var cookie = require('cookie');

const path = require('path'); 
const os = require('os');

// CRYPTO PASS
const { Cripto, Desencript } = require('./config/cripto.lib.js'); 
const crypto = new Cripto();
const desencriptar = new Desencript();

/*db*/
// const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database('./models/newsletter.db');
// let db_doc = new sqlite3.Database('./models/post.db');
// let db_comments = new sqlite3.Database('./models/comment_post.db');


router.get('/', (req, res)=>{

	var cookies = cookie.parse(req.headers.cookie || '');

	if(cookies._name){

	}

	if (!cookies._name) {
		res.setHeader('Set-Cookie',  [`_name=""`, `_email=""`, `_password=""`],{
    	  httpOnly: true,
      	  maxAge: 60 * 60 * 24 * 7 // 1 week
   			 });
	}

	res.redirect('/home');	
});

// GET REQUEST
router.get('/home', async (req, res)=>{

	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;
	
	let user_visits = await pool.query(`UPDATE login SET visits = visits + 1 WHERE _email = '${_email}';`);
	let visits = await pool.query(`SELECT visits FROM login WHERE _email = '${_email}';`);	

		res.status(200);
		await res.render('index', {
			title:all.home,
			name: _name,
			visit: visits.rows[0]
		});
		// console.log(visits.rows[0].visits)
});


router.get('/statistics', (req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;

	res.render('statistics', {
		title: all.estatistics,
		name: _name,
		keyFrom: 2
	});
});

router.get('/documentation', async(req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;

	let data = await pool.query('SELECT * FROM newsletter;');
		res.status(200);
		res.render('apiac', {
			title:all.API,
			data,
			name: _name
		});
});

router.get('/foro', (req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;
	
	let { str } = req.params;
	
	if(_name.length != 0 || _email.length != 0 || _password.length != 0){
		pool.query(`SELECT * FROM login WHERE _email = '${_email}' AND _passwd = '${_password}';`,
		(err, data)=>{
			if (err) {
				res.redirect("/");
			}

			if (data) {

				pool.query(`SELECT * FROM postings ORDER BY _id DESC;`,
				(err, post_data)=>{
					if (err) {
						res.render('run_foro',{
							post_data:"",
							title:all.foro.title,
							name: _name

						});
					}

					if (post_data) {	
						pool.query(`SELECT * FROM postings ORDER BY _views DESC;`,
							(err, doneQuery)=>{
								if (err) {throw err}
								if(doneQuery) {
									res.render('run_foro',{
										post_data:post_data.rows,
										title:all.foro.title,
										doneQuery:doneQuery.rows,
										name: _name
									});
								}
							}
							)		
						// console.log(post_data);
							}
			});

			}
		});
	}

	else{
		res.redirect('/login#s1');
	}
					
});

router.get('/about', (req, res)=>{

	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;
	
	res.status(200);
	res.render('about', {
		title:all.about.title,
		name:_name
	});
});

router.get('/login', (req, res)=>{
	res.status(200);
	res.render('login', all.login);
});

router.get('/add', (req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;
	
	res.status(200);
	res.render('add', {
		title: 'ADD'
	});
});

// RENDER POST #READ UNIQUE POST

router.get('/foro/post/id/:id/:title', (req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;

	let { id, title } = req.params;

	pool.query(`SELECT * FROM postings WHERE _id = ${id} AND _title = '${title}';`,
		(err, result_post)=>{
			if (err) {throw err;}
			if (result_post) {
				pool.query(`UPDATE postings SET _views = _views + 1 WHERE _ID = ${id};`,
				(err, done)=>{
					if (err) {throw err;}
					if (done) {

					// 
					pool.query(`SELECT * FROM comments WHERE _identify = ${id} ORDER BY _ID DESC;`,
						(err, success_comments)=>{
							if (err) {throw err}
							if (success_comments) {
								// console.log(success_comments);
								res.render('post', {
									result_post:result_post.rows,
									title: 'unique_post',
									success_comments:success_comments.rows,
									name:_name
								});
							}	
						}
						);
					// 
					}
				});	
			
			}
			// console.log(result_post.length);
		});	
});

// COMMENT POST
router.post('/foro/post/id/:id/:title', async(req, res)=>{
	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;

	let { id, title } = req.params;
	let { user_name, comment } = req.body;

		let comment_pub = await pool.query(`INSERT INTO comments(_identify, _user, _comment, _join) VALUES(${id}, '${_name}', '${comment}', '${date.date}');`);
		
	// if (private) {
	// 	let comment_priv = await pool.query(`INSERT INTO comment_private (_from, _to_email, _comment, _post_title, _post_id) VALUES('${_name}', '${creator}', '${comment}', '${title}', '${id}');`);
	// }

	res.redirect(`/foro/post/id/${id}/${title}`);
});


router.post('/home', async (req, res)=>{
	let { email } = req.body;

	let query_search = await pool.query(`SELECT * FROM newsletter WHERE _email = '${email}';`);

	if (query_search.rows.length == 0) {
		await pool.query(`INSERT INTO newsletter (_email, _join) VALUES('${email}', '${date.date}');`);
		console.log('el dato se introdujo satisfactoriamente');
		res.redirect('/home');
	}

	else{
		res.redirect('/home');
		console.log('el dato existe');
	}
}); 

router.post('/new', async(req, res)=>{
	let { name, email, password } = req.body;
	
	let dataQ = await pool.query(`INSERT INTO login (_name, _email, _passwd, _join) VALUES ('${name}', '${email}', '${password}', '${date.date}')`);

	res.redirect('/login#s1');
});


router.post('/validate', (req, res)=>{
	var { email, password } = req.body;

	pool.query(`SELECT * FROM login WHERE _email = '${email}' AND _passwd = '${password}' LIMIT 1;`, 
		(err, result)=>{
			if (err) {
				res.redirect('/login#s1');
			}

			if(result){
				if (result.rows[0]) {
				res.setHeader('Set-Cookie',  [`_name=${result.rows[0]._name}`, `_email=${result.rows[0]._email}`, `_password=${crypto.cripto_pass(result.rows[0]._passwd)}`],{
	    	 		 httpOnly: true,
	      	 		 maxAge: 60 * 60 * 24 * 7 // 1 week
	   			 });

				res.redirect('/home');
				}
				else{
					
				res.redirect('/login#s1');
				}
			}	
		});

});
//API FOR GET USER INFORMATION

router.get('/logout', (req, res)=>{
	 res.setHeader('Set-Cookie',  [`_name=""`, `_email=""`, `_password=""`],{
    	  httpOnly: true,
      	  maxAge: 60 * 60 * 24 * 7 // 1 week
   			 });

			res.redirect('/login#s1');
});

router.post('/foro', async(req, res)=>{
	let { title, content, tag1, tag2, tag3, author, link, add_q} = req.body;

	var cookies = cookie.parse(req.headers.cookie || '');
	var {_name, _email, _password} = cookies;


if (add_q == 'add') {

	let	insertData = await pool.query(
		`INSERT INTO postings 
		(_title, _doc_body,  _tag_1, _tag_2, _tag_3, _author, _join, _link, _user_creator, _add)
			VALUES('${title}', '${content}', '${tag1}', '${tag2}', '${tag3}', '${cookies._name}', '${date.date}', '${link}', '${cookies._email}', true);`);
	}

if (add_q == 'question') {

	let	insertData = await pool.query(
		`INSERT INTO postings 
		(_title, _doc_body, _tag_1, _tag_2, _tag_3, _author, _join, _link, _user_creator, question_not_body)
			VALUES('${title}', '${content}', '${tag1}', '${tag2}', '${tag3}', '${cookies._name}', '${date.date}', '${link}', '${cookies._email}', true);`);

	}

if (!add_q && content) {

	let	insertData = await pool.query(
		`INSERT INTO postings
		 (_title, _doc_body, _tag_1, _tag_2, _tag_3, _author, _join, _link, _user_creator)
			VALUES('${title}', '${content}', '${tag1}', '${tag2}', '${tag3}', '${cookies._name}', '${date.date}', '${link}', '${cookies._email}');`);
	}
	
	res.redirect('/foro');	
});

// LIKES

router.get('/foro/like/posting._/:id', async(req, res)=>{
	let { id } = req.params;

	let _like = pool.query(`UPDATE postings SET _likes = _likes + 1 WHERE _id = ${id}`);
	res.redirect('/foro');
});

router.post('/test', (req, res)=>{
	console.log(req.body)
}) 
module.exports = router;