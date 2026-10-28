const products = [
  {id:1,name:"Studio Wireless Headphones",category:"Electronics",price:2499,oldPrice:3299,rating:"4.8",reviews:284,emoji:"🎧",tag:"BESTSELLER",color:"#dfe7d4"},
  {id:2,name:"Minimal Ceramic Planter",category:"Home",price:699,oldPrice:899,rating:"4.7",reviews:156,emoji:"🪴",tag:"JUST IN",color:"#e8dfd2"},
  {id:3,name:"Everyday Runner Sneakers",category:"Fashion",price:1899,oldPrice:2499,rating:"4.6",reviews:98,emoji:"👟",tag:"POPULAR",color:"#e2e8ed"},
  {id:4,name:"The Creative Habit — Book",category:"Books",price:499,oldPrice:650,rating:"4.9",reviews:421,emoji:"📚",tag:"STAFF PICK",color:"#f0dfbd"},
  {id:5,name:"Smart Desk Lamp",category:"Home",price:1299,oldPrice:1699,rating:"4.5",reviews:112,emoji:"💡",tag:"SAVE 24%",color:"#e6e8cf"},
  {id:6,name:"Compact Bluetooth Speaker",category:"Electronics",price:1599,oldPrice:1999,rating:"4.7",reviews:203,emoji:"🔊",tag:"TOP RATED",color:"#dce6e5"},
  {id:7,name:"Everyday Canvas Tote",category:"Fashion",price:599,oldPrice:799,rating:"4.6",reviews:87,emoji:"👜",tag:"EASY CARRY",color:"#eeded0"},
  {id:8,name:"Insulated Travel Bottle",category:"Home",price:849,oldPrice:1099,rating:"4.8",reviews:312,emoji:"🧴",tag:"CUSTOMER FAVE",color:"#dce8d5"}
];
const grid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const sortSelect = document.querySelector("#sortSelect");
const cart = new Map();
let activeCategory = "all";
let toastTimer;
const rupees = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
function showToast(message){const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
function filteredProducts(){
 const query=searchInput.value.trim().toLowerCase();
 const category=activeCategory!=="all"?activeCategory:categorySelect.value;
 let result=products.filter(p=>(category==="all"||p.category===category)&&(p.name.toLowerCase().includes(query)||p.category.toLowerCase().includes(query)));
 if(sortSelect.value==="low")result.sort((a,b)=>a.price-b.price);
 if(sortSelect.value==="high")result.sort((a,b)=>b.price-a.price);
 return result;
}
function renderProducts(){
 const list=filteredProducts();
 document.querySelector("#filterNotice").hidden=!(activeCategory!=="all"||categorySelect.value!=="all"||searchInput.value.trim());
 document.querySelector("#filterNotice").textContent=`Showing ${list.length} product${list.length===1?"":"s"}${activeCategory!=="all"||categorySelect.value!=="all"?" in "+(activeCategory!=="all"?activeCategory:categorySelect.value):""}`;
 document.querySelectorAll(".quick-categories button").forEach(b=>b.classList.toggle("selected",b.dataset.category===activeCategory));
 if(!list.length){grid.innerHTML='<div class="empty-state">No products found. Try another search.</div>';return}
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image" style="background:${p.color}"><div class="product-blob" style="background:${p.color}"></div><span class="tag">${p.tag}</span><button class="heart" data-heart="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button><span class="emoji">${p.emoji}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating} (${p.reviews})</span></div><div class="product-bottom"><div><span class="price">${rupees(p.price)}</span><span class="old-price">${rupees(p.oldPrice)}</span></div><button class="add-button" data-add="${p.id}">+ Add</button></div></div></article>`).join("");
}
function renderCart(){
 const entries=[...cart.entries()].map(([id,qty])=>({product:products.find(p=>p.id===id),qty}));
 const count=entries.reduce((sum,e)=>sum+e.qty,0),subtotal=entries.reduce((sum,e)=>sum+e.product.price*e.qty,0);
 document.querySelector("#cartCount").textContent=count;
 document.querySelector("#cartSubtotal").textContent=rupees(subtotal);
 const container=document.querySelector("#cartItems");
 if(!entries.length){container.innerHTML='<div class="cart-empty"><span>🛍️</span>Your cart is waiting for something good.</div>';return}
 container.innerHTML=entries.map(({product:p,qty})=>`<div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${rupees(p.price)} each</small><div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove" data-remove="${p.id}">Remove</button></div><strong>${rupees(p.price*qty)}</strong></div>`).join("");
}
function openCart(){document.querySelector("#cartDrawer").classList.add("open");document.querySelector("#drawerBackdrop").classList.add("open");document.querySelector("#cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){document.querySelector("#cartDrawer").classList.remove("open");document.querySelector("#drawerBackdrop").classList.remove("open");document.querySelector("#cartDrawer").setAttribute("aria-hidden","true")}
document.querySelector("#searchForm").addEventListener("submit",e=>{e.preventDefault();activeCategory="all";renderProducts();document.querySelector("#products").scrollIntoView({behavior:"smooth"})});
searchInput.addEventListener("input",renderProducts);
categorySelect.addEventListener("change",()=>{activeCategory="all";renderProducts()});
sortSelect.addEventListener("change",renderProducts);
document.querySelector(".quick-categories").addEventListener("click",e=>{const button=e.target.closest("[data-category]");if(!button)return;activeCategory=button.dataset.category;categorySelect.value="all";renderProducts();document.querySelector("#products").scrollIntoView({behavior:"smooth"})});
grid.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const id=Number(add.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();showToast(`${products.find(p=>p.id===id).name} added to cart`);return}
 const heart=e.target.closest("[data-heart]");if(heart){heart.classList.toggle("liked");heart.textContent=heart.classList.contains("liked")?"♥":"♡";showToast(heart.classList.contains("liked")?"Added to wishlist":"Removed from wishlist")}
});
document.querySelector("#cartItems").addEventListener("click",e=>{
 const qty=e.target.closest("[data-qty]");if(qty){const id=Number(qty.dataset.qty),next=(cart.get(id)||0)+Number(qty.dataset.delta);if(next<=0)cart.delete(id);else cart.set(id,next);renderCart();return}
 const remove=e.target.closest("[data-remove]");if(remove){cart.delete(Number(remove.dataset.remove));renderCart()}
});
document.querySelector("#cartButton").addEventListener("click",openCart);
document.querySelector("#closeCart").addEventListener("click",closeCart);
document.querySelector("#drawerBackdrop").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
document.querySelector("#checkoutButton").addEventListener("click",()=>showToast(cart.size?"Demo checkout only — payment is not enabled.":"Your cart is empty."));
document.querySelector("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.querySelector("#newsletterMessage").textContent="Thanks for subscribing! (Demo only)";e.target.reset()});
document.querySelector("#menuButton").addEventListener("click",()=>{activeCategory="all";categorySelect.value="all";searchInput.value="";renderProducts();document.querySelector("#products").scrollIntoView({behavior:"smooth"})});
document.querySelector("#cartButton").setAttribute("aria-label","Open shopping cart");
renderProducts();renderCart();
