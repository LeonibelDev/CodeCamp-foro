var title = [
'Puedes contactarte directamente con el vendedor en la parte de abajo, por medio de los enlaces sociales', 
'Envios disponibles temporalmente solo en Republica Dominicana',
a = dsa.innerHTML,
];

var acc = [
'active',
'active',
'active'
];
	var i = 0;

	var dsa = document.getElementById('dsa');
function senty () {
	if (i > (title.length - 1)) {
		i = 0;
	}

	dsa.innerHTML = title[i];
	i++;


}

var interval = setInterval(senty, 3000);