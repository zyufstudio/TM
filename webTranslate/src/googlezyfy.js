(function () {
    (function injection() {
        var userLang = document.documentElement.lang;
        var uid = "{0}";
        var teId = "TE_" + uid;
        var cbId = "TECB_" + uid;

        function show() {
            window.setTimeout(function () {
                window[teId].showBanner(true)
            }, 10)
        }

        function newElem() {
            var elem = new google.translate.TranslateElement({
                autoDisplay: false,
                floatPosition: 0,
                multilanguagePage: true,
                pageLanguage: "auto"
            });
            return elem
        }
        if (window[teId]) {
            show()
        } else {
            if (!window.google || !google.translate || !google.translate.TranslateElement) {
                if (!window[cbId]) {
                    window[cbId] = function () {
                        window[teId] = newElem();
                        show()
                    }
                }
                var s = document.createElement("script");
                s.src = "https://translate.google.cn/translate_a/element.js?cb=" + encodeURIComponent(cbId) +
                    "&client=tee";
                document.getElementsByTagName("head")[0].appendChild(s)
            }
        }
    })()
})();