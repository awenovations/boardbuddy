import Signin from './signin.svelte';

describe('Signin Form', () => {
  beforeEach(() => {
    cy.mount(Signin);
  });

  it('Should show google button', () => {
    cy.get('[data-cy=google-button]').should('contains.text', 'Sign in with Google');
  });

  it('Should show apple button', () => {
    cy.get('[data-cy=apple-button]').should('contains.text', 'Sign in with Apple');
  });

  it('Should show divider', () => {
    cy.get('[data-cy=divider]').should('contains.text', 'OR');
  });

  it('Should show divider', () => {
    cy.get('[data-cy=divider]').should('contains.text', 'OR');
  });

  it('Should show an email input', () => {
    cy.get('[data-cy=email]');
  });

  it('Should show a password input', () => {
    cy.get('[data-cy=password]');
  });

  it('Should show a forgot password link', () => {
    cy.get('[data-cy=forgot-password]').should('contains.text', 'Forgot Password?');
    cy.get('[data-cy=forgot-password-link]').should('contains.text', 'Reset now');
  });

  it('Should show a sign in buton', () => {
    cy.get('[data-cy=sign-in]');
  });

  it('Should show a sign up link', () => {
    cy.get('[data-cy=sign-up]').should('contains.text', 'Don\'t have an account?');
    cy.get('[data-cy=sign-up-link]').should('contains.text', 'Sign up');
  });
});
