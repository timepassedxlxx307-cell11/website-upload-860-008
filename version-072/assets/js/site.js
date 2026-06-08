(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    callback();
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var headerSearch = document.querySelector('[data-header-search]');
    if (headerSearch) {
      headerSearch.addEventListener('submit', function (event) {
        var input = headerSearch.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
        }
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var nextButton = hero.querySelector('[data-hero-next]');
      var prevButton = hero.querySelector('[data-hero-prev]');
      var current = 0;
      var timer = null;

      function setSlide(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function startTimer() {
        if (slides.length < 2) {
          return;
        }
        clearInterval(timer);
        timer = setInterval(function () {
          setSlide(current + 1);
        }, 5200);
      }

      if (nextButton) {
        nextButton.addEventListener('click', function () {
          setSlide(current + 1);
          startTimer();
        });
      }

      if (prevButton) {
        prevButton.addEventListener('click', function () {
          setSlide(current - 1);
          startTimer();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          setSlide(dotIndex);
          startTimer();
        });
      });

      setSlide(0);
      startTimer();
    }

    var filterPanel = document.querySelector('[data-filter-panel]');
    if (filterPanel) {
      var searchInput = filterPanel.querySelector('[data-filter-search]');
      var typeSelect = filterPanel.querySelector('[data-filter-type]');
      var yearSelect = filterPanel.querySelector('[data-filter-year]');
      var regionSelect = filterPanel.querySelector('[data-filter-region]');
      var genreSelect = filterPanel.querySelector('[data-filter-genre]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
      var empty = document.querySelector('[data-empty-result]');

      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && searchInput) {
        searchInput.value = query;
      }

      function includesValue(source, value) {
        return !value || String(source || '').indexOf(value) !== -1;
      }

      function applyFilter() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var region = regionSelect ? regionSelect.value : '';
        var genre = genreSelect ? genreSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year')
          ].join(' ').toLowerCase();

          var ok = (!keyword || text.indexOf(keyword) !== -1) &&
            includesValue(card.getAttribute('data-type'), type) &&
            includesValue(card.getAttribute('data-year'), year) &&
            includesValue(card.getAttribute('data-region'), region) &&
            includesValue(card.getAttribute('data-genre'), genre);

          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [searchInput, typeSelect, yearSelect, regionSelect, genreSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilter);
          control.addEventListener('change', applyFilter);
        }
      });

      applyFilter();
    }
  });
})();
