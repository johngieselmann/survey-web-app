 (function(window, document, $, undefined) {

    // keep track of some common jq objects
    $win = $(window);
    $body = $("body");

    /**
     * Singleton app class that handles the bulk of the work for the survey.
     *
     * @author JohnG <john.gieselmann@gmail.com>
     */
    var app = {

        /**
         * The beginning, current, submit, and end elements.
         * @var obj section.$begin
         * @var obj section.$current
         * @var obj section.$submit
         * @var obj section.$end
         */
        section : {
            $begin   : null,
            $current : null,
            $submit  : null,
            $end     : null
        },

        /**
         * The survey button elements.
         * @var obj btn.$prev
         * @var obj btn.$next
         * @var obj btn.$submit
         * @var obj btn.$end
         */
        btn : {
            $prev   : null,
            $next   : null,
            $begin  : null,
            $submit : null
        },

        /**
         * The questions and answers data. The data gets assigned to the app
         * in qa.data.js
         * @var arr data
         */
        data         : null,

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
         * Keep track whether or not the app has been submitted.
         * @var bool submitted
         */
        submitted : false,

        /**
         * The settings for the app which are overridden by the config on init.
         * @var obj settings
         */
        settings : {

            // the title of the survey used in storing the data in localStorage
            title        : "survey_web_app",

            // full URL for submitting the results. if false, results are
            // saved in localStorage and logged to console for debugging
            url          : false,

            // additional parameters needed for submission, could be authentication
            // could be... whatever else you want to submit
            submitParams : {}
        },

        /**
         * Initialize the application.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj config The configuration for the questionnaire.
         *
         * @return void
         */
        init : function(config) {

            // update the settings based on the passed in configuration
            config = config || {};
            try {

                for (var i in config) {
                    // make sure we catch nested objects
                    if (typeof config[i] === "object") {
                        for (var j in config[i]) {
                            app.settings[i][j] = config[i][j];
                        }
                    } else {
                        app.settings[i] = config[i];
                    }
                }

            } catch (e) {
                console.log("You're doing something illegal:", e);
            }

            // assign the other classes
            app.trans = appTrans;

            // prepare app interaction
            app.captureElements();

            // set the current section to the beginning
            app.section.$current = app.section.$begin;

            // place the questions and answers
            app.prepareData();

            app.bindEvents();
        },

        /**
         * Capture the elements for the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        captureElements : function() {
            // get all the sections
            for (var s in app.section) {
                var sectionName = s.replace(/^\$/, "");
                app.section[s] = $("section.js-" + sectionName);
            }

            // get all the buttons
            for (var b in app.btn) {
                var btnName = b.replace(/^\$/, "");
                app.btn[b] = $(".js-btn-" + btnName);
            }
        },

        /**
         * Bind the events for the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        bindEvents : function() {
            // progress buttons
            app.btn.$begin.on("click", app.begin);
            app.btn.$prev.on("click", app.previousSection);
            app.btn.$next.on("click", app.nextSection);
            app.btn.$submit.on("click", app.submit);

            // scale the inputs as the window scales
            $win.on("resize", app.scaleAnswers);

            // validate inputs with each key and allow return to navigate
            $(".js-input").on("keyup", app.validateInput);
        },

        /**
         * Build all the questions and answers for the app and place them
         * on the page.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        prepareData : function() {

            // loop through all the data and create their elements
            for (var i in app.data) {

                // get the question data and create its element
                var qData = app.data[i];
                var $question = app.makeQuestion(qData);
                var $answers = $question.find(".js-answers");

                // create all the answers for this question
                for (var j in qData.answers) {
                    var $a = app.makeAnswer(qData, qData.answers[j]);
                    $answers.append($a);
                }

                // add the question section to the page just before the
                // submit section
                app.section.$submit.before($question);

                // add this question (unanswered) to the results object
                app.results[qData.id] = null;
            }

            // scale the answer buttons
            app.scaleAnswers();
        },

        /**
         * Scale the size of the answer buttons to be circles.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        scaleAnswers : function() {
            // set the height of each answer equal to its width
            $(".js-answer").each(function() {
                var $answer = $(this);

                // ignore inputs
                if ($answer.is("input")) {
                    return;
                }

                $answer.height($answer.width());
            });
        },

        /**
         * Make a question for the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj qData The question data.
         *
         * @return obj $el The jQuery element created.
         */
        makeQuestion : function(qData) {

            // create a CSS class name based on the number of available
            // answers for this question
            var numAnswers = "num-answers-" + qData.answers.length;

            // create the question text
            var $qText = $("<h1></h1>")
                .text(qData.display);

            var $answers = $("<div></div>")
                .addClass("answers js-answers clearfix");

            // create the containing section
            var $el = $("<section></section>")
                .addClass("js-question question right-off " + numAnswers)
                .attr("data-qid", qData.id)
                .attr("data-sid", qData.id);

            // add in custom attributes
            if (typeof qData.attr === "object") {
                app.addAttributes($el, qData.attr);
            }

            // add in the text and answers holder
            $el.append($qText);
            $el.append($answers);

            return $el;
        },

        /**
         * Make a button answer for a question.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj qData The question data.
         * @param obj aData The answer data.
         *
         * @return obj $el The jQuery element created.
         */
        makeAnswer : function(qData, aData) {

            // get the display text if present, otherwise default to value
            var display = typeof aData.display !== "undefined"
                ? aData.display
                : aData.value;

            // get the type of question and default to multiple choice
            var type = qData.type !== "undefined"
                ? qData.type
                : "multi";

            switch (type) {
                case "text":
                case "email":
                    var $answer = $("<input />")
                        .addClass("text js-input")
                        .attr("type", "text");
                    break;

                // multiple-choice questions are default
                case "multi":
                default:
                    // create the answer button
                    var $text = $("<p></p>")
                        .text(display);

                    var $answer = $("<div></div>")
                        .addClass("multi")
                        .append($text);

                    // bind the events to the button
                    $answer.on("click", app.saveAnswer);
                    $answer.on("click", app.nextSection);

                    break;
            }

            $answer.addClass("js-answer answer")
                .attr("data-validate", type)
                .attr("data-qid", qData.id)
                .attr("data-value", aData.value)


            // add in custom attributes
            if (typeof aData.attr === "object") {
                app.addAttributes($answer, aData.attr);
            }

            // allow hover states for non-touch devices
            if (!Modernizr.touch) {
                $answer.on("mouseover mouseout", app.toggleNotChosen);
            }

            return $answer;
        },

        /**
         * Add attributes to an element. See the documentation in swa.data.js
         * for specifications.
         *
         * @author JohnG <john.gieselmann@gmail.com
         *
         * @param obj $el The jQuery element getting the attributes.
         * @param obj attr The key value attributes being added.
         *
         * @return $el The finished element.
         */
        addAttributes : function($el, attr) {
            for (var name in attr) {
                switch (name) {

                    case "class":
                        $el.addClass(attr[name]);
                        break;

                    case "rel":
                    case "id":
                        $el.attr(name, attr[name]);
                        break;

                    default:
                        $el.attr("data-" + name, attr[name]);
                        break;
                }
            }

            return $el;
        },

        /**
         * Begin the Q & A with question 1.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        begin : function() {

            // remove the begin button / section from the screen
            app.trans.sectionMove($(".js-begin"));

            // show the proper buttons
            app.btn.$prev.addClass("inactive");
            app.btn.$next.addClass("inactive");

            // add the first question
            app.nextSection();

        },

        /**
         * Save an answer to the results.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        saveAnswer : function() {
            var $el = $(this)
                .removeClass("not-chosen")
                .removeClass("js-not-chosen")
                .addClass("chosen js-chosen");

            // update the chosen and not chosen status
            var $notChosen = $el.siblings()
                .addClass("js-not-chosen not-chosen");

            // add the answer to the results object
            app.results[$el.attr("data-qid")] = $el.attr("data-value");

        },

        /**
         * Load a section into the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param str|int|obj section The section id or element being removed
         *   from the app.
         *
         * @return void
         */
        loadSection : function(section) {

            // grab the section being loaded
            var $section = section instanceof jQuery
                ? section
                : $("[data-sid='" + section + "']");
            $section.addClass("active");

            // do not allow the back button if we are at the beginning
            // or if we are only on the first slide
            var $prev = $section.prev("section");
            if (   $section.is(app.section.$begin)
                || $prev.is(app.section.$begin)
            ) {
                app.toggleEl(app.btn.$prev, "inactive");
            } else {
                app.toggleEl(app.btn.$prev, "active");
            }

            // do not allow the next button if we are at the submit or an
            // unchosen answer slide
            if (   $section.is(app.section.$submit)
                || $section.find(".js-chosen").length < 1
            ) {
                app.toggleEl(app.btn.$next, "inactive");
            } else {
                app.toggleEl(app.btn.$next, "active");
            }

            // all loaded sections get moved in from the right
            app.trans.sectionMove($section, "right", true);

            // update the current section
            app.section.$current = $section;
        },

        /**
         * Remove a section from the app screen.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param str|int|obj section The section id or element being removed
         *   from the app.
         * @param str dir The direction in which to move the section.
         *
         * @return void
         */
        unloadSection : function(section, dir) {

            // default is to remove to the left
            dir = dir || "left";

            var $section = section instanceof jQuery
                ? section
                : $("[data-sid='" + section + "']");
            $section.removeClass("active");

            app.trans.sectionMove($section, dir, false);
        },

        /**
         * Move to the next section based on the current stored in the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        nextSection : function() {
            // if the button is inactive, we should not go on. also,
            // check if this is a question and that it has been answered
            if (   $(this).is(".inactive")
                || (   app.section.$current.is(".js-question")
                    && app.section.$current.find(".js-chosen").length < 1
                )
            ) {
                return false;
            }

            // get the next section
            var $next = app.section.$current.next("section");

            // unload the current secton and move on to the next
            app.unloadSection(app.section.$current.attr("data-sid"), "left");
            app.loadSection($next);
        },

        /**
         * Move to the previous section based on the current stored in the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        previousSection : function() {
            var $btn = $(this);
            var $previous = app.section.$current.prev("section");

            // if the button is inactive, we should not go back nor should
            // we go back if the previous is the beginning
            if (   $btn.is(".inactive")
                || $previous.is(".js-begin")
            ) {
                return false;
            } else {
                app.unloadSection(app.section.$current, "right");
                app.loadSection($previous);
            }
        },

        /**
         * Toggle a button from inactive to active and vice versa.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj $el The jQuery element to toggle.
         * @param str force Which direction to force the element.
         *   [active | inactive]
         */
        toggleEl : function($el, force) {
            force = force || false;

            // do not force, nature finds a way (true toggle)
            if (force === false) {

                if ($el.is("inactive")) {
                    $el.removeClass("inactive");
                    $el.addClass("active");
                } else {
                    $el.removeClass("active");
                    $el.addClass("inactive");
                }
            } else {

                // we are trying to force the button a certain way
                switch (force) {
                    case "active":
                        $el.removeClass("inactive");
                        $el.addClass("active");
                        break;

                    case "inactive":
                        $el.removeClass("active");
                        $el.addClass("inactive");
                        break;
                }
            }
        },

        /**
         * Toggle the other answers not chosen.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj e The jQuery event.
         *
         * @return void
         */
        toggleNotChosen : function(e) {
            var $el = $(this);
            var qid = $el.attr("data-qid");
            var $answers = $(".js-answer[data-qid='" + qid + "']");

            // this was triggered by a hover event
            if (typeof e !== "undefined") {

                switch (e.type) {
                    case "mouseover":
                        $el.removeClass("not-chosen")
                            .removeClass(".js-not-chosen");
                        $answers.not($el)
                            .addClass("not-chosen js-not-chosen");
                        break;

                    case "mouseout":
                    case "mouseleave":

                        // if one is selected, assign classes
                        var $chosen = null;
                        $answers.each(function() {
                            var $answer = $(this);
                            if ($answer.is(".js-chosen")) {
                                $chosen = $answer;
                                return false;
                            }
                        });

                        if ($chosen) {
                            $chosen.removeClass("not-chosen")
                                .removeClass("js-not-chosen");

                            $answers.not($chosen)
                                .addClass("not-chosen js-not-chosen");
                        } else {
                            $answers.removeClass("not-chosen")
                                .removeClass("js-not-chosen");
                        }
                        break;
                }

            }
        },

        /**
         * Validate an input to allow / disallow progress.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @param obj e The event object.
         *
         * @return bool valid Whether or not the input is valid.
         */
        validateInput : function(e) {

            // let's assume its invalid... safety first (as I never say)
            var valid = false;
            var $input = $(this);

            var type = $input.attr("data-validate");
            switch (type) {
                case "email":
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (re.test($input.val())) {
                        valid = true;
                    }
                    break;
                default:
                    // nothing for now
                    break;
            }

            // toggle the next button
            if (valid === false) {
                app.toggleEl(app.btn.$next, "inactive");
                $input.removeClass("js-chosen");
            } else {
                app.toggleEl(app.btn.$next, "active");
                $input.addClass("js-chosen");
            }

            // if the button pressed was enter / return try and go to the
            // next section
            if (e.keyCode === 13) {
                app.nextSection();
            }

            return valid;
        },

        /**
         * Submit the data.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         *
         * @return void
         */
        submit : function() {
            // haxorz be trying to submit twice, not in my house
            if (app.submitted === true) {
                return false;
            }

            var timestamp = Date.now();
            app.submitted = true;

            // create an object for posting the results
            var postData = {
                results   : app.results,
                timestamp : Date.now()
            };

            // assign any custom submit parameters to the post data
            if (typeof app.settings.submitParams === "object") {
                for (var i in app.settings.submitParams) {
                    postData[i] = app.settings.submitParams[i];
                }
            }

            // if online and url was provided, post to the url
            if (navigator.onLine && app.settings.url !== false) {

                $.ajax({
                    url     : app.settings.url,
                    type    : "POST",
                    data    : postData,
                    success : function(result) {
                        console.log("result: ", result);
                    },
                    error   : function(a, b, c) {
                        console.log("error a: ", a);
                        console.log("error b: ", b);
                        console.log("error c: ", c);
                    }
                });

            } else {
                // store locally
                var storeName = app.settings.title.toLowerCase().replace(/\s/g, "_");
                localStorage.setItem(
                    app.settings.title,
                    JSON.stringify(postData)
                );

                // console log for debugging
                console.log("RESULTS: ", postData);
            }

            // load the end section and remove all others
            app.nextSection();
//            app.btn.$prev.remove();
//            app.btn.$next.remove();
            app.toggleEl(app.btn.$prev, "inactive");
            app.toggleEl(app.btn.$next, "inactive");
            setTimeout(function() {
                $("section").not(app.section.$end).remove();
            }, 1000);
        }
    };

    /**
     * Singleton transition class for the survey app. It handles the specialized
     * movement of elements within the survey.
     *
     * @author JohnG <john.gieselmann@gmail.com>
     */
    var appTrans = {

        /**
         * Move a section within the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
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

    // assign the app to the window so it can be initialized elsewhere
    window.SurveyWebApp = app;

 })(window, document, jQuery, undefined);
