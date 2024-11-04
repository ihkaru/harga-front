import{c as C,i as G,e as P,p as D,a as g,h as m,g as $,l as A,d as J,w as _,o as L,f as q,n as K,j as H,r as p,k as U,m as M,q as S,s as Z,t as ee,u as te,v as ne,x as j,y as k}from"./index.a23681b7.js";import{h as oe,c as F,g as ie,a as le}from"./dom.38bfa888.js";var re=C({name:"QPageContainer",setup(e,{slots:a}){const{proxy:{$q:n}}=$(),t=G(A,P);if(t===P)return console.error("QPageContainer needs to be child of QLayout"),P;D(J,!0);const r=g(()=>{const s={};return t.header.space===!0&&(s.paddingTop=`${t.header.size}px`),t.right.space===!0&&(s[`padding${n.lang.rtl===!0?"Left":"Right"}`]=`${t.right.size}px`),t.footer.space===!0&&(s.paddingBottom=`${t.footer.size}px`),t.left.space===!0&&(s[`padding${n.lang.rtl===!0?"Right":"Left"}`]=`${t.left.size}px`),s});return()=>m("div",{class:"q-page-container",style:r.value},oe(a.default))}});const se=[Element,String],ae=[null,document,document.body,document.scrollingElement,document.documentElement];function ce(e,a){let n=ie(a);if(n===void 0){if(e==null)return window;n=e.closest(".scroll,.scroll-y,.overflow-auto")}return ae.includes(n)?window:n}function ue(e){return e===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:e.scrollTop}function de(e){return e===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:e.scrollLeft}let T;function R(){if(T!==void 0)return T;const e=document.createElement("p"),a=document.createElement("div");F(e,{width:"100%",height:"200px"}),F(a,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),a.appendChild(e),document.body.appendChild(a);const n=e.offsetWidth;a.style.overflow="scroll";let t=e.offsetWidth;return n===t&&(t=a.clientWidth),a.remove(),T=n-t,T}const{passive:B}=H,fe=["both","horizontal","vertical"];var ve=C({name:"QScrollObserver",props:{axis:{type:String,validator:e=>fe.includes(e),default:"vertical"},debounce:[String,Number],scrollTarget:se},emits:["scroll"],setup(e,{emit:a}){const n={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let t=null,r,s;_(()=>e.scrollTarget,()=>{l(),v()});function u(){t!==null&&t();const h=Math.max(0,ue(r)),w=de(r),d={top:h-n.position.top,left:w-n.position.left};if(e.axis==="vertical"&&d.top===0||e.axis==="horizontal"&&d.left===0)return;const z=Math.abs(d.top)>=Math.abs(d.left)?d.top<0?"up":"down":d.left<0?"left":"right";n.position={top:h,left:w},n.directionChanged=n.direction!==z,n.delta=d,n.directionChanged===!0&&(n.direction=z,n.inflectionPoint=n.position),a("scroll",{...n})}function v(){r=ce(s,e.scrollTarget),r.addEventListener("scroll",i,B),i(!0)}function l(){r!==void 0&&(r.removeEventListener("scroll",i,B),r=void 0)}function i(h){if(h===!0||e.debounce===0||e.debounce==="0")u();else if(t===null){const[w,d]=e.debounce?[setTimeout(u,e.debounce),clearTimeout]:[requestAnimationFrame(u),cancelAnimationFrame];t=()=>{d(w),t=null}}}const{proxy:f}=$();return _(()=>f.$q.lang.rtl,u),L(()=>{s=f.$el.parentNode,v()}),q(()=>{t!==null&&t(),l()}),Object.assign(f,{trigger:i,getPosition:()=>n}),K}});function he(){const e=p(!U.value);return e.value===!1&&L(()=>{e.value=!0}),{isHydrated:e}}const X=typeof ResizeObserver!="undefined",N=X===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var V=C({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(e,{emit:a}){let n=null,t,r={width:-1,height:-1};function s(l){l===!0||e.debounce===0||e.debounce==="0"?u():n===null&&(n=setTimeout(u,e.debounce))}function u(){if(n!==null&&(clearTimeout(n),n=null),t){const{offsetWidth:l,offsetHeight:i}=t;(l!==r.width||i!==r.height)&&(r={width:l,height:i},a("resize",r))}}const{proxy:v}=$();if(v.trigger=s,X===!0){let l;const i=f=>{t=v.$el.parentNode,t?(l=new ResizeObserver(s),l.observe(t),u()):f!==!0&&M(()=>{i(!0)})};return L(()=>{i()}),q(()=>{n!==null&&clearTimeout(n),l!==void 0&&(l.disconnect!==void 0?l.disconnect():t&&l.unobserve(t))}),K}else{let f=function(){n!==null&&(clearTimeout(n),n=null),i!==void 0&&(i.removeEventListener!==void 0&&i.removeEventListener("resize",s,H.passive),i=void 0)},h=function(){f(),t&&t.contentDocument&&(i=t.contentDocument.defaultView,i.addEventListener("resize",s,H.passive),u())};const{isHydrated:l}=he();let i;return L(()=>{M(()=>{t=v.$el,t&&h()})}),q(f),()=>{if(l.value===!0)return m("object",{class:"q--avoid-card-border",style:N.style,tabindex:-1,type:"text/html",data:N.url,"aria-hidden":"true",onLoad:h})}}}}),ge=C({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:e=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(e.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(e,{slots:a,emit:n}){const{proxy:{$q:t}}=$(),r=p(null),s=p(t.screen.height),u=p(e.container===!0?0:t.screen.width),v=p({position:0,direction:"down",inflectionPoint:0}),l=p(0),i=p(U.value===!0?0:R()),f=g(()=>"q-layout q-layout--"+(e.container===!0?"containerized":"standard")),h=g(()=>e.container===!1?{minHeight:t.screen.height+"px"}:null),w=g(()=>i.value!==0?{[t.lang.rtl===!0?"left":"right"]:`${i.value}px`}:null),d=g(()=>i.value!==0?{[t.lang.rtl===!0?"right":"left"]:0,[t.lang.rtl===!0?"left":"right"]:`-${i.value}px`,width:`calc(100% + ${i.value}px)`}:null);function z(o){if(e.container===!0||document.qScrollPrevented!==!0){const c={position:o.position.top,direction:o.direction,directionChanged:o.directionChanged,inflectionPoint:o.inflectionPoint.top,delta:o.delta.top};v.value=c,e.onScroll!==void 0&&n("scroll",c)}}function Y(o){const{height:c,width:b}=o;let y=!1;s.value!==c&&(y=!0,s.value=c,e.onScrollHeight!==void 0&&n("scrollHeight",c),O()),u.value!==b&&(y=!0,u.value=b),y===!0&&e.onResize!==void 0&&n("resize",o)}function I({height:o}){l.value!==o&&(l.value=o,O())}function O(){if(e.container===!0){const o=s.value>l.value?R():0;i.value!==o&&(i.value=o)}}let x=null;const Q={instances:{},view:g(()=>e.view),isContainer:g(()=>e.container),rootRef:r,height:s,containerHeight:l,scrollbarWidth:i,totalWidth:g(()=>u.value+i.value),rows:g(()=>{const o=e.view.toLowerCase().split(" ");return{top:o[0].split(""),middle:o[1].split(""),bottom:o[2].split("")}}),header:S({size:0,offset:0,space:!1}),right:S({size:300,offset:0,space:!1}),footer:S({size:0,offset:0,space:!1}),left:S({size:300,offset:0,space:!1}),scroll:v,animate(){x!==null?clearTimeout(x):document.body.classList.add("q-body--layout-animate"),x=setTimeout(()=>{x=null,document.body.classList.remove("q-body--layout-animate")},155)},update(o,c,b){Q[o][c]=b}};if(D(A,Q),R()>0){let b=function(){o=null,c.classList.remove("hide-scrollbar")},y=function(){if(o===null){if(c.scrollHeight>t.screen.height)return;c.classList.add("hide-scrollbar")}else clearTimeout(o);o=setTimeout(b,300)},E=function(W){o!==null&&W==="remove"&&(clearTimeout(o),b()),window[`${W}EventListener`]("resize",y)},o=null;const c=document.body;_(()=>e.container!==!0?"add":"remove",E),e.container!==!0&&E("add"),Z(()=>{E("remove")})}return()=>{const o=le(a.default,[m(ve,{onScroll:z}),m(V,{onResize:Y})]),c=m("div",{class:f.value,style:h.value,ref:e.container===!0?void 0:r,tabindex:-1},o);return e.container===!0?m("div",{class:"q-layout-container overflow-hidden",ref:r},[m(V,{onResize:I}),m("div",{class:"absolute-full",style:w.value},[m("div",{class:"scroll",style:d.value},[c])])]):c}}});const be=Object.assign({name:"MainLayout"},{__name:"MainLayout",setup(e){return p(!1),(a,n)=>{const t=ee("router-view");return te(),ne(ge,null,{default:j(()=>[k(re,null,{default:j(()=>[k(t)]),_:1})]),_:1})}}});export{be as default};
