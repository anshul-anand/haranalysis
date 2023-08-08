// Input fom the user using the input field.
const loadFileSection = document.getElementById("load-file-section");
const loadSummary = document.getElementById("display-all-queries");
const mainInputButton = document.getElementById("load-file");
const resultSummary = document.getElementById("result-summary");
const resultDetails = document.getElementById("result-details-tile");
const displayMoreDetails = document.getElementById("display-selected-query");
const mainHeaderElement = document.getElementById("main-header");

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
    alert(
      "Could not read the file, Please check the file selected is a .har file"
    );
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
    finalObject = { id: id };

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
    // console.log("request header", requestHeaders);
    requestHeaders.forEach((element) => {
      // console.log("request element", element);
      if (
        element.name == "x-snowflake-context" ||
        element.name == "x-snowflake-context"
      ) {
        let snowflakeContext = element.value;
        let snowflakeUser = snowflakeContext.split(":")[0];
        let locatorUrl =
          snowflakeContext.split(":")[2] + snowflakeContext.split(":")[3];
        finalObject.snowflakeContext = snowflakeContext;
        finalObject.snowflakeUser = snowflakeUser;
        finalObject.locatorUrl = locatorUrl;
      } else if (
        element.name == "x-snowflake-role" ||
        element.name == "X-snowflake-role"
      ) {
        let snowflakeRole = element.value;
        finalObject.snowflakeRole = snowflakeRole;
      } else if (
        element.name == "x-snowflake-request-id" ||
        element.name == "X-snowflake-request-id"
      ) {
        ressnowflakeReqID = element.value;
        finalObject.ressnowflakeReqID = ressnowflakeReqID;
      } else if (
        element.name == "x-snowflake-request-id" ||
        element.name == "X-snowflake-request-id"
      ) {
        ressnowflakeReqID = element.value;
        finalObject.ressnowflakeReqID = ressnowflakeReqID;
      } else if (element.name == ":path") {
        SnowflakeRequestPath = element.value;
        finalObject.SnowflakeRequestPath = SnowflakeRequestPath;
      }
    });

    // query string
    var queryString = requests.queryString;
    var querySent = "";
    if (queryString) {
      querySent = queryString[0];
      if (querySent) {
        queryString.forEach((element) => {
          querySent = `${element.name}-${element.value}`;
        });
        finalObject.querySent = querySent;
      }
    }

    //post data
    var postData = element.request.postData;
    if (postData) {
      var postDataParams = postData.params;
      if (postDataParams) {
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
    // console.log("response header", responseSnowflakeRequestId);
    var ressnowflakeReqID = "";
    responseSnowflakeRequestId.forEach((element) => {
      rawData.responseSnowflakeRequestId = responseSnowflakeRequestId;
      if (
        element.name == "x-snowflake-request-id" ||
        element.name == "X-snowflake-request-id"
      ) {
        ressnowflakeReqID = element.value;
        finalObject.ressnowflakeReqID = ressnowflakeReqID;
      }
    });

    var responseContent = response.content;

    let totalTime = element.time;
    let timings = element.timings;
    finalObject.totalTime = totalTime;
    finalObject.timings = timings;

    finalObject.response = element.response;
    finalObject.request = element.request;

    finalObjectArray.push(finalObject);
  });

  displayResultSummary();
}

/// Function which generates the gs logs.
function substractMinutes(date, minutes) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}
function addMinutes(date, minutes) {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

// function to display the result summary and more details.
function displayResultSummary() {
  mainHeaderElement.classList.remove("main-header");
  mainHeaderElement.classList.add("main-header-alt");
  finalObjectArray.forEach((element) => {
    //// main item tile display
    let requestDiv = document.createElement("div");
    var status = element.responseStatus.toString();
    if (status[0] == "2") {
      requestDiv.classList.add("result-summary-tile-ok");
    } else if (status[0] == "5") {
      requestDiv.classList.add("result-summary-tile-error");
    } else if (status[0] == "4") {
      requestDiv.classList.add("result-summary-tile-error");
    } else {
      requestDiv.classList.add("result-summary-tile");
    }
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

    ///// implementing collapse using bootstrap
    // for more details.
    let bcollapse = document.createElement("p");
    bcollapse.classList.add("d-inline-flex", "gap-1");
    bcollapse.innerHTML = ` <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#detail${element.id}" aria-expanded="false" aria-controls="detail${element.id}">More Details</button>`;
    let bcollapsedivstyle = document.createElement("div");
    let bcollapsesecdiv = document.createElement("div");
    bcollapsesecdiv.classList.add("collapse", "collapse-vertical");
    bcollapsesecdiv.id = `detail${element.id}`;
    bcollapsedivstyle.appendChild(bcollapsesecdiv);
    let bcollapseCarddiv = document.createElement("div");
    bcollapseCarddiv.classList.add("card", "card-body");
    bcollapseCarddiv.id = "card-body";
    bcollapseCarddiv.style = "width: auto;";
    bcollapsesecdiv.appendChild(bcollapseCarddiv);
    let bcollapsecontentDiv = document.createElement("div");
    let moredetailslist = document.createElement("ul");
    for (const [key, value] of Object.entries(element)) {
      listItem = document.createElement("li");

      if (
        `${key}` == "request" ||
        `${key}` == "response" ||
        `${key}` == "id" ||
        `${key}` == "timings" ||
        `${key}` == "SnowflakeContext"
      ) {
        continue;
      }
      listItem.textContent = `${key} : ${value}`;
      if (`${key}` == "url") {
        listItem.textContent = `Request URL : ${value}`;
      } else if (`${key}` == "SnowflakeRequestPath") {
        listItem.textContent = `Request Path: ${value}`;
      } else if (`${key}` == "serverIPAddress") {
        listItem.textContent = `Server IP : ${value}`;
      } else if (`${key}` == "method") {
        listItem.textContent = `Method : ${value}`;
      } else if (`${key}` == "startedDateTime") {
        listItem.textContent = `Date Time : ${value}`;
      } else if (`${key}` == "data") {
        listItem.textContent = `Date : ${value}`;
      } else if (`${key}` == "time") {
        listItem.textContent = `Time : ${value}`;
      } else if (`${key}` == "querySent") {
        listItem.textContent = ` Query Text : ${value}`;
      } else if (`${key}` == "ressnowflakeReqID") {
        listItem.textContent = `Snowflake Request ID : ${value}`;
      } else if (`${key}` == "responseStatus") {
        listItem.textContent = ` Status : ${value}`;
      } else if (`${key}` == "snowflakeUser") {
        listItem.textContent = ` User Name : ${value}`;
      } else if (`${key}` == "locatorUrl") {
        listItem.textContent = ` Region URL : ${value}`;
      } else if (`${key}` == "SnowflakeRequestId") {
        listItem.textContent = ` Snowflake Request ID : ${value}`;
      } else if (`${key}` == "snowflakeRole") {
        listItem.textContent = ` Snowflake Role : ${value}`;
      } else {
        listItem.textContent = ` ${key} : ${value}`;
      }
      moredetailslist.appendChild(listItem);
    }

    bcollapsecontentDiv.appendChild(moredetailslist);
    bcollapseCarddiv.appendChild(bcollapsecontentDiv);
    collapseDiv.appendChild(bcollapse);
    collapseDiv.appendChild(bcollapsedivstyle);
    resultSummary.appendChild(requestDiv);
    requestDiv.appendChild(collapseDiv);

    /// Section which populates the queries to fetch the logs.

    if (element.SnowflakeRequestPath) {
      if (element.SnowflakeRequestPath.startsWith(`/v0/session/`)) {
        let logdetailsDiv = document.createElement("div");
        logdetailsDiv.id = "log-details-div";
        let bcollapselog = document.createElement("p");
        bcollapselog.classList.add("d-inline-flex", "gap-1");
        bcollapselog.innerHTML = ` <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#log${element.id}" aria-expanded="false" aria-controls="log${element.id}">Queries</button>`;
        let bcollapsedivstylelog = document.createElement("div");
        let bcollapsesecdivlog = document.createElement("div");
        bcollapsesecdivlog.classList.add("collapse", "collapse-vertical");
        bcollapsesecdivlog.id = `log${element.id}`;
        bcollapsedivstylelog.appendChild(bcollapsesecdivlog);
        let bcollapseCarddivlog = document.createElement("div");
        bcollapseCarddivlog.classList.add("card", "card-body");
        bcollapseCarddivlog.id = "card-body";
        bcollapseCarddivlog.style = "width: auto;";
        bcollapsesecdivlog.appendChild(bcollapseCarddivlog);
        let bcollapsecontentDivlog = document.createElement("div");
        logdetailsDiv.appendChild(bcollapselog);
        logdetailsDiv.appendChild(bcollapsedivstylelog);
        requestDiv.appendChild(logdetailsDiv);

        let logDataHeader = document.createElement("h4");
        logDataHeader.textContent = "SnowSight Logs";
        let logDataHeadertextArea = document.createElement("textarea");
        logDataHeadertextArea.readOnly = true;
        logDataHeadertextArea.id = "textarearequest";
        logDataHeadertextArea.cols = 120;
        logDataHeadertextArea.rows = 10;
        logDataHeader.appendChild(logDataHeadertextArea);

        ////////// displaying snosight query
        var logcurrenttime = new Date(element.startedDateTime);
        var logcurrenttimeIso = logcurrenttime.toISOString();

        // start time substracted 5 minutes
        var logfetchstarttime = substractMinutes(logcurrenttime, 5);
        var logfetchstarttimeISO = logfetchstarttime.toISOString();
        // end time added 5 minutes
        var logfetchendTime = addMinutes(logcurrenttime, 2);
        var logfetchendTimeISO = logfetchendTime.toISOString();
        console.log("element", element);
        var logRequestID = element.ressnowflakeReqID;
        console.log("logRequestID", logRequestID);
        var LocatorUrl = element.locatorUrl;
        var logLocatorUrl = "";
        if (LocatorUrl) {
          logLocatorUrl = LocatorUrl.split("/")[2].split(".")[0];
          console.log(logLocatorUrl);
        }

        let quriesToExecute = `
        --Event time = ${logcurrenttime};
        set start_time = '${logfetchstarttimeISO}';
        set end_time = '${logfetchendTimeISO}';
        set request_id = '${logRequestID}';
        set account_locator = '${logLocatorUrl}';

          select * from "SNOWHOUSE_LOGS"."AZEASTUS2PROD"."SNOWSIGHT_LOGS_V"
          where 1=1
          and timestamp_k8s >= $start_time
          and timestamp_k8s <= $end_time
          and session_account ilike $account_locator
          and request_id = $request_id
          order by timestamp_k8s desc;
        `;
        logDataHeadertextArea.value = quriesToExecute;

        // ///////// above code for snowsight logs.

        bcollapseCarddivlog.appendChild(bcollapsecontentDivlog);
        bcollapsecontentDivlog.appendChild(logDataHeader);
      }
    }

    // for raw details.
    let bcollapseraw = document.createElement("p");
    bcollapseraw.classList.add("d-inline-flex", "gap-1");
    bcollapseraw.innerHTML = ` <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#raw${element.id}" aria-expanded="false" aria-controls="raw${element.id}">Raw Data</button>`;
    let bcollapsedivstyleraw = document.createElement("div");
    let bcollapsesecdivraw = document.createElement("div");
    bcollapsesecdivraw.classList.add("collapse", "collapse-vertical");
    bcollapsesecdivraw.id = `raw${element.id}`;
    bcollapsedivstyleraw.appendChild(bcollapsesecdivraw);
    let bcollapseCarddivraw = document.createElement("div");
    bcollapseCarddivraw.classList.add("card", "card-body");
    bcollapseCarddivraw.id = "raw-card-body";
    bcollapseCarddivraw.style = "width: auto;";
    bcollapsesecdivraw.appendChild(bcollapseCarddivraw);

    bcollapseCarddiv.appendChild(bcollapseraw);
    bcollapseraw.appendChild(bcollapsedivstyleraw);
    bcollapsesecdivraw.appendChild(bcollapseCarddivraw);

    // // raw request
    let rawrequestcontentdiv = document.createElement("div");

    let rawDataRequestTextArearequest = document.createElement("h4");
    // rawDataRequestTextArearequest.textContent = "Request";
    let rawDataRequestTextArea = document.createElement("textarea");
    rawDataRequestTextArea.readOnly = true;
    rawDataRequestTextArea.id = "textarearequest";
    rawDataRequestTextArea.cols = 120;
    rawDataRequestTextArea.rows = 10;
    rawDataRequestTextArearequest.appendChild(rawDataRequestTextArea);
    rawrequestcontentdiv.appendChild(rawDataRequestTextArearequest);

    // //// raw response
    let rawDataResponseTextArearesponse = document.createElement("h4");
    // rawDataResponseTextArearesponse.textContent = "Response";
    let rawDataResponseTextArea = document.createElement("textarea");
    rawDataResponseTextArea.readOnly = true;
    rawDataResponseTextArea.id = "textarearesponse";
    rawDataResponseTextArea.cols = 120;
    rawDataResponseTextArea.rows = 10;
    rawDataResponseTextArearesponse.appendChild(rawDataResponseTextArea);
    rawrequestcontentdiv.appendChild(rawDataResponseTextArearesponse);

    // /// raw timings.
    let rawDataTimingsTextAreaTextTiming = document.createElement("h4");
    // rawDataTimingsTextAreaTextTiming.textContent = "Timings";
    let rawDataTimingsTextArea = document.createElement("textarea");
    rawDataTimingsTextArea.readOnly = true;
    rawDataTimingsTextArea.id = "textareastimings";
    rawDataTimingsTextArea.cols = 120;
    rawDataTimingsTextArea.rows = 10;
    rawDataTimingsTextAreaTextTiming.appendChild(rawDataTimingsTextArea);
    rawrequestcontentdiv.appendChild(rawDataTimingsTextAreaTextTiming);

    let requestValues = JSON.stringify(element.request, undefined, 4);
    let responseValues = JSON.stringify(element.response, undefined, 4);
    let timingsValues = JSON.stringify(element.timings, undefined, 4);
    rawDataRequestTextArea.value = `Requests:  
    ${requestValues}`;
    rawDataResponseTextArea.value = `Response:
    ${responseValues}`;
    rawDataTimingsTextArea.value = `Total Time:${element.totalTime}
    Timings:
    ${timingsValues}`;

    bcollapseCarddivraw.appendChild(rawrequestcontentdiv);
  });
}

/// Event listeners
// Listner for input item on the main page.
mainInputButton.addEventListener("change", readHarFile);
