import { ingredientsSliceReducer, initialState } from '../ingredientsSlice';
import { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredients slice reducer', () => {
  it('sets loading true on request (pending)', () => {
    const state = ingredientsSliceReducer(initialState, {
      type: getIngredients.pending.type
    });
    expect(state.loadingData).toBe(true);
    expect(state.error).toBeNull();
  });

  it('writes ingredients and sets loading false on success (fulfilled)', () => {
    const payload: TIngredient[] = [
      {
        _id: 'i1',
        name: 'Ing 1',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const state = ingredientsSliceReducer(initialState, {
      type: getIngredients.fulfilled.type,
      payload
    });

    expect(state.loadingData).toBe(false);
    expect(state.ingredients).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it('writes error and sets loading false on failed (rejected)', () => {
    const state = ingredientsSliceReducer(initialState, {
      type: getIngredients.rejected.type,
      error: { message: 'Network error' }
    });
    expect(state.loadingData).toBe(false);
    expect(state.error).toEqual('Network error');
  });
});
