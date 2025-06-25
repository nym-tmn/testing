describe('app', () => {
	it('should be authenticated', () => {
		cy.visit('/iframe.html?path=/story/components-app--authenticated');
		cy.get('[data-testid="app"]').should('be.visible');
		cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users').as('getUserData');
		cy.wait('@getUserData');
		cy.matchImageSnapshot('authenticated');
	});

	it('should be unauthenticated', () => {
		cy.visit('/iframe.html?path=/story/components-app--unauthenticated');
		cy.get('[data-testid="app"]').should('be.visible');
		cy.matchImageSnapshot('unauthenticated');
	});
});