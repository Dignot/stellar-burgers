import {
  burgerConstructorSliceReducer,
  initialState,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  upPositionOfIngredient,
  downPositionOfIngredient,
  resetConstructor
} from '../slices/burgerConstrSlice';

describe('burgerConstructor slice', () => {
  it('adds bun and ingredients, removes and reorders them, resets', () => {
    const bunPayload = {
      id: 'bun-1',
      _id: 'b1',
      name: 'Bun',
      type: 'bun'
    } as any;
    const ingredientA = { id: 'a', _id: 'i1', name: 'A', type: 'main' } as any;
    const ingredientB = { id: 'b', _id: 'i2', name: 'B', type: 'main' } as any;

    // add bun
    let state = burgerConstructorSliceReducer(initialState, {
      type: addIngredientToConstructor.type,
      payload: bunPayload
    });
    expect(state.constructorBun).toEqual(bunPayload);

    // add two ingredients
    state = burgerConstructorSliceReducer(state, {
      type: addIngredientToConstructor.type,
      payload: ingredientA
    });
    state = burgerConstructorSliceReducer(state, {
      type: addIngredientToConstructor.type,
      payload: ingredientB
    });
    expect(state.constructorIngredients.map((i) => i.id)).toEqual(['a', 'b']);

    // move up (b -> a)
    state = burgerConstructorSliceReducer(state, {
      type: upPositionOfIngredient.type,
      payload: 'b'
    });
    expect(state.constructorIngredients.map((i) => i.id)).toEqual(['b', 'a']);

    // move down (b -> a)
    state = burgerConstructorSliceReducer(state, {
      type: downPositionOfIngredient.type,
      payload: 'b'
    });
    expect(state.constructorIngredients.map((i) => i.id)).toEqual(['a', 'b']);

    // remove ingredient
    state = burgerConstructorSliceReducer(state, {
      type: removeIngredientFromConstructor.type,
      payload: 'a'
    });
    expect(state.constructorIngredients.map((i) => i.id)).toEqual(['b']);

    // reset
    state = burgerConstructorSliceReducer(state, {
      type: resetConstructor.type
    });
    expect(state.constructorBun).toBeNull();
    expect(state.constructorIngredients).toHaveLength(0);
  });
});
