(function() {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function() {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (menuButton && nav) {
            menuButton.addEventListener("click", function() {
                nav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-hero]").forEach(function(hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function() {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                }
            }

            dots.forEach(function(dot) {
                dot.addEventListener("click", function() {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function() {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function() {
                    show(current + 1);
                    start();
                });
            }

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-panel]").forEach(function(panel) {
            var target = document.querySelector(panel.getAttribute("data-target"));
            if (!target) {
                return;
            }
            var input = panel.querySelector("[data-filter-search]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var reset = panel.querySelector("[data-filter-reset]");
            var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
            var empty = document.querySelector("[data-filter-empty]");

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function apply() {
                var q = normalize(input ? input.value : "");
                var selectedYear = normalize(year ? year.value : "");
                var selectedType = normalize(type ? type.value : "");
                var visible = 0;

                cards.forEach(function(card) {
                    var searchText = normalize(card.getAttribute("data-search"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var matched = true;

                    if (q && searchText.indexOf(q) === -1) {
                        matched = false;
                    }
                    if (selectedYear && cardYear.indexOf(selectedYear) === -1) {
                        matched = false;
                    }
                    if (selectedType && cardType.indexOf(selectedType) === -1) {
                        matched = false;
                    }

                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [input, year, type].forEach(function(control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            if (reset) {
                reset.addEventListener("click", function() {
                    if (input) {
                        input.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    if (type) {
                        type.value = "";
                    }
                    apply();
                });
            }
        });
    });
})();
