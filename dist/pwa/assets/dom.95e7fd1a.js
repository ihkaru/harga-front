import{z as e}from"./index.87f97188.js";function c(t,n){return t!==void 0&&t()||n}function u(t,n){return t!==void 0?n.concat(t()):n}function f(t,n){const r=t.style;for(const o in n)r[o]=n[o]}function a(t){if(t==null)return;if(typeof t=="string")try{return document.querySelector(t)||void 0}catch{return}const n=e(t);if(n)return n.$el||n}export{u as a,f as c,a as g,c as h};
