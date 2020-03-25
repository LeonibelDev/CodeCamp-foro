var login = document.getElementsByClassName('change1')[0].addEventListener('click', ()=>{
	var login = document.getElementsByClassName('change1')[0];
	var signin = document.getElementsByClassName('change2')[0];

	signin.setAttribute('class', 'change2 btn btn-outline-primary btn-block');
	login.setAttribute('class', 'change2 none');


});

var signin = document.getElementsByClassName('change2')[0].addEventListener('click', ()=>{
	var login = document.getElementsByClassName('change1')[0];
	var signin = document.getElementsByClassName('change2')[0];

	// signin.setAttribute('class', 'change2 btn btn-outline-primary btn-block none');
	login.setAttribute('class', 'change1 btn btn-outline-primary btn-block');

});
