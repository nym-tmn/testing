import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginForm } from "./LoginForm";
import { LoginModal } from "../LoginModal/LoginModal";
import { AuthContext } from "../../context/AuthContext";

const meta: Meta<typeof LoginForm> = {
	title: 'Components/LoginForm',
	component: LoginForm,
}

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
	args: {
		loginData: { email: '', password: '' },
		errors: { general: '', email: '', password: '' },
	}
}

export const WithFilledInputs: Story = {
	args: {
		loginData: { email: 'test@mail.ru', password: '12345678' },
		errors: { general: '', email: '', password: '' },
	},
}

export const WithGeneralError: Story = {
	args: {
		loginData: { email: 'wrong@mail.ru', password: '87654321' },
		errors: { general: 'Неверный логин или пароль', email: '', password: '' },
	}
}

export const WithValidationError: Story = {
	args: {
		loginData: { email: 'test@mail', password: '@#sdfscdcxsxs' },
		errors: { general: '', email: 'Введите корректный email', password: 'Пароль может состоять только из цифр' },
	}
}

export const LoadingState: Story = {
	args: {
		loginData: { email: 'test@mail.ru', password: '12345678' },
		isDisabled: true,
		errors: { general: '', email: '', password: '' },
	}
}

export const InModal: Story = {
	render: () => (

		<AuthContext.Provider value={{ isAuth: false, login: () => { }, logout: () => { } }}>
			<LoginModal isOpenModal={true} handleClose={() => { }}>
				<LoginForm
					loginData={{ email: '', password: '' }}
					errors={{ general: '', email: '', password: '' }}
					setLoginData={(loginData) => ({ loginData })}
					isDisabled={false}
					onLogin={() => Promise.resolve()}
					setErrors={(errors) => ({ errors })}
				/>
			</LoginModal>
		</AuthContext.Provider>
	),
};