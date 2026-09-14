import React from'react';
import ProductApp from'./App';
import CinematicSite from'./cinematic/CinematicSite';
import AuthFlow from'./auth/AuthFlow';
import{Discovery,Venue}from'./discovery/Discovery';

const publicRoutes=new Set(['story','restaurants','cafes','hotel-fb','qsr','operations','inventory','profit']);
export default function Router({route}){
 if(publicRoutes.has(route))return <CinematicSite route={route}/>;
 if(route==='auth'||route==='onboarding')return <AuthFlow route={route}/>;
 if(route==='discover')return <Discovery/>;
 if(route.startsWith('venue/'))return <Venue id={route.split('/')[1]}/>;
 return <ProductApp route={route}/>;
}
