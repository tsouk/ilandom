(function() {
  if (!window) {
    alert('No reference to the window object');
  }
  else {
    window.getUrlAndParseJson = function (url, callback, graphOptions) {
      var httpRequest;

      function makeRequest(url) {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
          console.log('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('GET', url);
        httpRequest.send();
      }

      function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            //console.log(httpRequest.responseText);
            if (typeof callback === 'function') {
              callback(JSON.parse(httpRequest.responseText), graphOptions);
            }
            else {
              console.log('Callback to GET request is not a function');
            }
          }
          else if (httpRequest.status === 307) {
            console.log('Could not connect, so serving test data for tsouk.com');
            callback(JSON.parse(httpRequest.responseText), graphOptions);
          }
          else {
            console.log('There was a problem with the request.');
          }
        }
      }

      try {
        makeRequest(url);
      }
      catch(e) {
        console.log(e);
      }
    };
  }
})();