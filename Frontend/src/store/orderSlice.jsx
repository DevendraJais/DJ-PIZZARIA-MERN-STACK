import { createSlice } from '@reduxjs/toolkit';


const orderSlice = createSlice({
name: 'order',
initialState: { lastOrder: null, status: 'idle' },
reducers: {
placeOrder: (state, action) => {
state.lastOrder = action.payload;
state.status = 'placed';
},
setStatus: (state, action) => { state.status = action.payload; },
clearOrder: (state) => { state.lastOrder = null; state.status = 'idle'; },
},
});


export const { placeOrder, setStatus, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;