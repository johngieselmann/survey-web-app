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
     *         // OPTIONAL: attributes to be added to the question's HTML
     *         // section tag. DO NOT USE "sid" as a custom attribute...
     *         // things will break and you will not be happy
     *         attr    : {
     *             id       : <str> // overrides the ID attribute
     *             rel      : <str> // overrides the rel attribute
     *             class    : <str> // appended to current classes
     *             <custom> : <str> // added as "data-<custom>" attribute
     *         }
     *
     *         // the array of answer objects to go with the question
     *         answers : [
     *             // answer 1
     *             {
     *                 value   : <str> // the answer value submitted for the question
     *                 display : <str> // OPTIONAL: text displayed for the answer
     *                                 // if none is supplied it defaults to value
     *                 attr    : {}    // same as question attr, see above
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
                    "value"   : "1-18",
                    "display" : "1-18"
                },
                {
                    "value"   : "19-30",
                    "display" : "19-30"
                },
                {
                    "value"   : "31-50",
                    "display" : "31-50"
                },
                {
                    "value"   : "51-70",
                    "display" : "51-70"
                },
                {
                    "value"   : "71+",
                    "display" : "71+"
                },
                {
                    "value"   : "na",
                    "display" : "Pass"
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
                    "value"   : "male",
                    "display" : "Male"
                },
                {
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
    window.SurveyWebApp.data = appData;
})(window);
