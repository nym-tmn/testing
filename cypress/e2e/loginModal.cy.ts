describe('LoginModal', () => {
	it('should render LoginModal', () => {
		cy.visit('/iframe.html?path=/story/components-loginmodal--modal-opend');
		cy.get('[data-testid="login-modal"]').should('be.visible');
		cy.matchImageSnapshot('login-modal');
	});
});