(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (slides.length > 1) {
            var current = 0;
            var showSlide = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === current);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    showSlide(i);
                });
            });
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterList = document.querySelector("[data-filter-list]");
        if (filterList) {
            var filterInput = document.querySelector("[data-filter-input]");
            var yearFilter = document.querySelector("[data-year-filter]");
            var typeFilter = document.querySelector("[data-type-filter]");
            var categoryFilter = document.querySelector("[data-category-filter]");
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q") || "";
            if (filterInput && q) {
                filterInput.value = q;
            }
            var cards = Array.prototype.slice.call(filterList.querySelectorAll(".filter-card"));
            var empty = document.createElement("div");
            empty.className = "no-result";
            empty.textContent = "没有找到匹配的影视作品";
            var applyFilters = function () {
                var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
                var year = yearFilter ? yearFilter.value : "";
                var type = typeFilter ? typeFilter.value : "";
                var category = categoryFilter ? categoryFilter.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var text = card.textContent.toLowerCase();
                    var matched = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (year && card.getAttribute("data-year") !== year) {
                        matched = false;
                    }
                    if (type && card.getAttribute("data-type") !== type) {
                        matched = false;
                    }
                    if (category && card.getAttribute("data-category") !== category) {
                        matched = false;
                    }
                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (visible === 0) {
                    if (!empty.parentNode) {
                        filterList.appendChild(empty);
                    }
                } else if (empty.parentNode) {
                    empty.parentNode.removeChild(empty);
                }
            };
            [filterInput, yearFilter, typeFilter, categoryFilter].forEach(function (item) {
                if (item) {
                    item.addEventListener("input", applyFilters);
                    item.addEventListener("change", applyFilters);
                }
            });
            applyFilters();
        }
    });

    window.setupMoviePlayer = function (source) {
        ready(function () {
            var video = document.getElementById("movie-player");
            var trigger = document.querySelector(".play-trigger");
            if (!video || !source) {
                return;
            }
            var attached = false;
            var attachSource = function () {
                if (attached) {
                    return;
                }
                attached = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
            };
            var start = function () {
                attachSource();
                if (trigger) {
                    trigger.classList.add("hidden");
                }
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            };
            if (trigger) {
                trigger.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        });
    };
})();
