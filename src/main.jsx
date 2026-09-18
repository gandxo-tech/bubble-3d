import React,{useEffect,useMemo,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import * as THREE from "three";
import "./styles.css";

const products=[
 {id:"brown",name:"Brown Sugar Milk Tea",desc:"Thé noir, lait crémeux & brown sugar.",price:5.9,sugar:"70%",ice:"normal",tag:"Best-seller",flavor:"brown",base:"#9a5b35"},
 {id:"matcha",name:"Matcha Cloud",desc:"Matcha premium, lait & mousse aérienne.",price:6.5,sugar:"50%",ice:"peu",tag:"Vegan",flavor:"matcha",base:"#7b9b55"},
 {id:"taro",name:"Taro Dream",desc:"Taro velouté, lait & perles de tapioca.",price:6.2,sugar:"70%",ice:"normal",tag:"Nouveau",flavor:"taro",base:"#9a7bb8"},
 {id:"mango",name:"Mango Passion",desc:"Mangue solaire, passion & thé léger.",price:5.8,sugar:"50%",ice:"beaucoup",tag:"Fresh",flavor:"mango",base:"#ef9b35"},
 {id:"strawberry",name:"Strawberry Yakult",desc:"Fraise fruitée, Yakult & jelly coco.",price:6.4,sugar:"30%",ice:"peu",tag:"Fruity",flavor:"strawberry",base:"#e89aa7"},
 {id:"coconut",name:"Coconut Coffee Boba",desc:"Café froid, coco toastée & boba.",price:6.7,sugar:"30%",ice:"normal",tag:"New",flavor:"coffee",base:"#745544"}
];
const toppings=[["tapioca","Perles de tapioca",.6],["mango","Popping boba mangue",.8],["coco","Jelly coco",.7],["pudding","Pudding",.7],["cheese","Mousse de fromage",.9]];
const sizes=[["Regular",0],["Large",.8],["XL",1.4]];
const sugar=["0%","30%","50%","70%","100%"], ice=["Sans glace","Peu","Normal","Beaucoup"];

function App(){
 const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem("boba-cart")||"[]"));
 const [selected,setSelected]=useState(null),[cartOpen,setCartOpen]=useState(false),[menuOpen,setMenuOpen]=useState(false),[filter,setFilter]=useState("Tous"),[ordered,setOrdered]=useState(false);
 useEffect(()=>localStorage.setItem("boba-cart",JSON.stringify(cart)),[cart]);
 useEffect(()=>{document.querySelectorAll(".reveal").forEach(el=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("visible");o.disconnect()}},{threshold:.12});o.observe(el)})},[]);
 const total=cart.reduce((s,i)=>s+i.unitPrice*i.qty,0),count=cart.reduce((s,i)=>s+i.qty,0);
 const filtered=filter==="Tous"?products:products.filter(p=>p.tag===filter);
 const add=(item)=>{setCart(c=>[...c,item]);setSelected(null);setCartOpen(true)};
 return <div className="app">
  <nav className="nav">
   <a className="logo" href="#top">Boba<span>Bloom</span></a>
   <div className={"navlinks "+(menuOpen?"open":"")}><a href="#menu" onClick={()=>setMenuOpen(false)}>Menu</a><a href="#custom" onClick={()=>setMenuOpen(false)}>Personnaliser</a><a href="#story" onClick={()=>setMenuOpen(false)}>Notre histoire</a><a href="#location" onClick={()=>setMenuOpen(false)}>Localisation</a></div>
   <div className="nav-actions"><button className="cart-btn" onClick={()=>setCartOpen(true)} aria-label="Ouvrir le panier">Panier <b>{count}</b></button><button className="order-top" onClick={()=>document.querySelector("#menu").scrollIntoView({behavior:"smooth"})}>Commander</button><button className="hamb" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">☰</button></div>
  </nav>
  <main id="top">
   <section className="hero">
    <div className="blob blob-a"></div><div className="blob blob-b"></div>
    <div className="hero-copy"><p className="eyebrow">BUBBLE TEA / COTONOU / 2026</p><h1>Shake<br/><i>your</i> mood.</h1><p className="hero-sub">Des thés modernes, des textures surprenantes et une boisson qui te ressemble.</p><div className="hero-buttons"><button className="primary" onClick={()=>document.querySelector("#menu").scrollIntoView({behavior:"smooth"})}>Commander maintenant ↗</button><button className="secondary" onClick={()=>document.querySelector("#menu").scrollIntoView({behavior:"smooth"})}>Découvrir les saveurs</button></div></div>
    <BubbleCup flavor="brown" big/>
    <div className="scroll">SCROLL TO SIP <span>↓</span></div>
   </section>

   <section className="marquee"><div>TEA • BOBA • BLOOM • TEA • BOBA • BLOOM • </div></section>

   <section id="menu" className="section reveal"><div className="section-head"><div><p className="eyebrow">01 / LE MENU</p><h2>Nos <em>best-sellers</em></h2></div><div className="filters">{["Tous","Best-seller","Vegan","Nouveau"].map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
    <div className="grid">{filtered.map((p,i)=><article className="product-card" key={p.id} onClick={()=>setSelected(p)}><div className="card-art" style={{"--drink":p.base}}><span className="tag">{p.tag}</span><BubbleCup flavor={p.flavor}/></div><div className="card-info"><div><h3>{p.name}</h3><p>{p.desc}</p></div><strong>{p.price.toFixed(2)} €</strong></div><div className="meta"><span>Sucre {p.sugar}</span><span>Glaçons {p.ice}</span><button onClick={(e)=>{e.stopPropagation();setSelected(p)}}>+</button></div></article>)}</div>
   </section>

   <section className="experience reveal"><div className="experience-copy"><p className="eyebrow">02 / INTERACTIF</p><h2>Meet your<br/><em>boba.</em></h2><p>Fais tourner ton boba, change sa couleur et observe les perles danser.</p><div className="flavor-row">{products.slice(0,4).map(p=><button key={p.id} onClick={()=>window.dispatchEvent(new CustomEvent("boba-flavor",{detail:p.flavor}))} style={{"--c":p.base}}>{p.flavor}</button>)}</div></div><Boba3D/></section>

   <section id="custom" className="builder reveal"><div className="builder-title"><p className="eyebrow">03 / À TOI DE JOUER</p><h2>Compose ton<br/><em>boba.</em></h2></div><div className="steps">{["Choisis ton thé","Ajoute ta saveur","Sucre & glaçons","Tes toppings","Savoure"].map((x,i)=><div className="step" key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div><button className="primary" onClick={()=>setSelected(products[0])}>Commencer à composer ↗</button></section>

   <section id="story" className="story reveal"><div className="story-img"><div className="ingredient i1">茶</div><div className="ingredient i2">✦</div><div className="ingredient i3">● ● ●</div><div className="ingredient i4">MANGO</div></div><div className="story-copy"><p className="eyebrow">04 / NOTRE HISTOIRE</p><h2>Une gorgée.<br/><em>Une vibe.</em></h2><p>Né d'une passion pour les thés modernes, Boba Bloom mélange des ingrédients créatifs, des textures surprenantes et des recettes personnalisables pour créer une expérience unique à chaque gorgée.</p><div className="stat-row"><div><b>06</b><span>recettes signatures</span></div><div><b>05</b><span>toppings créatifs</span></div><div><b>∞</b><span>combinaisons</span></div></div></div></section>

   <section id="location" className="location reveal"><div><p className="eyebrow">05 / TROUVE-NOUS</p><h2>Come say<br/><em>hi.</em></h2><p>12 rue des Palmiers, Cotonou<br/>Lun–Sam · 10:00–21:00</p><button className="secondary">Voir l'itinéraire ↗</button></div><div className="map"><div className="map-grid"></div><div className="pin">BOBA<br/>BLOOM</div></div></section>
  </main>
  <footer><div><a className="logo" href="#top">Boba<span>Bloom</span></a><p>Shake your mood.</p></div><div><b>Explorer</b><a href="#menu">Menu</a><a href="#custom">Personnaliser</a><a href="#story">Histoire</a></div><div><b>Follow</b><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Facebook</a></div><div><b>Newsletter</b><p>Une dose de boba dans ta boîte mail.</p><div className="newsletter"><input placeholder="ton@email.com" aria-label="Email"/><button>↗</button></div></div></footer>

  {selected&&<Customizer product={selected} close={()=>setSelected(null)} add={add}/>}
  {cartOpen&&<Cart cart={cart} setCart={setCart} total={total} close={()=>setCartOpen(false)} order={()=>{setCartOpen(false);setOrdered(true)}}/>}
  {ordered&&<div className="overlay"><div className="success"><div className="bubble-pop">● ● ●</div><p className="eyebrow">COMMANDE #{Math.floor(10000+Math.random()*89999)}</p><h2>Ta commande est<br/><em>en préparation !</em></h2><p>On shake ça pour toi. Merci pour la good vibe.</p><button className="primary" onClick={()=>setOrdered(false)}>Fermer</button></div></div>}
 </div>
}

function BubbleCup({flavor="brown",big=false}){
 const colors={brown:"#8d512f",matcha:"#72935a",taro:"#9578b3",mango:"#ee9634",strawberry:"#e18f9d",coffee:"#6f503f"};
 return <div className={"cup "+(big?"big":"")} style={{"--liquid":colors[flavor]||colors.brown}}><div className="straw"></div><div className="lid"></div><div className="drink"></div><div className="boba">{Array.from({length:9}).map((_,i)=><i key={i}></i>)}</div><div className="cupshine"></div></div>
}
function Boba3D(){
 const ref=useRef(); const [flavor,setFlavor]=useState("brown");
 useEffect(()=>{const el=ref.current,scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,0.1,100),ren=new THREE.WebGLRenderer({alpha:true,antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(ren.domElement);const resize=()=>{const r=el.getBoundingClientRect();ren.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;cam.updateProjectionMatrix()};resize();window.addEventListener("resize",resize);
 const group=new THREE.Group();scene.add(group);const light=new THREE.HemisphereLight(0xffffff,0x888888,2);scene.add(light);const cup=new THREE.Mesh(new THREE.CylinderGeometry(1.05,.9,2.4,64),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.28,roughness:.12,metalness:.02}));cup.position.y=.1;group.add(cup);
 const liquid=new THREE.Mesh(new THREE.CylinderGeometry(.91,.8,1.65,64),new THREE.MeshStandardMaterial({color:0x8d512f,roughness:.5}));liquid.position.y=-.18;group.add(liquid);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(1.08,1.0,.18,64),new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.65}));lid.position.y=1.32;group.add(lid);
 const straw=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,3.1,20),new THREE.MeshStandardMaterial({color:0x111111}));straw.position.set(.35,1.85,0);straw.rotation.z=-.16;group.add(straw);
 for(let i=0;i<18;i++){let b=new THREE.Mesh(new THREE.SphereGeometry(.12,16,16),new THREE.MeshStandardMaterial({color:0x171717}));b.position.set((Math.random()-.5)*1.45,-1+Math.random()*.45,(Math.random()-.5)*1.1);group.add(b)}
 let down=false,last=0,rot=0;const pointer=e=>{down=true;last=e.clientX||e.touches?.[0]?.clientX||0};const move=e=>{if(!down)return;let x=e.clientX||e.touches?.[0]?.clientX||0;rot+=(x-last)*.01;last=x;group.rotation.y=rot};const up=()=>down=false;el.addEventListener("pointerdown",pointer);el.addEventListener("pointermove",move);window.addEventListener("pointerup",up);
 const colors={brown:0x8d512f,matcha:0x72935a,taro:0x9578b3,mango:0xee9634};const handler=e=>{setFlavor(e.detail);liquid.material.color.setHex(colors[e.detail]||colors.brown)};window.addEventListener("boba-flavor",handler);
 let id;const animate=()=>{group.rotation.y+=.002;group.position.y=Math.sin(performance.now()*.001)*.04;ren.render(scene,cam);id=requestAnimationFrame(animate)};animate();return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);window.removeEventListener("boba-flavor",handler);ren.dispose();el.removeChild(ren.domElement)}},[]);
 return <div className="three-wrap"><div ref={ref} className="three"></div><span className="drag">↔ DRAG TO ROTATE</span><span className="flavor-label">{flavor}</span></div>
}
function Customizer({product,close,add}){
 const [size,setSize]=useState("Regular"),[s,setS]=useState(product.sugar),[i,setI]=useState(product.ice==="normal"?"Normal":product.ice==="peu"?"Peu":product.ice==="beaucoup"?"Beaucoup":"Sans glace"),[tops,setTops]=useState([]);
 const price=product.price+sizes.find(x=>x[0]===size)[1]+tops.reduce((a,id)=>a+(toppings.find(x=>x[0]===id)?.[2]||0),0);
 return <div className="overlay"><div className="modal"><button className="close" onClick={close}>×</button><div className="modal-art"><BubbleCup flavor={product.flavor} big/></div><div className="custom-content"><p className="eyebrow">PERSONNALISE</p><h2>{product.name}</h2><p>{product.desc}</p><Group title="Taille">{sizes.map(x=><Choice key={x[0]} active={size===x[0]} onClick={()=>setSize(x[0])}>{x[0]} {x[1]?`+${x[1].toFixed(2)}€`:""}</Choice>)}</Group><Group title="Sucre">{sugar.map(x=><Choice key={x} active={s===x} onClick={()=>setS(x)}>{x}</Choice>)}</Group><Group title="Glaçons">{ice.map(x=><Choice key={x} active={i===x} onClick={()=>setI(x)}>{x}</Choice>)}</Group><Group title="Toppings"><div className="choices wrap">{toppings.map(x=><Choice key={x[0]} active={tops.includes(x[0])} onClick={()=>setTops(t=>t.includes(x[0])?t.filter(a=>a!==x[0]):[...t,x[0]])}>{x[1]} +{x[2].toFixed(2)}€</Choice>)}</div></Group><button className="primary full" onClick={()=>add({id:product.id+"-"+Date.now(),product:product.name,unitPrice:price,qty:1,options:{size,sugar:s,ice:i,toppings:tops.map(id=>toppings.find(x=>x[0]===id)[1])}})}>Ajouter au panier · {price.toFixed(2)} €</button></div></div></div>
}
function Group({title,children}){return <div className="group"><b>{title}</b><div className="choices">{children}</div></div>}
function Choice({active,onClick,children}){return <button className={"choice "+(active?"selected":"")} onClick={onClick}>{children}</button>}
function Cart({cart,setCart,total,close,order}){const shipping=cart.length?2.5:0;return <div className="overlay cart-overlay"><aside className="cart"><button className="close" onClick={close}>×</button><p className="eyebrow">TON PANIER</p><h2>Ready to <em>sip?</em></h2>{!cart.length?<div className="empty">Ton panier est encore tout doux.<br/>Ajoute un boba pour commencer.</div>:<div className="cart-list">{cart.map((x,idx)=><div className="cart-item" key={x.id}><BubbleCup flavor="brown"/><div><b>{x.product}</b><small>{x.options.size} · {x.options.sugar} · {x.options.ice}</small><small>{x.options.toppings.join(", ")||"Sans topping"}</small><div className="qty"><button onClick={()=>setCart(c=>c.map((a,i)=>i===idx?{...a,qty:Math.max(1,a.qty-1)}:a))}>−</button><span>{x.qty}</span><button onClick={()=>setCart(c=>c.map((a,i)=>i===idx?{...a,qty:a.qty+1}:a))}>+</button><button className="remove" onClick={()=>setCart(c=>c.filter((_,i)=>i!==idx))}>Supprimer</button></div></div><strong>{(x.unitPrice*x.qty).toFixed(2)} €</strong></div>)}</div>}<div className="totals"><div>Sous-total <b>{total.toFixed(2)} €</b></div><div>Livraison <b>{shipping.toFixed(2)} €</b></div><div className="grand">Total <b>{(total+shipping).toFixed(2)} €</b></div></div><button className="primary full" disabled={!cart.length} onClick={order}>Passer la commande</button></aside></div>
}
createRoot(document.getElementById("root")).render(<App/>);
