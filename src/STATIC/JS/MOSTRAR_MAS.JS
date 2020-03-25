var show = document.getElementById('show'); 
this.show.onclick = show_more;

var hidden = document.getElementById('hidden');
this.hidden.onclick = hidden_min;


	var info  = document.getElementById('info');
	
	
function callback() {
	show.setAttribute('class', 'none-show');
	
}

function show_more (){

	info.setAttribute('class', 'extra p-3');
	hidden.setAttribute('class', 'min-red text-center');
	callback();

}

function hidden_min (){
	hidden.setAttribute('class', 'none-show');
	info.setAttribute('class', 'extra-none');
	show.setAttribute('class', 'read text-center');
}

