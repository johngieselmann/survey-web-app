(function(window, document, undefined, $) {

    // the required classes / files for the app
    var classes = [
        "main",
        "data"
    ];

    var bootstrap = {
        init : function() {
            // included all of the required classes / files
            for (var i in classes) {
                document.write(
                    "<script src='js/app." + classes[i] + ".js'></script>"
                );
            }

        }
    };

    $(document).ready(function() {
        bootstrap.init();
    });

})(window, document, undefined, jQuery);
