// import getUsers from './main_class';

// const user_list = new getUsers();

// async function users_print(){
// 	console.log(await user_list.users());
// }

// users_print();

main=>{

		const reqApi = await fetch('http://127.0.0.1:1818/api/')
		// const users = await reqApi.json();
		console.log(users);
}

async function run(){
	 await main();
}

run();