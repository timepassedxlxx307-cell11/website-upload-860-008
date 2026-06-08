import { H as Hls } from './hls.js';

function preparePlayer(player) {
  var video = player.querySelector('video');
  var cover = player.querySelector('[data-play-cover]');
  var button = player.querySelector('[data-play-button]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('src');
  var nativeHls = video.canPlayType('application/vnd.apple.mpegurl');

  if (source && !nativeHls && Hls && Hls.isSupported()) {
    var hls = new Hls({
      maxBufferLength: 30,
      enableWorker: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    video.removeAttribute('src');
  }

  function start() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      start();
    });
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });
}

document.querySelectorAll('[data-player]').forEach(preparePlayer);
