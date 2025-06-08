import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Component Button', () => {
	it('show text button', () => {
		render(<Button>Press me</Button>);
		expect(screen.getByText('Press me')).toBeInTheDocument();
	});
});