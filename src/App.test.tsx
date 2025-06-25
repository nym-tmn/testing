import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";
import { useAuth } from "./hooks/isAuth/useAuth";

vi.mock('./hooks/isAuth/useAuth', () => ({
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

	it('should render greeting and button with text "Exit" if authorized', async () => {

		vi.mocked(useAuth).mockReturnValue({
			isAuth: true,
			login: vi.fn(),
			logout: vi.fn(),
		})

		render(<App />);

		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		expect(screen.getByText(/^Список пользователей:$/)).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByTestId('users-list')).toBeInTheDocument();
			mockUsers.forEach(user => {
				expect(screen.getByText(user.name)).toBeInTheDocument();
			})

		})


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