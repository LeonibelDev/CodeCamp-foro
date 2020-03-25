function meridian() {

	var hora_minutos = document.getElementById('mer');

	var date = new Date();
		var meridiano = '';

		if (date.getHours() < 12) {
			meridiano = 'AM';
		}
		else{
			meridiano = 'PM';
		}

		hora_minutos.innerHTML = meridiano;
}

setInterval(meridian, 100);	