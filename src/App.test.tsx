import { describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthContext } from "./context/AuthContext";
import userEvent from "@testing-library/user-event";

describe('App component', () => {
	it('Render of a button with the text "Login" if not logged in', () => {

		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{ isAuth: false, toggleAuth }}>
				<App />
			</AuthContext.Provider>);

		expect(screen.getByRole('button', { name: /^Авторизоваться$/ })).toBeInTheDocument();
		expect(screen.queryByText('Вы авторизованы!!!')).toBeNull();
		expect(screen.queryByText('Выйти')).toBeNull();
		expect(screen.getByTestId('app')).toMatchSnapshot();
	});

	it('Render greeting and button with text "Exit" if authorized', () => {

		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{ isAuth: true, toggleAuth }}>
				<App />
			</AuthContext.Provider>);

		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		expect(screen.queryByText('Авторизоваться')).toBeNull();
		expect(screen.getByTestId('app')).toMatchSnapshot();
	});

	it('should open modal when clicked button "Authorization"', async () => {
		render(
			<AuthContext.Provider value={{ isAuth: false, toggleAuth: vi.fn() }}>
				<App />
			</AuthContext.Provider>
		);

		expect(screen.queryByTestId('login-modal')).toBeNull();

		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		expect(screen.getByTestId('login-modal')).toBeInTheDocument();
	});

	it('should close modal when clicked button "X"', async () => {
		render(
			<AuthContext.Provider value={{ isAuth: false, toggleAuth: vi.fn() }}>
				<App />
			</AuthContext.Provider>
		);

		await userEvent.click(screen.getByRole('button', { name: /Авторизоваться/i }));

		await userEvent.click(screen.getByRole('button', { name: /^X$/ }));

		expect(screen.queryByTestId('login-modal')).toBeNull();
	});
})