import { type Dispatch, type FormEvent } from 'react'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'
import type { LoginData } from '../LoginModal/LoginModal';

interface LoginFormProps {
	loginData: LoginData;
	setLoginData: Dispatch<React.SetStateAction<LoginData>>;
	isDisabled: boolean;
	handleSubmit: (event: FormEvent) => Promise<void>;
	error: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	loginData,
	setLoginData,
	isDisabled,
	handleSubmit,
	error
}) => {

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<p className={styles.paragraph}>Почта для входа tester@gmail.com</p>
			<p className={styles.paragraph}>Пароль для входа 12345678</p>
			<p className={`${styles.paragraph} ${error ? styles.error : ''}`}>{error}</p>
			<label htmlFor="email">Email:</label>
			<input
				name='email'
				// autoComplete='off'
				id="email"
				type="email"
				required
				value={loginData.email}
				onChange={(event) => setLoginData(loginData => ({ ...loginData, email: event.target.value }))}
			/>
			<label htmlFor="password">Password:</label>
			<input
				name='password'
				id="password"
				type="password"
				required
				value={loginData.password}
				onChange={(event) => setLoginData(loginData => ({ ...loginData, password: event.target.value }))}
			/>
			<Button disabled={isDisabled} type='submit'>Войти</Button>
		</form>
	)
}