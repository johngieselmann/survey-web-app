(function(window) {
    /**
     * The form data (questions and answers). It is an array of question
     * objects with all of their data. Each question and its answers is an
     * object in the appData array.
     *
     * var appData = [
     *     // question 1
     *     {
     *         id      : <value> // used for question identification on submission
     *         display : <value> // actual text displayed for the question
     *
     *         // the array of answer objects to go with the question
     *         answers : [
     *             // answer 1
     *             {
     *                 id      : <value> // used for answer identification on submission
     *                 value   : <value> // the value submitted for this answer
     *                 display : [value] // OPTIONAL: text displayed for the answer
     *                                   // if none is supplied it defaults to value
     *             }
     *         ]
     *     }
     * ];
     *
     */
    var appData = [
        // question 1
        {
            id      : 1,
            display : "What would you do for a Klondike bar?",
            a : [
                {
                    id : 1,
                    a  : "Nothing"
                },
                {
                    id : 2,
                    a  : "Kill a man"
                }
            ]
        },

        // question 2
        {
            id : 2,
            q  : "How awesome are you?",
            a  : [
                {
                    id : 1,
                    a  : "Very"
                },
                {
                    id : 2,
                    a  : "Somewhat"
                },
                {
                    id : 3,
                    a  : "Not very"
                }
            ]
        }
    ];

    // assign the questions to the app
    window.QuestionnaireApp.data = appData;
})(window);
