describe('Authentication', () => {
	it('Log in', () => {
		cy.visit('/')
		cy.get('button').should('have.text', 'Авторизоваться')
		cy.contains('Авторизоваться').click()
		cy.get('[data-testid="login-modal"]').should('be.visible')
		cy.get('[data-testid="email-input"]').type('test@mail.ru')
		cy.get('[data-testid="password-input"]').type('12345678')
		cy.contains('Войти').click().should('have.text', 'Processing...').should('be.disabled')
		cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('getUsers')
		cy.wait(3000)
		cy.wait('@getUsers')
		cy.get('[data-testid="login-modal"]').should('not.exist')
		cy.get('[data-testid="users-list"]').should('be.visible')
		cy.get('[data-testid="users-list"] li').should('have.length.gt', 0);
		cy.get('p').should('have.text', 'Вы авторизованы!!!')
		cy.get('button').should('have.text', 'Выйти').click()
		cy.get('button').should('have.text', 'Авторизоваться')
		cy.get('[data-testid="users-list"]').should('not.exist');
		cy.contains('Вы авторизованы!!!').should('not.exist');
	})
})