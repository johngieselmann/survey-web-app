(function(window) {
    /**
     * The form data (questions and answers). It is an array of question
     * objects with all of their data. Each question and its answers is an
     * object in the appData array.
     *
     * var appData = [
     *     // question 1
     *     {
     *         id      : <str> // used for question identification on submission
     *         display : <str> // actual text displayed for the question
     *
     *         // the array of answer objects to go with the question
     *         answers : [
     *             // answer 1
     *             {
     *                 id      : <str> // used for answer identification on submission
     *                 value   : <str> // the value submitted for this answer
     *                 display : [str] // OPTIONAL: text displayed for the answer
     *                                 // if none is supplied it defaults to value
     *             }
     *         ]
     *     }
     * ];
     *
     */
    var appData = [
        // question 1
        {
            "id"      : "age_range",
            "display" : "What is your age range?",
            "attr"    : {
                "class" : "jam central station"
            },

            "answers" : [
                {
                    "id"      : 1,
                    "value"   : "1-18",
                    "display" : "1-18"
                },
                {
                    "id"      : 2,
                    "value"   : "19-30",
                    "display" : "19-30",
                    "attr"    : {
                        "class" : "boom"
                    }
                }
            ]
        },

        // question 2
        {
            "id"      : "gender",
            "display" : "What is your gender?",
            "attr"    : {
                "class" : "jam central station"
            },

            "answers" : [
                {
                    "id"      : 1,
                    "value"   : "male",
                    "display" : "Male"
                },
                {
                    "id"      : 2,
                    "value"   : "female",
                    "display" : "Female",
                    "attr"    : {
                        "class" : "jam central station"
                    }
                }
            ]
        }
    ];

    // assign the questions to the app
    window.QuestionnaireApp.data = appData;
})(window);
