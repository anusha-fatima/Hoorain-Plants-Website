/* Hoorain Plants – shared script */
const P=[ // key, name, category, price, blurb, light, water, pet-friendly, has cutout
["monstera","Monstera Deliciosa","Home",3200,"Big split leaves, a jungle in one pot.","Bright, indirect","Weekly",false,true],
["lily","Peace Lily","Home",2400,"White blooms; tells you when it’s thirsty.","Low to medium","Weekly",false,true],
["money","Money Plant","Home",1200,"Trailing vines that grow in almost any light.","Low to bright","Every 1–2 weeks",false,false],
["spider","Spider Plant","Home",1500,"Arching striped leaves, easy and pet-friendly.","Bright, indirect","Weekly",true,false],
["areca","Areca Palm","Home",3800,"Feathery fronds for a bright corner.","Bright, indirect","Weekly",true,true],
["rubber","Rubber Plant","Home",2900,"Glossy dark leaves with a bold shape.","Bright, indirect","Every 1–2 weeks",false,true],
["snake","Snake Plant","Office",2000,"Upright and tough, happy in low light.","Low to bright","Every 2–3 weeks",false,true],
["zz","ZZ Plant","Office",3000,"Thrives on neglect and fluorescent light.","Low to bright","Every 2–3 weeks",false,true],
["jade","Jade Plant","Office",1800,"A tiny tree that stores its own water.","Bright, sunny","Every 2–3 weeks",false,true],
["bamboo","Lucky Bamboo","Office",900,"Grows in water, a calm desk companion.","Low to medium","Keep roots in water",false,true],
["aglao","Aglaonema","Office",2600,"Pink-flecked leaves that handle shade.","Low to medium","Weekly",false,true],
["succ","Succulent","Office",1100,"Sculptural rosette for a sunny desk.","Bright, sunny","Every 2 weeks",true,true]];
const TINT=["#AEC3B0","#CBDDC1","#D9E6BD","#B9CFB6","#E4EDC6"];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],fmt=n=>"Rs. "+n.toLocaleString("en-US"),find=k=>P.find(p=>p[0]==k);
const src=p=>p[8]?`images/cut/${p[0]}.webp`:`images/${p[0]}.jpg`,cls=p=>p[8]?"":' class="photo"',tint=p=>TINT[P.indexOf(p)%5];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* preloader (extra lime logo) */
const pre=$(".pre");let seen=false;try{seen=sessionStorage.getItem("hp_seen")}catch(e){}
if(pre){if(seen||reduce)pre.classList.add("skip");else{setTimeout(()=>pre.classList.add("done"),1700);setTimeout(()=>pre.remove(),2900);try{sessionStorage.setItem("hp_seen","1")}catch(e){}}}
/* mobile menu */
const bg=$("#burger"),links=$("#links");if(bg)bg.onclick=()=>{const o=links.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
/* toast */
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2300)}
/* cart */
let cart={};try{cart=JSON.parse(localStorage.getItem("hp_cart"))||{}}catch(e){}
const save=()=>{try{localStorage.setItem("hp_cart",JSON.stringify(cart))}catch(e){}},count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
document.body.insertAdjacentHTML("beforeend",`<div class="veil" id="veil"></div><aside class="drawer" id="drawer" aria-label="Shopping cart"><header><h2 id="dt">Your cart</h2><button class="x" id="close" aria-label="Close cart">×</button></header><div class="lines" id="lines"></div><div id="foot"></div></aside><div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Plant details"><div class="veil" id="mveil"></div><div class="mbox" id="mbox"></div></div><div class="toast" id="toast" role="status"></div>`);
function openCart(v){$("#drawer").classList.toggle("on",v);$("#veil").classList.toggle("on",v);if(v){closeModal();paint()}}
function badge(b){const c=$("#count");c.textContent=count();if(b){c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump")}}
function addCart(k,n=1){cart[k]=(cart[k]||0)+n;fly();save();badge(true);toast(find(k)[1]+" added to your cart")}
function paint(step){
 const ks=Object.keys(cart).filter(k=>cart[k]>0),tot=ks.reduce((s,k)=>s+cart[k]*find(k)[3],0);
 $("#dt").textContent=step=="form"?"Checkout":step=="done"?"Thank you":"Your cart";
 if(step=="done"){$("#lines").innerHTML=`<div class="empty"><svg viewBox="0 0 40 40"><use href="#lf"/></svg><p>Your order is placed. We’ll call you to confirm delivery.</p></div>`;$("#foot").innerHTML=`<button class="btn" id="kb">Keep browsing</button>`;$("#kb").onclick=()=>openCart(false);return}
 if(step=="form"){$("#lines").innerHTML=`<p>Total to pay on delivery: <b>${fmt(tot)}</b></p><input id="n" placeholder="Full name" autocomplete="name"><input id="ph" placeholder="Phone number" autocomplete="tel" inputmode="tel"><textarea id="ad" rows="3" placeholder="Delivery address"></textarea>`;$("#foot").innerHTML=`<button class="btn" id="po">Place order</button>`;
  $("#po").onclick=()=>{if(!$("#n").value||!$("#ph").value||!$("#ad").value)return toast("Please fill in name, phone and address");cart={};save();badge(true);paint("done")};return}
 $("#lines").innerHTML=ks.length?ks.map(k=>{const p=find(k);return `<div class="line"><div class="th"><img src="${src(p)}"${cls(p)} alt=""></div><div><b>${p[1]}</b>${fmt(p[3])}<div class="qty"><button data-m="${k}" aria-label="Fewer">−</button>${cart[k]}<button data-p="${k}" aria-label="More">+</button></div></div><button class="x" data-r="${k}" aria-label="Remove ${p[1]}">×</button></div>`}).join(""):`<div class="empty"><svg viewBox="0 0 40 40"><use href="#lf"/></svg><p>Your cart is empty. Pick a plant to get started.</p></div>`;
 const left=Math.max(0,5000-tot);
 $("#foot").innerHTML=ks.length?`<small>${left?fmt(left)+" more for free delivery":"You’ve unlocked free delivery"}</small><div class="bar2"><i style="width:${Math.min(100,tot/50)}%"></i></div><div class="tot"><span>Subtotal</span><span>${fmt(tot)}</span></div><button class="btn" id="co">Checkout</button>`:"";
 if(ks.length)$("#co").onclick=()=>paint("form")}
$("#lines").onclick=e=>{const t=e.target.closest("button");if(!t)return;const d=t.dataset;if(d.p)cart[d.p]++;if(d.m)cart[d.m]--;if(d.r)cart[d.r]=0;save();badge(true);paint()};
$("#cartBtn").onclick=()=>openCart(true);$("#close").onclick=$("#veil").onclick=()=>openCart(false);
addEventListener("keydown",e=>{if(e.key=="Escape"){openCart(false);closeModal()}});badge();
/* quick view modal */
function openModal(k){const p=find(k);$("#mbox").innerHTML=`<div class="mimg" style="--t:${tint(p)}"><img src="${src(p)}"${cls(p)} alt="${p[1]}"></div><div class="mtxt"><button class="x" id="mx" aria-label="Close">×</button><span class="tag" style="background:var(--cream)">${p[2]} plant</span><h2>${p[1]}</h2><div class="price" style="font-size:28px">${fmt(p[3])}</div><p>${p[4]}</p><ul><li>Light<span>${p[5]}</span></li><li>Water<span>${p[6]}</span></li><li>Pet-friendly<span>${p[7]?"Yes":"Keep away from pets"}</span></li></ul><div class="buy"><div class="qty" style="margin:0"><button id="mm" aria-label="Fewer">−</button><b id="mq">1</b><button id="mp" aria-label="More">+</button></div><button class="btn" id="ma" style="flex:1">Add to cart</button></div></div>`;
 let q=1;$("#mm").onclick=()=>$("#mq").textContent=q=Math.max(1,q-1);$("#mp").onclick=()=>$("#mq").textContent=++q;$("#ma").onclick=()=>{addCart(k,q);closeModal()};$("#mx").onclick=closeModal;$("#modal").classList.add("on")}
function closeModal(){$("#modal").classList.remove("on")}$("#mveil").onclick=closeModal;
/* product cards */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
const cardHTML=(p,i)=>`<article class="card" style="--d:${i%4}"><div class="ph" style="--t:${tint(p)}" data-open="${p[0]}"><img src="${src(p)}"${cls(p)} alt="${p[1]}" loading="lazy"><span class="tag">${p[2]}</span><button class="qv" data-open="${p[0]}">Quick view</button></div><div class="meta"><h3>${p[1]}</h3><p>${p[4]}</p><div class="badges"><span>${p[5]}</span><span>Water: ${p[6]}</span>${p[7]?"<span>Pet-friendly</span>":""}</div><div class="buy"><span class="price">${fmt(p[3])}</span><button class="add" data-k="${p[0]}">Add to cart</button></div></div></article>`;
const grid=$("#grid");
if(grid){const pick=(grid.dataset.pick||"").split(",").filter(Boolean),st={f:new URLSearchParams(location.search).get("f")||"all",q:"",s:"def"};
 function render(){let l=P.filter(p=>(st.f=="all"||p[2]==st.f)&&p[1].toLowerCase().includes(st.q));
  if(pick.length)l=pick.map(find);if(st.s=="lo")l=[...l].sort((a,b)=>a[3]-b[3]);if(st.s=="hi")l=[...l].sort((a,b)=>b[3]-a[3]);if(st.s=="az")l=[...l].sort((a,b)=>a[1].localeCompare(b[1]));
  grid.innerHTML=l.length?l.map(cardHTML).join(""):`<p class="none">No plants match that search. Try another name.</p>`;
  requestAnimationFrame(()=>grid.querySelectorAll(".card").forEach(c=>io.observe(c)));const r=$("#result");if(r)r.textContent=l.length+" plants"}
 $$(".tabs button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.f==st.f);b.onclick=()=>{st.f=b.dataset.f;$$(".tabs button").forEach(x=>x.setAttribute("aria-pressed",x==b));render()}});
 const q=$("#q"),s=$("#sort");if(q)q.oninput=()=>{st.q=q.value.trim().toLowerCase();render()};if(s)s.onchange=()=>{st.s=s.value;render()};
 grid.onclick=e=>{const o=e.target.closest("[data-open]");if(o)return openModal(o.dataset.open);const b=e.target.closest(".add");if(!b)return;addCart(b.dataset.k);b.textContent="Added ✓";b.classList.add("ok");setTimeout(()=>{b.textContent="Add to cart";b.classList.remove("ok")},1200)};
 render()}

const sh=$("#show");
if(sh){const L=P.filter(p=>p[8]&&["monstera","snake","lily","areca","zz","rubber","aglao","jade"].includes(p[0]));let cur=0,tm,prev=[];
 sh.innerHTML=L.map(p=>`<div class="sc" role="button" tabindex="0" aria-label="${p[1]}"><img src="${src(p)}" alt="${p[1]}"><div class="info"><h3>${p[1]}</h3><p>${p[4]}</p><div><span>${fmt(p[3])}</span><button class="mini" data-add="${p[0]}">Add to cart</button></div></div><span class="cap">${p[1]}</span></div>`).join("");
 const cs=[...sh.children],n=cs.length,bar=$("#pbar");
 function set(){cs.forEach((c,i)=>{const r=(i-cur+n)%n,cl=r==0?"s0":r<=3?"s"+r:r==n-1?"sx":"sh",jump=prev[i]=="sx"&&cl=="sh";
  c.style.transition=jump?"none":"";c.className="sc "+cl;if(jump)requestAnimationFrame(()=>requestAnimationFrame(()=>c.style.transition=""));prev[i]=cl;c.tabIndex=r==0?-1:0});
  $("#cnt").textContent=String(cur+1).padStart(2,"0")+" / "+String(n).padStart(2,"0");play()}
 function play(){clearTimeout(tm);bar.classList.remove("go");void bar.offsetWidth;if(reduce)return;bar.classList.add("go");bar.style.animationPlayState="running";tm=setTimeout(()=>{cur=(cur+1)%n;set()},4600)}
 function pause(){clearTimeout(tm);bar.style.animationPlayState="paused"}
 sh.onclick=e=>{const a=e.target.closest("[data-add]");if(a)return addCart(a.dataset.add);const c=e.target.closest(".sc");if(c&&!c.classList.contains("s0")&&!c.classList.contains("sx")&&!c.classList.contains("sh")){cur=cs.indexOf(c);set()}};
 sh.onkeydown=e=>{if(e.key=="Enter"||e.key==" "){const c=e.target.closest(".sc");if(c&&c.tabIndex==0){e.preventDefault();cur=cs.indexOf(c);set()}}};
 $("#prev").onclick=()=>{cur=(cur-1+n)%n;set()};$("#next").onclick=()=>{cur=(cur+1)%n;set()};
 const w=sh.closest(".showwrap");w.onmouseenter=pause;w.onmouseleave=play;set()}
/* marquee, footer, newsletter */
$$(".nl").forEach(f=>f.onsubmit=e=>{e.preventDefault();toast("Thanks for joining the garden club!");f.reset()});
/* scroll effects: hero curtain, flower reveal, fade-ins */
const rv=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");rv.unobserve(x.target)}}),{threshold:.15});$$(".rv").forEach(x=>rv.observe(x));
const hero=$(".hero"),fws=$$(".fw");let tk=false;
function onScroll(){tk=false;if(hero&&innerWidth>900&&!reduce)hero.style.setProperty("--p",Math.min(1,scrollY/(innerHeight*.9)).toFixed(3));
 if(!reduce)fws.forEach(f=>{const r=f.getBoundingClientRect();f.style.setProperty("--f",Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight*.85))).toFixed(3))})}
addEventListener("scroll",()=>{if(!tk){tk=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* ===== v3 effects ===== */
let lp={x:innerWidth/2,y:innerHeight/2};addEventListener("click",e=>lp={x:e.clientX,y:e.clientY},true);
function fly(){if(reduce)return;const t=$("#cartBtn").getBoundingClientRect(),d=document.createElement("div");d.className="fl";d.innerHTML='<svg viewBox="0 0 40 40"><use href="#lf"/></svg>';document.body.appendChild(d);
 const tx=t.left+t.width/2-15,ty=t.top+t.height/2-15;d.animate([{transform:`translate(${lp.x-15}px,${lp.y-15}px) scale(1.3) rotate(0deg)`,opacity:1},{transform:`translate(${(lp.x+tx)/2}px,${Math.min(lp.y,ty)-90}px) scale(1) rotate(140deg)`,opacity:1,offset:.5},{transform:`translate(${tx}px,${ty}px) scale(.4) rotate(300deg)`,opacity:.2}],{duration:850,easing:"cubic-bezier(.5,0,.3,1)"}).onfinish=()=>d.remove()}
const GC={d:["#13200C","#253719"],m:["#253719","#425530","#697E50"],l:["#425530","#697E50","#86A062"]};
$$(".grass").forEach(g=>{const cs=g.classList.contains("up")?GC.d:g.classList.contains("lt")?GC.l:GC.m,up=g.classList.contains("up");for(let i=0;i<46;i++){const s=document.createElement("span");s.style.cssText=`left:${(i*2.2+Math.random()*1.4).toFixed(1)}%;--h:${Math.round(26+Math.random()*(up?30:44))}px;--r:${(Math.random()*30-15).toFixed(1)}deg;--d:${(-Math.random()*4.5).toFixed(2)}s;--c:${cs[Math.floor(Math.random()*cs.length)]}`;g.appendChild(s)}});
addEventListener("mousemove",e=>{if(reduce)return;const p=e.target.closest&&e.target.closest(".ph");$$(".ph").forEach(x=>{if(x!==p){x.style.setProperty("--rx","0deg");x.style.setProperty("--ry","0deg")}});if(p){const r=p.getBoundingClientRect();p.style.setProperty("--ry",(((e.clientX-r.left)/r.width-.5)*10).toFixed(1)+"deg");p.style.setProperty("--rx",(-((e.clientY-r.top)/r.height-.5)*10).toFixed(1)+"deg")}});
const co=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);const el=x.target,to=+el.dataset.to,t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1500);el.textContent=Math.round(to*(1-Math.pow(1-p,3))).toLocaleString("en-US");if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});$$(".cnt").forEach(x=>co.observe(x));
function par(){if(reduce)return;$$(".frame,.pband").forEach(f=>{const r=f.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)f.style.setProperty("--py",Math.max(-34,Math.min(34,(r.top+r.height/2-innerHeight/2)*-.06)).toFixed(1)+"px")})}
addEventListener("scroll",()=>requestAnimationFrame(par),{passive:true});par();
/* plant planner (About page) */
const pl=$("#planner");
if(pl){const M={home:{u:"sq ft",min:300,max:4000,step:50,val:1200,l:"Size of your home",f:"Home",rooms:[["Living room","2–4","Monstera, Rubber Plant"],["Bedroom","1–2","Snake Plant, Peace Lily"],["Kitchen","1–2","Spider Plant, Money Plant"],["Bathroom","1–2","Peace Lily, Spider Plant"],["Home office","1–3","ZZ Plant, Jade Plant"],["Entryway","1","Areca Palm"]]},
 office:{u:"desks",min:2,max:100,step:1,val:12,l:"Number of desks",f:"Office",rooms:[["Each desk","1","Succulent, Lucky Bamboo, Jade"],["Reception","2–4","Areca Palm, Rubber Plant"],["Meeting room","1–3","Snake Plant, ZZ Plant"],["Open-plan floor","1 per 4–8 desks","Aglaonema, Monstera"],["Pantry","1–2","Money Plant, Spider Plant"],["Corridor","1 per 10 ft","Snake Plant"]]}};
 let mode="home";const r=$("#rng"),nf=n=>n.toLocaleString("en-US");
 function calc(){const m=M[mode],v=+r.value;let lo,hi,mix;
  if(mode=="home"){lo=Math.ceil(v/150);hi=Math.ceil(v/100);const L=Math.max(1,Math.round(lo*.2)),S=Math.round(lo*.4);mix=[S+" small",Math.max(0,lo-S-L)+" medium",L+" large"]}
  else{const a=Math.ceil(v/8),b=Math.ceil(v/4);lo=v+a;hi=v+b;mix=[v+" desk plants",a+"–"+b+" floor plants"]}
  $("#rv").textContent=nf(v)+" "+m.u;$("#num").textContent=lo==hi?lo:lo+"–"+hi;$("#cap").textContent=mode=="home"?"plants for a "+nf(v)+" sq ft home":"plants for "+v+" desks";$("#mix").innerHTML=mix.map(x=>"<span>"+x+"</span>").join("");$("#shopl").href="products.html?f="+m.f}
 function setMode(k){mode=k;const m=M[k];r.min=m.min;r.max=m.max;r.step=m.step;r.value=m.val;$("#rl").textContent=m.l;$$(".seg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m==k));$("#rooms").innerHTML=m.rooms.map(x=>`<div class="room"><b>${x[1]}</b><h3>${x[0]}</h3><p>${x[2]}</p></div>`).join("");calc()}
 $$(".seg button").forEach(b=>b.onclick=()=>setMode(b.dataset.m));r.oninput=calc;setMode("home")}
