import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('Component Button', () => {
	const handleClick = vi.fn();
	it('show text button', () => {
		render(<Button onClick={handleClick}>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async() => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Press me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	})

	it('should be disabled if prop disabled is passed', async() => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick} disabled>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toBeDisabled();
	})

	it('click should not work if the prop is disabled', async() => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick} disabled>Press me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(handleClick).not.toHaveBeenCalled();
	})

	it('snapshot: Button with onClick and disabled', async() => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick} disabled>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	})
});