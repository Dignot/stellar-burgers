import {
  ingredientsSliceReducer,
  initialState,
  getIngredients
} from '../slices/ingredientsSlice';

describe('ingredients slice', () => {
  it('handles pending, rejected and fulfilled states', () => {
    const prev = { ...initialState, loadingData: false, error: 'old' };

    const pending = ingredientsSliceReducer(prev, {
      type: getIngredients.pending.type
    });
    expect(pending.loadingData).toBe(true);
    expect(pending.error).toBeNull();

    const rejected = ingredientsSliceReducer(prev, {
      type: getIngredients.rejected.type,
      error: { message: 'failed' }
    });
    expect(rejected.loadingData).toBe(false);
    expect(rejected.error).toBe('failed');

    const payload = [{ _id: '1', name: 'I' } as any];
    const fulfilled = ingredientsSliceReducer(prev, {
      type: getIngredients.fulfilled.type,
      payload
    });
    expect(fulfilled.loadingData).toBe(false);
    expect(fulfilled.ingredients).toEqual(payload);
    expect(fulfilled.error).toBeNull();
  });
});
