import { movies } from './search-data.js';

var input = document.querySelector('#site-search');
var results = document.querySelector('#search-results');
var form = document.querySelector('#search-form');

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function card(movie) {
  return [
    '<a class="search-item" href="' + movie.url + '">',
    '  <img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
    '  <span>',
    '    <h2>' + escapeHtml(movie.title) + '</h2>',
    '    <p>' + escapeHtml([movie.year, movie.region, movie.type, movie.genre].filter(Boolean).join(' · ')) + '</p>',
    '    <p>' + escapeHtml(movie.line) + '</p>',
    '  </span>',
    '</a>'
  ].join('');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function render(keyword) {
  var q = normalize(keyword);
  var pool = movies;

  if (q) {
    pool = movies.filter(function (movie) {
      var text = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.line,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase();

      return text.indexOf(q) !== -1;
    });
  }

  results.innerHTML = pool.slice(0, 80).map(card).join('');
}

if (form && input && results) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render(input.value);
  });

  input.addEventListener('input', function () {
    render(input.value);
  });

  render('');
}
