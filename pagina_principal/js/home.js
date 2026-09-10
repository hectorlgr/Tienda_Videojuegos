$(document).ready(function() {

    const CART_KEY = 'checkpointCart';

    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCartDropdown();
    }

    function parsePrice(text) {
        return parseInt(text.replace(/[^0-9]/g, ''), 10);
    }

    function formatPrice(num) {
        return '$' + num.toLocaleString('es-CL');
    }

    function renderCartDropdown() {
        var cart = getCart();
        var $list = $('#cart-list');
        var totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

        $('#cart-count').text(totalQty);

        if (cart.length === 0) {
            $list.html('<p style="text-align: center; padding: 20px 0; color: #8D99AE;">Tu carrito está vacío</p>');
            $('#cart-summary').hide();
            return;
        }

        var html = '';
        var subtotal = 0;

        cart.forEach(function(item) {
            subtotal += item.price * item.qty;
            html += `
                <div class="product-widget" data-id="${item.id}">
                    <div class="product-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="product-body">
                        <h3 class="product-name"><a href="#">${item.name}</a></h3>
                        <h4 class="product-price"><span class="qty">${item.qty}x</span> ${formatPrice(item.price)}</h4>
                    </div>
                    <button class="delete cart-item-remove" data-id="${item.id}"><i class="fa fa-close"></i></button>
                </div>
            `;
        });

        $list.html(html);
        $('#cart-subtotal').text(formatPrice(subtotal));
        $('#cart-summary').show();
    }

    // Wishlist
    $('.add-to-wishlist').on('click', function(e) {
        e.preventDefault();
        $(this).find('i').toggleClass('fa-heart-o fa-heart');
    });

    $('.add-to-compare, .quick-view').on('click', function(e) {
        e.preventDefault();
    });

    // Añadir al carrito (sin redirigir)
    $('.add-to-cart-btn').on('click', function(e) {
        e.preventDefault();

        var $product = $(this).closest('.product');
        var name = $product.find('.product-name a').text().trim();
        var priceText = $product.find('.product-price').contents().first().text().trim();
        var price = parsePrice(priceText);
        var image = $product.find('.product-img img').attr('src');

        var cart = getCart();
        var existing = cart.find(item => item.name === name);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: name, name: name, price: price, qty: 1, image: image });
        }

        saveCart(cart);

        var $btn = $(this);
        $btn.text('¡Agregado!');
        setTimeout(function() {
            $btn.html('<i class="fa fa-shopping-cart"></i> añadir al carrito');
        }, 1000);
    });

    // Quitar producto desde el dropdown
    $(document).on('click', '.cart-item-remove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).data('id');
        var cart = getCart().filter(item => item.id !== id);
        saveCart(cart);
    });

    renderCartDropdown();

});