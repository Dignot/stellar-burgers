import {
  burgerConstructorSliceReducer,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  upPositionOfIngredient,
  downPositionOfIngredient,
  resetConstructor,
  initialState as burgerInitial
} from '../burgerConstrSlice';

import { TIngredient } from '@utils-types';

describe('burgerConstructor slice reducer', () => {
  const sampleIngredient = (
    overrides: Partial<TIngredient> = {}
  ): TIngredient => ({
    _id: 'ing1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: '',
    ...overrides
  });

  it('should add bun to constructor (sets constructorBun)', () => {
    const bun = sampleIngredient({ _id: 'bun1', type: 'bun' });
    const action = addIngredientToConstructor(bun);
    const state = burgerConstructorSliceReducer(burgerInitial, action);
    expect(state.constructorBun).toBeTruthy();
    expect(state.constructorBun?._id).toEqual('bun1');
  });

  it('should add non-bun ingredient to constructor', () => {
    const ing = sampleIngredient({ _id: 'm1', type: 'main' });
    const action = addIngredientToConstructor(ing);
    const state = burgerConstructorSliceReducer(burgerInitial, action);
    expect(state.constructorIngredients.length).toBe(1);
    expect(state.constructorIngredients[0]._id).toBe('m1');
  });

  it('should remove ingredient by id', () => {
    const ingA = addIngredientToConstructor(sampleIngredient({ _id: 'a' }));
    const ingB = addIngredientToConstructor(sampleIngredient({ _id: 'b' }));
    let state = burgerConstructorSliceReducer(burgerInitial, ingA);
    state = burgerConstructorSliceReducer(state, ingB);
    expect(state.constructorIngredients.length).toBe(2);

    
    state = burgerConstructorSliceReducer(
      state,
      removeIngredientFromConstructor(ingB.payload.id)
    );
    expect(
      state.constructorIngredients.find((i) => i.id === ingB.payload.id)
    ).toBeUndefined();
    expect(state.constructorIngredients.length).toBe(1);
  });

  it('should move ingredient up and down', () => {
    const a = addIngredientToConstructor(sampleIngredient({ _id: '1' }));
    const b = addIngredientToConstructor(sampleIngredient({ _id: '2' }));
    const c = addIngredientToConstructor(sampleIngredient({ _id: '3' }));
    let state = burgerConstructorSliceReducer(burgerInitial, a);
    state = burgerConstructorSliceReducer(state, b);
    state = burgerConstructorSliceReducer(state, c);

    const idsBefore = state.constructorIngredients.map((i) => i.id);
    expect(idsBefore.length).toBe(3);

    
    state = burgerConstructorSliceReducer(
      state,
      upPositionOfIngredient(b.payload.id)
    );
    const idsAfterUp = state.constructorIngredients.map((i) => i.id);
    expect(idsAfterUp[0]).toBe(b.payload.id);

    
    state = burgerConstructorSliceReducer(
      state,
      downPositionOfIngredient(b.payload.id)
    );
    const idsAfterDown = state.constructorIngredients.map((i) => i.id);
    
    expect(idsAfterDown[0]).not.toBe(b.payload.id);
  });

  it('should reset constructor', () => {
    const action = addIngredientToConstructor(sampleIngredient({ _id: 'x' }));
    let state = burgerConstructorSliceReducer(burgerInitial, action);
    expect(state.constructorIngredients.length).toBe(1);
    state = burgerConstructorSliceReducer(state, resetConstructor());
    expect(state.constructorIngredients.length).toBe(0);
    expect(state.constructorBun).toBeNull();
  });
});
