(function () {
    var Hls = window.Hls;
    var players = document.querySelectorAll('[data-stream]');

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var curtain = player.querySelector('.player-curtain');
        var button = player.querySelector('.player-start');
        var stream = player.getAttribute('data-stream');
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached || !video || !stream) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (Hls && Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }

            attached = true;
        }

        function play() {
            attach();

            if (curtain) {
                curtain.classList.add('is-hidden');
            }

            if (video) {
                video.controls = true;
                var playback = video.play();

                if (playback && typeof playback.catch === 'function') {
                    playback.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                play();
            });
        }

        if (curtain) {
            curtain.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!attached || video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
