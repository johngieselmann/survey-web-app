# Survey Web App

A survey web app / page that can be added to any site for easy capturing of
use data. Currently, it only supports multiple-choice answers. Deal with it.
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

Add your questions and answers to the `js/qa.data.js` file following the
guidlines outlined in the file and below.
```
var appData = [
    // question 1
    {
        id      : <str> // used for question identification on submission
        display : <str> // actual text displayed for the question

        // the array of answer objects to go with the question
        answers : [
            // answer 1
            {
                id      : <str> // used for answer identification on submission
                value   : <str> // the value submitted for this answer
                display : [str] // OPTIONAL: text displayed for the answer
                                // if none is supplied it defaults to value
            }
        ]
    }
];
```

Initialize the app anywhere after the two JavaScript files have been added
to the page `js/qa.app.js` and `js/qa.data.js`
```
<script type="text/javascript">
    // the configuration for the 
    var config = {
        url : false
    };

    var swa = window.SurveyWebApp;
    swa.init(config);
</script>
```
