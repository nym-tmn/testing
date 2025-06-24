describe('app', () => {
	it('should be authenticated', () => {
		cy.visit('/iframe.html?path=/story/components-app--authenticated');
		cy.get('[data-testid="app"]').should('be.visible');
		cy.matchImageSnapshot('authenticated');
	});

	it('should be unauthenticated', () => {
		cy.visit('/iframe.html?path=/story/components-app--unauthenticated');
		cy.get('[data-testid="app"]').should('be.visible');
		cy.matchImageSnapshot('unauthenticated');
	});
});