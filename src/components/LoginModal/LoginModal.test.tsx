import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginModal } from "./LoginModal";
import userEvent from "@testing-library/user-event";

const handleClose = vi.fn();

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
		handleClose.mockClear()
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

		expect(handleClose).toHaveBeenCalledWith();

		rerender(<LoginModal isOpenModal={false} handleClose={handleClose} />);

		expect(screen.queryByTestId('login-modal')).toBeNull();
	});

	it('should not close modal when clicking on modal', async () => {

		render(<LoginModal isOpenModal={true} handleClose={handleClose} />);

		await userEvent.click(screen.getByTestId('modal-content'));

		expect(handleClose).not.toHaveBeenCalled();
		expect(screen.queryByTestId('login-modal')).toBeInTheDocument();
	});
})