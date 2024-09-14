import Board from './board.svelte';

describe('when loading buddy board', () => {

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.mount(Board);
  })

  it('Should show 5 columns on the board', () => {
    cy.get('[cy-test=column-header]').should('have.length', 4);
  });

  it('Should have Backlog column', () => {
    cy.get('[cy-test=column-header]').should('contains.text', 'Backlog');
  });

  it('Should have To Do column', () => {
    cy.get('[cy-test=column-header]').should('contains.text', 'To Do');
  });

  it('Should have In Progress column', () => {
    cy.get('[cy-test=column-header]').should('contains.text', 'In Progress');
  });

  it('Should have Done column', () => {
    cy.get('[cy-test=column-header]').should('contains.text', 'Done');
  });

  it('Should show add button', () => {
    cy.get('[cy-test=add-button]').should('have.length', 4)
  });
});
