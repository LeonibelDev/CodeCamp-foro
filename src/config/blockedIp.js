// const address = require('address');

function listBlocked(ip){
	let ipBaned = ['127.0.0.1', '127.0.0.2', '127.0.0.3', '127.0.0.4'];

	var transform_ip = ip.toString();
	for (var i = 0; i < ipBaned.length; i++) {
		if(transform_ip == ipBaned[i]){
			console.log('your device was blocked for this web site');
			break;	
		}

		else{
			console.log('your device not was blocked! :)');
			continue;
		}

	}
}

let ipList = ['127.0.0.1', '127.0.0.2', '127.0.0.3', '127.0.0.4', '127.0.0.5'];

for (var i = 0; i < ipList.length; i++) {
	listBlocked(ipList[i])
}