(function () {
  function setupPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.player-overlay');

    if (!video) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (stream) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
      }
    }

    function start() {
      if (button) {
        button.classList.add('is-hidden');
      }

      var playRequest = video.play();

      if (playRequest && typeof playRequest.catch === 'function') {
        playRequest.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
