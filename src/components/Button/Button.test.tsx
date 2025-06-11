import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('Button component', () => {

	it('should render button with text', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByTestId('click-btn')).toBeInTheDocument();
	});

	describe('Button disabled state', () => {
		it('should disable only when type="submit" + disabled=true', () => {
			const { rerender } = render(<Button type="submit" disabled>Click me</Button>);
			expect(screen.getByTestId('click-btn')).toBeDisabled();
			rerender(<Button disabled>Button</Button>);
			expect(screen.getByTestId('click-btn')).not.toBeDisabled();
		});
	});

	describe('Interactions with user', () => {
		it('should not call onClick when disabled with type="submit"', async () => {
			const handleClick = vi.fn()
			render(<Button type="submit" disabled onClick={handleClick}>Click me</Button>)
			await userEvent.click(screen.getByTestId('click-btn'))
			expect(handleClick).not.toHaveBeenCalled()
		});

		it('should call onClick when not disabled', async () => {
			const handleClick = vi.fn()
			render(<Button onClick={handleClick}>Click me</Button>)
			await userEvent.click(screen.getByTestId('click-btn'))
			expect(handleClick).toHaveBeenCalled();
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe('Visual feedback', () => {
		it('should show "Processing..." when disabled with type="submit"', () => {
			render(<Button type="submit" disabled>Click me</Button>)
			expect(screen.getByTestId('click-btn')).toHaveTextContent('Processing...')
		});

		it('should show children when not disabled', () => {
			render(<Button type="submit">Click me</Button>)
			expect(screen.getByTestId('click-btn')).toHaveTextContent('Click me')
		});
	});

	it('snapshot: Button default', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	});

	it('snapshot: Button submit', () => {
		render(<Button type='submit'>Send</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	});

	it('snapshot: Button submit disabled', () => {
		render(<Button type='submit' disabled>Loading...</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	});
});