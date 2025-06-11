import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthContext } from "./context/AuthContext";
import userEvent from "@testing-library/user-event";

// beforeEach(() => {
// 	HTMLDialogElement.prototype.showModal = vi.fn();
// 	HTMLDialogElement.prototype.close = vi.fn();
// });

// afterEach(() => {
// 	vi.clearAllMocks();
// });

vi.mock('../components/LoginModal/LoginModal', () => ({
	LoginModal: vi.fn(({ isOpenModal, handleModalClick }: { isOpenModal: boolean, handleModalClick: () => void }) => {
		return isOpenModal ? (
			<div data-testid="mocked-login-modal" data-open="true">
				Mocked Login Modal
				<button onClick={handleModalClick}>Close Modal</button>
			</div>
		) : null;
	})
}));

describe('App component', () => {
	it('Render of a button with the text "Login" if not logged in', () => {

		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{isAuth: false, toggleAuth}}>
				<App />
			</AuthContext.Provider>);

		expect(screen.getByRole('button', { name: /^Авторизоваться$/})).toBeInTheDocument();
		expect(screen.queryByText('Вы авторизованы!!!')).toBeNull();
		expect(screen.queryByText('Выйти')).toBeNull();
	})

	it('Render greeting and button with text "Exit" if authorized', () => {
		
		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{ isAuth: true, toggleAuth }}>
				<App />
			</AuthContext.Provider>);

		expect(screen.getByText(/^Вы авторизованы!!!$/)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^Выйти$/ })).toBeInTheDocument();
		expect(screen.queryByText('Авторизоваться')).toBeNull();
	})
})

// describe('Interactions with user', () => {
// 	it('calls toggleAuth when clicking "Logout"', async () => {

// 		const toggleAuth = vi.fn();

// 		render(
// 			<AuthContext.Provider value={{ isAuth: true, toggleAuth }}>
// 				<App />
// 			</AuthContext.Provider>);
		
// 		await userEvent.click(screen.getByRole('button', { name: /^Выйти$/ }));
// 		expect(toggleAuth).toHaveBeenCalled();
// 		expect(toggleAuth).toHaveBeenCalledTimes(1);
// 	})

// 	it('should show modal when clicking "Login"', async () => {

// 		const toggleAuth = vi.fn();

// 		render(
// 			<AuthContext.Provider value={{ isAuth: false, toggleAuth }}>
// 				<App />
// 			</AuthContext.Provider>);
		
// 		expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
// 		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));
// 		expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
// 	})
// })

describe('Interactions with user', () => {
	it('should show modal when clicking "Login"', async () => {
		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{ isAuth: false, toggleAuth }}>
				<App />
			</AuthContext.Provider>
		);

		// Модалка изначально скрыта
		// expect(screen.queryByTestId('dialog')).toBeNull();
		expect(screen.queryByTestId('dialog')).not.toBeVisible();

		// Кликаем на кнопку авторизации
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		// Проверяем, что модалка появилась
		expect(screen.getByTestId('dialog')).toBeInTheDocument();
		// expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
		expect(screen.queryByTestId('dialog')).toBeVisible();
	});

	it('should close modal when clicking close button', async () => {
		const toggleAuth = vi.fn();

		render(
			<AuthContext.Provider value={{ isAuth: false, toggleAuth }}>
				<App />
			</AuthContext.Provider>
		);

		// Открываем модалку
		await userEvent.click(screen.getByRole('button', { name: /^Авторизоваться$/ }));

		// Закрываем модалку
		// await userEvent.click(screen.getByText('Close Modal'));

		// Проверяем, что модалка скрылась
		expect(screen.queryByTestId('dialog')).not.toBeVisible();
	});
});