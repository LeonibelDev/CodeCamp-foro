var meses = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

let time = new Date();
let joinD = time.getDate() +" "+ meses[time.getMonth()] +" "+ time.getFullYear() +" "+ time.getHours() +":"+ time.getMinutes()+":"+ time.getUTCSeconds()+"";

module.exports = {
	date:joinD,
}