(function () {
  var body = document.body;
  var navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      body.classList.toggle('nav-open');
    });
  }

  var carousels = document.querySelectorAll('.hero-carousel');
  carousels.forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var thumbs = Array.prototype.slice.call(carousel.querySelectorAll('.hero-thumb'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var activate = function (index) {
      current = index % slides.length;
      if (current < 0) {
        current = slides.length - 1;
      }
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('is-active', i === current);
      });
    };
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        activate(i);
      });
    });
    activate(0);
    window.setInterval(function () {
      activate(current + 1);
    }, 5200);
  });

  var panels = document.querySelectorAll('[data-search-panel]');
  panels.forEach(function (panel) {
    var targetSelector = panel.getAttribute('data-target') || '.movie-card-grid';
    var scope = document.querySelector(targetSelector) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var keywordInput = panel.querySelector('[data-filter-keyword]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var normalize = function (value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    };
    var update = function () {
      var keyword = normalize(keywordInput && keywordInput.value);
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-category'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || card.getAttribute('data-year') === year;
        var matchType = !type || card.getAttribute('data-type') === type;
        card.hidden = !(matchKeyword && matchYear && matchType);
      });
    };
    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', update);
        control.addEventListener('change', update);
      }
    });
    update();
  });
})();
