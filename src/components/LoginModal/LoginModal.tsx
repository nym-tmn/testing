import { createPortal } from "react-dom"
import { LoginForm } from "../LoginForm/LoginForm"
import { useEffect, useRef, type MouseEvent } from "react"
import { Button } from "../Button/Button";
import styles from './LoginModal.module.css'

interface LoginModalProps {
	isOpenModal: boolean;
	handleModalClick: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpenModal, handleModalClick }) => {

	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleCloseBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === dialogRef.current) {
			dialogRef.current.close();
			handleModalClick();
		}
	};

	useEffect(() => {
		if (isOpenModal) {
			dialogRef.current?.showModal()
		} else {
			dialogRef.current?.close()
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
				<LoginForm handleModalClick={handleModalClick} dialogRef={dialogRef} />
			</div>
		</dialog>,
		document.body
	)
}