// ==========================================
// 1. LOGICA PENTRU COȘ / PROGRAMARE
// ==========================================
let cart = {};

function updateQty(variantId, change) {
  const qtySpan = document.getElementById(`qty-${variantId}`);
  if(!qtySpan) return;
  let currentQty = parseInt(qtySpan.innerText);
  
  currentQty += change;
  if (currentQty < 1) currentQty = 1; 
  
  qtySpan.innerText = currentQty;
}

function addToCart(variantId, serviceName, price) {
  const qtySpan = document.getElementById(`qty-${variantId}`);
  const qty = parseInt(qtySpan.innerText);

  if (cart[variantId]) {
    cart[variantId].qty += qty;
  } else {
    cart[variantId] = {
      name: serviceName,
      price: price,
      qty: qty
    };
  }

  qtySpan.innerText = "1"; 
  renderCart();
  openCart();
}

function removeFromCart(variantId) {
  delete cart[variantId];
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartCountSpan = document.getElementById('cartCount');
  const cartTotalSpan = document.getElementById('cartTotalValue');
  
  if(!cartContainer) return; // Protecție dacă suntem pe pagina de galerie fără coș

  cartContainer.innerHTML = '';
  let totalCost = 0;
  let totalItems = 0;
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart-msg">Nu ai selectat niciun serviciu momentan.</p>';
  } else {
    keys.forEach(id => {
      const item = cart[id];
      const itemTotal = item.price * item.qty;
      totalCost += itemTotal;
      totalItems += item.qty;

      const itemHTML = `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>Cantitate: <strong>${item.qty}</strong></p>
            <button class="remove-item" onclick="removeFromCart('${id}')">Elimină</button>
          </div>
          <div class="cart-item-price">
            ${itemTotal} RON
          </div>
        </div>
      `;
      cartContainer.innerHTML += itemHTML;
    });
  }

  if(cartCountSpan) cartCountSpan.innerText = totalItems;
  if(cartTotalSpan) cartTotalSpan.innerText = `${totalCost} RON`;
}

// CONTROL PANOU LATERAL
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');

function openCart() {
  if(cartOverlay && cartPanel) {
    cartOverlay.classList.add('active');
    cartPanel.classList.add('active');
  }
}

function closeCart() {
  if(cartOverlay && cartPanel) {
    cartOverlay.classList.remove('active');
    cartPanel.classList.remove('active');
  }
}

const openBtn = document.getElementById('openCartBtn');
const closeBtn = document.getElementById('closeCartBtn');

if(openBtn) openBtn.addEventListener('click', openCart);
if(closeBtn) closeBtn.addEventListener('click', closeCart);
if(cartOverlay) cartOverlay.addEventListener('click', closeCart);


// ==========================================
// 2. TRIMITERE COMANDĂ PE WHATSAPP
// ==========================================
const confirmBtn = document.getElementById('confirmBookingBtn');
if(confirmBtn) {
  confirmBtn.addEventListener('click', () => {
    const keys = Object.keys(cart);
    
    if (keys.length === 0) {
      alert("Vă rugăm să selectați cel puțin un serviciu.");
      return;
    }

    // AICI ADAUGI NUMĂRUL TĂU DE TELEFON (cu 40 în față)
    const telefonSalon = "40700000000"; 
    
    let mesajText = "Bună ziua! Aș dori o programare la Atelierul de Înfrumusețare pentru următoarele servicii:%0A%0A";
    let totalComanda = 0;

    keys.forEach(id => {
      const item = cart[id];
      mesajText += `- ${item.qty}x ${item.name} (${item.price * item.qty} RON)%0A`;
      totalComanda += (item.price * item.qty);
    });

    mesajText += `%0A*Total estimat: ${totalComanda} RON*%0A%0A`;
    mesajText += "Ce zile și ore aveți disponibile în perioada următoare?";

    const whatsappUrl = `https://wa.me/${telefonSalon}?text=${mesajText}`;
    window.open(whatsappUrl, '_blank');
  });
}

// ==========================================
// 3. LOGICĂ PENTRU SLIDESHOW-URI (GALERIE)
// ==========================================
const sliders = document.querySelectorAll('.slider-wrapper');
sliders.forEach(slider => {
  let currentIndex = 0;
  const track = slider.querySelector('.slides-track');
  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  
  if(!track || slides.length === 0) return;
  const totalSlides = slides.length;

  function updateSliderPosition() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  if(nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
      updateSliderPosition();
    });
  }

  if(prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
      updateSliderPosition();
    });
  }
});


// ==========================================
// 4. ANIMATII LA SCROLL (FADE UP)
// ==========================================
function handleScroll() {
  const trigger = window.innerHeight - 80;
  document.querySelectorAll(".scroll-appear").forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("visible");
    }
  });
}
document.addEventListener("DOMContentLoaded", handleScroll);
window.addEventListener("scroll", handleScroll);