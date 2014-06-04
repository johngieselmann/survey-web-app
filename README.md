# Survey Web App

A survey web app / page that can be added to any site for easy capturing of
user input. Currently, it only supports multiple-choice answers. Deal with it.
Just consider it anonymous... you'll get more honest answers that way.

On submit, the questions and selected answers are posted as JSON to the URL
set during initialization.

## Requirements

- CSS Transitions support

## How To Use

Clone this repository to your site / server.
```
git clone https://git@github.com/johngieselmann/survey-web-app
```

Change the button text and 

Add your questions and answers to the `js/swa.data.js` file following the
guidlines outlined below and in the file.
```
var appData = [
    // question 1
    {
        id      : <str> // used for question identification on submission
        display : <str> // actual text displayed for the question

        // OPTIONAL: attributes to be added to the question's HTML
        // section tag. DO NOT USE "sid" as a custom attribute...
        // things will break and you will not be happy
        attr    : {
            id       : <str> // overrides the ID attribute
            rel      : <str> // overrides the rel attribute
            class    : <str> // appended to current classes
            <custom> : <str> // added as "data-<custom>" attribute
        }

        // the array of answer objects to go with the question
        answers : [
            // answer 1
            {
                value   : <str> // the answer value submitted for the question
                display : <str> // OPTIONAL: text displayed for the answer
                                // if none is supplied it defaults to value
                attr    : {}    // same as question attr, see above
            }
        ]
    }
];
```

Initialize the app anywhere after the two JavaScript files have been added
to the page `js/swa.app.js` and `js/swa.data.js`
```
<script type="text/javascript">
    // the configuration for the survey
    var config = {
        url : "http://example.com/survey"
    };

    var swa = window.SurveyWebApp;
    swa.init(config);
</script>
```

## Configuration

