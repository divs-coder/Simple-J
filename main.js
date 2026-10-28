/* Simple J demo storefront. Change CONTACT_EMAIL to your real customer-service email. */
const CONTACT_EMAIL = "your-email@example.com";

function readCart() {
  try { return JSON.parse(localStorage.getItem("simpleJCart") || "[]"); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("simpleJCart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = count; });
}
function addToCart(name, price) {
  const cart = readCart();
  const existing = cart.find((item) => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({ name, price, quantity: 1 });
  saveCart(cart);
  alert(`${name} added to your cart. Cart items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}.`);
}

function setupProductSearchAndFilter() {
  const searchInput = document.getElementById("siteSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const cards = Array.from(document.querySelectorAll(".product-card"));
  if (!cards.length) return;
  const params = new URLSearchParams(window.location.search);
  if (categoryFilter && params.has("category")) categoryFilter.value = params.get("category");
  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const category = categoryFilter?.value || "All";
    let visible = 0;
    cards.forEach((card) => {
      const matchesTerm = (card.dataset.name || card.textContent).toLowerCase().includes(term);
      const matchesCategory = category === "All" || card.dataset.category === category;
      const show = matchesTerm && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.getElementById("productCount");
    const noProducts = document.getElementById("noProducts");
    if (count) count.textContent = `${visible} product${visible === 1 ? "" : "s"} shown`;
    if (noProducts) noProducts.hidden = visible > 0;
  }
  searchInput?.addEventListener("input", applyFilters);
  categoryFilter?.addEventListener("change", applyFilters);
  applyFilters();
}

function setupHeaderSearch() {
  const input = document.getElementById("siteSearch");
  if (!input) return;
  // On pages without a product grid, route searches to the shop page.
  if (!document.querySelector(".product-card")) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && input.value.trim()) {
        window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  } else {
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) {
      input.value = params.get("search");
      input.dispatchEvent(new Event("input"));
    }
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "Simple J enquiry").trim();
    const message = String(data.get("message") || "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    if (CONTACT_EMAIL === "your-email@example.com") {
      alert("Before using this form, open assets/js/main.js and replace your-email@example.com with your real business email. Your message has not been sent.");
      return;
    }
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletterForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks for your interest! This sample newsletter form needs an email-marketing service to save subscribers.");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.product || "Gadget", Number(button.dataset.price || 0)));
  });
  document.querySelectorAll(".cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const cart = readCart();
      if (!cart.length) { alert("Your cart is empty. Add a gadget to get started."); return; }
      const lines = cart.map((item) => `${item.name} × ${item.quantity} — ₦${(item.price * item.quantity).toLocaleString("en-NG")}`);
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      alert(`YOUR SIMPLE J CART\n\n${lines.join("\n")}\n\nTotal: ₦${total.toLocaleString("en-NG")}\n\nThis demo does not process payments.`);
    });
  });
  document.querySelectorAll(".current-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  setupProductSearchAndFilter();
  setupHeaderSearch();
  setupMobileMenu();
  setupContactForm();
  setupNewsletter();
});
