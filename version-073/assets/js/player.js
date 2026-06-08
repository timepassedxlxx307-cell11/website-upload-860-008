(function () {
  function preparePlayer(box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('.player-overlay');
    var button = box.querySelector('.play-button');
    var stream = box.getAttribute('data-stream');
    var mounted = false;
    var hls = null;
    if (!video || !stream) {
      return;
    }
    var play = function () {
      if (!mounted) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          mounted = true;
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
            hls.loadSource(stream);
          });
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          mounted = true;
          video.play().catch(function () {});
        } else {
          video.src = stream;
          mounted = true;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    };
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener('click', function () {
      if (!mounted) {
        play();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cinema-player').forEach(preparePlayer);
  });
})();
