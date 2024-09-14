import TaskForm from './task-form.svelte';

describe('Task Form', () => {
	describe('When loading', () => {
		beforeEach(() => {
			cy.mount(TaskForm);
		});

		it('Should show a task name field', () => {
			cy.get('[data-cy=task-name]').should('exist');
		});

		it('Should show a description field', () => {
			cy.get('[data-cy=description]').should('exist');
		});

		it('Should show a assignee field', () => {
			cy.get('[data-cy=assignee]').should('exist');
		});

		it('Should show a task type field', () => {
			cy.get('[data-cy=task-type]').should('exist');
		});

		it('Should show a cancel button', () => {
			cy.get('[data-cy=cancel-button]').should('exist');
		});

		it('Should show a save button', () => {
			cy.get('[data-cy=save-button]').should('exist');
		});
	});

	describe('When canceling', () => {
		it('Should call close form', () => {
			const stub = cy.stub();

			cy.mount(TaskForm, { props: { handleClose: stub } });

			cy.get('[data-cy=cancel-button]')
				.realClick()
				.then(() => expect(stub).to.be.called);
		});
	});

	describe('When submitting', () => {
		const fillOutForm = () => {
			cy.get('input[data-cy=task-name]').type('Test task name');
			cy.get('textarea[data-cy=description]').type('Test description');
			cy.get('input[data-cy=assignee]').type('Test assignee');
			cy.get('input[data-cy=task-type]').type('Task type');
		};

		const setup = () => {
			const stub = cy.stub();

			cy.mount(TaskForm, { props: { handleSubmit: stub } });

			fillOutForm();

			return stub;
		};

		it('Should call send form', () => {
			const stub = setup();

			cy.get('[data-cy=save-button]')
				.realClick()
				.then(() => expect(stub).to.be.called);
		});

		describe('When submitting a valid submission', () => {
			const setup = (time: number = 0) => {
				const closeStub = cy.stub();

				const submitting = () => {
					const promise = new Promise((resolve) => {
						setTimeout(() => {
							resolve('done');
						}, time);
					});

					return promise;
				};

				cy.mount(TaskForm, { props: { handleClose: closeStub, handleSubmit: submitting } });

				fillOutForm();

				return { closeStub };
			};

			it('Should show a loading symbol until done', () => {
				setup(300);

				cy.get('[data-cy=save-button]').realClick();

				cy.get('.aura-progress-ring');
			});

			it('Should close when successfully submitted', () => {
				const { closeStub } = setup();

				cy.get('[data-cy=save-button]')
					.realClick()
					.then(() => expect(closeStub).to.be.called);
			});
		});

		describe('When submitting an invalid submission', () => {
			const setup = () => {
				cy.mount(TaskForm, { props: { handleClose: () => {}, handleSubmit: () => {} } });
			};

			beforeEach(() => {
				setup();
			});

			it('When task name is empty', () => {
				cy.get('[data-cy=save-button]')
					.realClick()
					.then(() => {
						cy.get('[data-cy=task-name-errors]').contains('Task name is required');
					});
			});

			it('When task description is empty', () => {
				cy.get('[data-cy=save-button]')
					.realClick()
					.then(() => {
						cy.get('[data-cy=task-description-errors]').contains('Task description is required');
					});
			});

			it('When task assignee is empty', () => {
				cy.get('[data-cy=save-button]')
					.realClick()
					.then(() => {
						cy.get('[data-cy=assignee-errors]').contains('Assignee is required');
					});
			});

			it('When task type is empty', () => {
				cy.get('[data-cy=save-button]')
					.realClick()
					.then(() => {
						cy.get('[data-cy=task-type-errors]').contains('Task type is required');
					});
			});
		});
	});
});