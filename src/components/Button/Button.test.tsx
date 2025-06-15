import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('Button component', () => {

	const handleClick = vi.fn();

	beforeEach(() => {
		handleClick.mockClear();
	})

	it('should render with default props', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByTestId('click-btn')).toBeInTheDocument();
		expect(screen.getByTestId('click-btn')).toHaveTextContent('Click me');
	});

	it('should call onClick when clicked', async () => {
		render(<Button onClick={handleClick}>Click me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(handleClick).toHaveBeenCalled();
	});

	it('should display Processing... and be disabled when type=submit and disabled=true', () => {
		render(<Button type="submit" disabled>Click me</Button>);
		const button = screen.getByTestId('click-btn');
		expect(button).toBeDisabled();
		expect(button).toHaveTextContent('Processing...');
	});

	it('should not call onClick when disabled', async () => {
		render(<Button type="submit" disabled onClick={handleClick}>Click me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should reset to enabled state when disabled=false', () => {
		render(<Button disabled={false}>Click me</Button>);
		const button = screen.getByTestId('click-btn');
		expect(button).not.toBeDisabled();
		expect(button).toHaveTextContent('Click me');
	});

	it('should display original text when type=submit and not disabled', () => {
		render(<Button type="submit">Click me</Button>);
		const button = screen.getByTestId('click-btn');
		expect(button).not.toBeDisabled();
		expect(button).toHaveTextContent('Click me');
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