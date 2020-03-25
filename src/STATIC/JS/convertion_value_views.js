function main (){
	var value = document.querySelectorAll('.vew');
	for (var i = 0; i < value.length; i++) {
		
		var final_value = value[i].innerHTML.trim();
		var config = final_value.charAt(0);
		var config_two = final_value.charAt(1);


		if (final_value < 1000) {
			value[i].innerHTML = final_value;  
		}

		if (final_value >= 1000) {
			
			if (config_two <= 0) {
				value[i].innerHTML = config+"K";
			}  

			if (config_two > 0) {
				value[i].innerHTML = config+"."+config_two+"K";
			}
			
		}
	
	}

}

main();

