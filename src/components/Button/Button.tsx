import type { ReactNode, MouseEvent } from "react"

interface ButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
	return (
		<button
			data-testid={'click-btn'}
			type="button"
			onClick={onClick}
			disabled={disabled}
		>
			{disabled ? 'Processing...' : children}
		</button>
	)
}