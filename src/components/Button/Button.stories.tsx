import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
}

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Button',
	}
}

export const Disabled: Story = {
	args: {
		children: 'Button',
		disabled: true,
		type: 'submit'
	}
}