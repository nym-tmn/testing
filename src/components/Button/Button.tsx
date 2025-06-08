import type { ReactNode, MouseEvent } from "react"

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	handleClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: React.FC<ButtonProps> = ({ children, handleClick, disabled }) => {
	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={disabled}
		>
			{disabled ? 'Processing...' : children}
		</button>
	)
}