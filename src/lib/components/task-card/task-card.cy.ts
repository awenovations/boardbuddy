import TaskCard from './task-card.svelte';

describe('Task Card', () => {
	beforeEach(() => {
		cy.viewport(350, 250);
	});

	describe('when viewing a card', () => {
		describe('when inputs are normal', () => {
			const title = 'Example Task';
			const body =
				'An example task description that is longer than the amount that should be shown in this card.';
			const assignee = 'Joe';
			const id = 'test-id';

			describe('with defaults', () => {
				beforeEach(() => {
					cy.mount(TaskCard, { props: { title, body, assignee, id } });
				});

				describe('when hovering over a card', () => {
					it('should show action buttons when card is hovered', () => {
						cy.get('[data-cy=task-card]').realHover();
						cy.get('[data-cy=task-card-actions]').should('be.visible');
						cy.get('[data-cy=task-card]').realMouseMove(-10, -10);
					});

					it('should show action buttons when actions is hovered', () => {
						cy.get('[data-cy=task-card]').realHover();
						cy.get('[data-cy=task-card-actions]').realHover();
						cy.wait(300);
						cy.get('[data-cy=task-card-actions]').should('be.visible');
					});
				});

        // TODO: Figure out how to test the confirm delete
				describe.skip('when deleting', () => {
					it('should show action buttons when actions is hovered', () => {
						cy.get('[data-cy=task-card]').realHover();
						cy.get('[data-cy=task-card-actions]').realHover();
						cy.wait(300);
						cy.get('[data-cy=confirm-task-delete]').should('be.visible');
					});
				});

				describe('when dragging a card', () => {
					it.skip('should change the cursor to grab hand on hover', () => {
						cy.get('[data-cy=task-card]')
							.realHover()
							.then(($el) => {
								cy.wrap($el.css('cursor')).should('equal', 'grab');
							});
					});

					it.skip('should change the cursor to grabbing hand on click', () => {
						cy.get('[data-cy=task-card]')
							.realMouseDown()
							.then(($el) => {
								cy.wrap($el.css('cursor')).should('equal', 'grabbing');
							});
					});
				});

				it('should show the card', () => {
					cy.get('[data-cy=task-card]').should('exist');
				});

				it('should show the title', () => {
					cy.get('[data-cy=task-card-title]').should('contain', title);
				});

				it('should an example text to a line limit of 3', () => {
					cy.get('[data-cy=task-card-body]')
						.should('contain', body)
						.should('have.css', 'line-clamp', '3')
						.should('have.css', '-webkit-line-clamp', '3')
						.should('have.css', '-webkit-box-orient', 'vertical')
						.should('have.css', 'overflow', 'hidden');
				});

				it('should show an assignee', () => {
					cy.get('[data-cy=task-card-assignee]').should('contain', `Assigned to ${assignee}`);
				});

				it('should show the default task type', () => {
					cy.get('[data-cy=task-card-type]').should('contain', 'user story');
				});

				it('should show the user icon', () => {
					cy.get('[data-cy=task-card-type] [style*=user-story]').should('exist');
				});
			});

			describe('with non-default values', () => {
				it('should show a custom task type', () => {
					const type = 'non-default';
					cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
					cy.get('[data-cy=task-card-type]').should('contain', type);
				});

				it('should default to a plan icon', () => {
					const type = 'anything';
					cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
					cy.get('[data-cy=task-card-type] [style*=plan]').should('exist');
				});

				it('should show a user story icon', () => {
					const type = 'user story';
					cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
					cy.get('[data-cy=task-card-type] [style*=user-story]').should('exist');
				});

				it('should show a bug fix icon', () => {
					const type = 'bug fix';
					cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
					cy.get('[data-cy=task-card-type] [style*=bug]').should('exist');
				});

				it('should show a plan icon', () => {
					const type = 'planning';
					cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
					cy.get('[data-cy=task-card-type] [style*=plan]').should('exist');
				});
			});
		});

		describe('when inputs are out of range', () => {
			const title = 'Example Task That Is Really Long';
			const body =
				'An example task description that is longer than the amount that should be shown in this card.';
			const assignee = "Joe's name is way too long";
			const type = 'This is a really long type that should be truncated';
			const id = 'test-id';

			beforeEach(() => {
				cy.mount(TaskCard, { props: { title, body, assignee, type, id } });
			});

			it('should show an ellipsis on a long title', () => {
				cy.get('[data-cy=task-card-title]')
					.should('have.css', 'text-overflow', 'ellipsis')
					.should('have.css', 'overflow', 'hidden')
					.should('have.css', 'white-space', 'nowrap');
			});

			it('should show an ellipsis on a long assignee', () => {
				cy.get('[data-cy=task-card-assignee]')
					.should('have.css', 'text-overflow', 'ellipsis')
					.should('have.css', 'overflow', 'hidden')
					.should('have.css', 'white-space', 'nowrap');
			});

			it('should show an ellipsis on a long type', () => {
				cy.get('[data-cy=task-card-type] .card-type-text')
					.should('have.css', 'text-overflow', 'ellipsis')
					.should('have.css', 'overflow', 'hidden')
					.should('have.css', 'white-space', 'nowrap');
			});
		});
	});
});
