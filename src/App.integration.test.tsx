import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { authorization, getUsers } from "./api/api";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./providers/AuthProvider";

vi.mock('./api/api', () => ({
	authorization: vi.fn(),
	getUsers: vi.fn(),
}));

const mockUsers = [
	{
		"id": 1,
		"name": "Leanne Graham",
		"username": "Bret",
		"email": "Sincere@april.biz",
		"address": {
			"street": "Kulas Light",
			"suite": "Apt. 556",
			"city": "Gwenborough",
			"zipcode": "92998-3874",
			"geo": {
				"lat": "-37.3159",
				"lng": "81.1496"
			}
		},
		"phone": "1-770-736-8031 x56442",
		"website": "hildegard.org",
		"company": {
			"name": "Romaguera-Crona",
			"catchPhrase": "Multi-layered client-server neural-net",
			"bs": "harness real-time e-markets"
		}
	},
	{
		"id": 2,
		"name": "Ervin Howell",
		"username": "Antonette",
		"email": "Shanna@melissa.tv",
		"address": {
			"street": "Victor Plains",
			"suite": "Suite 879",
			"city": "Wisokyburgh",
			"zipcode": "90566-7771",
			"geo": {
				"lat": "-43.9509",
				"lng": "-34.4618"
			}
		},
		"phone": "010-692-6593 x09125",
		"website": "anastasia.net",
		"company": {
			"name": "Deckow-Crist",
			"catchPhrase": "Proactive didactic contingency",
			"bs": "synergize scalable supply-chains"
		}
	},
]

describe('Intergration test: flow authorization', () => {

	beforeEach(() => {
		vi.clearAllMocks();
		render(
			<AuthProvider>
				<App />
			</AuthProvider>
		)
	});

	it('The user successfully logs in through the form and then logs out of the account', async () => {
		vi.mocked(authorization).mockImplementationOnce(() =>
			new Promise((resolve) => setTimeout(resolve, 100))
		);
		vi.mocked(getUsers).mockResolvedValue(mockUsers);

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		expect(screen.getByTestId('login-modal')).toBeInTheDocument();

		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');

		expect(screen.getByTestId('email-input')).toHaveValue('test@mail.ru');

		await userEvent.type(screen.getByTestId('password-input'), '12345678');

		expect(screen.getByTestId('password-input')).toHaveValue('12345678');

		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));


		expect(screen.queryByRole('button', { name: /^Войти$/ })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Processing...$/ })).toBeDisabled();
		expect(screen.getByRole('button', { name: /^Processing...$/ })).toHaveTextContent('Processing...');
		expect(authorization).toHaveBeenCalledWith({
			email: 'test@mail.ru',
			password: '12345678'
		});

		await waitFor(() => {
			expect(getUsers).toHaveBeenCalledOnce();
		})

		expect(screen.queryByTestId('login-modal')).toBeNull();
		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		expect(screen.getByText(/^Список пользователей:$/)).toBeInTheDocument();
		expect(screen.getByTestId('users-list')).toBeInTheDocument();

		mockUsers.forEach(user => {
			expect(screen.getByText(user.name)).toBeInTheDocument();
		})

		await userEvent.click(screen.getByRole('button', { name: /^Выйти$/ }));

		expect(screen.getByRole('button', { name: /^Авторизоваться$/ })).toBeInTheDocument();
		expect(screen.queryByText(/^Вы авторизованы!!!$/)).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /^Выйти$/ })).not.toBeInTheDocument();
		expect(screen.queryByText(/^Список пользователей:$/)).not.toBeInTheDocument();
		expect(screen.queryByTestId('users-list')).not.toBeInTheDocument();
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

	it('should save form data when submission fails', async () => {
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

		expect(getUsers).not.toHaveBeenCalledOnce();

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
		expect(authorization).not.toHaveBeenCalledOnce();

		await userEvent.clear(screen.getByTestId('email-input'));
		await userEvent.clear(screen.getByTestId('password-input'));
		await userEvent.type(screen.getByTestId('email-input'), 'test@');
		await userEvent.type(screen.getByTestId('password-input'), '12345678');

		expect(screen.getByTestId('email-input')).toHaveValue('test@');
		expect(screen.getByTestId('password-input')).toHaveValue('12345678');
		expect(authorization).not.toHaveBeenCalledOnce();

		await userEvent.clear(screen.getByTestId('email-input'));
		await userEvent.clear(screen.getByTestId('password-input'));
		await userEvent.type(screen.getByTestId('email-input'), 'test@mail.ru');
		await userEvent.type(screen.getByTestId('password-input'), '@#$#wbewbh');

		expect(screen.getByTestId('email-input')).toHaveValue('test@mail.ru');
		expect(screen.getByTestId('password-input')).toHaveValue('@#$#wbewbh');
		expect(authorization).not.toHaveBeenCalledOnce();
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