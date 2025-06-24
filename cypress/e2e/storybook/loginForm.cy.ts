describe('LoginForm', () => {
	it('should render LoginForm', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--default');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form');
	});

	it('should render LoginForm with filled inputs', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--with-filled-inputs');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form-with-filled-inputs');
	});
	
	it('should render LoginForm with general error', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--with-general-error');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form-with-general-error');
	});

	it('should render LoginForm with validation errors', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--with-validation-error');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form-with-validation-errors');
	});

	it('should render LoginForm with loading state', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--loading-state');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form-with-loading-state');
	});

	it('should render LoginForm into modal window', () => {
		cy.visit('/iframe.html?path=/story/components-loginform--in-modal');
		cy.get('[data-testid="form"]').should('be.visible');
		cy.matchImageSnapshot('login-form-into-modal');
	});
});