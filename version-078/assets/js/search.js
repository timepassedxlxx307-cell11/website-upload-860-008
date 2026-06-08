(function () {
  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var input = document.getElementById('searchQuery');
  var results = document.getElementById('searchResults');
  var heading = document.getElementById('searchHeading');
  var empty = document.getElementById('searchEmpty');
  var items = window.SEARCH_ITEMS || [];

  if (input) {
    input.value = query;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function card(item) {
    var tags = (item.tags || []).slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card">' +
      '<a class="movie-card__link" href="' + escapeHtml(item.url) + '">' +
      '<figure class="movie-card__poster">' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="movie-card__year">' + escapeHtml(item.year) + '</span>' +
      '</figure>' +
      '<div class="movie-card__body">' +
      '<h2 class="movie-card__title">' + escapeHtml(item.title) + '</h2>' +
      '<p class="movie-card__summary">' + escapeHtml(item.oneLine) + '</p>' +
      '<div class="tag-list">' + tags + '</div>' +
      '<div class="movie-card__meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
      '</div>' +
      '</a>' +
      '</article>';
  }

  function search() {
    var keyword = query.toLowerCase();
    var list = items;

    if (keyword) {
      list = items.filter(function (item) {
        return item.search.indexOf(keyword) !== -1;
      });
    }

    list = list.slice(0, 80);

    if (heading) {
      heading.textContent = keyword ? '搜索结果' : '推荐内容';
    }

    if (results) {
      results.innerHTML = list.map(card).join('');
    }

    if (empty) {
      empty.hidden = list.length !== 0;
    }
  }

  search();
}());
