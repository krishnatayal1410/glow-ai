import React from'react';
import ProductApp from'./App';
import CinematicSite from'./cinematic/CinematicSite';

const publicRoutes=new Set(['story','restaurants','cafes','hotel-fb','qsr','operations','inventory','profit']);
export default function Router({route}){
 if(publicRoutes.has(route))return <CinematicSite route={route}/>;
 return <ProductApp route={route}/>;
}
