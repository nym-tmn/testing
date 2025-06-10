import { type ChangeEvent, type Dispatch, type FormEvent } from 'react'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'
import type { ErrorsData, LoginData } from '../LoginModal/LoginModal';

interface LoginFormProps {
	loginData: LoginData;
	setLoginData: Dispatch<React.SetStateAction<LoginData>>;
	isDisabled: boolean;
	onLogin: (data: LoginData) => Promise<void>;
	errors: ErrorsData;
	setErrors: Dispatch<React.SetStateAction<ErrorsData>>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	loginData,
	setLoginData,
	isDisabled,
	onLogin,
	errors,
	setErrors,
}) => {

	const validateEmail = (email: string) => {
		if (!email) return 'Email обязателен';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Введите корректный email';
		return ''
	}

	const validatePassword = (password: string) => {
		if (!password) return 'Пароль обязателен';
		if (password.length < 8) return 'Пароль должен быть не короче 8 символов';
		const passwordRegex = /^\d+$/;
		if (!passwordRegex.test(password)) return 'Пароль может состоять только из цифр';
		return ''
	}

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setLoginData(loginData => ({ ...loginData, email: value }));
		const emailError = validateEmail(value);
		setErrors(errors => ({ ...errors, email: emailError }))
	}

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setLoginData(loginData => ({ ...loginData, password: value }));
		const passwordError = validatePassword(value);
		setErrors(errors => ({ ...errors, password: passwordError }))
	}

	const handleSubmit = async (event: FormEvent) => {
			event.preventDefault();

			const emailError = validateEmail(loginData.email);
		const passwordError = validatePassword(loginData.password);
		
		setErrors(errors => ({ ...errors, email: emailError, password: passwordError}))

			if (emailError || passwordError) return;

		onLogin(loginData);
		}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<p className={styles.paragraph}>Почта для входа tester@gmail.com</p>
			<p className={styles.paragraph}>Пароль для входа 12345678</p>
			{errors.general && <p className={`${styles.paragraph} ${errors ? styles.error : ''}`}>{errors.general}</p>}
			<label htmlFor="email">Email:</label>
			{errors.email && <p className={`${styles.paragraph} ${errors ? styles.error : ''}`}>{errors.email}</p>}
			<input
				name='email'
				autoComplete='off'
				id="email"
				type="email"
				required
				value={loginData.email}
				onChange={handleEmailChange}
			/>
			<label htmlFor="password">Password:</label>
			{errors.password && <p className={`${styles.paragraph} ${errors ? styles.error : ''}`}>{errors.password}</p>}
			<input
				name='password'
				id="password"
				type="password"
				required
				value={loginData.password}
				onChange={handlePasswordChange}
			/>
			<Button disabled={isDisabled} type='submit'>Войти</Button>
		</form>
	)
}