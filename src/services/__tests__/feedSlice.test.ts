import {
  feedsSliceReducer,
  initialState,
  getAllFeeds,
  getOrderByNumber,
  getOrdersData,
  getIsLoading,
  getTotalOrders,
  getTodayOrders
} from '../slices/feedSlice';

describe('feeds slice', () => {
  it('handles feeds async actions and selectors', () => {
    const prev = { ...initialState, loadingData: false, error: 'old' };

    const pending = feedsSliceReducer(prev, { type: getAllFeeds.pending.type });
    expect(pending.loadingData).toBe(true);
    expect(pending.error).toBeNull();

    const rejected = feedsSliceReducer(prev, {
      type: getAllFeeds.rejected.type,
      error: { message: 'err' }
    });
    expect(rejected.loadingData).toBe(false);
    expect(rejected.error).toBe('err');

    const payload = { orders: [{ id: 1 } as any], total: 5, totalToday: 2 };
    const fulfilled = feedsSliceReducer(prev, {
      type: getAllFeeds.fulfilled.type,
      payload
    });
    expect(fulfilled.loadingData).toBe(false);
    expect(fulfilled.orders).toEqual(payload.orders);
    expect(fulfilled.total).toBe(5);

    // selectors
    const rootState: any = { feeds: fulfilled };
    expect(getOrdersData(rootState)).toEqual(payload.orders);
    expect(getIsLoading(rootState)).toBe(false);
    expect(getTotalOrders(rootState)).toBe(5);
    expect(getTodayOrders(rootState)).toBe(2);
  });
});
