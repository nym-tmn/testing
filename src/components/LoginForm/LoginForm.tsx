import { type ChangeEvent, type Dispatch, type FormEvent } from 'react'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'
import type { ErrorsData, LoginData } from '../LoginModal/LoginModal';
import { validateEmail } from './helpers/email/validateEmail';
import { validatePassword } from './helpers/password/validatePassword';

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

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.trim();
		setLoginData(loginData => ({ ...loginData, email: value }));
		const emailError = validateEmail(value);
		if (emailError) {
			setErrors(errors => ({ ...errors, email: emailError }))
		}
	}

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.trim();
		setLoginData(loginData => ({ ...loginData, password: value }));
		const passwordError = validatePassword(value);
		if (passwordError) {
			setErrors(errors => ({ ...errors, password: passwordError }))
		}
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const emailError = validateEmail(loginData.email);
		const passwordError = validatePassword(loginData.password);

		setErrors(errors => ({ ...errors, email: emailError, password: passwordError }))

		if (emailError || passwordError) return;

		onLogin(loginData);
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} data-testid='form' noValidate>
			<p className={styles.paragraph}>Почта для входа test@mail.ru</p>
			<p className={styles.paragraph}>Пароль для входа 12345678</p>
			{errors.general &&
				<p
					data-testid='general-error'
					className={`${styles.paragraph} ${errors ? styles.error : ''}`}
				>
					{errors.general}
				</p>}
			<label htmlFor="email">Email:</label>
			{errors.email &&
				<p
					data-testid='email-error'
					className={`${styles.paragraph} ${errors ? styles.error : ''}`}
				>
					{errors.email}
				</p>}
			<input
				data-testid='email-input'
				name='email'
				autoComplete='off'
				id="email"
				type="text"
				required
				value={loginData.email}
				onChange={handleEmailChange}
			/>
			<label htmlFor="password">Password:</label>
			{errors.password &&
				<p
					data-testid='password-error'
					className={`${styles.paragraph} ${errors ? styles.error : ''}`}
				>
					{errors.password}
				</p>}
			<input
				data-testid='password-input'
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