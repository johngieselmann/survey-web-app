/**
 * Self executing anonymous function to keep everything out of the global
 * scope.
 *
 * @author JohnG <john.gieselmann@upsync.com>
 */
 (function(window, document, $, undefined) {

    // keep track of some common jq objects
    $win = $(window);
    $body = $("body");

    /**
     * Object literal class.
     *
     * @author JohnG <john.gieselmann@upsync.com>
     */
    var app = {
        init: function() {

        }
    };

    app.init();

 })(window, document, $, undefined);
