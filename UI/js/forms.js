let editprof = document.querySelector('#edit-profile');
const editProfile = () => {
	document.getElementById('p-message').innerHTML = "<h4>Profile Successfully changed</h4>"
	event.preventDefault();
}
editprof.addEventListener("submit", editProfile, false);

let changepass = document.querySelector('#edit-changepassword');
const changePassword = () => {
	document.getElementById('p-message').innerHTML = "<h4>Password Successfully changed</h4>"
	event.preventDefault();
}
changepass.addEventListener("submit", changePassword, false);