import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";
import { useAuth } from "./hooks/useAuth";

vi.mock('./hooks/useAuth', () => ({
	useAuth: vi.fn(() => ({
		isAuth: false,
		login: vi.fn(),
		logout: vi.fn(),
	}))
}));

vi.mock('./components/LoginModal/LoginModal', () => ({
	LoginModal: vi.fn(({ isOpenModal, handleShowModalClick }) => (
		isOpenModal ? (
			<div data-testid='login-modal'>
				<button onClick={handleShowModalClick}>X</button>
			</div>
		) : null
	))
}))

vi.mock('./components/Button/Button', () => ({
	Button: vi.fn(({ children, onClick }) => (
		<button onClick={onClick}>{children}</button>
	))
}))

describe('App component', () => {

	beforeEach(() => {
		vi.clearAllMocks();
	})

	it('should render of button with text "Login" if not logged in', () => {

		render(<App />);

		expect(screen.getByRole('button', { name: /^Авторизоваться$/ })).toBeInTheDocument();
		expect(screen.queryByText('Вы авторизованы!!!')).toBeNull();
		expect(screen.queryByText('Выйти')).toBeNull();
		expect(screen.getByTestId('app')).toMatchSnapshot();
	});

	it('should render greeting and button with text "Exit" if authorized', () => {

		vi.mocked(useAuth).mockReturnValue({
			isAuth: true,
			login: vi.fn(),
			logout: vi.fn(),
		})

		render(<App />);

		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		expect(screen.queryByText('Авторизоваться')).toBeNull();
		expect(screen.getByTestId('app')).toMatchSnapshot();
	});

	it('should open modal when clicked button "Authorization"', async () => {

		vi.mocked(useAuth).mockReturnValue({
			isAuth: false,
			login: vi.fn(),
			logout: vi.fn(),
		})

		render(<App />);

		expect(screen.queryByTestId('login-modal')).toBeNull();
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
		expect(screen.getByTestId('login-modal')).toBeInTheDocument();
	});

	it('should call logout when button with text "Exit" is clicked', async () => {

		const mockLogout = vi.fn();

		vi.mocked(useAuth).mockReturnValue({
			isAuth: true,
			login: vi.fn(),
			logout: mockLogout,
		})

		render(<App />);

		await userEvent.click(screen.getByRole('button', { name: /^Выйти$/ }));
		expect(mockLogout).toHaveBeenCalledOnce();
	});
});