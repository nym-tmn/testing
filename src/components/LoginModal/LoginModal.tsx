import { createPortal } from "react-dom"
import { LoginForm } from "../LoginForm/LoginForm"
import { useRef, useState} from "react"
import { Button } from "../Button/Button";
import styles from './LoginModal.module.css'
import { useAuth } from "../../hooks/isAuth/useAuth";
import { authorization } from "../../api/api";
import { useHandleCloseModal } from "../../hooks/useHandleCloseModal/useHandleCloseModal";

interface LoginModalProps {
	isOpenModal: boolean;
	handleClose: VoidFunction;
	children?: React.ReactNode;
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

export const LoginModal: React.FC<LoginModalProps> = ({ isOpenModal, handleClose}) => {

	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [isDisabled, setIsDisabled] = useState(false);
	const [errors, setErrors] = useState({ general: '', email: '', password: '' });


	const { login } = useAuth();

	const modalRef = useRef<HTMLDivElement>(null);

	const handleModalClose = () => {
		setLoginData({ email: '', password: '' });
		setErrors({ general: '', email: '', password: '' });
		handleClose();
	};

	const { handleCloseBackdrop } = useHandleCloseModal(handleModalClose, modalRef)

	const handleLogin = async (data: LoginData) => {

		setIsDisabled(true);

		try {
			setErrors(errors => ({ ...errors, general: '' }))
			await authorization(data);
			login();
			setLoginData({ email: '', password: '' })
			handleClose();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				setErrors(errors => ({ ...errors, general: error.message }))
			}
		} finally {
			setIsDisabled(false);
		}
	}

	if (!isOpenModal) return null;

	return createPortal(

		<div
			data-testid='login-modal'
			className={styles.modalOverlay}
			ref={modalRef}
			onMouseDown={handleCloseBackdrop}
		>
			<div
				data-testid='modal-content'
				className={styles.modal}
			>
				<Button onClick={handleModalClose}>X</Button>
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