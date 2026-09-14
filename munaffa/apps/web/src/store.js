import{create}from'zustand';
import{initialState,reduceRestaurant}from'@munaffa/core';
const KEY='munaffa:rebuild:v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||initialState()}catch{return initialState()}};
export const useRestaurant=create((set,get)=>({
 state:typeof window==='undefined'?initialState():load(),
 dispatch:(type,payload={})=>set(({state})=>{const next=reduceRestaurant(state,{type,payload});try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}return{state:next}}),
 reset:()=>{const next=initialState();try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}set({state:next})},
 snapshot:()=>get().state
}));
