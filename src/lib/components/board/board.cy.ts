import Board from './board.svelte';

describe('when loading buddy board', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	describe('when loading an empty board', () => {
		beforeEach(() => {
			cy.mount(Board);
		});

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
			cy.get('[cy-test=add-button]').should('have.length', 4);
		});
	});

	describe('when task cards are present', () => {
		it.only('should show a few cards', () => {
			cy.mount(Board, {
				props: {
					cards: [
						{
							_id: '3cb834af-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test',
							description: 'test',
							assignee: 'test',
							taskType: 'user story',
							user_id: '104383507739409303538',
							order: 0,
							column: 'Backlog'
						},
						{
							_id: '3cb834ag-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test 2',
							description: 'test 2',
							assignee: 'test 2',
							taskType: 'user story',
							user_id: '104383507739409303538',
							order: 0,
							column: 'Done'
						},
						{
							_id: '3cb834ag-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test 2',
							description: 'test 2',
							assignee: 'test 2',
							taskType: 'user story',
							user_id: '104383507739409303538',
							order: 0,
							column: 'In Progress'
						},
						{
							_id: '3cb834ag-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test 2',
							description: 'test 2',
							assignee: 'test 2',
							taskType: 'user story',
							user_id: '104383507739409303538',
							order: 0,
							column: 'To Do'
						}
					]
				}
			});

			cy.get('[data-cy=task-card]').should('have.length', 4);
		});
	});
});
