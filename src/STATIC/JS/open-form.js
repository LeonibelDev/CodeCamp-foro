var boton = document.getElementById('mostrar-login').onclick = mostrar;

function retroces(){
	
var boton = document.getElementById('mostrar-login');

	boton.setAttribute('class', 'none-show');

		var carrouser = document.querySelectorAll('#slide');
	for (var i = 0; i < carrouser.length; i++) {

		carrouser[i].setAttribute('class', 'none');
	}
}

function mostrar(){

	var login = document.getElementById('formulario-login');

	var botonB = document.getElementById('ocultar-login');

	botonB.setAttribute('class', 'menu-item text-white');
	
	login.setAttribute('class', 'cubrir');

	retroces();
}
