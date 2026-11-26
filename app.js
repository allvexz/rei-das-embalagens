(() => {
  "use strict";

  const { whatsapp, categorias, produtos } = window.REI;
  const PAGE_SIZE = 12;
  const CART_KEY = "rei-cart-v2";
  const FALLBACK_IMG = "assets/img/caixa.svg";

  const $ = (selector, root = document) => root.querySelector(selector);
  const money = value => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  const categoryName = Object.fromEntries(categorias.map(c => [c.slug, c.nome]));
  const byId = new Map(produtos.map(p => [p.id, p]));

  const state = { category: "", search: "", sort: "nome", available: false, visible: PAGE_SIZE, cart: loadCart() };

  /* ---------- carrinho (guarda só id + quantidade; preço e estoque vêm sempre do catálogo) ---------- */
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return raw
        .map(item => ({ id: Number(item.id), quantidade: Number(item.quantidade) }))
        .filter(item => byId.has(item.id) && item.quantidade > 0)
        .map(item => ({ ...item, quantidade: Math.min(item.quantidade, byId.get(item.id).estoque) }))
        .filter(item => item.quantidade > 0);
    } catch { return []; }
  }
  function persistCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch { /* armazenamento indisponível */ }
    renderCart();
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    $("#toasts").append(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  document.addEventListener("error", event => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.dataset.fallback !== "used") {
      image.dataset.fallback = "used";
      image.src = FALLBACK_IMG;
    }
  }, true);

  /* ---------- categorias ---------- */
  const categoryDetails = {
    "descartaveis": ["copo.svg", "Copos, pratos e talheres para servir."],
    "embalagens-alimentos": ["marmitex.svg", "Potes e embalagens para alimentos."],
    "caixas-papelao": ["caixa.svg", "Caixas para bolos, doces e transporte."],
    "sacolas-sacos": ["sacola.svg", "Sacolas e sacos para organizar e embalar."],
    "fitas-filmes": ["fita.svg", "Fitas, filmes e itens para proteger."],
    "higiene-limpeza": ["limpeza.svg", "Produtos para higiene e limpeza."]
  };

  function renderCategories() {
    $("#categories").innerHTML = `<button class="category-tile chip active" data-category="" aria-pressed="true">
      <span class="category-tile-image"><img src="${FALLBACK_IMG}" alt="" loading="lazy"></span>
      <span class="category-tile-copy"><strong>Todas as categorias</strong><span>Explore o catálogo completo.</span></span>
      <span class="category-tile-arrow" aria-hidden="true">→</span>
    </button>` + categorias.map(category => {
      const [image, description] = categoryDetails[category.slug] || ["caixa.svg", "Confira as opções disponíveis na loja."];
      return `<button class="category-tile chip" data-category="${escapeHTML(category.slug)}" aria-pressed="false">
        <span class="category-tile-image"><img src="assets/img/${image}" alt="" loading="lazy"></span>
        <span class="category-tile-copy"><strong>${escapeHTML(category.nome)}</strong><span>${description}</span></span>
        <span class="category-tile-arrow" aria-hidden="true">→</span>
      </button>`;
    }).join("");
  }

  /* ---------- catálogo ---------- */
  function stockInfo(stock) {
    if (stock === 0) return { cls: "out", text: "Esgotado" };
    if (stock <= 5) return { cls: "low", text: `Restam ${stock}` };
    return { cls: "in", text: "Em estoque" };
  }

  function filteredProducts() {
    const query = state.search.toLocaleLowerCase("pt-BR");
    const list = produtos.filter(p =>
      (!state.category || p.categoria === state.category) &&
      (!state.available || p.estoque > 0) &&
      (!query || `${p.nome} ${categoryName[p.categoria] || ""} ${p.descricao}`.toLocaleLowerCase("pt-BR").includes(query))
    );
    const sorters = {
      nome: (a, b) => a.nome.localeCompare(b.nome, "pt-BR"),
      preco_asc: (a, b) => a.preco - b.preco || a.nome.localeCompare(b.nome, "pt-BR"),
      preco_desc: (a, b) => b.preco - a.preco || a.nome.localeCompare(b.nome, "pt-BR")
    };
    return list.sort(sorters[state.sort] || sorters.nome);
  }

  function productCard(product, index) {
    const stock = product.estoque;
    const { cls, text } = stockInfo(stock);
    return `<article class="product-card ${stock === 0 ? "is-out" : ""}" style="--delay:${Math.min(index, 6) * 45}ms">
      <button class="product-open" data-details="${product.id}" aria-label="Detalhes de ${escapeHTML(product.nome)}">
        <span class="product-image"><img src="${escapeHTML(product.imagem)}" alt="${escapeHTML(product.nome)}" loading="lazy"></span>
        <span class="product-category">${escapeHTML(categoryName[product.categoria] || "")}</span>
        <strong class="product-name">${escapeHTML(product.nome)}</strong>
        <span class="product-price">${money(product.preco)}</span>
        <span class="product-unit">por ${escapeHTML(product.unidade || "un")}</span>
        <span class="stock ${cls}">${text}</span>
      </button>
      <button class="button button-primary add-button" data-add="${product.id}" ${stock === 0 ? "disabled" : ""}>${stock === 0 ? "Indisponível" : "Adicionar ao pedido"}</button>
    </article>`;
  }

  function renderProducts() {
    const list = filteredProducts();
    $("#products").innerHTML = list.length
      ? list.slice(0, state.visible).map(productCard).join("")
      : '<p class="empty-state">Nenhum produto encontrado. Tente alterar os filtros.</p>';
    $("#loadMore").hidden = list.length <= state.visible;
  }

  function resetAndRender() { state.visible = PAGE_SIZE; renderProducts(); }

  /* ---------- carrinho ---------- */
  function addToCart(product, quantity = 1) {
    const item = state.cart.find(entry => entry.id === product.id);
    const next = (item?.quantidade || 0) + quantity;
    if (next > product.estoque) return showToast("A quantidade escolhida excede o estoque disponível.");
    if (item) item.quantidade = next; else state.cart.push({ id: product.id, quantidade: quantity });
    persistCart();
    $("#openCart").classList.remove("pulse");
    void $("#openCart").offsetWidth;
    $("#openCart").classList.add("pulse");
    showToast(`${product.nome} adicionado ao pedido.`);
  }

  function renderCart() {
    const lines = state.cart.map(item => ({ ...item, product: byId.get(item.id) }));
    const count = lines.reduce((sum, l) => sum + l.quantidade, 0);
    const total = lines.reduce((sum, l) => sum + l.product.preco * l.quantidade, 0);
    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = money(total);
    $("#cartItems").innerHTML = lines.length ? lines.map(({ product, quantidade }) => `
      <article class="cart-item">
        <img src="${escapeHTML(product.imagem)}" alt="" loading="lazy">
        <div class="cart-item-info"><strong>${escapeHTML(product.nome)}</strong><span>${money(product.preco)} / ${escapeHTML(product.unidade || "un")}</span>
          <div class="quantity-control">
            <button data-quantity="-1" data-id="${product.id}" aria-label="Diminuir quantidade">−</button>
            <span>${quantidade}</span>
            <button data-quantity="1" data-id="${product.id}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${product.id}" aria-label="Remover ${escapeHTML(product.nome)}">×</button>
      </article>`).join("") : '<p class="empty-state">Seu pedido ainda está vazio.</p>';
  }

  function openCart() {
    $("#cartOverlay").classList.add("open");
    $("#cartOverlay").setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }
  function closeCart() {
    $("#cartOverlay").classList.remove("open");
    $("#cartOverlay").setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }
  function closeProduct() {
    $("#productModal").classList.remove("open");
    if (!$("#cartOverlay").classList.contains("open")) document.body.classList.remove("no-scroll");
  }

  /* ---------- detalhes do produto ---------- */
  function showDetails(id) {
    const product = byId.get(Number(id));
    if (!product) return showToast("Produto não encontrado.");
    const stock = product.estoque;
    const { cls, text } = stockInfo(stock);
    $("#productDetails").innerHTML = `<button class="icon-button modal-close" id="closeProduct" aria-label="Fechar">×</button>
      <img class="detail-image" src="${escapeHTML(product.imagem)}" alt="${escapeHTML(product.nome)}">
      <p class="product-category">${escapeHTML(categoryName[product.categoria] || "")}</p><h2>${escapeHTML(product.nome)}</h2>
      <p class="muted">${escapeHTML(product.descricao || "")}</p>
      <p class="detail-price">${money(product.preco)} / ${escapeHTML(product.unidade || "un")}</p>
      <span class="stock ${cls}">${text}</span>
      ${stock > 0 ? `<div class="detail-add"><label for="detailQuantity">Quantidade</label><input class="field" id="detailQuantity" type="number" min="1" max="${stock}" value="1"><button class="button button-primary" id="detailAdd" data-id="${product.id}">Adicionar</button></div>` : ""}`;
    $("#productModal").classList.add("open");
    document.body.classList.add("no-scroll");
    $("#closeProduct").addEventListener("click", closeProduct);
  }

  /* ---------- pedido pelo WhatsApp ---------- */
  function buildWhatsAppLink({ nome, telefone, observacoes }) {
    const lines = state.cart.map(({ id, quantidade }) => {
      const p = byId.get(id);
      return `• ${quantidade}x ${p.nome} (${p.unidade}) — ${money(p.preco * quantidade)}`;
    });
    const total = state.cart.reduce((sum, { id, quantidade }) => sum + byId.get(id).preco * quantidade, 0);
    const message = [
      "Olá! Gostaria de fazer um pedido pelo site da Rei das Embalagens.",
      "",
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      "",
      "*Itens:*",
      ...lines,
      "",
      `*Total estimado:* ${money(total)}`,
      ...(observacoes ? ["", `*Observações:* ${observacoes}`] : []),
      "",
      "Aguardo a confirmação de disponibilidade e valores."
    ].join("\n");
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  }

  /* ---------- horário de funcionamento ---------- */
  function updateOpenStatus() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone:"America/Sao_Paulo", weekday:"short", hour:"2-digit", minute:"2-digit", hourCycle:"h23"
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const weekdayNames = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
    const day = weekdays.indexOf(values.weekday);
    const minutes = Number(values.hour) * 60 + Number(values.minute);
    const open = day >= 1 && day <= 5 ? minutes >= 480 && minutes < 1080 : day === 6 && minutes >= 480 && minutes < 900;
    let nextOpen = "";
    if (!open) {
      if (day >= 1 && day <= 5 && minutes < 480) nextOpen = "Abre hoje às 8h.";
      else if (day >= 1 && day <= 4) nextOpen = "Abre amanhã às 8h.";
      else if (day === 5) nextOpen = "Abre sábado às 8h.";
      else nextOpen = "Abre segunda-feira às 8h.";
    }
  
    const closingTime = day === 6 ? "15h" : "18h";
    const todaySchedule = day === 0
      ? "Hoje (domingo): fechado"
      : `Hoje (${weekdayNames[day]}): 8h às ${closingTime}`;
    const statusCard = $("#hoursStatusCard");
    $("#openStatus").textContent = open ? "Aberto agora" : "Fechado agora";
    $("#openStatusDetail").textContent = open
      ? `Atendimento até às ${closingTime}.`
      : nextOpen;
    $("#todayHours").textContent = todaySchedule;
    statusCard.classList.toggle("is-open", open);
    statusCard.classList.toggle("is-closed", !open);
  }

  /* ---------- eventos ---------- */
  $("#menuToggle").addEventListener("click", event => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    $("#navLinks").classList.toggle("open", !expanded);
  });
  $("#navLinks").addEventListener("click", event => {
    if (event.target.closest("a")) {
      $("#navLinks").classList.remove("open");
      $("#menuToggle").setAttribute("aria-expanded", "false");
    }
  });

  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", event => { if (event.target.id === "cartOverlay") closeCart(); });
  $("#productModal").addEventListener("click", event => { if (event.target.id === "productModal") closeProduct(); });

  $("#categories").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    $("#categories").querySelectorAll(".chip").forEach(chip => {
      const active = chip === button;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    resetAndRender();
  });

  $("#products").addEventListener("click", event => {
    const add = event.target.closest("[data-add]");
    const details = event.target.closest("[data-details]");
    if (add) addToCart(byId.get(Number(add.dataset.add)));
    else if (details) showDetails(details.dataset.details);
  });
  $("#loadMore").addEventListener("click", () => { state.visible += PAGE_SIZE; renderProducts(); });

  let searchTimer;
  $("#searchProducts").addEventListener("input", event => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.search = event.target.value.trim(); resetAndRender(); }, 200);
  });
  $("#sortProducts").addEventListener("change", event => { state.sort = event.target.value; resetAndRender(); });
  $("#availableOnly").addEventListener("change", event => { state.available = event.target.checked; resetAndRender(); });

  $("#cartItems").addEventListener("click", event => {
    const change = event.target.closest("[data-quantity]");
    const remove = event.target.closest("[data-remove]");
    if (change) {
      const item = state.cart.find(entry => entry.id === Number(change.dataset.id));
      if (!item) return;
      const quantity = item.quantidade + Number(change.dataset.quantity);
      if (quantity < 1) state.cart = state.cart.filter(entry => entry !== item);
      else if (quantity <= byId.get(item.id).estoque) item.quantidade = quantity;
      else showToast("Quantidade máxima em estoque atingida.");
      persistCart();
    }
    if (remove) {
      state.cart = state.cart.filter(item => item.id !== Number(remove.dataset.remove));
      persistCart();
    }
  });

  $("#productDetails").addEventListener("click", event => {
    if (event.target.id !== "detailAdd") return;
    const product = byId.get(Number(event.target.dataset.id));
    const quantity = Number($("#detailQuantity").value);
    if (product && Number.isInteger(quantity) && quantity > 0 && quantity <= product.estoque) {
      addToCart(product, quantity);
      closeProduct();
    } else showToast("Informe uma quantidade válida para o estoque.");
  });

  $("#checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!state.cart.length) return showToast("Adicione produtos ao pedido antes de continuar.");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const nome = data.nome.trim();
    const telefone = data.telefone.trim();
    if (!nome || telefone.replace(/\D/g, "").length < 10) return showToast("Informe seu nome e um telefone com DDD.");
    const link = buildWhatsAppLink({ nome, telefone, observacoes: (data.observacoes || "").trim() });
    state.cart = [];
    persistCart();
    form.reset();
    closeCart();
    showToast("Abrindo o WhatsApp para enviar seu pedido...");
    window.location.href = link;
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeCart(); closeProduct(); }
  });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

  /* ---------- início ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderCategories();
  renderProducts();
  persistCart();
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);
})();
