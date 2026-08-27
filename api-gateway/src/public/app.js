(function ($) {
  'use strict';

  const state = {
    products: [],
    categories: [],
    token: sessionStorage.getItem('novaToken') || '',
    user: JSON.parse(sessionStorage.getItem('novaUser') || 'null'),
    authMode: 'login',
  };

  const api = (options) =>
    $.ajax({
      dataType: 'json',
      contentType: 'application/json',
      xhrFields: { withCredentials: true },
      ...options,
      headers: {
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
        ...(options.headers || {}),
      },
    });

  const messageFromError = (error) => {
    const validationMessage = error.responseJSON?.errors?.[0]?.msg;
    return validationMessage || error.responseJSON?.message || 'İşlem tamamlanamadı.';
  };

  const showToast = (message, type = 'success') => {
    const palette =
      type === 'error'
        ? 'border-rose-400/30 bg-rose-400/10 text-rose-100'
        : 'border-lime/30 bg-lime/10 text-lime';
    const $toast = $('<div>')
      .addClass(`translate-y-3 rounded-2xl border px-4 py-3 text-sm font-semibold opacity-0 shadow-2xl backdrop-blur transition duration-200 ${palette}`)
      .text(message);
    $('#toastArea').append($toast);
    requestAnimationFrame(() => $toast.removeClass('translate-y-3 opacity-0'));
    setTimeout(() => {
      $toast.addClass('translate-y-3 opacity-0');
      setTimeout(() => $toast.remove(), 250);
    }, 3500);
  };

  const setBusy = ($button, busy, label = 'İşleniyor…') => {
    if (busy) {
      $button.data('originalText', $button.text()).prop('disabled', true).addClass('opacity-60').text(label);
    } else {
      $button.prop('disabled', false).removeClass('opacity-60').text($button.data('originalText'));
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(value));

  const saveSession = (token, user) => {
    state.token = token || '';
    state.user = user || null;
    if (state.token) sessionStorage.setItem('novaToken', state.token);
    else sessionStorage.removeItem('novaToken');
    if (state.user) sessionStorage.setItem('novaUser', JSON.stringify(state.user));
    else sessionStorage.removeItem('novaUser');
    renderSession();
  };

  const renderSession = () => {
    const loggedIn = Boolean(state.user);
    $('#authButton, #heroAuthButton').toggleClass('hidden', loggedIn);
    $('#userMenu').toggleClass('hidden', !loggedIn).toggleClass('flex', loggedIn);
    $('#userChip').text(loggedIn ? `${state.user.name || state.user.email} · ${state.user.role}` : '');
    const isAdmin = state.user?.role === 'admin';
    $('#admin, #adminNav').toggleClass('hidden', !isAdmin);
    if (isAdmin) renderAdminLists();
  };

  const setAuthMode = (mode) => {
    state.authMode = mode;
    const isRegister = mode === 'register';
    $('#registerFields').toggleClass('hidden', !isRegister);
    $('#registerFields [name="name"]').prop('required', isRegister);
    $('#authTitle').text(isRegister ? 'Hesap oluştur' : 'Giriş yap');
    $('#authSubmit').text(isRegister ? 'Hesap oluştur' : 'Giriş yap');
    $('#authForm [name="password"]').attr('autocomplete', isRegister ? 'new-password' : 'current-password');
    $('#loginTab')
      .toggleClass('bg-white text-ink', !isRegister)
      .toggleClass('text-slate-400', isRegister);
    $('#registerTab')
      .toggleClass('bg-white text-ink', isRegister)
      .toggleClass('text-slate-400', !isRegister);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    $('#authModal').removeClass('hidden').addClass('flex');
    setTimeout(() => $('#authForm [name="email"]').trigger('focus'), 50);
  };

  const closeModals = () => {
    $('#authModal, #checkoutModal').addClass('hidden').removeClass('flex');
  };

  const populateCategoryControls = () => {
    const selectedFilter = $('#categoryFilter').val();
    const selectedProduct = $('#productCategory').val();
    const $filter = $('#categoryFilter').empty().append($('<option>').val('').text('Tüm kategoriler'));
    const $productSelect = $('#productCategory').empty().append($('<option>').val('').text('Kategori seç'));

    state.categories.forEach((category) => {
      $filter.append($('<option>').val(category._id).text(category.name));
      $productSelect.append($('<option>').val(category._id).text(category.name));
    });
    $filter.val(selectedFilter || '');
    $productSelect.val(selectedProduct || '');
  };

  const productCard = (product, index) => {
    const categoryName = product.category?.name || 'Kategorisiz';
    const inStock = Number(product.stock) > 0;
    const accents = [
      'from-lime/20 via-emerald-300/5 to-transparent',
      'from-sky-400/20 via-indigo-400/5 to-transparent',
      'from-fuchsia-400/20 via-rose-400/5 to-transparent',
    ];
    const $card = $('<article>').addClass(
      'group overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] transition duration-300 hover:-translate-y-1 hover:border-white/20',
    );
    const $visual = $('<div>').addClass(
      `relative grid h-48 place-items-center overflow-hidden bg-gradient-to-br ${accents[index % accents.length]}`,
    );
    $visual.append(
      $('<span>').addClass('text-7xl font-black text-white/[.08] transition duration-500 group-hover:scale-110').text(
        product.name.slice(0, 1).toUpperCase(),
      ),
      $('<span>').addClass('absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold backdrop-blur').text(categoryName),
      $('<span>')
        .addClass(`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${inStock ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300'}`)
        .text(inStock ? `${product.stock} stokta` : 'Tükendi'),
    );

    const $content = $('<div>').addClass('p-5');
    $content.append(
      $('<h3>').addClass('text-xl font-bold').text(product.name),
      $('<p>').addClass('mt-2 min-h-12 text-sm leading-6 text-slate-500').text(product.description),
    );
    const $footer = $('<div>').addClass('mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-5');
    $footer.append(
      $('<strong>').addClass('text-xl text-lime').text(formatPrice(product.price)),
      $('<button>')
        .attr({ type: 'button', disabled: !inStock })
        .data('product-id', product._id)
        .addClass(`checkoutButton rounded-xl px-4 py-2.5 text-sm font-black transition ${inStock ? 'bg-white text-ink hover:bg-lime' : 'cursor-not-allowed bg-white/5 text-slate-600'}`)
        .text(inStock ? 'Satın al' : 'Stok yok'),
    );
    $content.append($footer);
    return $card.append($visual, $content);
  };

  const renderProducts = () => {
    const query = $('#searchInput').val().trim().toLocaleLowerCase('tr-TR');
    const categoryId = $('#categoryFilter').val();
    const filtered = state.products.filter((product) => {
      const text = `${product.name} ${product.description}`.toLocaleLowerCase('tr-TR');
      const productCategoryId = product.category?._id || product.category;
      return (!query || text.includes(query)) && (!categoryId || productCategoryId === categoryId);
    });

    const $grid = $('#productGrid').empty();
    filtered.forEach((product, index) => $grid.append(productCard(product, index)));
    $('#catalogLoading').addClass('hidden');
    $grid.toggleClass('hidden', filtered.length === 0);
    $('#emptyCatalog').toggleClass('hidden', filtered.length > 0);
    $('#emptyCatalog h3').text(state.products.length ? 'Aramana uygun ürün bulunamadı' : 'Henüz ürün yok');
  };

  const renderAdminLists = () => {
    if (state.user?.role !== 'admin') return;
    const $categories = $('#adminCategoryList').empty();
    state.categories.forEach((category) => {
      const hasProducts = state.products.some(
        (product) => (product.category?._id || product.category) === category._id,
      );
      const $row = $('<div>').addClass('flex items-center justify-between rounded-xl bg-black/20 px-4 py-3');
      $row.append(
        $('<span>').addClass('text-sm font-semibold').text(category.name),
        $('<button>')
          .attr({ type: 'button', disabled: hasProducts, title: hasProducts ? 'Önce bu kategorideki ürünleri silin' : 'Kategoriyi sil' })
          .data('category-id', category._id)
          .addClass(`deleteCategory text-xs font-bold ${hasProducts ? 'cursor-not-allowed text-slate-700' : 'text-rose-300 hover:text-rose-200'}`)
          .text('Sil'),
      );
      $categories.append($row);
    });
    if (!state.categories.length) $categories.append($('<p>').addClass('text-sm text-slate-600').text('Kategori yok.'));

    const $products = $('#adminProductList').empty();
    state.products.forEach((product) => {
      const $row = $('<div>').addClass('flex items-center justify-between gap-4 rounded-xl bg-black/20 px-4 py-3');
      $row.append(
        $('<div>').append(
          $('<p>').addClass('text-sm font-semibold').text(product.name),
          $('<p>').addClass('text-xs text-slate-600').text(`${formatPrice(product.price)} · ${product.stock} stok`),
        ),
        $('<button>')
          .attr('type', 'button')
          .data('product-id', product._id)
          .addClass('deleteProduct text-xs font-bold text-rose-300 hover:text-rose-200')
          .text('Sil'),
      );
      $products.append($row);
    });
    if (!state.products.length) $products.append($('<p>').addClass('text-sm text-slate-600').text('Ürün yok.'));
  };

  const loadCatalog = async () => {
    $('#catalogLoading').removeClass('hidden');
    $('#productGrid, #emptyCatalog').addClass('hidden');
    try {
      const [products, categories] = await Promise.all([
        api({ url: '/api/products', method: 'GET' }),
        api({ url: '/api/categories', method: 'GET' }),
      ]);
      state.products = products;
      state.categories = categories;
      $('#productCount').text(products.length);
      $('#categoryCount').text(categories.length);
      populateCategoryControls();
      renderProducts();
      renderAdminLists();
    } catch (error) {
      $('#catalogLoading').addClass('hidden');
      $('#emptyCatalog').removeClass('hidden').find('h3').text('Katalog yüklenemedi');
      showToast(messageFromError(error), 'error');
    }
  };

  const loadHealth = async () => {
    try {
      await api({ url: '/health', method: 'GET' });
      $('#apiStatus').removeClass('text-slate-400').addClass('text-emerald-300').contents().last()[0].textContent = ' API hazır';
      $('#apiStatus span').removeClass('bg-amber-400').addClass('bg-emerald-400');
    } catch (error) {
      $('#apiStatus').addClass('text-rose-300').contents().last()[0].textContent = ' API çevrimdışı';
      $('#apiStatus span').removeClass('bg-amber-400').addClass('bg-rose-400');
    }
  };

  $('#authButton').on('click', () => openAuth('login'));
  $('#heroAuthButton').on('click', () => openAuth('register'));
  $('#loginTab').on('click', () => setAuthMode('login'));
  $('#registerTab').on('click', () => setAuthMode('register'));
  $('.modalClose').on('click', closeModals);
  $('#authModal, #checkoutModal').on('click', function (event) {
    if (event.target === this) closeModals();
  });
  $(document).on('keydown', (event) => {
    if (event.key === 'Escape') closeModals();
  });

  $('#authForm').on('submit', async function (event) {
    event.preventDefault();
    const $button = $('#authSubmit');
    const values = Object.fromEntries(new FormData(this).entries());
    if (state.authMode === 'login') {
      delete values.name;
      delete values.city;
    }
    setBusy($button, true);
    try {
      const result = await api({
        url: `/api/auth/${state.authMode === 'register' ? 'register' : 'login'}`,
        method: 'POST',
        data: JSON.stringify(values),
      });
      saveSession(result.token, result.user);
      closeModals();
      this.reset();
      showToast(state.authMode === 'register' ? 'Hesabın oluşturuldu.' : 'Tekrar hoş geldin!');
    } catch (error) {
      showToast(messageFromError(error), 'error');
    } finally {
      setBusy($button, false);
    }
  });

  $('#logoutButton').on('click', async () => {
    try {
      await api({ url: '/api/auth/logout', method: 'POST' });
    } catch (error) {
      // Local session is cleared even if the cookie endpoint is temporarily unavailable.
    }
    saveSession('', null);
    showToast('Oturum kapatıldı.');
  });

  $('#searchInput').on('input', renderProducts);
  $('#categoryFilter').on('change', renderProducts);
  $('#refreshCatalog').on('click', loadCatalog);

  $('#productGrid').on('click', '.checkoutButton', function () {
    const product = state.products.find((item) => item._id === $(this).data('product-id'));
    if (!state.user) {
      showToast('Satın almak için giriş yapmalısın.', 'error');
      openAuth('login');
      return;
    }
    if (!product) return;
    $('#checkoutForm [name="productId"]').val(product._id);
    $('#checkoutProduct').text(`${product.name} · ${formatPrice(product.price)}`);
    $('#checkoutModal').removeClass('hidden').addClass('flex');
  });

  $('#checkoutForm').on('submit', async function (event) {
    event.preventDefault();
    const $button = $(this).find('button[type="submit"]');
    const values = Object.fromEntries(new FormData(this).entries());
    setBusy($button, true, 'Ödeme hazırlanıyor…');
    try {
      const result = await api({ url: '/api/payments/checkout', method: 'POST', data: JSON.stringify(values) });
      showToast('Iyzico ödeme sayfasına yönlendiriliyorsun.');
      window.location.assign(result.paymentPageUrl);
    } catch (error) {
      showToast(messageFromError(error), 'error');
      setBusy($button, false);
    }
  });

  $('#categoryForm').on('submit', async function (event) {
    event.preventDefault();
    const $button = $(this).find('button[type="submit"]');
    const values = Object.fromEntries(new FormData(this).entries());
    setBusy($button, true);
    try {
      await api({ url: '/api/categories', method: 'POST', data: JSON.stringify(values) });
      this.reset();
      showToast('Kategori eklendi.');
      await loadCatalog();
    } catch (error) {
      showToast(messageFromError(error), 'error');
    } finally {
      setBusy($button, false);
    }
  });

  $('#productForm').on('submit', async function (event) {
    event.preventDefault();
    const $button = $(this).find('button[type="submit"]');
    const values = Object.fromEntries(new FormData(this).entries());
    values.price = Number(values.price);
    values.stock = Number(values.stock || 0);
    setBusy($button, true);
    try {
      await api({ url: '/api/products', method: 'POST', data: JSON.stringify(values) });
      this.reset();
      showToast('Ürün eklendi.');
      await loadCatalog();
    } catch (error) {
      showToast(messageFromError(error), 'error');
    } finally {
      setBusy($button, false);
    }
  });

  $('#adminCategoryList').on('click', '.deleteCategory', async function () {
    if (!window.confirm('Bu kategoriyi silmek istediğine emin misin?')) return;
    try {
      await api({ url: `/api/categories/${$(this).data('category-id')}`, method: 'DELETE', dataType: undefined });
      showToast('Kategori silindi.');
      await loadCatalog();
    } catch (error) {
      showToast(messageFromError(error), 'error');
    }
  });

  $('#adminProductList').on('click', '.deleteProduct', async function () {
    if (!window.confirm('Bu ürünü silmek istediğine emin misin?')) return;
    try {
      await api({ url: `/api/products/${$(this).data('product-id')}`, method: 'DELETE', dataType: undefined });
      showToast('Ürün silindi.');
      await loadCatalog();
    } catch (error) {
      showToast(messageFromError(error), 'error');
    }
  });

  renderSession();
  loadHealth();
  loadCatalog();
})(jQuery);
