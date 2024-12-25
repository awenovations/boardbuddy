import { mount } from 'cypress/svelte';

import Column from './column.svelte';

const header = 'Column';

describe('when using a column', () => {
	it('Should show column header', () => {
		mount(Column, { props: { name: header, handleCreateTask: () => {} } });
		cy.get('[data-cy=column-header]').should('contains.text', header);
	});

	describe('when using the add button', () => {
		it('Should show add button', () => {
			mount(Column, { props: { name: header, handleCreateTask: () => {} } });

			cy.get('[data-cy=add-button]').should('exist');
		});

		it('Should should call handleCreateTask', () => {
			const stub = cy.stub();

			mount(Column, { props: { name: header, handleCreateTask: stub } });

			cy.get('[data-cy=add-button]')
				.realClick()
				.then(() => expect(stub).to.be.called);
		});
	});

	describe('when task cards are present', () => {
		const cardList = [
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
				_id: '4cb834ag-b714-40be-81b0-93c1c73bca33',
				taskName: 'Test 2',
				description: 'test 2',
				assignee: 'test 2',
				taskType: 'user story',
				user_id: '104383507739409303538',
				order: 1,
				column: 'Backlog'
			},
			{
				_id: '2cb834ag-b714-40be-81b0-93c1c73bca33',
				taskName: 'Test 3',
				description: 'test 3',
				assignee: 'test 3',
				taskType: 'user story',
				user_id: '104383507739409303538',
				order: 2,
				column: 'Backlog'
			}
		];

		beforeEach(() => {
			mount(Column, {
				props: {
					name: header,
					handleCreateTask: () => {},
					cards: cardList
				}
			});
		});

		it('should show a few cards', () => {
			cy.get('[data-cy=task-card]').should('have.length', 3);
		});

		describe('when dragging cards', () => {
			it('should highlight column', () => {
				cy.get('[data-cy=task-card]').realMouseDown().realMouseMove(50, 0, { position: 'center' });
				cy.get('.droppable').should('exist');
				cy.get('[data-cy=task-card]').realMouseUp();
			});

			it('should contain dropzone card', () => {
				const card = cy.get('[data-cy=task-card]');

				card
					.realMouseDown()
					.realMouseMove(10, 0, { position: 'center' })
					.realMouseMove(5, -100, { position: 'center' });

				cy.get('.dropzone').should('be.visible');
			});

			it('should show the dropzone in the middle', () => {
				const card = cy.get(`[data-id=${cardList[1]._id}]`);

				card
					.realMouseDown()
					.realMouseMove(10, 0, { position: 'center' })
					.realMouseMove(5, 100, { position: 'center' });

				cy.get('.dropzone[data-index=2]').should('be.visible');
			});

			it('should show the dropzone on the top', () => {
				const card = cy.get(`[data-id=${cardList[1]._id}]`);
				card
					.realMouseDown()
					.realMouseMove(10, -110, { position: 'center' })
					.realMouseMove(5, -200, { position: 'center' });

				cy.get('.dropzone[data-index=0]').should('be.visible');
			});

			it('should show the dropzone on the bottom', () => {
				const card = cy.get(`[data-id=${cardList[2]._id}]`);

				card
					.realMouseDown()
					.realMouseMove(10, 100, { position: 'center' })
					.realMouseMove(10, 120, { position: 'center' });

				cy.get('.dropzone:last-of-type').should('be.visible');
			});

			it('should show the dropzone on the bottom', () => {
				const card = cy.get(`[data-id=${cardList[2]._id}]`);

				card
					.realMouseDown()
					.realMouseMove(10, 120, { position: 'center' })
					.realMouseMove(10, 120, { position: 'center' });

				cy.get('.dropzone').should('be.visible');

				card.realMouseMove(100, 0, { position: 'center' });

				cy.get('.dropzone').should('not.be.visible');
			});
		});
	});
});
