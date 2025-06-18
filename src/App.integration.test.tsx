import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { authorization } from "./api/api";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./providers/AuthProvider";

vi.mock('./api/api', () => ({
	authorization: vi.fn(),
}));

describe('Intergration test: flow authorization', () => {

	beforeEach(() => {
		vi.clearAllMocks();
		render(
			<AuthProvider>
				<App />
			</AuthProvider>
		)
	});

	it('user successfully logs in through the form', async () => {
		vi.mocked(authorization).mockResolvedValueOnce({});

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		expect(screen.getByTestId('login-modal')).toBeInTheDocument();

		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');

		expect(screen.getByTestId('email-input')).toHaveValue('test@mail.ru');

		await userEvent.type(screen.getByTestId('password-input'), '12345678');

		expect(screen.getByTestId('password-input')).toHaveValue('12345678');

		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(authorization).toHaveBeenCalledWith({
			email: 'test@mail.ru',
			password: '12345678'
		});

		expect(screen.queryByTestId('login-modal')).toBeNull();
		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
	});

	it('disables login button during submission', async () => {
		vi.mocked(authorization).mockImplementationOnce(() =>
			new Promise((resolve) => setTimeout(resolve, 100))
		);

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '12345678');
		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(screen.queryByRole('button', { name: /^Войти$/ })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Processing...$/ })).toBeDisabled();
		expect(screen.getByRole('button', { name: /^Processing...$/ })).toHaveTextContent('Processing...');

		await waitFor(() => {
			expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		});
	});

	it('should clear form after successful submission', async () => {
		vi.mocked(authorization).mockResolvedValueOnce({});

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '12345678');

		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		await waitFor(() => {
			expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
		});

		await userEvent.click(screen.getByRole('button', { name: /^Выйти$/ }));
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		expect(screen.getByTestId('email-input')).toHaveValue('');
		expect(screen.getByTestId('password-input')).toHaveValue('');
		expect(screen.queryByText('general-error')).toBeNull();
	});

	it('should persist form data when submission fails', async () => {
		vi.mocked(authorization).mockRejectedValueOnce(new Error('Неверный логин или пароль'));

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'wrong@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '87654321');
		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(screen.getByTestId('email-input')).toHaveValue('wrong@mail.ru');
		expect(screen.getByTestId('password-input')).toHaveValue('87654321');
		expect(screen.queryByTestId('general-error')).toBeInTheDocument();
		expect(screen.getByTestId('general-error')).toHaveTextContent('Неверный логин или пароль');
	});

	it('shows error message when invalid credentials are entered', async () => {
		vi.mocked(authorization).mockRejectedValueOnce(new Error('Неверный логин или пароль'));

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByLabelText(/^Email:$/), 'wrong@gmail.com');

		expect(screen.getByTestId('email-input')).toHaveValue('wrong@gmail.com');

		await userEvent.type(screen.getByLabelText(/^Password:$/), '87654321');

		expect(screen.getByTestId('password-input')).toHaveValue('87654321');

		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(authorization).toHaveBeenCalledWith({
			email: 'wrong@gmail.com',
			password: '87654321'
		});

		expect(await screen.findByTestId('general-error')).toBeInTheDocument();
		expect(await screen.findByTestId('general-error')).toHaveTextContent('Неверный логин или пароль');
	});

	it('shows validation errors for empty fields on submit', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }))
		expect(screen.getByTestId('email-input')).toHaveValue('');
		expect(screen.getByTestId('password-input')).toHaveValue('');
		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(authorization).not.toHaveBeenCalledOnce();

		expect(screen.getByTestId('email-error')).toHaveTextContent('Email обязателен');
		expect(screen.getByTestId('password-error')).toHaveTextContent('Пароль обязателен');
	});

	it('shows email validation error on invalid email format', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'test@');

		expect(screen.getByTestId('email-input')).toHaveValue('test@');
		expect(screen.getByTestId('email-error')).toHaveTextContent('Введите корректный email');
	});

	it('shows password validation error on short password', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('password-input'), '123');

		expect(screen.getByTestId('password-input')).toHaveValue('123');
		expect(screen.getByTestId('password-error')).toHaveTextContent('Пароль должен быть не короче 8 символов');
	});

	it('shows password validation error on invalid password', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('password-input'), '@#$#wbewbh');

		expect(screen.getByTestId('password-input')).toHaveValue('@#$#wbewbh');
		expect(screen.getByTestId('password-error')).toHaveTextContent('Пароль может состоять только из цифр');
	});

	it('should not start submit event if login and/or password are invalid', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'test@');
		await userEvent.type(screen.getByTestId('password-input'), '@#$#wbewbh');

		expect(screen.getByTestId('email-input')).toHaveValue('test@');
		expect(screen.getByTestId('password-input')).toHaveValue('@#$#wbewbh');

		await userEvent.clear(screen.getByTestId('email-input'));
		await userEvent.clear(screen.getByTestId('password-input'));
		await userEvent.type(screen.getByTestId('email-input'), 'test@');
		await userEvent.type(screen.getByTestId('password-input'), '12345678');

		expect(screen.getByTestId('email-input')).toHaveValue('test@');
		expect(screen.getByTestId('password-input')).toHaveValue('12345678');

		await userEvent.clear(screen.getByTestId('email-input'));
		await userEvent.clear(screen.getByTestId('password-input'));
		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '@#$#wbewbh');

		expect(screen.getByTestId('email-input')).toHaveValue('test@mail.ru');
		expect(screen.getByTestId('password-input')).toHaveValue('@#$#wbewbh');
	});

	it('clears form data and errors when modal is closed', async () => {
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		await userEvent.type(screen.getByTestId('email-input'), 'wrong@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '123');

		expect(screen.getByTestId('email-error')).toBeInTheDocument();
		expect(screen.getByTestId('password-error')).toBeInTheDocument();

		await userEvent.click(screen.getByRole('button', { name: /^X$/ }));

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		expect(screen.getByTestId('email-input')).toHaveValue('');
		expect(screen.getByTestId('password-input')).toHaveValue('');
		expect(screen.queryByTestId('email-error')).toBeNull();
		expect(screen.queryByTestId('password-error')).toBeNull();
	});
});