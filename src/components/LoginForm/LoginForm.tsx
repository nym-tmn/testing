import { useState, type FormEvent, type RefObject } from 'react'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
	dialogRef: RefObject<HTMLDialogElement | null>;
	handleModalClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ dialogRef, handleModalClick }) => {

	const [isDisabled, setIsDisabled] = useState(false);

	const { toggleAuth } = useAuth();

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		setIsDisabled(true);
		
		setTimeout(() => {
			toggleAuth();
			dialogRef.current?.close();
			handleModalClick();
			setIsDisabled(false);
		}, 2000)
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<p style={{ margin: '0' }}>Почта для входа tester@gmail.com</p>
			<p style={{ margin: '0' }}>Пароль для входа 12345678</p>
			<label htmlFor="email">Email:</label>
			<input autoComplete='off' id="email" type="email" />
			<label htmlFor="password">Password:</label>
			<input id="password" type="password" />
			<Button disabled={isDisabled} type='submit'>Войти</Button>
		</form>
	)
}