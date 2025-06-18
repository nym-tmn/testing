import { describe, expect, it } from "vitest";
import { validatePassword } from "./validatePassword";

describe('Validating password', () => {
	it('should return error for empty password', () => {
		expect(validatePassword('')).toBe('Пароль обязателен');
	});

	it('should return error if password.length < 8', () => {
		expect(validatePassword('1234567')).toBe('Пароль должен быть не короче 8 символов');
	});

	it('should return error if password is not number', () => {
		expect(validatePassword('qwteuwis')).toBe('Пароль может состоять только из цифр');
		expect(validatePassword('!@#$%^&*')).toBe('Пароль может состоять только из цифр');
	});

	it('should return empty string for valid password', () => {
		expect(validatePassword('12345678')).toBe('');
	});
})