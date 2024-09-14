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
});
