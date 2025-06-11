import type { MouseEventHandler, ReactNode } from "react"
import styles from './Button.module.css'

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, type = 'button' }) => {

	return (
		<button
			className={styles.button}
			data-testid={'click-btn'}
			onClick={onClick}
			type={type}
			disabled={type === 'submit' ? disabled : false}
		>
			{disabled ? 'Processing...' : children}
		</button>
	)
}