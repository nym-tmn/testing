import { createPortal } from "react-dom"
import { LoginForm } from "../LoginForm/LoginForm"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { Button } from "../Button/Button";
import styles from './LoginModal.module.css'
import { useAuth } from "../../hooks/useAuth";
import { authorization } from "../../api/api";

interface LoginModalProps {
	isOpenModal: boolean;
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

export const LoginModal: React.FC<LoginModalProps> = ({ isOpenModal, handleModalClick }) => {

	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [isDisabled, setIsDisabled] = useState(false);
	const [errors, setErrors] = useState({general: '', email: '', password: ''});

	const { toggleAuth } = useAuth();

	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleLogin = async (data: LoginData) => {

		setIsDisabled(true);

		try {
			setErrors(errors => ({...errors, general: ''}))
			await authorization(data);
			toggleAuth();
			setLoginData({ email: '', password: '' })
			dialogRef.current?.close();
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

	const handleCloseBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === dialogRef.current) {
			dialogRef.current.close();
			handleModalClick();
		}
	};

	useEffect(() => {
		if (isOpenModal) {
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
			setErrors(errors => ({ ...errors, general: '' }))
			setLoginData({ email: '', password: '' })
		}
	}, [isOpenModal])

	return createPortal(
		<dialog
			ref={dialogRef}
			className={styles.dialog}
			onClick={handleCloseBackdrop}
			onCancel={handleModalClick}
		>
			<div className={styles.dialogContent}>
				<Button type="button" onClick={handleModalClick}>X</Button>
				<LoginForm
					loginData={loginData}
					setLoginData={setLoginData}
					isDisabled={isDisabled}
					errors={errors}
					setErrors={setErrors}
					onLogin={handleLogin} />
			</div>
		</dialog>,
		document.body
	)
}