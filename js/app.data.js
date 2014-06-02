 (function(window, document, $, undefined) {

    // keep track of some common jq objects
    $win = $(window);
    $body = $("body");

    /**
     * The form data (questions and answers). Where the question id is the
     * object key along with 
     *
     * @author JohnG <john.gieselmann@upsync.com>
     */
    var data = [
        {
            id: 1,
            q : "What would you do for a klondike bar?",
            a : [
                "Nothing",
                "Kill a man"
            ]
        }
    ];

    window.sampleFormApp.data = data;

 })(window, document, $, undefined);
