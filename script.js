// Input fom the user using the input field.
const loadFileSection = document.getElementById("load-file-section");
const loadSummary = document.getElementById("display-all-queries");
const mainInputButton = document.getElementById("load-file");
const resultSummary = document.getElementById("result-summary");
const resultDetails = document.getElementById("result-details-tile");
const displayMoreDetails = document.getElementById("display-selected-query");

// variables for storing data.
//variable with loaded har file data.
let allRequests = "";
// filtered parameters from the requests and loaded in the following veriable.
let requestObjects = [];
// final array:
var finalObjectArray = [];
// final rawObject Array
var finalRawObjectArray = [];

// Function to fetch the requests save it to a variable.
async function readHarFile() {
  try {
    const dataString = await this.files[0].text();
    const data = JSON.parse(dataString);
    //har content stored in fileData
    let fileData = data;
    allRequests = fileData.log;
    fetchRequests();
    loadFileSection.hidden = true;
    loadSummary.hidden = false;
  } catch (error) {
    console.log(error);
  }
}

// function to fetch all the requests, and return an array requestObjects with all the objects.
function fetchRequests() {
  var index = "";
  var request = "";
  var allRequestEntries = allRequests.entries;
  for (var request in allRequestEntries) {
    index = request;
    request = allRequestEntries[request];

    requestObjects.push(request);
  }
  fetchRequestEntries();
}

// Aside function, Wused while fetching the entries

// fetch values from headers.
function fetchValuesFromHeaders(headerarr, attributeName) {
  let obj = headerarr.find((o) => o.name === attributeName);
  return obj.value;
}

// function to fetch the requested entries
function fetchRequestEntries() {
  ////// new code ////////////////////////////////
  let finalObject = {};
  let rawData = {};

  /// This contains an array of javascript objects.
  var mainentries = requestObjects;
  // find queries

  requestObjects.forEach((element, index) => {
    // enter the id to trace:
    var id = index;

    /// start date time.
    var startedDateTime = mainentries.find((item) => element.startedDateTime);
    startedDateTime = startedDateTime.startedDateTime;
    finalObject = {};

    // fetching the values from request
    var requests = element.request;

    // fetching URL
    var url = requests.url;
    finalObject.url = url;

    // server IP address
    if (element.serverIPAddress) {
      var serverIPAddress = mainentries.find((item) => element.serverIPAddress);
      serverIPAddress = serverIPAddress.serverIPAddress;
      finalObject.serverIPAddress = serverIPAddress;
    }
    var method = requests.method;
    finalObject.method = method;

    // Start Date time
    finalObject.startedDateTime = startedDateTime;

    let [dateValues, timevalues] = startedDateTime.split("T");
    timevalues.split("+");
    // timevalues = `${timevalues.split("+")[0]} UTC+${timevalues.split("+")[1]}`;
    finalObject.data = dateValues;
    finalObject.time = timevalues;

    // Values from request Headers.
    var requestHeaders = requests.headers;
    for (i in requestHeaders) {
      rawData.requestHeaders = requestHeaders;
      let allkeys = requestHeaders[i].name;

      if (allkeys == "X-Snowflake-Context") {
        var SnowflakeContext = fetchValuesFromHeaders(
          requestHeaders,
          "X-Snowflake-Context"
        );
        finalObject.SnowflakeContext = SnowflakeContext;
      } else if (allkeys == "X-Snowflake-Request-Id") {
        var SnowflakeRequestId = fetchValuesFromHeaders(
          requestHeaders,
          "X-Snowflake-Request-Id"
        );
        finalObject.SnowflakeRequestId = SnowflakeRequestId;
      } else if (allkeys == "X-Numeracy-Client-Version") {
        var NumeracyClientVersion = fetchValuesFromHeaders(
          requestHeaders,
          "X-Numeracy-Client-Version"
        );
        finalObject.NumeracyClientVersion = NumeracyClientVersion;
      } else if (allkeys == "X-Snowflake-Role") {
        var SnowflakeRole = fetchValuesFromHeaders(
          requestHeaders,
          "X-Snowflake-Role"
        );
        finalObject.SnowflakeRole = SnowflakeRole;
      }
      // query string
      var queryString = requests.queryString;
      var querySent = "";
      if (queryString) {
        querySent = queryString[0];
        if (querySent) {
          queryString.forEach((element) => {
            querySent = `${element.name}:${element.value}`;
          });
          finalObject.querySent = querySent;
        }
      }

      //post data
      var postData = element.request.postData;
      if (postData) {
        var postDataParams = postData.params;
        if (postDataParams.length !== 0) {
          postDataParams.forEach((element) => {});
        }
      }

      // fetching values from response
      var response = element.response;
      var responseStatus = response.status;
      var responseText = response.statusText;

      finalObject.responseStatus = responseStatus;
      finalObject.responseText = responseText;

      var responseSnowflakeRequestId = response.headers;
      var ressnowflakeReqID = "";
      responseSnowflakeRequestId.forEach((element) => {
        rawData.responseSnowflakeRequestId = responseSnowflakeRequestId;
        if (element.name == "x-snowflake-request-id") {
          ressnowflakeReqID = element.value;
          finalObject.ressnowflakeReqID = ressnowflakeReqID;
        }
      });

      var responseContent = response.content;

      if (responseContent.text) {
      }
    }

    // extracting username and password
    let userName = "";
    let regionUrl = "";
    if (userName) {
      finalObject.userName = userName;
    }
    if (regionUrl) {
      finalObject.regionUrl = regionUrl;
    }
    if (SnowflakeContext !== undefined) {
      userName = SnowflakeContext.split(":")[0];
      regionUrl =
        SnowflakeContext.split(":")[2] + SnowflakeContext.split(":")[3];
    }
    // timings.
    let totalTime = element.time;
    let timings = element.timings;
    finalObject.totalTime;
    finalObject.timings;

    // check for undefined snowflake SnowflakeRequestId and change it to not set.
    if (SnowflakeRequestId === undefined) {
      SnowflakeRequestId = "absent";
      ressnowflakeReqID = "absent";
    }
    if (SnowflakeContext === undefined) {
      SnowflakeContext = "absent";
      userName = "absent";
      regionUrl = "absent";
    }
    if (SnowflakeRole === undefined) {
      SnowflakeRole = "Does not exist";
    }
    if (NumeracyClientVersion === undefined) {
      NumeracyClientVersion = "Does not exist";
    }

    finalObjectArray.push(finalObject);
  });

  displayResultSummary();
}

// function to display the result summary and more details.
function displayResultSummary() {
  finalObjectArray.forEach((element) => {
    //// main item tile display
    let requestDiv = document.createElement("div");
    requestDiv.classList.add("result-summary-tile");
    requestDiv.id = `${element.id}`;
    let requesth2 = document.createElement("h2");
    let requesth2Text = document.createTextNode(` ${element.url}`);
    requesth2.appendChild(requesth2Text);
    requestDiv.appendChild(requesth2);

    let requesth31 = document.createElement("h3");
    let requesth31Text = document.createTextNode(`${element.method}`);
    requesth31.appendChild(requesth31Text);
    requestDiv.appendChild(requesth31);

    let requesth32 = document.createElement("h3");
    let request32text = document.createTextNode(
      `Status: ${element.responseStatus}`
    );
    requesth32.appendChild(request32text);
    requestDiv.appendChild(requesth32);

    // dicision to hold collapsable button
    let collapseDiv = document.createElement("div");
    collapseDiv.id = "more-details-div";

    // collapsable Button
    let collapseButtonForMoreDetails = document.createElement("button");
    collapseButtonForMoreDetails.classList.add("collapsible");
    collapseButtonForMoreDetails.type = "button";
    collapseButtonForMoreDetails.textContent = "Details";
    collapseButtonForMoreDetails.id = "collapse-button";
    collapseDiv.appendChild(collapseButtonForMoreDetails);
    requestDiv.append(collapseDiv);
    resultSummary.appendChild(requestDiv);

    let containerDiv = document.createElement("div");
    containerDiv.id = "detail-container-div";

    /// Logic for more details
    let moredetailsDiv = document.createElement("div");
    moredetailsDiv.classList.add("content");
    collapseDiv.appendChild(moredetailsDiv);
    let moredetailslist = document.createElement("ul");
    moredetailsDiv.appendChild(moredetailslist);

    for (const [key, value] of Object.entries(element)) {
      let listItem = `li${element.id}`;
      listItem = document.createElement("li");
      listItem.textContent = `${key} : ${value}`;
      moredetailslist.appendChild(listItem);
    }

    var coll = document.getElementsByClassName("collapsible");

    // listening for the click event and looking for the id returned, and making the collapsable behave on the click.
    document.addEventListener("click", (e) => {
      // Retrieve id from clicked element
      let elementId = e.target.id;
      if (elementId !== "") {
        if (elementId == "collapse-button") {
          for (var i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
              this.classList.toggle("active");
              var content = this.nextElementSibling;
              if (content.style.display === "block") {
                content.style.display = "none";
              } else {
                content.style.display = "block";
              }
            });
          }
        }
      } else {
        console.log("An element without an id was clicked.");
      }
    });
    // logic to display Raw items
  });
}

/// Event listeners

// Listner for input item on the main page.
mainInputButton.addEventListener("change", readHarFile);
