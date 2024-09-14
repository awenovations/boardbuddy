import Signup from './signup.svelte';

describe('Signup Form', () => {
  beforeEach(() => {
    cy.mount(Signup);
  });

  it('Should show google button', () => {
    cy.get('[data-cy=google-button]').should('contains.text', 'Continue with Google');
  });

  it('Should show apple button', () => {
    cy.get('[data-cy=apple-button]').should('contains.text', 'Continue with Apple');
  });

  it('Should show divider', () => {
    cy.get('[data-cy=divider]').should('contains.text', 'OR');
  });

  it('Should show a name input', () => {
    cy.get('[data-cy=name]');
  });

  it('Should show an email input', () => {
    cy.get('[data-cy=email]');
  });

  it('Should show a password input', () => {
    cy.get('[data-cy=password]');
  });

  it('Should show a sign up buton', () => {
    cy.get('[data-cy=sign-up]');
  });

  it('Should show a sign in link', () => {
    cy.get('[data-cy=sign-in]').should('contains.text', 'Already have an account?');
    cy.get('[data-cy=sign-in-link]').should('contains.text', 'Sign in');
  });
});
