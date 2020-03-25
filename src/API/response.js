const pool = require('../config/db_connect');
	// CONECION POSTGRESQL

let getPost = async(req, res) =>{
	let data = await pool.query(`SELECT * FROM postings;`);
	// let tran = JSON.stringify(data.rows, undefined, 1)
	res.json(data.rows);
}

let getPostById = async(req, res) =>{
	let { id } = req.params;
	let data = await pool.query(`SELECT * FROM postings WHERE _id = ${id};`);
	res.json(data.rows);
} 

let getPostLimitResult = async(req, res) =>{
	let { id } = req.params;
	let data = await pool.query(`SELECT * FROM postings LIMIT ${id};`);
	res.json(data.rows);
} 

let getAverage = async(req, res) =>{
	let { from, to } = req.params;

	let data = await pool.query(`SELECT * FROM postings WHERE _id BETWEEN ${from} AND ${to};`);
	res.json(data.rows);
		
}


module.exports = {
	getPost, 
	getPostById, 
	getPostLimitResult, 
	getAverage
}