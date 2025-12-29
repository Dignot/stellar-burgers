import { SELECTORS } from '../support/selectors';

describe('Конструктор бургеров — интеграционные тесты', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Добавляет булку и начинку в конструктор', () => {
    cy.fixture('ingredients.json').then((f: any) => {
      const bun = f.data.find((i: any) => i.type === 'bun');
      const filling = f.data.find(
        (i: any) => i.type === 'main' || i.type === 'sauce'
      );

      cy.contains(bun.name).as('bunItem');
      cy.contains(filling.name).as('fillingItem');

      const dataTransfer: any = { data: {} };

      cy.get('@bunItem').trigger('dragstart', { dataTransfer });
      cy.get(SELECTORS.CONSTRUCTOR_DROP).trigger('drop', { dataTransfer });

      cy.get('@fillingItem').trigger('dragstart', { dataTransfer });
      cy.get(SELECTORS.CONSTRUCTOR_DROP).trigger('drop', { dataTransfer });

      cy.get(SELECTORS.CONSTRUCTOR_LIST).should('contain', bun.name);
      cy.get(SELECTORS.CONSTRUCTOR_LIST).should('contain', filling.name);
    });
  });

  it('Открывает и закрывает модальное окно ингредиента (крестик и оверлей)', () => {
    cy.get(SELECTORS.INGREDIENT)
      .first()
      .invoke('text')
      .then((name) => {
        cy.get(SELECTORS.INGREDIENT).first().click();
        cy.get(SELECTORS.MODAL).should('be.visible');

        cy.get(SELECTORS.MODAL).should('contain', name.trim());
      });

    cy.get('[data-cy=modal-close]').click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.INGREDIENT).first().click();
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get('.modal-overlay').click('topLeft');
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('Создание заказа — авторизованный пользователь и проверка модалки с номером', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.fixture('ingredients.json').then((f: any) => {
      const bun = f.data.find((i: any) => i.type === 'bun');
      const filling = f.data.find(
        (i: any) => i.type === 'main' || i.type === 'sauce'
      );
      const dataTransfer: any = { data: {} };

      cy.contains(bun.name).trigger('dragstart', { dataTransfer });
      cy.get(SELECTORS.CONSTRUCTOR_DROP).trigger('drop', { dataTransfer });

      cy.contains(filling.name).trigger('dragstart', { dataTransfer });
      cy.get(SELECTORS.CONSTRUCTOR_DROP).trigger('drop', { dataTransfer });

      cy.contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get('[data-cy=order-modal]')
        .should('be.visible')
        .and('contain', '12345');

      cy.get('[data-cy=order-modal-close]').click();
      cy.get('[data-cy=order-modal]').should('not.exist');

      cy.get(SELECTORS.CONSTRUCTOR_LIST).children().should('have.length', 0);

      cy.clearLocalStorage();
      cy.clearCookies();
    });
  });
});
