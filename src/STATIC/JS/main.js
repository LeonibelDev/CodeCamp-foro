window.onload = function time() {
function arg(){

	var hora = document.getElementById('hora');
	var minutos = document.getElementById('minuto');
	var segundo = document.getElementById('segundos');
	var fecha = document.getElementById('fecha');
	var time = new Date();

	hora.innerHTML = time.getHours();
	minutos.innerHTML = time.getMinutes();

	segundo.innerHTML = time.getSeconds();

	if (segundo.innerHTML < 10) {
		segundo.innerHTML = "0"+time.getSeconds();
	}

	if (time.getHours()<10) {
		hora.innerHTML = "0" + time.getHours();			
	}

	if (time.getMinutes()<10) {
		minutos.innerHTML = "0" + time.getMinutes();			
	}
	var meses = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

	fecha.innerHTML = time.getDate()+" "+meses[time.getMonth()]+" "+time.getFullYear();
	}
setInterval(arg, 1);
	}

