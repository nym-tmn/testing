import { describe, expect, it } from "vitest";
import { validateEmail } from "./validateEmail";

describe('Validating email', () => {
	it('should return error for empty email', () => {
		expect(validateEmail('')).toBe('Email обязателен');
	});

	it('should return error for invalid email', () => {
		expect(validateEmail('test')).toBe('Введите корректный email');
		expect(validateEmail('test@')).toBe('Введите корректный email');
		expect(validateEmail('test@example')).toBe('Введите корректный email');
		expect(validateEmail('test@example.')).toBe('Введите корректный email');
	});

	it('should return empty string for valid email', () => {
		expect(validateEmail('test@example.com')).toBe('');
	});
})