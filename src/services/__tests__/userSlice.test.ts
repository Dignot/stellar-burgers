import {
  userSliceReducer,
  initialState,
  makeLoginUserSuccess,
  setLastOrder,
  newUserOrder
} from '../slices/userSlice';

describe('user slice', () => {
  it('handles simple reducers and newUserOrder fulfilled', () => {
    let state = userSliceReducer(initialState, {
      type: makeLoginUserSuccess.type,
      payload: true
    });
    expect(state.success).toBe(true);

    const order = { id: 'o1' } as any;
    state = userSliceReducer(state, {
      type: setLastOrder.type,
      payload: order
    });
    expect(state.lastOrder).toEqual(order);

    // simulate newUserOrder.fulfilled
    const fulfilled = userSliceReducer(state, {
      type: newUserOrder.fulfilled.type,
      payload: { order }
    });
    expect(fulfilled.orderRequestData).toBe(false);
    expect(fulfilled.lastOrder).toEqual(order);
    expect(fulfilled.orders).toContain(order);
  });
});
