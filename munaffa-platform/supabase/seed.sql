-- Demo seed. Run after schema.sql. Replace UUIDs or keep these deterministic IDs for local demos.
insert into public.restaurants(id,name,legal_name,gstin,fssai) values('11111111-1111-1111-1111-111111111111','The Spice Room','The Spice Room Foods Pvt Ltd','07ABCDE1234F1Z5','10000000000000') on conflict do nothing;
insert into public.outlets(id,restaurant_id,name,phone,opens_at,closes_at) values('22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Connaught Place','+91 98765 43210','11:00','23:30') on conflict do nothing;
insert into public.menu_categories(id,restaurant_id,name,sort_order) values('33333333-3333-3333-3333-333333333331','11111111-1111-1111-1111-111111111111','Popular',1),('33333333-3333-3333-3333-333333333332','11111111-1111-1111-1111-111111111111','Mains',2) on conflict do nothing;
insert into public.menu_items(id,restaurant_id,category_id,name,description,price,dietary,prep_minutes) values
('44444444-4444-4444-4444-444444444441','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333331','Paneer Tikka','Smoky cottage cheese, peppers and mint chutney',349,array['veg'],16),
('44444444-4444-4444-4444-444444444442','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333332','Butter Chicken','Charred chicken in slow-cooked makhani gravy',449,array['non-veg'],20),
('44444444-4444-4444-4444-444444444443','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333332','Dal Makhani','Black lentils simmered overnight',329,array['veg'],14) on conflict do nothing;
insert into public.ingredients(id,restaurant_id,name,purchase_unit,base_unit,unit_factor,avg_unit_cost,on_hand,reorder_level) values
('55555555-5555-5555-5555-555555555551','11111111-1111-1111-1111-111111111111','Paneer','kg','g',1000,.326,13200,5000),
('55555555-5555-5555-5555-555555555552','11111111-1111-1111-1111-111111111111','Chicken','kg','g',1000,.242,28700,8000),
('55555555-5555-5555-5555-555555555553','11111111-1111-1111-1111-111111111111','Cream','L','ml',1000,.210,4200,3000) on conflict do nothing;
insert into public.restaurant_tables(outlet_id,label,seats,state) select '22222222-2222-2222-2222-222222222222','T'||lpad(x::text,2,'0'),case when x%4=0 then 6 else 4 end,case when x%5=0 then 'free' when x%5=1 then 'dining' when x%5=2 then 'prep' when x%5=3 then 'ready' else 'bill' end from generate_series(1,20)x on conflict(outlet_id,label) do nothing;
