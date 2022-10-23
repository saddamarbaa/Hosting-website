class FormValidator {
	constructor(form, fields, validationSchema) {
		this.form = form
		this.fields = fields
		this.validateFields
		this.validationSchema = validationSchema
	}

	initialize() {
		this.validateOnEntry()
		this.validateOnSubmit()
	}

	handleApiCall() {
		let isAlVaild = true
		let self = this
		for (const property in self.validationSchema) {
			if (!self.validationSchema[property]) {
				isAlVaild = false
			}

			if (isAlVaild) {
				// console.log(self.validationSchema)
				handleLogin()
			}
		}
	}

	validateOnSubmit() {
		let self = this
		this.form.addEventListener('submit', (e) => {
			e.preventDefault()
			self.fields.forEach((field) => {
				const input = document.querySelector(`#${field}`)
				self.validateFields(input)
			})
			this.handleApiCall()
		})
	}

	validateOnEntry() {
		let self = this
		this.fields.forEach((field) => {
			const input = document.querySelector(`#${field}`)
			input.addEventListener('input', (event) => {
				self.validateFields(input)
			})
		})
	}

	validateFields(field) {
		// Check presence of values
		if (field.value.trim() === '') {
			this.setStatus(field, `${field.name} cannot be blank`, 'error')
		} else {
			this.setStatus(field, null, 'success')
		}

		if (
			field.value.trim() &&
			field.name === 'password' &&
			field.value.length < 6
		) {
			this.setStatus(field, `Password must be at least 6 characters`, 'error')
		}

		if (field.type === 'email') {
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (re.test(field.value)) {
				this.setStatus(field, null, 'success')
			} else {
				this.setStatus(field, 'Please provide a valid email address', 'error')
			}
		}
	}

	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector('.error-message')
		if (status === 'success') {
			this.validationSchema[field.name] = true
			field.nextElementSibling.nextElementSibling.classList.remove(
				'icon-error-show',
			)
			field.nextElementSibling.classList.add('icon-success')
			if (errorMessage) {
				errorMessage.innerText = ''
			}
			field.nextElementSibling.classList.remove('hidden')
			field.parentElement.classList.remove('input-invalid')
			field.parentElement.previousElementSibling.innerText = ''
			field.placeholder = field.name
			field.parentElement.classList.add('input-success')
		}

		if (status === 'error') {
			field.parentElement.classList.remove('input-success')
			field.nextElementSibling.classList.remove('icon-success')
			field.nextElementSibling.nextElementSibling.classList.add(
				'icon-error-show',
			)

			this.validationSchema[field.name] = false
			field.placeholder = ''
			field.parentElement.previousElementSibling.innerText = message
			field.parentElement.previousElementSibling.classList.add('error')
			field.parentElement.classList.add('input-invalid')
		}
	}
}

const loginForm = document.getElementById('loginForm')
const fields = ['email', 'password']
const validateFields = {
	email: false,
	password: false,
}
let API_URL = 'http://localhost:8000'

const validator = new FormValidator(loginForm, fields, validateFields)
validator.initialize()

if (location.href.indexOf('netlify') != -1) {
	API_URL = 'https://blog-post-api-sadam.herokuapp.com'
}

function handleLogin() {
	const payload = {
		email: loginForm.email.value,
		password: loginForm.password.value,
	}

	fetch(API_URL + '/api/v1/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(payload),
	})
		.then((response) => {
			return response.json()
		})
		.then((response) => {
			if (
				response?.success &&
				response.status === 200 &&
				response?.data?.user?.refreshToken &&
				response?.data?.user?.accessToken
			) {
				localStorage.setItem('refreshToken', response?.data?.user?.refreshToken)
				localStorage.setItem('accessToken', response?.data?.user?.accessToken)
				localStorage.setItem('isAdmin', response?.data?.user?.role === 'admin')
				location.href = '/'
			} else {
				throw new Error(
					response?.message || 'Something went wrong please try again',
				)
			}
		})
		.catch((error) => {
			console.log('Fetch Error :-S', error)
			alert(error?.message)
		})
}

const redirectToRegisterPage = () => (location.href = '/register.html')
