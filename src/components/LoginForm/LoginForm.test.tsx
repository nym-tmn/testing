import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";
import userEvent from "@testing-library/user-event";
import styles from './LoginForm.module.css'

const handleLogin = vi.fn();
const setErrors = vi.fn();
const setLoginData = vi.fn();

vi.mock('../Button/Button', () => ({
	Button: vi.fn(({ children, onClick }) => (
		<button onClick={onClick}>{children}</button>
	))
}))

describe('LoginForm component', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	})

	it('should render login form and button of submit form', () => {
		render(
			<LoginForm
				loginData={{ email: '', password: '' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin} />
		);

		expect(screen.getByTestId('form')).toBeInTheDocument();
		expect(screen.getByText('Почта для входа test@mail.ru')).toBeInTheDocument();
		expect(screen.getByText('Пароль для входа 12345678')).toBeInTheDocument();
		expect(screen.getByLabelText(/^Email:$/)).toBeInTheDocument();
		expect(screen.getByTestId('email-input')).toBeInTheDocument();
		expect(screen.getByLabelText(/^Password:$/)).toBeInTheDocument();
		expect(screen.getByTestId('password-input')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^Войти$/ })).toBeInTheDocument();
	});

	it('should call event submit when button with text "Login" is clicked', async () => {

		render(
			<LoginForm
				loginData={{ email: 'test@mail.ru', password: '12345678' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin} />
		);

		await userEvent.click(screen.getByRole('button', { name: /^Войти$/ }));

		expect(handleLogin).toHaveBeenCalledWith({
			email: 'test@mail.ru',
			password: '12345678'
		});
	});

	it('should be displayed email and password error messages', () => {

		render(
			<LoginForm
				loginData={{ email: 'test@mail', password: '!@#qwedasd' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: 'Введите корректный email', password: 'Пароль может состоять только из цифр' }}
				setErrors={setErrors}
				onLogin={handleLogin} />
		);

		expect(screen.getByTestId('email-error')).toBeInTheDocument();
		expect(screen.getByTestId('email-error')).toHaveTextContent('Введите корректный email');
		expect(screen.getByTestId('email-error')).toHaveClass(styles.error);

		expect(screen.getByTestId('password-error')).toBeInTheDocument();
		expect(screen.getByTestId('password-error')).toHaveTextContent('Пароль может состоять только из цифр');
		expect(screen.getByTestId('password-error')).toHaveClass(styles.error);

	});

	it('should be displayed general error message', () => {

		render(
			<LoginForm
				loginData={{ email: 'wrong@mail.ru', password: '87654321' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: 'Неверный логин или пароль', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin} />
		);

		expect(screen.getByTestId('general-error')).toBeInTheDocument();
		expect(screen.getByTestId('general-error')).toHaveTextContent('Неверный логин или пароль');
		expect(screen.getByTestId('general-error')).toHaveClass(styles.error);
	});

	it('inputs should be required', () => {

		render(
			<LoginForm
				loginData={{ email: '', password: '' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin} />
		);

		expect(screen.getByTestId('email-input')).toBeRequired();
		expect(screen.getByTestId('password-input')).toBeRequired();
	});

	it('should call handleEmailChange and update email state', async () => {

		render(
			<LoginForm
				loginData={{ email: '', password: '' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin}
			/>
		);

		const emailInput = screen.getByTestId('email-input');

		await userEvent.type(emailInput, 'test@mail.ru');

		expect(setLoginData).toHaveBeenCalledWith(expect.any(Function));
		expect(setLoginData).toHaveBeenCalledTimes(12);

		let finalState = { email: '', password: '' };

		setLoginData.mock.calls.forEach(([updaterFn]) => {
			const partialUpdate = updaterFn(finalState);
			finalState = {
				...finalState,
				email: finalState.email + partialUpdate.email
			};
		});

		expect(finalState).toEqual({
			email: 'test@mail.ru',
			password: ''
		});
	});

	it('should call handlePasswordChange and update password state', async () => {

		render(
			<LoginForm
				loginData={{ email: '', password: '' }}
				setLoginData={setLoginData}
				isDisabled={false}
				errors={{ general: '', email: '', password: '' }}
				setErrors={setErrors}
				onLogin={handleLogin}
			/>
		);

		const passwordlInput = screen.getByTestId('password-input');

		await userEvent.type(passwordlInput, '12345678');

		expect(setLoginData).toHaveBeenCalledWith(expect.any(Function));
		expect(setLoginData).toHaveBeenCalledTimes(8);

		let finalState = { email: '', password: '' };

		setLoginData.mock.calls.forEach(([updaterFn]) => {
			const partialUpdate = updaterFn(finalState);
			finalState = {
				...finalState,
				password: finalState.password + partialUpdate.password
			};
		});

		expect(finalState).toEqual({
			email: '',
			password: '12345678'
		});
	});
});