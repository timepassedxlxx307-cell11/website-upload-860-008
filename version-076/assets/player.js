function setupMoviePlayer(videoId, coverId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    var loaded = false;
    var hls = null;

    if (!video || !streamUrl) {
        return;
    }

    function load() {
        if (loaded) {
            return;
        }
        loaded = true;
        video.playsInline = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function start() {
        load();
        video.controls = true;
        if (cover) {
            cover.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function() {});
        }
    }

    if (button) {
        button.addEventListener("click", start);
    }
    if (cover) {
        cover.addEventListener("click", start);
    }
    video.addEventListener("click", function() {
        if (video.paused) {
            start();
        }
    });
}
