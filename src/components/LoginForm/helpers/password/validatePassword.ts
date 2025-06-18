export const validatePassword = (password: string) => {
	if ((!password)) return 'Пароль обязателен';
	if (password.length < 8) return 'Пароль должен быть не короче 8 символов';
	const passwordRegex = /^\d+$/;
	if (!passwordRegex.test(password)) return 'Пароль может состоять только из цифр';
	return ''
}