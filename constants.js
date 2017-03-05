var path = require('path');

var rootPath= path.resolve(__dirname);

module.exports = {

    ROOT_PATH:rootPath,
    // Path of SENTIMENT and LANGUAGE
    URL: 'https://jmlk74oovf.execute-api.eu-west-1.amazonaws.com',
    PATH_DEV: "/dev/", // path of dev folder
    RESOURCE_LANGUAGE: "language", // resource language
    RESOURCE_SENTIMENT: "sentiment", // resource sentiment

    // Constants error handlers
    TASK_COMPLETED: "Task completed successfully", // ALL GOOD
    FORBIDDEN: 403, // access denied for api key or incorrect path
    INVALID_RESOURCE: "Missing Authentication Token", // Access denied for invalid resource, not sentiment or language
    EMPTY_MESSAGE: "", // this error and EXECUTION_CODE_WAIT are request come back before finish of process, wait : true
    EXECUTION_CODE_WAIT: "taskWaiting",
    NETWORK_ERROR: "Network error communicating with endpoint",
    INVALID_URL: "Problems with request, timeout or cant reach host",

    // Constants of script
    TITLE_SENTIMENT: "\nSENTIMENT\n:::::::::",
    TITLE_LANGUAGE: "\nLANGUAGE\n::::::::",
    MESSAGE_FORBIDDEN: "Access denied, wrong api-key or incorrect path",
    MESSAGE_NOWAIT: "Sorry the request came back before it was finished processing, use ,qs: { wait: 'true' } in options",
    MESSAGE_INTERNAL_ERROR: "Internal error, failed in EM workflow",
    MESSAGE_EXCEPTION: "Exception",
    TEXTIN_PARAMETER: "textIn parameter is necessary",
    SENTIMENT_PARAMETERS: "textIn and language are necessary, language can be only (Spanish or English)",
    SPANISH: "Spanish",
    ENGLISH: "English",
    LOG_FILE: "./log.txt",
    ERROR: "[ERROR]",
    SUCCESSFUL: "[SUCCESSFUL]",

    // Options of request
    options: {
        method: 'POST',
        qs: { wait: 'true' }, // url iable
        headers:
        {
            'x-api-key': '9CAfxmC4WB10tnS9RY9oG92Io0M4trVp7HpTUEjR',
            'content-type': 'application/json'
        }
    },
}
