/// <reference types="cypress" />
import { mount } from 'cypress/svelte';

import Column from './column.svelte';

const header = 'Column';

describe('when using a column', () => {
	it('Should show column header', () => {
		mount(Column, { props: { name: header, handleCreateTask: () => {} } });
		cy.get('[cy-test=column-header]').should('contains.text', header);
	});

	describe('when using the add button', () => {
		it('Should show add button', () => {
			mount(Column, { props: { name: header, handleCreateTask: () => {} } });

			cy.get('[cy-test=add-button]').should('exist');
		});

		it('Should should call handleCreateTask', () => {
			const stub = cy.stub();

			mount(Column, { props: { name: header, handleCreateTask: stub } });

			cy.get('[cy-test=add-button]')
				.realClick()
				.then(() => expect(stub).to.be.called);
		});
	});

	describe('when task cards are present', () => {
		it('should show a few cards', () => {
			mount(Column, {
				props: {
					name: header,
					handleCreateTask: () => {},
					cards: [
						{
							_id: '3cb834af-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test',
							description: 'test',
							assignee: 'test',
							taskType: 'user story',
							user_id: '104383507739409303538',
							column: 'Backlog'
						},
						{
							_id: '3cb834ag-b714-40be-81b0-93c1c73bca33',
							taskName: 'Test 2',
							description: 'test 2',
							assignee: 'test 2',
							taskType: 'user story',
							user_id: '104383507739409303538',
							column: 'Backlog'
						}
					]
				}
			});

			cy.get('[data-cy=task-card]').should('have.length', 2);
		});
	});
});
