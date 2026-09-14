import{describe,expect,it}from'vitest';
import{demoTable12Events,initialState,makeEvent,replay,reduceEvent}from'../src/index';

describe('Table 12 connected restaurant simulation',()=>{
 it('creates one order that reaches KDS and consumes theoretical stock',()=>{
  const state=replay(demoTable12Events());
  expect(state.table.id).toBe('T12');
  expect(state.orders['order-table12'].lines).toHaveLength(2);
  expect(Object.keys(state.kitchen)).toHaveLength(2);
  expect(state.stock.theoretical.paneer).toBe(13200-440);
  expect(state.stock.theoretical.chicken).toBe(28700-240);
 });
 it('uses the same order to update payment and owner contribution',()=>{
  let state=replay(demoTable12Events());
  for(const ticket of Object.keys(state.kitchen)){
   state=reduceEvent(state,makeEvent('KITCHEN_TICKET_STARTED',{ticketId:ticket},'kitchen','chef-1'));
   state=reduceEvent(state,makeEvent('KITCHEN_ITEM_READY',{ticketId:ticket},'kitchen','chef-1'));
  }
  state=reduceEvent(state,makeEvent('ORDER_SERVED',{orderId:'order-table12'},'waiter','waiter-rahul'));
  state=reduceEvent(state,makeEvent('BILL_CREATED',{orderId:'order-table12'},'cashier','cashier-1'));
  state=reduceEvent(state,makeEvent('PAYMENT_CAPTURED',{orderId:'order-table12',method:'upi'},'cashier','cashier-1'));
  expect(state.money.sales).toBe(1147);
  expect(state.money.contribution).toBeGreaterThan(0);
  expect(state.guest.visits).toBe(1);
  expect(state.table.status).toBe('paid');
 });
 it('turns a physical count gap into rupee-ranked leakage',()=>{
  let state=replay(demoTable12Events());
  state=reduceEvent(state,makeEvent('STOCK_COUNTED',{ingredientId:'paneer',qty:12000},'stock','store-1'));
  const paneerLeak=state.leaks.find(x=>x.kind==='ingredient_variance'&&x.detail.includes('Paneer'));
  expect(paneerLeak).toBeTruthy();
  expect(paneerLeak!.amount).toBeGreaterThan(0);
 });
});
