const now=()=>new Date().toISOString();
const clone=v=>typeof globalThis.structuredClone==='function'?globalThis.structuredClone(v):JSON.parse(JSON.stringify(v));

export const menu={
 paneer_tikka:{id:'paneer_tikka',name:'Paneer Tikka',price:349,station:'tandoor',recipe:{paneer:180,capsicum:60,onion:40,spices:15}},
 butter_chicken:{id:'butter_chicken',name:'Butter Chicken',price:449,station:'curry',recipe:{chicken:220,cream:60,butter:25,tomato:100,spices:18}},
 garlic_naan:{id:'garlic_naan',name:'Garlic Naan',price:89,station:'tandoor',recipe:{flour:120,butter:10,garlic:8}},
 cold_coffee:{id:'cold_coffee',name:'Cold Coffee',price:189,station:'bar',recipe:{milk:220,coffee:18,sugar:20}}
};

export const initialState=()=>({
 restaurant:{id:'demo-restaurant',name:'The Spice Room',outlet:'Connaught Place',currency:'INR'},
 tables:{T12:{id:'T12',seats:6,status:'seated',waiter:'Rahul',guests:4,openedAt:now()}},
 ingredients:{
  paneer:{name:'Paneer',unit:'g',qty:13200,costPerUnit:.326},capsicum:{name:'Capsicum',unit:'g',qty:8000,costPerUnit:.09},onion:{name:'Onion',unit:'g',qty:22200,costPerUnit:.041},spices:{name:'Spices',unit:'g',qty:5000,costPerUnit:.20},
  chicken:{name:'Chicken',unit:'g',qty:28700,costPerUnit:.242},cream:{name:'Cream',unit:'ml',qty:4200,costPerUnit:.21},butter:{name:'Butter',unit:'g',qty:8600,costPerUnit:.518},tomato:{name:'Tomato',unit:'g',qty:31400,costPerUnit:.044},
  flour:{name:'Flour',unit:'g',qty:40000,costPerUnit:.045},garlic:{name:'Garlic',unit:'g',qty:3800,costPerUnit:.16},milk:{name:'Milk',unit:'ml',qty:18000,costPerUnit:.07},coffee:{name:'Coffee',unit:'g',qty:2200,costPerUnit:.70},sugar:{name:'Sugar',unit:'g',qty:12000,costPerUnit:.048}
 },
 orders:[],stockMovements:[],payments:[],waste:[],feedback:[],events:[],guests:{guest_1:{id:'guest_1',name:'Aarav',visits:3,lifetimeSpend:4820}},suppliers:{},sequence:1
});

const event=(s,type,payload={})=>s.events.push({id:`evt_${s.events.length+1}`,type,payload,at:now()});
const itemCost=item=>Object.entries(menu[item.menuId].recipe).reduce((sum,[ingredientId,qty])=>sum+qty*item.qty*item.ingredientCosts[ingredientId],0);

export function reduceRestaurant(state,action){
 const s=clone(state);const p=action.payload||{};
 switch(action.type){
  case 'RESET':return initialState();
  case 'ORDER_PLACED':{
   const id=`ORD-${String(s.sequence++).padStart(4,'0')}`;
   const items=(p.items||[]).map((x,i)=>{const dish=menu[x.menuId];return{id:`${id}-${i+1}`,menuId:x.menuId,name:dish.name,qty:x.qty||1,price:dish.price,station:dish.station,status:'new',consumed:false,ingredientCosts:Object.fromEntries(Object.keys(dish.recipe).map(k=>[k,s.ingredients[k].costPerUnit]))}});
   const order={id,tableId:p.tableId||'T12',guestId:p.guestId||'guest_1',source:p.source||'guest',status:'placed',items,discount:p.discount||0,createdAt:now(),paymentStatus:'unpaid'};
   s.orders.push(order);s.tables[order.tableId].status='ordering';event(s,'OrderPlaced',{orderId:id,tableId:order.tableId,source:order.source});return s;
  }
  case 'ORDER_ACCEPTED':{
   const o=s.orders.find(x=>x.id===p.orderId);if(!o)return s;o.status='accepted';s.tables[o.tableId].status='dining';event(s,'OrderAccepted',{orderId:o.id});return s;
  }
  case 'ITEM_STARTED':{
   const o=s.orders.find(x=>x.id===p.orderId);const it=o?.items.find(x=>x.id===p.itemId);if(!it)return s;it.status='preparing';
   if(!it.consumed){for(const[ingredientId,perPortion]of Object.entries(menu[it.menuId].recipe)){const qty=perPortion*it.qty;s.ingredients[ingredientId].qty-=qty;s.stockMovements.push({id:`mov_${s.stockMovements.length+1}`,ingredientId,qty:-qty,reason:'recipe',orderId:o.id,itemId:it.id,at:now()})}it.consumed=true;event(s,'StockConsumed',{orderId:o.id,itemId:it.id})}
   event(s,'ItemStarted',{orderId:o.id,itemId:it.id,station:it.station});return s;
  }
  case 'ITEM_READY':{
   const o=s.orders.find(x=>x.id===p.orderId);const it=o?.items.find(x=>x.id===p.itemId);if(!it)return s;it.status='ready';event(s,'ItemReady',{orderId:o.id,itemId:it.id});if(o.items.every(x=>x.status==='ready'||x.status==='served'))s.tables[o.tableId].status='ready';return s;
  }
  case 'ITEM_SERVED':{
   const o=s.orders.find(x=>x.id===p.orderId);const it=o?.items.find(x=>x.id===p.itemId);if(!it)return s;it.status='served';event(s,'ItemServed',{orderId:o.id,itemId:it.id});if(o.items.every(x=>x.status==='served')){o.status='served';s.tables[o.tableId].status='dining'}return s;
  }
  case 'WASTE_LOGGED':{
   const ing=s.ingredients[p.ingredientId];if(!ing)return s;const qty=Number(p.qty)||0;ing.qty-=qty;const cost=qty*ing.costPerUnit;s.waste.push({id:`w_${s.waste.length+1}`,ingredientId:p.ingredientId,qty,cost,reason:p.reason||'other',at:now()});s.stockMovements.push({id:`mov_${s.stockMovements.length+1}`,ingredientId:p.ingredientId,qty:-qty,reason:'waste',at:now()});event(s,'WasteLogged',{ingredientId:p.ingredientId,qty,cost});return s;
  }
  case 'PURCHASE_RECEIVED':{
   const ing=s.ingredients[p.ingredientId];if(!ing)return s;const qty=Number(p.qty)||0;const unitCost=Number(p.unitCost)||ing.costPerUnit;const oldValue=ing.qty*ing.costPerUnit,newQty=ing.qty+qty;ing.costPerUnit=(oldValue+qty*unitCost)/Math.max(newQty,1);ing.qty=newQty;s.stockMovements.push({id:`mov_${s.stockMovements.length+1}`,ingredientId:p.ingredientId,qty,reason:'purchase',at:now()});event(s,'PurchaseReceived',{ingredientId:p.ingredientId,qty,unitCost});return s;
  }
  case 'PAYMENT_CAPTURED':{
   const o=s.orders.find(x=>x.id===p.orderId);if(!o)return s;const subtotal=o.items.reduce((a,x)=>a+x.price*x.qty,0);const total=Math.max(0,subtotal-o.discount);o.paymentStatus='paid';o.status='paid';o.paidAt=now();s.payments.push({id:`pay_${s.payments.length+1}`,orderId:o.id,amount:total,method:p.method||'upi',fee:total*.012,at:now()});const g=s.guests[o.guestId];if(g){g.visits+=1;g.lifetimeSpend+=total}s.tables[o.tableId].status='paid';event(s,'PaymentCaptured',{orderId:o.id,amount:total,method:p.method||'upi'});return s;
  }
  case 'FEEDBACK_SUBMITTED':{
   s.feedback.push({id:`fb_${s.feedback.length+1}`,guestId:p.guestId||'guest_1',orderId:p.orderId,rating:p.rating||5,comment:p.comment||'',at:now()});event(s,'FeedbackSubmitted',{orderId:p.orderId,rating:p.rating||5});return s;
  }
  default:return s;
 }
}

export function metrics(state){
 const paid=new Set(state.payments.map(x=>x.orderId));const paidOrders=state.orders.filter(x=>paid.has(x.id));
 const revenue=state.payments.reduce((a,x)=>a+x.amount,0);const paymentFees=state.payments.reduce((a,x)=>a+x.fee,0);const ingredientCost=paidOrders.flatMap(o=>o.items).reduce((a,x)=>a+itemCost(x),0);const wasteCost=state.waste.reduce((a,x)=>a+x.cost,0);const discounts=paidOrders.reduce((a,o)=>a+o.discount,0);const contribution=revenue-ingredientCost-paymentFees;const foodCostPct=revenue?ingredientCost/revenue*100:0;
 return{revenue,ingredientCost,paymentFees,discounts,contribution,foodCostPct,wasteCost,potentialLeakage:wasteCost+discounts,orders:state.orders.length,paidOrders:paidOrders.length};
}

export const activeOrder=s=>[...s.orders].reverse().find(o=>o.tableId==='T12');
export const rupees=n=>`₹${Math.round(n||0).toLocaleString('en-IN')}`;
