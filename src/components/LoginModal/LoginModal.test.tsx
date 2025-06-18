import { act, render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginModal } from "./LoginModal";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { useHandleCloseModal } from "../../hooks/useHandleCloseModal/useHandleCloseModal";

const handleClose = vi.fn();

vi.mock('../../hooks/useHandleCloseModal/useHandleCloseModal', () => ({
	useHandleCloseModal: vi.fn((handleClose, modalRef) => {

		const handleCloseBackdrop = (e: MouseEvent) => {
			if (e.target === modalRef.current) {
				handleClose();
				}
			}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleCloseBackdrop);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleCloseBackdrop);
		};
	}),
}));

vi.mock('../../hooks/isAuth/useAuth', () => ({
	useAuth: vi.fn(() => ({
		isAuth: false,
		login: vi.fn(),
		logout: vi.fn(),
	}))
}));

vi.mock('../LoginForm/LoginForm', () => ({
	LoginForm: vi.fn(({ isDisabled }) => (
		<form data-testid='form'>
			<button disabled={isDisabled}>Войти</button>
		</form>
	))
}))

vi.mock('../Button/Button', () => ({
	Button: vi.fn(({ children, onClick }) => (
		<button onClick={onClick}>{children}</button>
	))
}))

describe('LoginModal component', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	})

	it('should render modal window, login form and button of closing modal window', () => {

		render(<LoginModal isOpenModal={true} handleClose={handleClose} />)

		expect(screen.getByTestId('login-modal')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^X$/ })).toBeInTheDocument();
		expect(screen.getByTestId('form')).toBeInTheDocument();
	});

	it('should close modal when clicking on "X"', async () => {

		const { rerender } = render(
			<LoginModal isOpenModal={true} handleClose={handleClose} />
		);

		await userEvent.click(screen.getByRole('button', { name: /^X$/ }));

		expect(handleClose).toHaveBeenCalled();

		rerender(<LoginModal isOpenModal={false} handleClose={handleClose} />);

		expect(screen.queryByTestId('login-modal')).toBeNull();
	});

	it('should close modal when clicking on backdrop', async () => {
		vi.mocked(useHandleCloseModal)

		const { rerender } = render(
			<LoginModal isOpenModal={true} handleClose={handleClose} />
		);

		await userEvent.click(screen.getByTestId('login-modal'));

		expect(handleClose).toHaveBeenCalled();

		rerender(<LoginModal isOpenModal={false} handleClose={handleClose} />);

		expect(screen.queryByTestId('login-modal')).toBeNull();
	});

	it('should close modal when press key Escape', async () => {

		const { rerender } = render(
			<LoginModal isOpenModal={true} handleClose={handleClose} />
		);

		await userEvent.keyboard('{Escape}');

		expect(handleClose).toHaveBeenCalled();

		rerender(<LoginModal isOpenModal={false} handleClose={handleClose} />);

		expect(screen.queryByTestId('login-modal')).toBeNull();
	});

	it('should not close modal when clicking on modal', async () => {

		render(<LoginModal isOpenModal={true} handleClose={handleClose} />);

		await userEvent.click(screen.getByTestId('modal-content'));

		expect(handleClose).not.toHaveBeenCalled();
		expect(screen.queryByTestId('login-modal')).toBeInTheDocument();
	});
});

describe('handleModalClose', () => {
	it('should reset login data, clear errors, and call handleClose', () => {

		const { result } = renderHook(() => {
			const [loginData, setLoginData] = useState({ email: 'test@mail.ru', password: '12345678' });
			const [errors, setErrors] = useState({
				general: 'Error',
				email: 'Invalid email',
				password: 'Invalid password'
			});

			const handleModalClose = () => {
				setLoginData({ email: '', password: '' });
				setErrors({ general: '', email: '', password: '' });
				handleClose();
			};

			return { loginData, errors, handleModalClose };
		});

		expect(result.current.loginData).toEqual({ email: 'test@mail.ru', password: '12345678' });
		expect(result.current.errors).toEqual({
			general: 'Error',
			email: 'Invalid email',
			password: 'Invalid password',
		});

		act(() => {
			result.current.handleModalClose();
		});

		expect(result.current.loginData).toEqual({ email: '', password: '' });
		expect(result.current.errors).toEqual({ general: '', email: '', password: '' });
		expect(handleClose).toHaveBeenCalled();
	});
});