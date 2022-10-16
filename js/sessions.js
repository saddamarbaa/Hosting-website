/**
 *  in login page
 *  Check if token is available
 *  if token is available take the  redirect user to the home page
 *  in home page also
 *  Check if token is available
 *  if token is not available redirect user to login page
 */

const currentToken = localStorage.getItem('token')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const existingEmail = urlParams.get('existingEmail')
const registeredEmail = urlParams.get('registered')

window.onload = () => {
	const loginForm = document.getElementById('loginForm')
	const emailInput = loginForm?.email

	if (existingEmail) {
		emailInput.value = existingEmail
		emailInput.style.borderColor = '#006ce5'
		emailInput.style.fontSize = '17px'
		emailInput.style.color = '#006ce5'
		emailInput.style.transition = '0.5s'
		// emailInput.style.textAlign = 'center'
	}
	if (registeredEmail) {
		const newRegisterEmailInput = loginForm.registered
		newRegisterEmailInput.style.display = 'block'
	}
}

// check if the user is already login
const checkIfLoggedIn = () => {
	const currentToken = localStorage.getItem('token')
	if (currentToken) {
		if (
			location.href.includes('/login.html') ||
			location.href.includes('/register.html')
		) {
			location.href = '/'
		}
	} else if (!currentToken) {
		// If I am currently not logged in
		// And trying to access a unauthorized page
		// (Trying to access all pages besides login)
		if (
			!location.href.includes('/login.html') &&
			!location.href.includes('/register.html')
		) {
			location.href = '/login.html'
		}
	}
}

const LogOut = () => {
	localStorage.removeItem('token')
	location.href = 'login.html'
}

checkIfLoggedIn()
