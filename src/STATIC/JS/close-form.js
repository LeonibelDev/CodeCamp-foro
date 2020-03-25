var botonB = document.getElementById('ocultar-login').onclick = ocultar;


function callbackdos(){
	
var botonB = document.getElementById('ocultar-login');
	botonB.setAttribute('class', 'none-show');

	var carrouser = document.querySelectorAll('#slide');
	for (var i = 0; i < carrouser.length; i++) {
		carrouser[i].setAttribute('class', ' ');

	}

}

function ocultar(){
	var login = document.getElementById('formulario-login');
	login.setAttribute('class', 'down');

	var boton = document.getElementById('mostrar-login');
	boton.setAttribute('class', 'menu-item text-white');

	callbackdos();
}
