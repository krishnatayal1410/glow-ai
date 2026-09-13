export const SITE_PAGES={
 home:{eyebrow:'Restaurant Profit OS',title:'You know your sales. Now know your Munaffa.',body:'One connected operating system from the table to the kitchen to the bottom line.',accent:'#b9ef83',profile:'journey'},
 platform:{eyebrow:'The platform',title:'Your restaurant becomes one living system.',body:'Orders, kitchen, inventory, purchasing, guests and profit intelligence stay connected in real time.',accent:'#e7c485',profile:'orbit'},
 profit:{eyebrow:'Profit OS',title:'Follow every rupee until it becomes profit.',body:'See what revenue becomes after ingredients, waste, discounts, fees and operational variance.',accent:'#b9ef83',profile:'profit'},
 operations:{eyebrow:'Live operations',title:'Run the floor like a control room.',body:'Tables, orders, KDS, waiter requests, bills, approvals and service timing move together.',accent:'#78d8ff',profile:'operations'},
 inventory:{eyebrow:'Inventory intelligence',title:'From a 25 kg sack to the last gram on a plate.',body:'Bulk purchases, recipes, batch prep, counts, waste and supplier prices share one stock ledger.',accent:'#ffc96f',profile:'inventory'},
 guest:{eyebrow:'Guest experience',title:'Digital ordering that still feels like hospitality.',body:'QR is optional. The menu is restaurant-branded. Waiter service, ordering, payment and feedback remain human.',accent:'#ff9b7e',profile:'guest'},
 ai:{eyebrow:'Munaffa Intelligence',title:'Turn restaurant noise into the next best action.',body:'Forecast demand, surface anomalies, explain profit leakage and recommend what to investigate next.',accent:'#ad97ff',profile:'ai'},
 integrations:{eyebrow:'Connected ecosystem',title:'Keep the systems you already depend on.',body:'Connect payments, delivery, accounting, messaging and existing restaurant tools instead of forcing a day-one rip-and-replace.',accent:'#76e3c1',profile:'integrations'},
 customers:{eyebrow:'Customer stories',title:'Built around measurable restaurant outcomes.',body:'Food cost, service time, waste and repeat visits matter more than feature counts.',accent:'#efc88c',profile:'customers'},
 resources:{eyebrow:'Resources',title:'Playbooks for operators who want better margins.',body:'Practical guides on recipe costing, stock variance, purchasing, service and restaurant economics.',accent:'#9ad8af',profile:'resources'},
 pricing:{eyebrow:'Plans',title:'Start small. Prove the value. Expand when it earns its place.',body:'A restaurant should save or earn more through Munaffa than it pays for Munaffa.',accent:'#b9ef83',profile:'pricing'},
 about:{eyebrow:'Why Munaffa',title:'Better restaurants should not require worse spreadsheets.',body:'We are building an operating layer that makes restaurant economics visible without making hospitality feel robotic.',accent:'#dcbf92',profile:'about'},
 contact:{eyebrow:'Pilot with us',title:'Bring us one restaurant. We will find what the numbers are hiding.',body:'Start with an operational and profit-leak audit before replacing a single piece of software.',accent:'#b9ef83',profile:'contact'}
};

export const TOP_NAV=[['Platform','platform'],['Profit','profit'],['Operations','operations'],['Inventory','inventory'],['Customers','customers'],['Pricing','pricing']];
export const FULL_NAV=[['Platform','platform','One connected restaurant OS'],['Profit OS','profit','Know where every rupee goes'],['Operations','operations','Floor, KDS and service control'],['Inventory','inventory','Recipes, stock and purchasing'],['Guest Experience','guest','QR, service, payment and feedback'],['AI Intelligence','ai','Forecast, detect and explain'],['Integrations','integrations','Payments, delivery, accounting'],['Customers','customers','Outcomes and case studies'],['Resources','resources','Guides and operator playbooks'],['Pricing','pricing','Plans and pilot'],['About','about','Mission and principles'],['Contact','contact','Start a restaurant pilot']];

const common={
 home:[['THE BILL','A single sales number hides the entire economics of the restaurant.'],['THE TABLE','The guest, waiter and counter all enter the same order engine.'],['THE KITCHEN','Orders become station work, preparation time and service signals.'],['THE STOCK','Every dish maps back to ingredients, recipes and theoretical usage.'],['THE LEAK','Variance, waste and supplier changes peel away from the healthy flow.'],['THE OWNER','The entire restaurant resolves into decisions, not dashboards.']],
 platform:[['ONE MAP','See tables, kitchen, inventory, guests and money as connected systems.'],['ORDER ENGINE','Dine-in, QR, waiter, takeaway and delivery converge.'],['KITCHEN','Tickets route to stations and reunite at expo.'],['STOCK','Recipes create ideal usage while counts reveal reality.'],['GUESTS','Visits, feedback and retention close the loop.'],['CONTROL','Owners and managers see the same restaurant at different levels.']],
 profit:[['REVENUE','Start with net sales, not vanity GMV.'],['VARIABLE COST','Ingredients, packaging, fees and discounts separate visibly.'],['VARIANCE','Compare ideal consumption with actual movement.'],['LEAK DETECTOR','Translate variance into rupee impact and evidence.'],['SIMULATE','Model price, portion and supplier changes before acting.'],['CONTRIBUTION','Keep profit language honest when overhead data is incomplete.']],
 operations:[['FLOOR','Every table has a live service state.'],['ORDER','Guest and waiter actions share one session.'],['KDS','Kitchen work moves by station, not by chaos.'],['EXPO','Prepared components reunite before service.'],['REQUESTS','Water, waiter, bill and delays become accountable tasks.'],['MANAGER','Only exceptions rise to the top.']],
 inventory:[['PURCHASE','Receive bulk stock with supplier and price history.'],['NORMALIZE','Convert kg, grams, litres, ml, packs and portions.'],['RECIPE','Dish and batch recipes create theoretical consumption.'],['COUNT','Physical inventory exposes the truth.'],['WASTE','Every loss gets a reason and rupee impact.'],['FORECAST','Predict runout and recommend purchasing.']],
 guest:[['SCAN','Identify the outlet and table instantly.'],['DISCOVER','Restaurant branding leads; Munaffa stays invisible.'],['ORDER','Direct, waiter-confirmed or browse-only modes.'],['TRACK','A simple live status replaces uncertainty.'],['SERVICE','Requests become tasks instead of hand waves.'],['RETURN','Payment, feedback and loyalty close the visit.']],
 ai:[['OBSERVE','Track operational patterns without pretending surveillance is intelligence.'],['COMPARE','Use recipes, targets and history as baselines.'],['DETECT','Surface anomalies with evidence and confidence.'],['FORECAST','Project demand, stock and customer risk.'],['EXPLAIN','Show the inputs behind each recommendation.'],['HUMAN APPROVAL','AI suggests. Operators decide.']],
 integrations:[['PAYMENTS','UPI, cards and payment gateways feed the same bill.'],['DELIVERY','Bring marketplace orders into the operating stream.'],['ACCOUNTING','Export clean financial events instead of retyping totals.'],['MESSAGING','Use WhatsApp for receipts, service and retention with consent.'],['EXISTING POS','Integrate first when replacing is unnecessary.'],['API LAYER','Keep Munaffa open enough to become infrastructure.']],
 customers:[['FOOD COST','Reduce variance by making recipes and counts visible.'],['SERVICE','Find bottlenecks between ready and served.'],['WASTE','Make loss visible before month-end.'],['PURCHASING','Compare supplier price and reliability over time.'],['RETENTION','Know which guests are drifting away.'],['ROI','Measure Munaffa by verified restaurant improvement.']],
 resources:[['FOOD COST','Understand theoretical versus actual usage.'],['MENU','Engineer for both popularity and contribution.'],['STOCK','Build counting routines staff can actually follow.'],['SERVICE','Measure the gaps that guests feel.'],['SUPPLIERS','Track price, shortage and reliability.'],['GROWTH','Turn operations into repeatable systems.']],
 pricing:[['LAUNCH','QR, orders and core restaurant operations.'],['GROWTH','Inventory, KDS, recipes and purchasing.'],['PROFIT','Leakage intelligence, CRM and deeper analytics.'],['MULTI-OUTLET','Central control with outlet autonomy.'],['PILOT','Start by finding measurable leakage.'],['ROI','Expand only when the numbers justify it.']],
 about:[['HOSPITALITY','Technology should disappear behind better service.'],['TRUTH','Profit estimates need confidence labels and honest inputs.'],['REALITY','Chefs use judgement; systems must accommodate it.'],['CONTROL','Operators keep final authority over pricing and people.'],['OPENNESS','Integrations beat forced replacement.'],['OUTCOME','Verified profit improvement is the north star.']],
 contact:[['AUDIT','Choose one outlet and one month of operational data.'],['MAP','Connect menu, recipes, purchases and sales.'],['MEASURE','Find variance, waste and margin gaps.'],['PILOT','Run Munaffa alongside existing systems.'],['PROVE','Measure savings and operational change.'],['EXPAND','Only then move deeper into the stack.']]
};
export const CHAPTERS=common;

export const CAMERA_PATHS={
 journey:[[0,5,10],[4,2.2,6],[-4,2.7,5.5],[3.6,2.8,6.2],[-2,2.4,6],[0,2.1,8.2]],
 orbit:[[0,7.8,8.5],[6,3.6,6],[-6,3.2,5.5],[5,2.6,4.8],[-4,2.5,5.2],[0,4.8,10]],
 profit:[[0,2.8,8],[-1,1.7,5.2],[0,1.2,4.2],[2.4,1.8,5.2],[-2.2,2.1,5.8],[0,2.2,7.8]],
 operations:[[-5,4.5,7],[-4,1.8,4.5],[3.8,1.7,4.2],[2,1.6,3.8],[-3.4,1.6,4.2],[0,5.5,8]],
 inventory:[[5.5,3.5,7],[4.2,1.8,4.3],[3.6,1.4,3.2],[1.8,2.1,4.2],[-1.2,2.2,5.4],[0,5.8,9]],
 guest:[[2.8,2.4,6],[2.2,1.8,3.4],[1.6,1.6,3.1],[-1.8,2.2,4.8],[-3.6,2.3,5.1],[0,5.2,8.8]],
 ai:[[0,2.1,6],[0,1.4,3.8],[2.8,2.2,5],[-2.8,2.1,5],[0,4.4,7],[0,7,10]],
 integrations:[[0,5,9],[4,4,6],[-4,4,6],[0,2.5,5],[0,6.5,8],[0,8,11]],
 customers:[[0,7,10],[-4,3,6],[4,3,6],[-2,2.5,5],[2,2.5,5],[0,6,9]],
 resources:[[0,5.5,9],[-3,3.2,5.8],[3,3.2,5.8],[-2,2.8,5],[2,2.8,5],[0,6.5,10]],
 pricing:[[0,4.5,8],[-3,2.4,5],[0,2.2,4.5],[3,2.4,5],[-1,4.5,7],[0,6.5,9]],
 about:[[0,6.5,10],[-3,3.2,6],[3,3.2,6],[0,2.5,5],[-2,5.2,8],[0,8,12]],
 contact:[[0,5.5,9],[0,3.6,6],[2,2.8,5],[-2,2.8,5],[0,4.5,7],[0,8,11]]
};
