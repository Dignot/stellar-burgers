// cypress/e2e/constructor/constructor.cy.tsx

/// <reference types="cypress" />

import { TEST_IDS } from './selectors';

describe('Главная страница, ингредиенты, конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'makeOrder'
    );

    cy.visit('/');
    cy.wait('@getIngredients', { timeout: 20000 });
  });

  describe('Модальное окно ингредиента', () => {
    it('Открытие модалки и проверка содержимого', () => {
      cy.get(`${TEST_IDS.allIngredientsDiv} li`, { timeout: 10000 })
        .first()
        .click();
      cy.get(TEST_IDS.modalDiv)
        .should('be.visible')
        .and('contain.text', 'Детали ингредиента');
    });

    it('Закрытие модалки крестиком', () => {
      cy.get(`${TEST_IDS.allIngredientsDiv} li`, { timeout: 10000 })
        .first()
        .click();
      cy.get(TEST_IDS.modalDiv).should('be.visible');
      cy.get(TEST_IDS.modalCloseBtn).click();
      cy.get(TEST_IDS.modalDiv).should('not.exist');
    });

    it('Закрытие модалки кликом на overlay', () => {
      cy.get(`${TEST_IDS.allIngredientsDiv} li`, { timeout: 10000 })
        .first()
        .click();
      cy.get(TEST_IDS.modalDiv).should('be.visible');
      cy.get(TEST_IDS.modalOverlay).click({ force: true });
      cy.get(TEST_IDS.modalDiv).should('not.exist');
    });
  });

  describe('order', () => {
    beforeEach(() => {
      cy.get(`${TEST_IDS.allIngredientsDiv} ul`)
        .should('exist')
        .as('ingredientsList');

      cy.get('@ingredientsList').eq(0).find('li').eq(1).as('second_bun'); // Булки
      cy.get('@ingredientsList').eq(1).find('li').eq(1).as('filling'); // Начинки
      cy.get('@ingredientsList').eq(2).find('li').eq(1).as('sauce'); // Соусы
    });

    it('Булка отобразилась в конструкторе', () => {
      cy.get('@second_bun').find(TEST_IDS.addBtn).click();
      cy.get('@second_bun')
        .find(TEST_IDS.ingredientName)
        .invoke('text')
        .then((bunName) => {
          cy.get(TEST_IDS.topBunInConstructor).should(
            'contain.text',
            bunName.trim()
          );
        });
    });

    it('Начинка отобразилась в конструкторе', () => {
      cy.get('@filling').find(TEST_IDS.addBtn).click();
      cy.get('@filling')
        .find(TEST_IDS.ingredientName)
        .invoke('text')
        .then((fillingName) => {
          cy.get(TEST_IDS.constructorIngredientsList).should(
            'contain.text',
            fillingName.trim()
          );
        });
    });

    it('Соус отобразился в конструкторе', () => {
      cy.get('@sauce').find(TEST_IDS.addBtn).click();
      cy.get('@sauce')
        .find(TEST_IDS.ingredientName)
        .invoke('text')
        .then((sauceName) => {
          cy.get(TEST_IDS.constructorIngredientsList).should(
            'contain.text',
            sauceName.trim()
          );
        });
    });
  });

  describe('Оформление заказа', () => {
    it('Собираем бургер и оформляем заказ с одним ингредиентом', () => {
      cy.intercept('POST', '**/auth/login', { fixture: 'login' }).as(
        'postLogin'
      );
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('order');

      window.localStorage.setItem(
        'refreshToken',
        JSON.stringify('test-refreshToken')
      );
      cy.setCookie('accessToken', 'test-accessToken');

      cy.get(`${TEST_IDS.allIngredientsDiv} li ${TEST_IDS.addBtn}`, {
        timeout: 10000
      })
        .first()
        .click();
      cy.get(TEST_IDS.makeOrderBtn, { timeout: 10000 }).click();

      cy.wait('@order').its('response.statusCode').should('eq', 200);
      cy.get(TEST_IDS.modalDiv, { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', '777777');

      cy.get(TEST_IDS.modalCloseBtn).click();
      cy.get(TEST_IDS.modalDiv).should('not.exist');

      cy.get(TEST_IDS.topBunInConstructor).should('not.exist');
      cy.contains('Выберите начинку').should('be.visible');

      cy.clearLocalStorage();
      cy.clearCookies();
    });
  });
});
