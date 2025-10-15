const products = [
  {
    id: 1,
    title: "Boho Floral Dress",
    price: 799,
    category: "Clothing",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQbACIAsVw5WbLWAg1KWnoCpyXwpl9wzs0rhKOyNmg3oNlpWQijgUNbsuncyL-aU30ctSqe0qbh46YrmBSq-pPASbHl6dvZorQB06BDZtMH",
  },
  {
    id: 2,
    title: "Colorblock Sneakers",
    price: 1499,
    category: "Footwear",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT5FH0xFV05AcOIILn-fHmuzjY7AiiHbyy1mogeoe9DTUYEaQj8heo32tK4rpd_72zZM0yGTWjQWgcQKL_byk_sNnnaiXmYZPQv3yGMf91OU0paQxySWbbr",
  },
  {
    id: 3,
    title: "Handmade Tote Bag",
    price: 399,
    category: "Accessories",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSi9hG8YWeyVes8C0ZvHRnsbR1n5XcUREPEo4U1_cjBGLoen--Jma4L3idgl5fS6imMN8TAQZT2z1Ft2PvBYPi2L4suB6M19YGgo0IINV9l2zq5eXsCkifV",
  },
  {
    id: 4,
    title: "Kids Plush Toy",
    price: 299,
    category: "Toys",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRWHmDBAcvxhL24U3oLGFYIaLhb8SIMjtdlU4UeL2sfRhvMLnPUzjkwEBkSWBbvSw041LtsIBScl0hTs-stpB5dnrXxPKp91fXdAr_Xj7_4hDK00aQKXClX",
  },
  {
    id: 5,
    title: "Scented Candle Set",
    price: 599,
    category: "Home",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTvDYSTrqX7rEzPBlLCK05TrSdCZoFDb61RAMILEWDBR137v8tPba6wH7drWIVT9YN0uWcRDNrpslFepkMAPxxW623PHmOhs80ny6M_dmsyspOhDk809TmfeQ",
  },
  {
    id: 6,
    title: "Statement Necklace",
    price: 899,
    category: "Accessories",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ7VgTz9RyQSgGuXUXt70HtFafpGgFiFwXc867F-J2eiST8hjSxs9JNEcwH9_6apcBPRikYv5t_8EFRiuLuzCnTVxRoYhATpS3v6jtw58xtjLXVLMLBdqt5",
  },
  {
    id: 7,
    title: "Spray",
    price: 178,
    category: "Accessories",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRkOisYVIyva0oHJJ7sSrYSjfApQJs-_TVyiRq0tjkpOqpkFBcFiE6ozc_7sKoc5oMmILcc9qBLYkYnd6T0VHFeCKl5qkt85l9j4iRTWeFbDYaEbyw3uN5m",
  },
  {
    id: 8,
    title: "Workwear Top",
    price: 399,
    category: "Accessories",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQXYKmFt8gv-z0rsVJvoxZBVCOQUc0BjGA7fPahfhNGX9RReH092-F0rg9m8hTf-geSbFFS3-Q6Uq5Gk1wtm-Vg9LrOdhDTTj6f1lEs92wx",
  },
];

const productList = document.getElementById("product-list");
const cartPanel = document.getElementById("cart-panel");
const cartItemsDiv = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const catNav = document.getElementById("categories");

let cart = {};
let currentCategory = "All";

function renderCategories() {
  const cats = ["All", ...new Set(products.map((p) => p.category))];
  catNav.innerHTML = cats
    .map(
      (cat) => `
    <button class="${
      cat === currentCategory ? "active" : ""
    }" onclick="selectCategory('${cat}')">${cat}</button>
  `
    )
    .join("");
}

function selectCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderProducts();
}

function renderProducts() {
  const search = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(
    (p) =>
      (currentCategory === "All" || p.category === currentCategory) &&
      p.title.toLowerCase().includes(search)
  );
  productList.innerHTML = filtered
    .map(
      (p) => `
    <div class='card'>
      <img src='${p.img}' alt='${p.title}'>
      <div class='card-body'>
        <h3>${p.title}</h3>
        <div class='price'>₹${p.price}</div>
        <button class='btn' onclick='addToCart(${p.id})'>Add to Cart</button>
      </div>
    </div>
  `
    )
    .join("");

  if (filtered.length === 0)
    productList.innerHTML =
      '<p style="text-align:center;color:gray;">No products found.</p>';
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  toggleCart(true);
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function updateQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  cart[id] = qty;
  updateCart();
}

function updateCart() {
  const entries = Object.entries(cart);
  let total = 0;
  cartItemsDiv.innerHTML = entries
    .map(([id, qty]) => {
      const p = products.find((x) => x.id == id);
      total += p.price * qty;
      return `
      <div class='cart-item'>
        <img src='${p.img}'>
        <div>
          <h4>${p.title}</h4>
          <p>₹${p.price}</p>
          <button onclick='updateQty(${id},${qty - 1})'>-</button>${qty}
          <button onclick='updateQty(${id},${qty + 1})'>+</button>
          <button onclick='removeFromCart(${id})' style='color:red;background:none;'>x</button>
        </div>
      </div>
    `;
    })
    .join("");
  totalEl.textContent = total;
  cartCount.textContent = entries.length;
  if (entries.length === 0)
    cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
}

function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
}

function filterProducts() {
  renderProducts();
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty!");
    return;
  }
  alert("Checkout successful! Total: ₹" + totalEl.textContent);
  cart = {};
  updateCart();
  toggleCart(false);
}

renderCategories();
renderProducts();