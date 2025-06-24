import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginModal } from "./LoginModal";
import { AuthContext } from "../../context/AuthContext";

const meta: Meta<typeof LoginModal> = {
	title: 'Components/LoginModal',
	component: LoginModal,
	decorators: [
		(Story) => (
			<AuthContext.Provider value={{ isAuth: false, login: () => { }, logout: () => { } }}>
				<Story />
			</AuthContext.Provider >
		),
	],
}

export default meta;
type Story = StoryObj<typeof LoginModal>;

export const ModalOpend: Story = {
	args: {
		isOpenModal: true,
		handleClose: () => { },
	},
}
