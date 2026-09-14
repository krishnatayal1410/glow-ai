export const storyChapters=[
 {id:'arrival',scene:'restaurant',eyebrow:'01 · ARRIVAL',title:'Hospitality first.',body:'The story begins inside the restaurant, not inside a dashboard. One guest arrives at Table 12 and every operational event after this stays connected to that visit.',camera:[[0,1.25,4.7],[-.7,1.15,3.1],[-1.05,1.05,2.05]],look:[[0,.9,0],[-.25,.9,0],[-.45,.82,-.2]]},
 {id:'table',scene:'restaurant',eyebrow:'02 · TABLE 12',title:'One table. Any service style.',body:'Waiter-led ordering, optional QR and POS all write into the same table session. Digital is available when useful; hospitality never becomes mandatory self-service.',camera:[[-1.05,1.05,2.05],[-.55,.92,1.28],[.05,.78,.82]],look:[[-.45,.82,-.2],[-.12,.65,-.35],[.22,.52,-.45]]},
 {id:'order',scene:'service',eyebrow:'03 · THE ORDER',title:'The order becomes one shared object.',body:'The guest does not create one order while the waiter, POS and kitchen create copies. Munaffa keeps one order identity and lets every role see the state it needs.',camera:[[1.9,1.35,3.4],[1.05,1.12,2.2],[.35,.95,1.35]],look:[[0,.8,0],[0,.7,0],[-.1,.58,-.1]]},
 {id:'kitchen',scene:'hotpass',eyebrow:'04 · KITCHEN',title:'Production state becomes visible service state.',body:'Starting Paneer Tikka changes the same ticket the waiter sees. Recipe consumption is written at the moment production begins, not reconstructed at the end of the month.',camera:[[-2.4,1.45,3.9],[-1.15,1.18,2.35],[.05,1.02,1.55]],look:[[0,.95,0],[.1,.85,0],[.25,.72,-.15]]},
 {id:'stock',scene:'service',eyebrow:'05 · STOCK',title:'Every movement needs a reason.',body:'Recipe consumption, receiving, wastage, transfers and physical counts all enter the same stock ledger. The gap between ideal and actual becomes explainable.',camera:[[2.2,1.6,3.7],[1.15,1.22,2.25],[.25,1.0,1.45]],look:[[0,.85,0],[0,.72,0],[-.2,.6,-.1]]},
 {id:'payment',scene:'terminal',eyebrow:'06 · PAYMENT',title:'₹1,054 in sales is not ₹1,054 of profit.',body:'The bill settles the exact Table 12 order. Selling price then separates into ingredient cost, payment fees, discounts and contribution.',camera:[[1.45,1.05,3.4],[.8,.82,2.1],[.15,.66,1.2]],look:[[0,.5,0],[0,.38,0],[0,.3,-.05]]},
 {id:'leakage',scene:'terminal',eyebrow:'07 · LEAKAGE',title:'Show the evidence behind every rupee.',body:'Munaffa does not accuse staff or invent losses. It shows recorded waste, unusual variance, supplier changes, discounts and voids with confidence and source events attached.',camera:[[.15,.66,1.2],[-.55,.72,1.4],[-1.15,.8,1.9]],look:[[0,.3,-.05],[0,.32,0],[.1,.38,0]]},
 {id:'owner',scene:'restaurant',eyebrow:'08 · OWNER',title:'End the shift with decisions, not thirty charts.',body:'The physical restaurant resolves into one owner view: what changed, why it matters, the rupee impact and the next action worth taking.',camera:[[.4,1.0,2.0],[0,1.35,3.0],[0,1.7,4.8]],look:[[0,.7,0],[0,.82,0],[0,.95,0]]}
];

export const routeStories={
 restaurants:[
  {id:'floor',scene:'restaurant',eyebrow:'RESTAURANTS · LIVE FLOOR',title:'The dining room is the operating graph.',body:'Tables, waiter ownership, readiness, requests and billing remain one live service state.',camera:[[0,1.45,4.4],[-.8,1.2,2.7],[-.2,.95,1.55]],look:[[0,.9,0],[-.2,.75,-.1],[.15,.62,-.2]]},
  {id:'pass',scene:'hotpass',eyebrow:'RESTAURANTS · PASS',title:'Front of house and kitchen stop drifting apart.',body:'Station timing and table readiness are connected to the same order identity.',camera:[[-2.1,1.35,3.5],[-.9,1.12,2.1],[.1,.9,1.35]],look:[[0,.8,0],[.1,.72,0],[.2,.6,-.1]]}
 ],
 cafes:[
  {id:'rush',scene:'cafe',eyebrow:'CAFÉS · MORNING RUSH',title:'Counter, pickup and table service share one queue.',body:'Fast service stays fast without splitting the guest relationship across disconnected systems.',camera:[[0,1.35,4.2],[.7,1.08,2.55],[.15,.88,1.55]],look:[[0,.85,0],[.1,.7,-.1],[-.1,.58,-.15]]},
  {id:'repeat',scene:'terminal',eyebrow:'CAFÉS · REPEAT',title:'The receipt should strengthen the direct relationship.',body:'Payment, feedback and loyalty become one visit history owned by the café.',camera:[[1.2,1.05,3.2],[.65,.78,1.9],[0,.6,1.08]],look:[[0,.5,0],[0,.35,0],[0,.28,0]]}
 ],
 'hotel-fb':[
  {id:'hotel',scene:'hotel',eyebrow:'HOTEL F&B · OUTLETS',title:'Dining, café, bar and banquet can stay distinct.',body:'Each outlet keeps its own service identity while operational and contribution data roll up for the property.',camera:[[0,1.55,4.6],[-.5,1.25,2.8],[.25,1.02,1.8]],look:[[0,.9,0],[-.15,.78,-.1],[.1,.65,-.2]]},
  {id:'contribution',scene:'terminal',eyebrow:'HOTEL F&B · CONTRIBUTION',title:'Premium service still needs unit economics.',body:'Food cost, payment cost, waste and contribution remain visible without turning the guest experience into accounting software.',camera:[[-1.25,1.0,3.1],[-.6,.78,1.9],[0,.62,1.1]],look:[[0,.5,0],[0,.34,0],[0,.28,0]]}
 ],
 qsr:[
  {id:'throughput',scene:'qsr',eyebrow:'QSR · THROUGHPUT',title:'Fast does not have to mean fragmented.',body:'Counter, pickup, kitchen and inventory share one high-throughput order state.',camera:[[0,1.4,4.4],[.8,1.18,2.7],[.2,.96,1.65]],look:[[0,.88,0],[.15,.74,-.05],[-.1,.62,-.15]]},
  {id:'control',scene:'hotpass',eyebrow:'QSR · CONTROL',title:'Exceptions surface before the queue breaks.',body:'Late items, unavailable stock and unusual waste become operational signals while service is still recoverable.',camera:[[2.0,1.4,3.5],[.85,1.1,2.05],[-.05,.88,1.3]],look:[[0,.82,0],[0,.68,0],[-.1,.57,-.1]]}
 ],
 operations:[
  {id:'kds',scene:'hotpass',eyebrow:'OPERATIONS · KDS',title:'Kitchen state is service state.',body:'When an item moves New → Preparing → Ready → Served, every relevant role sees the same transition.',camera:[[-2.2,1.4,3.6],[-.95,1.1,2.15],[.05,.9,1.3]],look:[[0,.85,0],[.1,.7,0],[.15,.58,-.1]]},
  {id:'service',scene:'service',eyebrow:'OPERATIONS · SERVICE',title:'Every request gets an owner.',body:'Water, cutlery, bill and assistance requests become accepted work, not hand waves across a crowded floor.',camera:[[2.1,1.35,3.4],[1.0,1.05,2.05],[.1,.85,1.3]],look:[[0,.8,0],[0,.68,0],[-.1,.56,-.1]]}
 ],
 inventory:[
  {id:'ledger',scene:'service',eyebrow:'INVENTORY · LEDGER',title:'Stock should move for a reason.',body:'Recipe use, receiving, wastage, transfers and counts write explicit movements instead of mutating a mysterious quantity.',camera:[[1.9,1.45,3.5],[.8,1.12,2.1],[-.05,.92,1.35]],look:[[0,.82,0],[0,.68,0],[-.1,.58,-.1]]},
  {id:'receive',scene:'hotpass',eyebrow:'INVENTORY · RECEIVING',title:'Cost starts changing at the loading door.',body:'Expected versus received quantity and supplier price changes update weighted cost before the next dish is sold.',camera:[[-1.9,1.42,3.4],[-.8,1.1,2.0],[.05,.9,1.3]],look:[[0,.8,0],[0,.67,0],[.1,.56,-.1]]}
 ],
 profit:[
  {id:'bill',scene:'terminal',eyebrow:'PROFIT OS · BILL',title:'Start with one actual payment.',body:'Revenue only exists here after the exact Table 12 bill is captured.',camera:[[1.35,1.05,3.25],[.65,.78,1.9],[0,.6,1.08]],look:[[0,.5,0],[0,.35,0],[0,.28,0]]},
  {id:'bridge',scene:'restaurant',eyebrow:'PROFIT OS · CONTRIBUTION',title:'Then connect the money back to the operation.',body:'Recipe snapshots, stock movements, payment fees, discounts and logged waste explain contribution with evidence.',camera:[[0,1.3,3.8],[-.5,1.1,2.45],[.1,.9,1.5]],look:[[0,.82,0],[-.1,.7,-.1],[.1,.58,-.15]]}
 ]
};
