import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('Component Button', () => {
	it('show text button', () => {
		render(<Button>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async() => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Press me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(onClick).toHaveBeenCalledTimes(1);
	})

	it('should be disabled if prop disabled is passed', async() => {
		render(<Button disabled>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toBeDisabled();
	})

	it('click should not work if the prop is disabled', async() => {
		const onClick = vi.fn();
		render(<Button onClick={onClick} disabled>Press me</Button>);
		await userEvent.click(screen.getByTestId('click-btn'));
		expect(onClick).not.toHaveBeenCalled();
	})

	it('snapshot: Button with onClick and disabled', async() => {
		const onClick = vi.fn();
		render(<Button onClick={onClick} disabled>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	})

	it('snapshot: Button with onClick and without disabled', async() => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Press me</Button>);
		expect(screen.getByTestId('click-btn')).toMatchSnapshot();
	})
});