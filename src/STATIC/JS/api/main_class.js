class getUsers {

	async users(){
		const req = await fetch('http://127.0.0.1:1818/api/');
		const users = await req.json();
		return users;
	}
	
}

export default getUsers;