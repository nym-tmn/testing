describe('Button', () => {
	it('should render Button with children', () => {
		cy.visit('/iframe.html?path=/story/components-button--default');
		cy.get('[data-testid="click-btn"]').should('be.visible');
		cy.matchImageSnapshot('button-defualt');
	});

	it('should render Button with disabled state', () => {
		cy.visit('/iframe.html?path=/story/components-button--disabled');
		cy.get('[data-testid="click-btn"]').should('be.visible');
		cy.matchImageSnapshot('button-with-disabled-state');
	});
});