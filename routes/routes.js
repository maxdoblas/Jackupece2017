var fs = require("fs");
var request = require("request");
var constants = require("../constants");
var Twitter = require('twitter');

var options = constants.options;
/**
 *  function getSentiment()
 * callback is a function to return parameter String
 * set complete path and do request
 */
function getSentiment(text, language, callback) {
  // set path
  options.url = constants.URL + constants.PATH_DEV + constants.RESOURCE_SENTIMENT;
  if (text != undefined && text != "" &&
    language != undefined && language != null &&
    (language === constants.SPANISH || language === constants.ENGLISH)) {
    // set parameters
    options.json = { textIn: text, language: language };
    // do request
    request(options, function (error, res, body) {
      if (error) {
        callback(constants.INVALID_URL);
        writeLog(constants.ERROR, constants.RESOURCE_SENTIMENT, 0,  constants.INVALID_URL);
      } else {
        handleRes(body, constants.RESOURCE_SENTIMENT, res.statusCode, callback);
      }
    });
  } else {
    callback(constants.TEXTIN_PARAMETER);
  }
}

/**
 *  function getLanguage()
 * callback is a function to return parameter String
 *
 * set complete path and do request
 *
 */
function getLanguage(text, callback) {
  // set url
  options.url = constants.URL + constants.PATH_DEV + constants.RESOURCE_LANGUAGE;
  if (text != undefined && text != "") {
      // set parameter
      options.json = { textIn: text };
      // do request
      request(options, function (error, res, body) {
        if (error) {
          callback(constants.INVALID_URL);
          writeLog(constants.ERROR, constants.RESOURCE_LANGUAGE, 0, constants.INVALID_URL);
        } else {
          handleRes(body, constants.RESOURCE_LANGUAGE, res.statusCode, callback);
        }
      });
  } else {
    callback(constants.SENTIMENT_PARAMETERS);
  }
}

/**
 * handleResp(resp, type, statusCode, callback)
 * resp, is response data
 * type, is type of resource, Sentiment or Language
 * statusCode response status code
 * callback is a function to return parameter String
 *
 * Check errors of response
 */
function handleRes(resp, type, statusCode, callback) {
  try {
    if (resp.message === constants.TASK_COMPLETED) {
      if (type === constants.RESOURCE_SENTIMENT) {
        callback(resp.results.prediction);
        writeLog(constants.SUCCESSFUL, type, statusCode, resp.results.prediction);
      } else if (type === constants.RESOURCE_LANGUAGE) {
        callback(resp.results.language);
        writeLog(constants.SUCCESSFUL, type, statusCode, resp.results.language);
      }
    } else if (statusCode === constants.FORBIDDEN) {
      callback(constants.MESSAGE_FORBIDDEN);
      writeLog(constants.ERROR, type, statusCode, constants.MESSAGE_FORBIDDEN);
    }  else if (resp.message === constants.EMPTY_MESSAGE && resp.status.executionStatusCode === constants.EXECUTION_CODE_WAIT) {
      callback(constants.MESSAGE_NOWAIT);
      writeLog(constants.ERROR, type, statusCode, constants.MESSAGE_NOWAIT);
    } else if (resp.message === NETWORK_ERROR) {
      callback(constants.NETWORK_ERROR);
      writeLog(constants.ERROR, type, statusCode, constants.NETWORK_ERROR);
    } else {
      callback(resp);
      writeLog(constants.ERROR, type, statusCode, resp);
    }
  } catch (err) {
     callback(constants.MESSAGE_EXCEPTION);
     writeLog(constants.ERROR, type, statusCode, constants.MESSAGE_EXCEPTION);
  }
}

function writeLog(success, type, statusCode, message) {
  fs.appendFile(constants.LOG_FILE, new Date().toISOString() + ": " + success + "[" + type + "][" + statusCode + "]" + message + '\n', function (err) {
    if (err) return console.log(err);
  });
};

//twitter hackup
/*


var karma=0;
var cc=0;

var params = {screen_name: 'theseapost_mar', count: 10, include_rts: false};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    for(var i=0;i<tweets.length;i++){
      console.log(tweets[i].text);
      getSentiment(tweets[i].text, "English", function (results) {
        console.log(results);
        if(results=="positive") karma++;
        else if(results=="neutral") karma+=0.5;
        cc++;
        if(cc==tweets.length){
          var r=0.0;
          r=karma/cc;
          console.log(karma/cc);
        }
      })
    }
  }
});



*/
var client = new Twitter({
  consumer_key: 'I53SDy6RHG6dbweLdBUeBUVga',
  consumer_secret: 'QoFnkdi5yirgxmvmO4aQnZeiyAAyoIlTi6IFEceMdy4cRWLBNy',
  access_token_key: '1475615647-I6Jz9LrKmwz4yzYOpi7U7UVuiGzNCjR7KLtbMiU',
  access_token_secret: '7xYzQ19bVr4zlC3pIgoHQtQtjKKdloBoENSu3kHmSGROV'
});
var appRouter = function(app) {

  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


  app.get("/", function(req, res) {
      res.sendFile('index.html', { root: constants.ROOT_PATH });
  });

  app.post("/language", function(req, res) {
    if(!req.body.text) {
        return res.send({"status": "error", "message": "missing a parameter"});
    } else {
      console.log("Llamando a api final");
      getLanguage(req.body.text,function (results) {
        console.log(results);
      return res.send(results);})

    }
});

app.post("/twitter", function(req, res) {
  if(!req.body.text || !req.body.language ) {
      return res.send({"status": "error", "message": "missing a parameter"});
  } else {
    var params = {screen_name: req.body.text , count: 10, include_rts:false};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        var karma=0;
        var cc=0;
        for(var i=0;i<tweets.length;i++){
          console.log(tweets[i].text);
          getSentiment(tweets[i].text, req.body.language , function (results) {
            console.log(results);
            if(results=="positive") karma++;
            else if(results=="neutral") karma+=0.5;
            cc++;
            if(cc==tweets.length){
              var r=0.0;
              r=karma/cc;
              console.log(r);
              return res.send(200,r);
            }
          })
        }
      }
    });

  }
});

app.post("/sentiment", function(req, res) {
  if(!req.body.text || !req.body.language ) {
      return res.send({"status": "error", "message": "missing a parameter"});
  } else {
    console.log("Llamando a api final");
    getSentiment(req.body.text,req.body.language,function (results) {
      console.log(results);
    return res.send(results);})
  }
});

}

module.exports = appRouter;
