(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('is-missing');
        }, { once: true });
    });

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var previous = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }

            index = (target + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        if (previous) {
            previous.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        show(0);
        restart();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-card-filter]');
        var region = scope.querySelector('[data-region-filter]');
        var category = scope.querySelector('[data-category-filter]');
        var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .ranking-row'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function filterItems() {
            var words = normalize(input ? input.value : '');
            var regionValue = region ? region.value : '';
            var categoryValue = category ? category.value : '';

            items.forEach(function (item) {
                var title = normalize(item.getAttribute('data-title'));
                var itemRegion = item.getAttribute('data-region') || '';
                var itemYear = normalize(item.getAttribute('data-year'));
                var itemGenre = normalize(item.getAttribute('data-genre'));
                var itemCategory = item.getAttribute('data-category') || '';
                var haystack = [title, normalize(itemRegion), itemYear, itemGenre, normalize(itemCategory)].join(' ');
                var matchedWords = !words || haystack.indexOf(words) !== -1;
                var matchedRegion = !regionValue || itemRegion === regionValue;
                var matchedCategory = !categoryValue || itemCategory === categoryValue;

                item.classList.toggle('is-filtered-out', !(matchedWords && matchedRegion && matchedCategory));
            });
        }

        if (input) {
            input.addEventListener('input', filterItems);
        }

        if (region) {
            region.addEventListener('change', filterItems);
        }

        if (category) {
            category.addEventListener('change', filterItems);
        }

        filterItems();
    });
})();
