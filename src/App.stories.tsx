import type { Meta, StoryObj } from "@storybook/react-vite";
import App from "./App";
import { AuthContext } from "./context/AuthContext";

const meta: Meta<typeof App> = {
	title: 'Components/App',
	component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const Unauthenticated: Story = {
	decorators: [
		(Story) => (
			<AuthContext.Provider value={{ isAuth: false, login: () => { }, logout: () => { } }}>
				<Story />
			</AuthContext.Provider>
		),
	],
};

export const Authenticated: Story = {
	decorators: [
		(Story) => (
			<AuthContext.Provider value={{ isAuth: true, login: () => { }, logout: () => { } }}>
				<Story />
			</AuthContext.Provider>
		),
	],
};