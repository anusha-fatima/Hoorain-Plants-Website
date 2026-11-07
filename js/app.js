/* Hoorain Plants – shared script: products, cart, filters */
const P=[
["monstera","Monstera Deliciosa","Home",3200,"Big split leaves, a jungle in one pot.","Bright, indirect","Weekly",false],
["lily","Peace Lily","Home",2400,"White blooms; tells you when it’s thirsty.","Low to medium","Weekly",false],
["money","Money Plant","Home",1200,"Trailing vines that grow in almost any light.","Low to bright","Every 1–2 weeks",false],
["spider","Spider Plant","Home",1500,"Arching striped leaves, easy and pet-friendly.","Bright, indirect","Weekly",true],
["areca","Areca Palm","Home",3800,"Feathery fronds for a bright corner.","Bright, indirect","Weekly",true],
["rubber","Rubber Plant","Home",2900,"Glossy dark leaves with a bold shape.","Bright, indirect","Every 1–2 weeks",false],
["snake","Snake Plant","Office",2000,"Upright and tough, happy in low light.","Low to bright","Every 2–3 weeks",false],
["zz","ZZ Plant","Office",3000,"Thrives on neglect and fluorescent light.","Low to bright","Every 2–3 weeks",false],
["jade","Jade Plant","Office",1800,"A tiny tree that stores its own water.","Bright, sunny","Every 2–3 weeks",false],
["bamboo","Lucky Bamboo","Office",900,"Grows in water, a calm desk companion.","Low to medium","Keep roots in water",false],
["aglao","Aglaonema","Office",2600,"Pink-flecked leaves that handle shade.","Low to medium","Weekly",false],
["succ","Succulent","Office",1100,"Sculptural rosette for a sunny desk.","Bright, sunny","Every 2 weeks",true]];
const $=s=>document.querySelector(s),fmt=n=>"Rs. "+n.toLocaleString("en-US"),find=k=>P.find(p=>p[0]==k);
let cart={};try{cart=JSON.parse(localStorage.getItem("hp_cart"))||{}}catch(e){}
const save=()=>{try{localStorage.setItem("hp_cart",JSON.stringify(cart))}catch(e){}};
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
document.body.insertAdjacentHTML("beforeend",`<div class="veil" id="veil"></div><aside class="drawer" id="drawer" aria-label="Shopping cart"><header><h2 id="dt">Your cart</h2><button class="x" id="close" aria-label="Close cart">×</button></header><div class="lines" id="lines"></div><div id="foot"></div></aside><div class="toast" id="toast" role="status"></div>`);
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2200)}
function openCart(v){$("#drawer").classList.toggle("on",v);$("#veil").classList.toggle("on",v);if(v)paint()}
function badge(bump){const c=$("#count");c.textContent=count();if(bump){c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump")}}
function paint(step){
 const ks=Object.keys(cart).filter(k=>cart[k]>0),tot=ks.reduce((s,k)=>s+cart[k]*find(k)[3],0);
 $("#dt").textContent=step=="form"?"Checkout":step=="done"?"Thank you":"Your cart";
 if(step=="done"){$("#lines").innerHTML=`<div class="empty"><svg viewBox="0 0 40 40" style="color:var(--sage)"><use href="#lf"/></svg><p>Your order is placed. We’ll call you to confirm delivery.</p></div>`;$("#foot").innerHTML=`<button class="btn" id="kb">Keep browsing</button>`;$("#kb").onclick=()=>openCart(false);return}
 if(step=="form"){$("#lines").innerHTML=`<p>Total to pay on delivery: <b>${fmt(tot)}</b></p><input id="n" placeholder="Full name" autocomplete="name"><input id="ph" placeholder="Phone number" autocomplete="tel"><textarea id="ad" rows="3" placeholder="Delivery address"></textarea>`;$("#foot").innerHTML=`<button class="btn" id="po">Place order</button>`;
  $("#po").onclick=()=>{if(!$("#n").value||!$("#ph").value||!$("#ad").value)return toast("Please fill in name, phone and address");cart={};save();badge(true);paint("done")};return}
 $("#lines").innerHTML=ks.length?ks.map(k=>{const p=find(k);return `<div class="line"><img src="images/${k}.jpg" alt=""><div><b>${p[1]}</b>${fmt(p[3])}<div class="qty"><button data-m="${k}" aria-label="Fewer">−</button>${cart[k]}<button data-p="${k}" aria-label="More">+</button></div></div><button class="x" data-r="${k}" aria-label="Remove ${p[1]}">×</button></div>`}).join(""):`<div class="empty"><svg viewBox="0 0 40 40"><use href="#lf"/></svg><p>Your cart is empty. Pick a plant to get started.</p></div>`;
 const left=Math.max(0,5000-tot);
 $("#foot").innerHTML=ks.length?`<small>${left?fmt(left)+" more for free delivery":"You’ve unlocked free delivery"}</small><div class="bar"><i style="width:${Math.min(100,tot/50)}%"></i></div><div class="tot"><span>Subtotal</span><span>${fmt(tot)}</span></div><button class="btn" id="co">Checkout</button>`:"";
 if(ks.length)$("#co").onclick=()=>paint("form")}
$("#lines").onclick=e=>{const t=e.target.closest("button");if(!t)return;const d=t.dataset;if(d.p)cart[d.p]++;if(d.m)cart[d.m]--;if(d.r)cart[d.r]=0;save();badge(true);paint()};
$("#cartBtn").onclick=()=>openCart(true);$("#close").onclick=$("#veil").onclick=()=>openCart(false);
addEventListener("keydown",e=>e.key=="Escape"&&openCart(false));badge();
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
const cardHTML=(p,i)=>`<article class="card" style="--d:${i%4}"><div class="ph"><img src="images/${p[0]}.jpg" alt="${p[1]}" loading="lazy"></div><div class="meta"><span class="tag">${p[2]}</span><h3>${p[1]}</h3><p>${p[4]}</p><div class="badges"><span>${p[5]}</span><span>Water: ${p[6]}</span>${p[7]?"<span>Pet-friendly</span>":""}</div><div class="buy"><span class="price">${fmt(p[3])}</span><button class="add" data-k="${p[0]}">Add to cart</button></div></div></article>`;
const grid=$("#grid");
if(grid){
 const limit=+grid.dataset.limit||0,st={f:new URLSearchParams(location.search).get("f")||"all",q:"",s:"def"};
 function render(){let l=P.filter(p=>(st.f=="all"||p[2]==st.f)&&p[1].toLowerCase().includes(st.q));
  if(st.s=="lo")l=[...l].sort((a,b)=>a[3]-b[3]);if(st.s=="hi")l=[...l].sort((a,b)=>b[3]-a[3]);if(st.s=="az")l=[...l].sort((a,b)=>a[1].localeCompare(b[1]));
  if(limit)l=l.slice(0,limit);grid.innerHTML=l.length?l.map(cardHTML).join(""):`<p class="none">No plants match that search. Try another name.</p>`;
  requestAnimationFrame(()=>grid.querySelectorAll(".card").forEach(c=>io.observe(c)));const r=$("#result");if(r)r.textContent=l.length+" plants"}
 document.querySelectorAll(".tabs button").forEach(b=>{b.setAttribute("aria-pressed",b.dataset.f==st.f);b.onclick=()=>{st.f=b.dataset.f;document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-pressed",x==b));render()}});
 const q=$("#q"),s=$("#sort");if(q)q.oninput=()=>{st.q=q.value.trim().toLowerCase();render()};if(s)s.onchange=()=>{st.s=s.value;render()};
 grid.onclick=e=>{const b=e.target.closest(".add");if(!b)return;const k=b.dataset.k;cart[k]=(cart[k]||0)+1;save();badge(true);b.textContent="Added ✓";b.classList.add("ok");setTimeout(()=>{b.textContent="Add to cart";b.classList.remove("ok")},1200);toast(find(k)[1]+" added to your cart")};
 render()}
const art=$("#art");if(art)art.onmousemove=e=>{const r=art.getBoundingClientRect();art.style.setProperty("--px",(e.clientX-r.left)/r.width-.5);art.style.setProperty("--py",(e.clientY-r.top)/r.height-.5)};
const par=$("#par");if(par)addEventListener("scroll",()=>{const r=par.parentNode.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)par.style.transform=`translateY(${-(r.top/innerHeight)*40}px)`},{passive:true});

