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




















	// it('should call login on successful authorization', async () => {
	// 	// const login = vi.fn();
	// 	// const logout = vi.fn();
	// 	// const handleShowModalClick = vi.fn();

	// 	vi.mocked(authorization).mockResolvedValue({});

	// 	// render(
	// 	// 	<AuthContext.Provider value={{ isAuth: false, login, logout }}>
	// 	// 		<LoginModal handleShowModalClick={handleShowModalClick} />
	// 	// 	</AuthContext.Provider>
	// 	// );

	// 	await userEvent.type(screen.getByLabelText(/^Email:$/), 'tester@gmail.com');
	// 	await userEvent.type(screen.getByLabelText(/^Password:$/), '12345678');

	// 	await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

	// 	await waitFor(() => {
	// 		expect(login).toBeCalled();
	// 		expect(handleShowModalClick).toBeCalled();
	// 	})
	// });

	// it('should disable submit button while processing', async () => {

	// 	// const login = vi.fn();
	// 	// const logout = vi.fn();
	// 	// const handleShowModalClick = vi.fn();

	// 	vi.mocked(authorization).mockImplementation(
	// 		() => new Promise(resolve => setTimeout(resolve, 100))
	// 	);

	// 	// render(
	// 	// 	<AuthContext.Provider value={{ isAuth: false, login, logout }}>
	// 	// 		<LoginModal handleShowModalClick={handleShowModalClick} />
	// 	// 	</AuthContext.Provider>
	// 	// );

	// 	await userEvent.type(screen.getByLabelText(/Email:/i), 'tester@gmail.com');
	// 	await userEvent.type(screen.getByLabelText(/Password:/i), '12345678');
	// 	await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

	// 	expect(screen.getByRole('button', { name: /^Processing...$/ })).toBeDisabled();

	// 	await waitFor(() => {
	// 		expect(screen.getByRole('button', { name: /^Войти$/ })).toBeEnabled();
	// 	});
	// });

	// it('should clear form after submit', async () => {

	// 	// const login = vi.fn();
	// 	// const logout = vi.fn();
	// 	// const handleShowModalClick = vi.fn();

	// 	vi.mocked(authorization).mockResolvedValueOnce({});

	// 	// render(
	// 	// 	<AuthContext.Provider value={{ isAuth: false, login, logout }}>
	// 	// 		<LoginModal handleShowModalClick={handleShowModalClick} />
	// 	// 	</AuthContext.Provider>
	// 	// );

	// 	await userEvent.type(screen.getByLabelText(/Email:/i), 'tester@gmail.com');
	// 	await userEvent.type(screen.getByLabelText(/Password:/i), '12345678');

	// 	expect(screen.getByLabelText(/^Email:$/)).toHaveValue('tester@gmail.com');
	// 	expect(screen.getByLabelText(/^Password:$/)).toHaveValue('12345678');

	// 	await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

	// 	await waitFor(() => {
	// 		expect(screen.getByLabelText(/^Email:$/)).toHaveValue('');
	// 		expect(screen.getByLabelText(/^Password:$/)).toHaveValue('');
	// 		expect(login).toBeCalled();
	// 		expect(handleShowModalClick).toBeCalled();
	// 	})
	// });

	// it('should clear form after submit', async () => {

	// 	// const login = vi.fn();
	// 	// const logout = vi.fn();
	// 	// const handleShowModalClick = vi.fn();

	// 	vi.mocked(authorization).mockResolvedValueOnce({});

	// 	// render(
	// 	// 	<AuthContext.Provider value={{ isAuth: false, login, logout }}>
	// 	// 		<LoginModal handleShowModalClick={handleShowModalClick} />
	// 	// 	</AuthContext.Provider>
	// 	// );

	// 	await userEvent.type(screen.getByLabelText(/Email:/i), 'tester@gmail.com');
	// 	await userEvent.type(screen.getByLabelText(/Password:/i), '12345678');

	// 	expect(screen.getByLabelText(/^Email:$/)).toHaveValue('tester@gmail.com');
	// 	expect(screen.getByLabelText(/^Password:$/)).toHaveValue('12345678');

	// 	await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

	// 	await waitFor(() => {
	// 		expect(screen.getByLabelText(/^Email:$/)).toHaveValue('');
	// 		expect(screen.getByLabelText(/^Password:$/)).toHaveValue('');
	// 		expect(login).toBeCalled();
	// 		expect(handleShowModalClick).toBeCalled();
	// 	})
	// });

	// it('should generate general error', async () => {

	// 	vi.mocked(authorization).mockRejectedValueOnce(new Error('Неверный логин или пароль'))

	// 	// const handleShowModalClick = vi.fn();
	// 	// const login = vi.fn();
	// 	// const logout = vi.fn();

	// 	// render(
	// 	// 	<AuthContext.Provider value={{ isAuth: false, login, logout }}>
	// 	// 		<LoginModal handleShowModalClick={handleShowModalClick} />
	// 	// 	</AuthContext.Provider>
	// 	// );

	// 	await userEvent.type(screen.getByLabelText(/Email:/i), 'wrong@gmail.com');
	// 	await userEvent.type(screen.getByLabelText(/Password:/i), '87654321');

	// 	await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

	// 	expect(await screen.findByTestId('general-error')).toBeInTheDocument();
	// 	expect(await screen.findByTestId('general-error')).toHaveTextContent('Неверный логин или пароль');
	// });
})