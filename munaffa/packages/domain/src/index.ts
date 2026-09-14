export type Role = 'owner'|'manager'|'cashier'|'waiter'|'kitchen'|'stock'|'admin'|'guest';

export type MoneyConfidence='recorded'|'calculated'|'estimated'|'forecast';

export type EventType=
  |'TABLE_OPENED'|'GUEST_SEATED'|'ORDER_CREATED'|'ORDER_ITEM_ADDED'|'ORDER_SUBMITTED'
  |'ORDER_ACCEPTED'|'KITCHEN_TICKET_STARTED'|'KITCHEN_ITEM_READY'|'ORDER_SERVED'
  |'STOCK_RECEIVED'|'STOCK_COUNTED'|'WASTE_RECORDED'|'STOCK_TRANSFERRED'
  |'BILL_CREATED'|'DISCOUNT_APPLIED'|'PAYMENT_CAPTURED'|'REFUND_ISSUED'
  |'FEEDBACK_RECEIVED'|'SUPPLIER_PRICE_CHANGED';

export type DomainEvent={
  id:string;
  type:EventType;
  at:number;
  actorRole:Role;
  actorId:string;
  outletId:string;
  payload:Record<string,unknown>;
};

export type Ingredient={id:string;name:string;unit:'g'|'ml'|'pc';avgCostPerUnit:number};
export type RecipeLine={ingredientId:string;qty:number};
export type MenuItem={id:string;name:string;price:number;recipe:RecipeLine[];station:'tandoor'|'curry'|'bar'|'dessert'|'main'};
export type OrderLine={menuItemId:string;qty:number};

export type DemoCatalog={ingredients:Record<string,Ingredient>;menu:Record<string,MenuItem>};

export const demoCatalog:DemoCatalog={
  ingredients:{
    paneer:{id:'paneer',name:'Paneer',unit:'g',avgCostPerUnit:.326},
    capsicum:{id:'capsicum',name:'Capsicum',unit:'g',avgCostPerUnit:.08},
    onion:{id:'onion',name:'Onion',unit:'g',avgCostPerUnit:.041},
    cream:{id:'cream',name:'Cream',unit:'ml',avgCostPerUnit:.21},
    chicken:{id:'chicken',name:'Chicken',unit:'g',avgCostPerUnit:.242},
    tomato:{id:'tomato',name:'Tomato',unit:'g',avgCostPerUnit:.044},
    butter:{id:'butter',name:'Butter',unit:'g',avgCostPerUnit:.518}
  },
  menu:{
    paneerTikka:{id:'paneerTikka',name:'Paneer Tikka',price:349,station:'tandoor',recipe:[{ingredientId:'paneer',qty:220},{ingredientId:'capsicum',qty:45},{ingredientId:'onion',qty:35}]},
    butterChicken:{id:'butterChicken',name:'Butter Chicken',price:449,station:'curry',recipe:[{ingredientId:'chicken',qty:240},{ingredientId:'tomato',qty:150},{ingredientId:'cream',qty:60},{ingredientId:'butter',qty:24}]}
  }
};

export type RestaurantState={
  table:{id:string;status:'free'|'open'|'ordering'|'submitted'|'preparing'|'ready'|'served'|'billing'|'paid';guests:number};
  orders:Record<string,{id:string;tableId:string;lines:OrderLine[];status:'draft'|'submitted'|'accepted'|'preparing'|'ready'|'served'|'paid'}>;
  kitchen:Record<string,{orderId:string;menuItemId:string;qty:number;station:MenuItem['station'];status:'new'|'preparing'|'ready'}>;
  stock:{theoretical:Record<string,number>;actual:Record<string,number>;received:Record<string,number>;waste:Record<string,number>};
  money:{sales:number;discounts:number;refunds:number;ingredientCost:number;contribution:number;confidence:MoneyConfidence};
  guest:{visits:number;lifetimeSpend:number;lastFeedback?:number};
  leaks:Array<{kind:'ingredient_variance'|'waste'|'supplier_price'|'discount'|'refund';amount:number;confidence:MoneyConfidence;detail:string}>;
};

export const initialState:RestaurantState={
  table:{id:'T12',status:'free',guests:0},orders:{},kitchen:{},
  stock:{
    theoretical:{paneer:13200,capsicum:5200,onion:22200,cream:4200,chicken:28700,tomato:31400,butter:8600},
    actual:{paneer:13200,capsicum:5200,onion:22200,cream:4200,chicken:28700,tomato:31400,butter:8600},
    received:{},waste:{}
  },
  money:{sales:0,discounts:0,refunds:0,ingredientCost:0,contribution:0,confidence:'calculated'},
  guest:{visits:0,lifetimeSpend:0},leaks:[]
};

export const makeEvent=(type:EventType,payload:Record<string,unknown>,actorRole:Role='guest',actorId='demo-user'):DomainEvent=>({
  id:`evt_${Math.random().toString(36).slice(2)}_${Date.now()}`,
  type,at:Date.now(),actorRole,actorId,outletId:'demo-outlet',payload
});

const clone=<T>(value:T):T=>structuredClone(value);

function ingredientCost(lines:OrderLine[],catalog:DemoCatalog){
  return lines.reduce((total,line)=>{
    const item=catalog.menu[line.menuItemId];
    if(!item)return total;
    const one=item.recipe.reduce((sum,r)=>sum+(catalog.ingredients[r.ingredientId]?.avgCostPerUnit||0)*r.qty,0);
    return total+one*line.qty;
  },0);
}

function expectedUsage(lines:OrderLine[],catalog:DemoCatalog){
  const usage:Record<string,number>={};
  for(const line of lines){
    const item=catalog.menu[line.menuItemId]; if(!item)continue;
    for(const recipe of item.recipe)usage[recipe.ingredientId]=(usage[recipe.ingredientId]||0)+recipe.qty*line.qty;
  }
  return usage;
}

function recalcLeaks(state:RestaurantState){
  const leaks:RestaurantState['leaks']=[];
  for(const [ingredientId,theoretical] of Object.entries(state.stock.theoretical)){
    const actual=state.stock.actual[ingredientId]??theoretical;
    const diff=theoretical-actual;
    if(diff>0){
      const ingredient=demoCatalog.ingredients[ingredientId];
      leaks.push({kind:'ingredient_variance',amount:diff*(ingredient?.avgCostPerUnit||0),confidence:'calculated',detail:`${ingredient?.name||ingredientId}: ${diff.toFixed(0)}${ingredient?.unit||''} below theoretical`});
    }
  }
  for(const [ingredientId,qty] of Object.entries(state.stock.waste)){
    if(qty<=0)continue;const ingredient=demoCatalog.ingredients[ingredientId];
    leaks.push({kind:'waste',amount:qty*(ingredient?.avgCostPerUnit||0),confidence:'recorded',detail:`Recorded waste: ${ingredient?.name||ingredientId}`});
  }
  if(state.money.discounts>0)leaks.push({kind:'discount',amount:state.money.discounts,confidence:'recorded',detail:'Recorded discounts'});
  if(state.money.refunds>0)leaks.push({kind:'refund',amount:state.money.refunds,confidence:'recorded',detail:'Recorded refunds'});
  state.leaks=leaks.sort((a,b)=>b.amount-a.amount);
}

export function reduceEvent(current:RestaurantState,event:DomainEvent,catalog:DemoCatalog=demoCatalog):RestaurantState{
  const state=clone(current);const p=event.payload;
  switch(event.type){
    case'TABLE_OPENED': state.table={id:String(p.tableId||'T12'),status:'open',guests:Number(p.guests||2)};break;
    case'GUEST_SEATED': state.table.guests=Number(p.guests||state.table.guests||2);state.table.status='ordering';break;
    case'ORDER_CREATED':{
      const id=String(p.orderId);state.orders[id]={id,tableId:String(p.tableId||state.table.id),lines:[],status:'draft'};state.table.status='ordering';break;
    }
    case'ORDER_ITEM_ADDED':{
      const o=state.orders[String(p.orderId)];if(o)o.lines.push({menuItemId:String(p.menuItemId),qty:Number(p.qty||1)});break;
    }
    case'ORDER_SUBMITTED':{
      const id=String(p.orderId),o=state.orders[id];if(!o)break;o.status='submitted';state.table.status='submitted';
      o.lines.forEach((line,i)=>{const item=catalog.menu[line.menuItemId];if(item)state.kitchen[`${id}_${i}`]={orderId:id,menuItemId:line.menuItemId,qty:line.qty,station:item.station,status:'new'}});
      const usage=expectedUsage(o.lines,catalog);for(const[k,v]of Object.entries(usage))state.stock.theoretical[k]=(state.stock.theoretical[k]||0)-v;
      break;
    }
    case'ORDER_ACCEPTED':{const o=state.orders[String(p.orderId)];if(o)o.status='accepted';break}
    case'KITCHEN_TICKET_STARTED':{
      const t=state.kitchen[String(p.ticketId)];if(t)t.status='preparing';const o=t&&state.orders[t.orderId];if(o)o.status='preparing';state.table.status='preparing';break;
    }
    case'KITCHEN_ITEM_READY':{
      const t=state.kitchen[String(p.ticketId)];if(t)t.status='ready';if(t){const all=Object.values(state.kitchen).filter(x=>x.orderId===t.orderId).every(x=>x.status==='ready');if(all){state.orders[t.orderId].status='ready';state.table.status='ready'}}break;
    }
    case'ORDER_SERVED':{const o=state.orders[String(p.orderId)];if(o)o.status='served';state.table.status='served';break}
    case'STOCK_RECEIVED':{
      const id=String(p.ingredientId),qty=Number(p.qty||0);state.stock.actual[id]=(state.stock.actual[id]||0)+qty;state.stock.theoretical[id]=(state.stock.theoretical[id]||0)+qty;state.stock.received[id]=(state.stock.received[id]||0)+qty;break;
    }
    case'STOCK_COUNTED':{state.stock.actual[String(p.ingredientId)]=Number(p.qty||0);break}
    case'WASTE_RECORDED':{
      const id=String(p.ingredientId),qty=Number(p.qty||0);state.stock.actual[id]=(state.stock.actual[id]||0)-qty;state.stock.waste[id]=(state.stock.waste[id]||0)+qty;break;
    }
    case'BILL_CREATED':{state.table.status='billing';break}
    case'DISCOUNT_APPLIED':{state.money.discounts+=Number(p.amount||0);break}
    case'PAYMENT_CAPTURED':{
      const orderId=String(p.orderId),o=state.orders[orderId];if(!o)break;
      const gross=o.lines.reduce((sum,l)=>sum+(catalog.menu[l.menuItemId]?.price||0)*l.qty,0);
      const cogs=ingredientCost(o.lines,catalog);
      state.money.sales+=gross;state.money.ingredientCost+=cogs;state.money.contribution=state.money.sales-state.money.ingredientCost-state.money.discounts-state.money.refunds;
      o.status='paid';state.table.status='paid';state.guest.visits+=1;state.guest.lifetimeSpend+=gross;break;
    }
    case'REFUND_ISSUED':{state.money.refunds+=Number(p.amount||0);state.money.contribution=state.money.sales-state.money.ingredientCost-state.money.discounts-state.money.refunds;break}
    case'FEEDBACK_RECEIVED':{state.guest.lastFeedback=Number(p.rating||0);break}
    case'SUPPLIER_PRICE_CHANGED':{
      const id=String(p.ingredientId),next=Number(p.newCostPerUnit||0),prev=catalog.ingredients[id]?.avgCostPerUnit||0;
      if(next>prev)state.leaks.push({kind:'supplier_price',amount:(next-prev)*Number(p.expectedMonthlyQty||0),confidence:'estimated',detail:`${catalog.ingredients[id]?.name||id} supplier price increased`});break;
    }
  }
  recalcLeaks(state);return state;
}

export function replay(events:DomainEvent[],seed:RestaurantState=initialState){return events.reduce((s,e)=>reduceEvent(s,e),seed)}

export function demoTable12Events(){
  const orderId='order-table12';
  return [
    makeEvent('TABLE_OPENED',{tableId:'T12',guests:4},'waiter','waiter-rahul'),
    makeEvent('GUEST_SEATED',{guests:4},'waiter','waiter-rahul'),
    makeEvent('ORDER_CREATED',{orderId,tableId:'T12'}),
    makeEvent('ORDER_ITEM_ADDED',{orderId,menuItemId:'paneerTikka',qty:2}),
    makeEvent('ORDER_ITEM_ADDED',{orderId,menuItemId:'butterChicken',qty:1}),
    makeEvent('ORDER_SUBMITTED',{orderId}),
    makeEvent('ORDER_ACCEPTED',{orderId},'waiter','waiter-rahul')
  ];
}
