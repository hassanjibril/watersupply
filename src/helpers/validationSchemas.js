import * as yup from 'yup'

export const signInValidationSchema = yup.object().shape({
	username: yup.string()
		.email('Email is invalid').required('Email is required')
		.required('Username is required'),
	password: yup.string()
		.min(8, 'Password has to be longer than 8 characters!')
		.required('Password is required!')
});

export const passwordValidationSchema = yup
	.string()
	.min(8, 'Password must be 8 characters or longer')
	.matches(/^(?=.*([A-Z]){1,})(?=.*[!@#$%^\-&*()_+=]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{8,50}$/g, 'Password not complex enough.')
	.required('Password is required')

export const passwordConfirmationValidationSchema = yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')

export const signupValidationSchema = yup.object().shape({
	first_name: yup.string().required('First Name is required!'),
	last_name: yup.string().required('Last Name is required!'),
	email: yup.string().email('Email is invalid').required('Email is required'),
	password: yup.string().min(8, 'Password has to be longer than 8 characters!').required('Password is required!'),
	c_password: yup.string().min(8, 'Password has to be longer than 8 characters!').required('Password is required!')
});

export const contactusValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
	email: yup.string().email('Email is invalid').required('Email is required'),
	message: yup.string().required('Message is required!'),
});

export const waterAccessValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
});

export const newReadingValidationSchema = yup.object().shape({
	value: yup.string().required('Value is required!').matches(/^[0-9]*$/),
});

export const GaugesValidationSchema = yup.object().shape({
	serial: yup.string().required('Serial is required!'),
	initial_count: yup.string().matches(/^[0-9]*$/),
	current_count: yup.string().matches(/^[0-9]*$/),
});

export const userValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
	email: yup.string().email('Email is invalid').nullable(),
    password: yup.string().min(8, 'Password has to be longer than 8 characters!').nullable(),
    role: yup.string().required(),
});

export const paymentTermsValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
});

export const orgValidationSchema = yup.object().shape({
	name: yup.string().required('Name is required!'),
    email: yup.string().email('Email is invalid!')
});

export const newsValidationSchema = yup.object().shape({
	title: yup.string().required('Title is required!'),
});

export const analysiValidationSchema = yup.object().shape({
	lab_name: yup.string().required('Laboratory Name is required!'),
});