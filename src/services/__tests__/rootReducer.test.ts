import { rootReducer } from '../store';
import { initialState as ingInit } from '../slices/ingredientsSlice';
import { initialState as burgerInit } from '../slices/burgerConstrSlice';

describe('rootReducer / initial state', () => {
  it('returns initial state when called with undefined and unknown action', () => {
    const state = rootReducer(undefined as any, { type: 'UNKNOWN_ACTION' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructorItems');
    expect(state.ingredients).toEqual(ingInit);
    expect(state.constructorItems).toEqual(burgerInit);
  });
});
