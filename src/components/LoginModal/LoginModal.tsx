import { createPortal } from "react-dom"
import { LoginForm } from "../LoginForm/LoginForm"
import { useRef, useState, type MouseEvent, type KeyboardEvent, useEffect } from "react"
import { Button } from "../Button/Button";
import styles from './LoginModal.module.css'
import { useAuth } from "../../hooks/useAuth";
import { authorization } from "../../api/api";

interface LoginModalProps {
	handleShowModalClick: () => void;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface ErrorsData {
	general: string;
	email: string;
	password: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ handleShowModalClick }) => {

	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [isDisabled, setIsDisabled] = useState(false);
	const [errors, setErrors] = useState({ general: '', email: '', password: '' });

	const { login } = useAuth();

	const modalRef = useRef<HTMLDivElement>(null);

	const handleLogin = async (data: LoginData) => {

		setIsDisabled(true);

		try {
			setErrors(errors => ({ ...errors, general: '' }))
			await authorization(data);
			login();
			setLoginData({ email: '', password: '' })
			handleShowModalClick();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				setErrors(errors => ({ ...errors, general: error.message }))
			}
		} finally {
			setIsDisabled(false);
		}
	}

	const handleCloseBackdrop = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === modalRef.current) {
			handleShowModalClick();
		}
	};

	useEffect(() => {
		const handleCloseKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleShowModalClick();
			}
		}

		document.addEventListener('keydown', handleCloseKeyDown);

		return () => {
			document.removeEventListener('keydown', handleCloseKeyDown);
		}
	}, [handleShowModalClick])

	return createPortal(

		<div
			data-testid='login-modal'
			className={styles.modalOverlay}
			ref={modalRef}
			onClick={handleCloseBackdrop}
		>
			<div
				className={styles.modal}
			>
				<Button onClick={handleShowModalClick}>X</Button>
				<LoginForm
					loginData={loginData}
					setLoginData={setLoginData}
					isDisabled={isDisabled}
					errors={errors}
					setErrors={setErrors}
					onLogin={handleLogin} />
			</div>
		</div>,
		document.body
	)
}