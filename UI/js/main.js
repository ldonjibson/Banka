//To toggle menu on mobile
let menumobil = document.getElementById('mobile-m').style.display='none';
const menuToggle = () =>{
	const getburger = document.getElementById('mobile-m');
	if (getburger.style.display === 'none'){
		return getburger.style.display='block';
	} else {
		return getburger.style.display='none';
	}

}

//load login button
const loginLoad = () => {
	let toLoadlogin = document.getElementById('login');
	toLoadlogin.innerHTML = "<i class='fa-li fa fa-spinner fa-spin'></i> Logging you in ...";
	setTimeout( () => {
		location.assign(document.getElementById('login-form').getAttribute("action"))
	}, 5000)
	event.preventDefault();
}


//load register button
const registerLoad = () => {
	let toLoadregister = document.getElementById('register');
	console.log(toLoadregister.innerText);
	toLoadregister.innerHTML = "<i class='fa-li fa fa-spinner fa-spin'></i> Registering you now ...";
	setTimeout( () => {
		toLoadregister.innerHTML = "<i class='fa-li fa fa-spinner fa-spin'></i> Registered";
		document.getElementById('registering').innerHTML = "<h4>Registration Successful.<br/>Wait!!! Redirecting...</h4>"
	}, 3000)
	setTimeout( () => {
		location.assign('./login.html')
	}, 10000)
	event.preventDefault();
}

//OnSelct the user banking option in the dashboard
const bankView = () => {
	let chgbank = document.getElementById('bank-op').value;
	if (chgbank === "profile"){
		location.assign('./profile.html');
	} else if (chgbank == "transaction") {
		location.assign('./transaction.html');
	} else if (chgbank == "logout") {
		location.assign('./login.html');
	}
}

//profile page codes
const revealImgForm = () => {
	let imgForm = document.getElementById('edit-image');
	if (imgForm) {
		document.getElementById('profile-upload').style.display='block';
		imgForm.style.display='none';
	} else {
		document.getElementById('profile-upload').style.display='none';
		imgForm.style.display='block';
	}
}

const revealProfileForm = () => {
	if (document.getElementById('edit-profile')){
		document.getElementById('edit-profile').style.display='block';
		document.getElementById('edit-changepassword').style.display='none';
		document.getElementById('profile-details').style.display='none';
	}
}

const revealPassword = () => {
	if (document.getElementById('edit-changepassword')){
		document.getElementById('edit-changepassword').style.display='block';
		document.getElementById('edit-profile').style.display='none';
		document.getElementById('profile-details').style.display='none';
	}
}



const editProfile = () => {
	document.getElementById('p-message').innerHTML = "<h4>Profile Successfully changed</h4>";
	setTimeout (() => { 
		document.getElementById('p-message').innerHTML = "";
	},3000);
	document.getElementById('edit-profile').style.display = 'none';
	document.getElementById('profile-details').style.display = 'block';
	event.preventDefault();

}

const changePassword = () => {
	document.getElementById('p-message').innerHTML = "<h4>Password Successfully changed</h4>";
	setTimeout (() => { 
		document.getElementById('p-message').innerHTML = "";
	},3000);	
	document.getElementById('edit-changepassword').style.display = 'none';
	document.getElementById('profile-details').style.display = 'block';
	event.preventDefault();
}

//send password reset email link to the user 
const passWordReset = () => {
	document.getElementById('passwordreset').innerHTML = "<h4>Password Reset Request Has Been Sent to Your Email</h4>";
	setTimeout (() => { 
		location.assign(document.getElementById('passwordreset-form').getAttribute('action'));
	},3000);
	event.preventDefault();
}

// when user click the link they land on this page 
const chPassword = () => {
	document.getElementById('passwordchange').innerHTML = "<h4>Password Has Successfully Been Changed<br/>Redirecting to login page ...</h4>";
	setTimeout (() => { 
		location.assign(document.getElementById('passchange-form').getAttribute('action'));
	},5000);
	event.preventDefault();
}

//OnSelct the Admin banking option in the dashboard
const bankAdminView = () => {
	let chgbadmin = document.getElementById('bank-admin').value;
	if (chgbadmin === "users"){
		location.assign('./admin-dashboard-users.html');
	} else if (chgbadmin === "staff") {
		location.assign('./admin-dashboard-staff.html');
	} else if (chgbadmin === "create-user-staff") {
		location.assign('./admin-create-users.html');
	} else if (chgbadmin === "main"){
		location.assign('./admin-dashboard.html');
	} else if (chgbadmin=== 'logout'){
		location.assign('./admin-login.html');
	}
}


const bankStaffView = () => {
	let chgbadmin = document.getElementById('bank-staff').value;
	if (chgbadmin === "main"){
		location.assign('./staff-dashboard.html');
	} else if (chgbadmin === "staff-profile"){
		location.assign('./staff-profile.html');
	} else if (chgbadmin === "staff-users") {
		location.assign('./staff-dashboard-users.html');
	} else if (chgbadmin === "create-user-staff") {
		location.assign('./staff-create-users.html');
	} else if (chgbadmin=== 'logout'){
		location.assign('./staff-login.html');
	}
}
////Admin Createuser and staff dashboard

const createUserStaff = () => {
	let getForm = document.getElementById('create-user-profile');
	let formValu = "";
	let i;
	for(i = 0; i < getForm.length; i++){
		formValu = formValu + getForm.elements[i].value +  ",";
	}
	alert(formValu);
	document.getElementById('createuresponse').innerHTML= "<h5>" + "User Created Successfully (" + formValu + ")</h5>"
	// setTimeout(() => {
	// 	document.getElementById('createuresponse').innerHTML = "";
	// 	// for(i = 0; i < getForm.length; i++){
	// 	// 	getForm.elements[i].value = "";
	// 	// }
	// }, 3000);
	event.preventDefault();
}

//generate
const Generate = () => {
	const generateG = 1000000000 + Math.floor(Math.random() * 999999999);
	console.log(generateG);
	document.getElementById('account-number').value = generateG;
	document.getElementById('account-number-show').innerHTML = "<h4 class='text-center'>The Account number is:<br/><span class='account-number-show'>" + generateG; + "</span></h4>";
}

// let updateUS = document.querySelector('#admin-create-user-profile');
const updateUserStaff = () => {
	const getuserstaffform = document.getElementById('admin-create-user-profile');
	let formValu = "";
	let i;
	console.log(getuserstaffform);
	for(i = 0; i < getuserstaffform.length; i++){
		formValu = formValu + getuserstaffform.elements[i].value +  ",";
	}
	document.getElementById('passwordtop').innerHTML = "<h5>" + "User Updated Successfully (" + formValu + ")</h4>"
	setTimeout(() => {
		document.getElementById('passwordtop').innerHTML = "";
	}, 3000);
	event.preventDefault();
}

//edit user and staff by admin 
const adminUpdate = () => {
	let xx = document.getElementById('admin-toggle-user-edit');
	if (xx.getAttribute('class')==='hide'){
		//this shows the form
		xx.removeAttribute('class');
		xx.style.display = 'block';
	} else {
		xx.style.display='none';
		xx.setAttribute('class','hide');
		document.getElementById('passwordtop').innerHTML = ""
	}
}

//change password for users anda staffsif needed
const adminchangePassword = () =>{
	let getpassform = document.getElementById('adminedit-changepassword');
	let formValu = ""
	let i;
	for (i = 0; i < getpassform.length; i++) {
		formValu = formValu + getpassform.elements[i].value +  ",";
	}
	document.getElementById('passwordtop').innerHTML = "<h5>" + "User Password Changed Successfully (" + formValu + ")</h5>"
	setTimeout(() => {
	document.getElementById('passwordtop').innerHTML = ""
	}, 3000);
	event.preventDefault();
}


//For debit and credit
const adminDrCrUpdate = () => {
	let xx = document.getElementById('credit-debit');
	if (xx.getAttribute('class')==='hide'){
		//this shows the form
		xx.removeAttribute('class');
		xx.style.display = 'block';
	} else {
		xx.style.display='none';
		xx.setAttribute('class','hide');
		document.getElementById('amountupsdate').innerHTML = ""
	}
}

//add and remove credit from user ****************  Awesome *****************
const creditDebit = () => {
	let getvaluetodrcr = document.getElementById('credit-debit').elements[0].value;
	console.log(getvaluetodrcr);
	let x = document.getElementById('balance').innerHTML;
	const total = document.getElementById('balance').innerHTML = Number(x) + Number(getvaluetodrcr);
	document.getElementById('amountupsdate').innerHTML = "<h5>" + getvaluetodrcr + " Has been Added to User Account, User now has " + total + "</h5>"
	// alert(getvaluetodrcr + "Has been Added to User Account, User now has" + total);
	document.getElementById('credit-debit').elements[0].value='';
	setTimeout(() => {
	document.getElementById('amountupsdate').innerHTML = ""
	}, 3000);
	event.preventDefault();
}
/////Admin creatteuser and staff ends


//Contact form action

const contactSubmit = () => {
	document.getElementById('contmssg').innerHTML = "<h5> Message Sent !!!</h5>"
	setTimeout( () => {
		document.getElementById('contmssg').innerHTML = ""
	}, 3000);
	event.preventDefault();
}

//Contact form action 