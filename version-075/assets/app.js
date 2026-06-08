(function() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  var slider = document.getElementById('heroSlider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var next = slider.querySelector('[data-hero-next]');
    var prev = slider.querySelector('[data-hero-prev]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function(dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (next) {
      next.addEventListener('click', function() {
        show(index + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function() {
        show(index - 1);
        start();
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards(value, scope) {
    var root = scope || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-search]'));
    var empty = root.querySelector('[data-empty-text]') || document.querySelector('[data-empty-text]');
    var query = normalize(value);
    var visible = 0;

    cards.forEach(function(card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var match = !query || haystack.indexOf(query) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  var localInput = document.querySelector('[data-local-search]');
  if (localInput) {
    var list = document.querySelector('[data-filter-list]') || document;
    localInput.addEventListener('input', function() {
      filterCards(localInput.value, list.parentNode || document);
    });
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  if (searchInput && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    searchInput.value = q;
    filterCards(q, document);

    searchInput.addEventListener('input', function() {
      filterCards(searchInput.value, document);
    });

    document.querySelectorAll('[data-chip]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        searchInput.value = chip.getAttribute('data-chip') || '';
        filterCards(searchInput.value, document);
        searchInput.focus();
      });
    });
  }
})();
