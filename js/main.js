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

        /**
         * The app buttons.
         */
        btns : {
            begin  : null,
            submit : null,
        },

        /**
         * The form data and its corresponding elements.
         * @var arr data
         * @var arr dataElements
         */
        data         : null,
        dataElements : [],

        /**
         * The navigation class
         * @var obj nav
         */
        nav : null,

        /**
         * The transition class.
         * @var obj trans
         */
        trans : null,

        /**
         * The results from the answers submitted.
         * @var obj results
         */
        results : {},

        /**
         * Initialize the application.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @return void
         */
        init : function() {

            // assign the other classes
            app.data = appData;
            app.trans = appTrans;

            // build the questions and answers
            app.buildDataElements();

            // prepare app interaction
            app.captureElements();
            app.bindEvents();

        },

        /**
         * Capture the elements for the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @return void
         */
        captureElements : function() {
            // get all the buttons
            for (var i in app.btns) {
                app.btns[i] = $(".js-btn-" + i);
            }
        },

        /**
         * Bind the events for the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @return void
         */
        bindEvents : function() {
            app.btns.begin.on("click", app.begin);
        },

        /**
         * Build all the questions and answers for the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         */
        buildDataElements : function() {
            var $main = $(".js-main");

            // loop through all the data and create their elements
            for (var i in app.data) {
                var qData = app.data[i];
                var dataEl = {
                    q : app.makeQuestion(qData),
                    a : []
                };

                // add this to the results object
                app.results[qData.id] = null;

                // create all the answers for this question
                for (var j in qData.a) {
                    var $a = app.makeAnswer(qData, qData.a[j]);
                    dataEl.a.push($a);
                    dataEl.q.append($a);
                }

                app.dataElements.push(dataEl);
                $main.append(dataEl.q);
            }
        },

        /**
         * Make a question for the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param obj qData The question data.
         *
         * @return obj $el The jQuery element created.
         */
        makeQuestion : function(qData) {

            // create the question text
            var $q = $("<h1></h1>")
                .text(qData.q);

            // create the containing section
            var $el = $("<section></section>")
                .addClass("js-question question right-off")
                .attr("data-qid", qData.id);

            $el.append($q);

            return $el;
        },

        /**
         * Make a button answer for a question.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param obj qData The question data.
         * @param obj aData The answer data.
         *
         * @return obj $el The jQuery element created.
         */
        makeAnswer : function(qData, aData) {

            // create the answer button
            var $el = $("<button></button>")
                .text(aData.a)
                .addClass("js-answer answer")
                .attr("data-qid", qData.id)
                .attr("data-aid", aData.id);

            // bind the events to the button
            $el.on("click", app.saveAnswer);
            $el.on("click", app.nextQuestion);

            return $el;
        },

        /**
         * Begin the Q & A with question 1.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @return void
         */
        begin : function() {

            // remove the begin button / section from the screen
            app.trans.sectionMove($(".js-begin"));

            // add the first question
            app.addQuestion(1);
        },

        /**
         * Save an answer to the results.
         */
        saveAnswer : function() {
            var $el = $(this);
            app.results[$el.attr("data-qid")] = $el.attr("data-aid");

            console.log("saved: ", app.results);
        },

        /**
         * Add a question to the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param int qid The question id being added to the app.
         *
         * @return void
         */
        addQuestion : function(qid) {
            console.log("add question", qid);

            var $q = $(".js-qestion[data-qid='" + qid + "']");
            $q.addClass("active");

            app.trans.sectionMove($q, "right", true);
        },

        /**
         * Remove a question from the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param int qid The question id being removed from the app.
         *
         * @return void
         */
        removeQuestion : function(qid) {

            var $q = $(".js-question[data-qid='" + qid + "']");
            $q.removeClass("active");

            app.trans.sectionMove($q, "left", false);
        },

        /**
         * Move to the next question.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param obj e The jQuery event object.
         * @param int qid The forced question to load next.
         *
         * @return void
         */
        nextQuestion : function(e, qid) {

            // if we are not passing in the question id, then this is being
            // called via a jQuery event binding
            if (typeof qid === "undefined") {
                qid = $(this).attr("data-qid");
            }

            // if we are at the end of the question, do not move forward
            if (qid === (dataElements.length - 1)) {
                console.log("at the end");
                return false;
            } else {
                var $el = $(".js-question[data-qid='" + qid + "']");
                app.removeQuestion(qid);
            }


        }
    };

    /**
     * The form data (questions and answers). It is an array of question
     * objects with all of their data.
     */
    var appData = [
        // question 1
        {
            id: 1,
            q : "What would you do for a Klondike bar?",
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

    /**
     * The transitioning of elements in the app.
     *
     * @author JohnG <john.gieselmann@upsync.com>
     */
    var appTrans = {

        /**
         * Move a section within the app.
         *
         * @author JohnG <john.gieselmann@upsync.com>
         *
         * @param obj $el The section jQuery element to move.
         * @param str direction The direction in which to move the section.
         * @param bool visible Whether or not the section is being moved on
         *   or off the screen (true = on screen, false = off screen).
         *
         * @return void
         */
        sectionMove : function($el, direction, visible) {

            // default direction is to the left
            direction = direction || "left";

            // default is to move the section off the screen
            visible = Boolean(visible) || false;
            var vis = visible === true
                ? "on"
                : "off";

            // remove any of the other classes
            $el.removeClass("left-off")
                .removeClass("left-on")
                .removeClass("right-off")
                .removeClass("right-on");

            // add the appropriate class
            $el.addClass(direction + "-" + vis);
        }
    };

    // initialize the app when the document is ready
    $(document).ready(function() {
        app.init();
    });

 })(window, document, $, undefined);
