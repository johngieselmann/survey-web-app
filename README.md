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

Change the button text and section headings in the `index.html` file if you so
desire. Below are your options:

- Buttons
    - Begin `button.js-btn-begin`
    - Submit `button.js-btn-submit`
- Headings
    - Begin `section.js-begin h1`
    - Submit `section.js-submit h1`
    - End `section.js-end h1`

Add your questions and answers to the `js/swa.data.js` file following the
guidlines outlined below and in the file.
```
var appData = [
    // question 1
    {
        id       : <str>  // used for question identification on submission
        display  : <str>  // actual text displayed for the question
        type     : <str>  // the type of question [email, text, tel, multi]
                          // (default is multi)
        required : <bool> // if required, can not move forward without
                          // a valid answer (default is true)

        // OPTIONAL: attributes to be added to the question's HTML
        // section tag. DO NOT USE "sid" as a custom attribute...
        // things will break and you will not be happy
        attr     : {
            id       : <str> // overrides the ID attribute
            rel      : <str> // overrides the rel attribute
            class    : <str> // appended to current classes
            <custom> : <str> // added as "data-<custom>" attribute
        }

        // the array of answer objects to go with the question
        answers  : [
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
        title        : "My Survey",
        url          : "http://example.com/survey",
        submitParams : {
            // none
        }
    };

    // initialize the survey
    var swa = window.SurveyWebApp;
    swa.init(config);
</script>
```

## Submissions

Submissions are posted to the URL passed into the app configuration. The data
is formatted as JSON and contains the following:
```
{
    results      : {
        question_id : answer_value // the question ID from the data and its
                                   // corresponding answer value from the data
    }
    timestamp    : 1234            // the UTC timestamp at time of submission
    navigator    : {}              // the browsers navigator object
    submitParam1 : xxxx            // all submitParams are added to the object
    submitParam2 : yyyy            // see above
}
```

## Configuration

Here are the possible configurations for the app when you initialize the survey.

- **title** str *default : "survey_web_app"*
    - The title of the survey used
in storing the data in localStorage
- **url** str | bool *default : false*
    - The full URL for submitting the results.
    - If false, results are saved in localStorage and logged to the console for debug.
- **submitParams** obj *default : {}*
    - Additional parameters to be submitted with the ajax request upon survey
      completion / submission.
