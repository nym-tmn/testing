import type { MouseEventHandler, ReactNode } from "react"
import styles from './Button.module.css'

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	type: "submit" | "reset" | "button" | undefined;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, ...props }) => {
	return (
		<button
			className={styles.button}
			data-testid={'click-btn'}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{disabled ? 'Processing...' : children}
		</button>
	)
}