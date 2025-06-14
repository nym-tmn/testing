import { createPortal } from "react-dom"
import { LoginForm } from "../LoginForm/LoginForm"
import { useRef, useState, type MouseEvent } from "react"
import { Button } from "../Button/Button";
import styles from './LoginModal.module.css'
import { useAuth } from "../../hooks/useAuth";
import { authorization } from "../../api/api";

interface LoginModalProps {
	handleModalClick: () => void;
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

export const LoginModal: React.FC<LoginModalProps> = ({ handleModalClick }) => {

	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [isDisabled, setIsDisabled] = useState(false);
	const [errors, setErrors] = useState({ general: '', email: '', password: '' });

	const { toggleAuth } = useAuth();

	const modalRef = useRef<HTMLDivElement>(null);

	const handleLogin = async (data: LoginData) => {

		setIsDisabled(true);

		try {
			setErrors(errors => ({ ...errors, general: '' }))
			await authorization(data);
			toggleAuth();
			setLoginData({ email: '', password: '' })
			handleModalClick();
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
			handleModalClick();
		}
	};

	return createPortal(

		<div
			data-testid='login-modal'
			className={styles.modalOverlay}
			ref={modalRef}
			onClick={handleCloseBackdrop}
		>
			<div className={styles.modal}>
				<Button onClick={handleModalClick}>X</Button>
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