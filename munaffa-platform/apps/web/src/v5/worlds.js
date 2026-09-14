export const WORLD_MODELS={
 restaurant:{uid:'84aed47cfbb4470087c6cf92868a020a',name:'High-end restaurant environment',credit:'Janis Zeps · Sketchfab',kind:'restaurant'},
 restaurantFull:{uid:'d25a03ad3f654cc79a37c6bf46d44655',name:'Multi-room restaurant environment',credit:'Himank Agarwal · Sketchfab · CC BY',kind:'restaurant'},
 cafe:{uid:'07c17186dce6472ea2ff2b93d84aea6d',name:'Premium café interior',credit:'Studio 795 · Sketchfab',kind:'cafe'},
 cafeAlt:{uid:'a3b86583b93448aca7d1480dfa3cb63d',name:'Café interior environment',credit:'Shivang Jindal · Sketchfab · CC BY',kind:'cafe'},
 hotel:{uid:'7731809de26e41b0828f236f39c95f7c',name:'Hotel lobby & hospitality environment',credit:'Arbin4444 · Sketchfab',kind:'hotel'},
 kitchen:{uid:'7b11498a7e2e407aab9c2663a0dc500e',name:'Commercial kitchen environment',credit:'Giimann · Sketchfab',kind:'kitchen'},
 kitchenFree:{uid:'fe2944834f6b4988b6eeb767f844b556',name:'Restaurant kitchen',credit:'Erik_Br · Sketchfab',kind:'kitchen'},
 coldroom:{uid:'9d7dd4a316a14b04b6399c15f6a2f2de',name:'Cold-room storage environment',credit:'nuralam018 · Sketchfab',kind:'stock'},
 dinner:{uid:'0664035ef8d94a1e8cd4ec6e6d94f379',name:'Restaurant dinner scene',credit:'Seth Blaine · Sketchfab · CC BY',kind:'dish'},
 dish:{uid:'a4f58f3d0a894d51aa073d64ad695497',name:'Captured restaurant dish',credit:'Bitreel · Sketchfab',kind:'dish'},
 table:{uid:'95f62638ba94453b96719ba1651edf98',name:'Restaurant table setting',credit:'AspectStudios · Sketchfab · CC BY',kind:'table'}
};

export const ROUTES={
 home:{label:'Story',accent:'#d8ff7a',headline:'A restaurant is a living system.',sub:'Follow one order from the guest to the kitchen, into stock, through payment and all the way to the owner’s real contribution.',scenes:[
  {model:'restaurant',kicker:'01 · ARRIVAL',title:'Hospitality first.',copy:'Munaffa begins where guests begin: inside a real restaurant, not inside a dashboard.',camera:{orbit:.14,dolly:.20,lift:.02}},
  {model:'table',kicker:'02 · THE TABLE',title:'One table. Any service style.',copy:'Waiter-led, QR, POS and direct payment all write into the same table session. QR is optional, never forced.',camera:{orbit:-.2,dolly:.28,lift:.08}},
  {model:'kitchen',kicker:'03 · THE KITCHEN',title:'The order becomes real work.',copy:'Station routing, KDS state and service timing become operational events the floor can act on immediately.',camera:{orbit:.13,dolly:.22,lift:.05}},
  {model:'coldroom',kicker:'04 · THE STOCK',title:'The plate reaches the storeroom.',copy:'Ideal recipe usage meets receiving, counts, transfers and waste so stock reflects reality instead of spreadsheet fiction.',camera:{orbit:-.1,dolly:.18,lift:.06}},
  {model:'dish',kicker:'05 · THE MARGIN',title:'₹449 is not ₹449 of profit.',copy:'Munaffa separates ingredient cost, discounts, payment fees, waste and contribution — with confidence and evidence attached.',camera:{orbit:.22,dolly:.35,lift:.12}},
  {model:'restaurantFull',kicker:'06 · THE OWNER',title:'End the day with decisions.',copy:'The owner sees what changed, the rupee impact and the next best action — not thirty disconnected charts.',camera:{orbit:-.16,dolly:.18,lift:.04}}
 ]},
 restaurants:{label:'Restaurants',accent:'#f6c88f',headline:'Built around the dining room, not around software.',sub:'For independent restaurants and growing groups that need service, kitchen, stock and margin to finally agree.',scenes:[
  {model:'restaurant',kicker:'RESTAURANT OS',title:'See the whole floor as service.',copy:'Tables, waiter ownership, kitchen readiness, requests and bills live in one operational state.',camera:{orbit:.18,dolly:.20,lift:.02}},
  {model:'kitchen',kicker:'KITCHEN',title:'Front of house and back of house stop drifting apart.',copy:'Tickets route by station and service teams see readiness without shouting across the pass.',camera:{orbit:-.13,dolly:.24,lift:.08}},
  {model:'dish',kicker:'DISH ECONOMICS',title:'Every bestseller has a margin story.',copy:'Menu engineering connects popularity with contribution, not just sales volume.',camera:{orbit:.28,dolly:.30,lift:.1}}
 ]},
 cafes:{label:'Cafés',accent:'#f0a96b',headline:'Fast service without losing the guest relationship.',sub:'Counter ordering, pickup, table service, direct ordering and loyalty for cafés where speed and repeat visits matter.',scenes:[
  {model:'cafe',kicker:'CAFÉ FLOW',title:'Morning rush, one operating state.',copy:'Counter, table, pickup and direct orders share the same queue instead of creating separate mini-systems.',camera:{orbit:.15,dolly:.24,lift:.03}},
  {model:'table',kicker:'GUEST',title:'Digital when it helps. Human when it matters.',copy:'A guest can browse, order, call staff or pay — without being forced to create an account.',camera:{orbit:-.18,dolly:.3,lift:.1}},
  {model:'dish',kicker:'REPEAT',title:'A better visit becomes a repeat visit.',copy:'Receipts, feedback and loyalty strengthen the café’s own customer relationship.',camera:{orbit:.18,dolly:.25,lift:.04}}
 ]},
 hotels:{label:'Hotels',accent:'#d9c7a1',headline:'One profit layer across hotel F&B.',sub:'For hotel restaurants, cafés, bars and banquet dining — focused on food-and-beverage operations, not pretending to be a full PMS.',scenes:[
  {model:'hotel',kicker:'HOTEL F&B',title:'Every outlet keeps its identity.',copy:'Dining room, café, bar and banquet operations can stay distinct while rolling up into one commercial view.',camera:{orbit:.14,dolly:.18,lift:.04}},
  {model:'restaurant',kicker:'OUTLET OPS',title:'Service stays local. Intelligence rolls up.',copy:'Each outlet runs its own tables, kitchen and inventory while owners see consolidated performance.',camera:{orbit:-.12,dolly:.19,lift:.04}},
  {model:'dinner',kicker:'CONTRIBUTION',title:'Premium hospitality still needs unit economics.',copy:'Munaffa connects menu, purchase cost, waste and contribution without flattening the guest experience.',camera:{orbit:.22,dolly:.3,lift:.08}}
 ]},
 profit:{label:'Profit OS',accent:'#b8ff75',headline:'Know where every rupee actually goes.',sub:'The core Munaffa difference: turning restaurant events into evidence-backed margin intelligence.',scenes:[
  {model:'dish',kicker:'PRICE → COST',title:'Start with one dish.',copy:'Selling price separates into ingredient cost, payment cost, promotion allocation and contribution.',camera:{orbit:.32,dolly:.38,lift:.12}},
  {model:'coldroom',kicker:'IDEAL → ACTUAL',title:'Recipes are theory. Stock is reality.',copy:'Expected consumption is reconciled against purchases, physical counts, transfers and waste.',camera:{orbit:-.14,dolly:.2,lift:.08}},
  {model:'dinner',kicker:'LEAK DETECTOR',title:'Prioritize rupees, not alerts.',copy:'Ingredient variance, waste, supplier increases, discount leakage and void patterns are ranked by likely impact.',camera:{orbit:.16,dolly:.26,lift:.06}}
 ]},
 operations:{label:'Operations',accent:'#81e1ff',headline:'The restaurant should feel alive, not complicated.',sub:'Tables, waiters, kitchen, approvals and service requests stay synchronized while staff keep moving.',scenes:[
  {model:'restaurantFull',kicker:'LIVE FLOOR',title:'The floor becomes a service map.',copy:'Occupancy, wait state, waiter ownership and bill requests stay visible without becoming a command bunker.',camera:{orbit:.16,dolly:.2,lift:.02}},
  {model:'kitchen',kicker:'KDS',title:'Kitchen state is production state.',copy:'Tickets route to stations, late items surface naturally and expo sees when the whole table is ready.',camera:{orbit:-.18,dolly:.26,lift:.06}},
  {model:'table',kicker:'SERVICE',title:'Every request reaches a person.',copy:'Water, cutlery, bill and assistance requests are accepted, owned and completed with timing attached.',camera:{orbit:.2,dolly:.3,lift:.08}}
 ]},
 inventory:{label:'Inventory',accent:'#ffd07d',headline:'From delivery door to plated dish.',sub:'Receiving, recipe theory, physical counts, waste and purchasing finally live in the same ledger.',scenes:[
  {model:'coldroom',kicker:'RECEIVING',title:'Stock starts at the loading door.',copy:'Expected quantity, received quantity, price changes and shortages are recorded before stock reaches the kitchen.',camera:{orbit:.16,dolly:.19,lift:.04}},
  {model:'kitchenFree',kicker:'CONSUMPTION',title:'Every movement has a reason.',copy:'Purchases add stock, recipes consume it, waste removes it, transfers move it and counts correct it.',camera:{orbit:-.14,dolly:.22,lift:.06}},
  {model:'dish',kicker:'FORECAST',title:'Buy for tomorrow, not for yesterday.',copy:'Demand, lead time, current stock and safety levels become editable purchase recommendations.',camera:{orbit:.24,dolly:.34,lift:.1}}
 ]},
 discover:{label:'Discover',accent:'#8ee7c8',headline:'Find hospitality without breaking the direct relationship.',sub:'Restaurants, cafés and hotel dining can be discovered, booked and ordered from directly — while the venue stays in control.',scenes:[
  {model:'restaurant',kicker:'RESTAURANT',title:'Choose by occasion, not by ad spend.',copy:'Distance, cuisine, availability, service style and real venue atmosphere come first.',camera:{orbit:.12,dolly:.18,lift:.02}},
  {model:'cafeAlt',kicker:'CAFÉ',title:'See the place before opening the menu.',copy:'Discovery shows the hospitality environment first and lets the venue own its story.',camera:{orbit:-.15,dolly:.22,lift:.04}},
  {model:'hotel',kicker:'HOTEL DINING',title:'Book the table directly.',copy:'Availability and booking can flow straight into outlet operations without creating another disconnected system.',camera:{orbit:.13,dolly:.19,lift:.04}}
 ]},
 pricing:{label:'Pricing',accent:'#d8ff7a',headline:'Software should earn its seat at the table.',sub:'Start lean, prove measurable improvement, then unlock deeper operations and profit intelligence.',scenes:[
  {model:'table',kicker:'LAUNCH',title:'₹999 / month',copy:'Digital menu, direct ordering, POS basics, guest feedback and core analytics.',camera:{orbit:.18,dolly:.28,lift:.08}},
  {model:'cafeAlt',kicker:'GROWTH',title:'₹2,499 / month',copy:'Adds waiter app, KDS, inventory, recipes, purchasing, wastage and menu engineering.',camera:{orbit:-.12,dolly:.2,lift:.03}},
  {model:'restaurantFull',kicker:'PROFIT',title:'₹4,999 / month',copy:'Adds Profit Leak Engine, forecasting, advanced CRM, controls and deeper owner intelligence.',camera:{orbit:.14,dolly:.18,lift:.04}}
 ]}
};

export const NAV_PRIMARY=['restaurants','cafes','hotels','profit','operations','inventory','discover','pricing'];
