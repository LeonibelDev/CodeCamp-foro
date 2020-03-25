'use estrict'
const express  = require('express');
const morgan = require('morgan');
const routes = require('./src/routes');
const server = express();
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const API = require('./src/API/router');
const compression = require('compression');
const fiter_req = require('./src/config/filter');

/*OBJECTS */
server.use(express.urlencoded({extended:false}));
server.use(express.static('src/PUBLIC'));
server.use(express.static('src/STATIC/CSS'));
server.use(express.static('src/STATIC/JS')); 
server.use(compression());

/*VIEW ENGINE (MOTOR DE VISTAS)*/
server.set("views", path.join(__dirname, "/src/VIEWS"));
server.set("view engine", "handlebars");
server.set("view engine", "ejs");
server.set('json spaces', 2);

server.use(express.json());

server.use(morgan('dev'));
server.use(routes);
server.use('/api/', API);
server.use(fiter_req);

server.get('*', (req, res)=>{
	res.render('error');
});

let options = {
  port:process.env.PORT || 1818,
  host:'127.0.0.1',
  key: fs.readFileSync('./src/SSL/key.pem'),
  cert: fs.readFileSync('./src/SSL/private.pem')
};

let serverSSL = http.createServer(server);

serverSSL.listen(options, ()=>{
	console.log(`server started on uri http://${options.host}:${options.port}`);
});