export const validateEmail = (email: string) => {
	if ((!email)) return 'Email обязателен';
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) return 'Введите корректный email';
	return ''
}