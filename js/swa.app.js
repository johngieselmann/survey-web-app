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
         * The app buttons.
         */
        btns : {
            back   : null,
            begin  : null,
            submit : null
        },

        /**
         * The form data and its corresponding elements. The data gets assigned
         * to the app in qa.data.js
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
         * The beginning, current, submit, and end section jQuery objects.
         * @var obj $beginSection
         * @var obj $currentSection
         * @var obj $submitSection
         * @var obj $endSection
         */
        $beginSection   : $(".js-begin"),
        $currentSection : $(".js-begin"),
        $submitSection  : $(".js-submit"),
        $endSection     : $(".js-end"),

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
            url : false // full URL for form submission, if false stored
                        // in localStorage and logged to console (debug)
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
            for (var i in config) {
                app.settings[i] = config[i];
            }

            // assign the other classes
            app.trans = appTrans;

            // place the questions and answers
            app.buildDataElements();

            // prepare app interaction
            app.captureElements();
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
            // get all the buttons
            for (var i in app.btns) {
                app.btns[i] = $(".js-btn-" + i);
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
            app.btns.begin.on("click", app.begin);
            app.btns.back.on("click", app.previousSection);
            app.btns.submit.on("click", app.submit);
        },

        /**
         * Build all the questions and answers for the app.
         *
         * @author JohnG <john.gieselmann@gmail.com>
         */
        buildDataElements : function() {

            // get the submit section so we can place the questions, in order,
            // before it
            var $submit = $(".js-submit");

            // loop through all the data and create their elements
            for (var i in app.data) {

                // get the question data and start this data element object
                var qData = app.data[i];
                var dataEl = {
                    question : app.makeQuestion(qData),
                    answers  : []
                };

                // create all the answers for this question
                for (var j in qData.answers) {
                    var $a = app.makeAnswer(qData, qData.answers[j]);

                    dataEl.answers.push($a);
                    dataEl.question.append($a);
                }

                // add the question section to the page
                app.dataElements.push(dataEl);
                $submit.before(dataEl.question);

                // add this question (unanswered) to the results object
                app.results[qData.id] = null;

            }
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
            var $q = $("<h1></h1>")
                .text(qData.display);

            // create the containing section
            var $el = $("<section></section>")
                .addClass("js-question question right-off " + numAnswers)
                .attr("data-qid", qData.id)
                .attr("data-sid", qData.id);

            // add in custom attributes
            if (typeof qData.attr === "object") {
                app.addAttributes($el, qData.attr);
            }

            $el.append($q);

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

            // create the answer button
            var $el = $("<button></button>")
                .text(display)
                .addClass("js-answer answer")
                .attr("data-qid", qData.id)
                .attr("data-value", aData.value)
                .attr("data-aid", aData.id);

            // add in custom attributes
            if (typeof aData.attr === "object") {
                app.addAttributes($el, aData.attr);
            }

            // bind the events to the button
            $el.on("click", app.saveAnswer);
            $el.on("click", app.nextSection);

            // allow hover states for non-touch devices
            if (!Modernizr.touch) {
                $el.on("mouseover mouseout", app.toggleNotChosen);
            }

            return $el;
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
                        $el.addClass(" " + attr[name]);
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
            app.btns.back.addClass("inactive");

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
                .addClass("chosen");

            // update the chosen and not chosen status
            var $notChosen = $el.siblings()
                .addClass("not-chosen");

            // add the answer to the results object
            app.results[$el.attr("data-qid")] = $el.attr("data-aid");

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
            console.log(section);

            // toggle the back button appropriately
            // TODO: figure out toggling of back button
            //jam
//            if (sid === 1) {
//                app.toggleEl(app.btns.back, "inactive");
//            } else {
//                app.toggleEl(app.btns.back, "active");
//            }

            // grab the section being loaded
            var $section = section instanceof jQuery
                ? section
                : $("[data-sid='" + section + "']");
            $section.addClass("active");

            // all loaded sections get moved in from the right
            app.trans.sectionMove($section, "right", true);

            // update the current section
            app.$currentSection = $section;
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

            // get the next section
            var $next = app.$currentSection.next("section");

            // unload the current secton and move on to the next
            app.unloadSection(app.$currentSection.attr("data-sid"), "left");
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

            // if we are at the beginning of the survey, do not go back
            if (newSid === "begin") {
                return false;
            } else {
                var $previous = app.$currentSection.previous("section");
                app.unloadSection(app.$currentSection, "right");
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
                        $el.removeClass("not-chosen");
                        $answers.not($el)
                            .addClass("not-chosen");
                        break;

                    case "mouseout":
                    case "mouseleave":

                        // if one is selected, assign classes
                        var $chosen = null;
                        $answers.each(function() {
                            var $answer = $(this);
                            if ($answer.is(".chosen")) {
                                $chosen = $answer;
                                return false;
                            }
                        });

                        if ($chosen) {
                            $answers.not($chosen)
                                .addClass("not-chosen");
                        } else {
                            $answers.removeClass("not-chosen");
                        }
                        break;
                }

            }
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
            app.submitted = true;

            // if online and url was provided, post to the url
            if (navigator.onLine && app.settings.url !== false) {

                // create an object for posting the results
                var postData = {
                    results : app.results
                };

                // assign any custom submit parameters to the post data
                if (typeof app.settings.submitParams === "object") {
                    for (var i in app.settings.submitParams) {
                        postData[i] = app.settings.submitParams[i];
                    }
                }

                $.ajax({
                    url     : app.settings.url,
                    type    : "POST",
                    data    : app.results,
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
                localStorage.setItem(
                    "sample_web_app",
                    JSON.stringify(app.results)
                );

                // console log for debugging
                console.log("RESULTS: ", app.results);
            }

            // load the end section and remove all others
            app.loadSection(app.$endSection);
            app.btns.back.remove();
            setTimeout(function() {
                $("section").not(app.$endSection).remove();
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
