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

// fetch values from headers.
function fetchValuesFromHeaders(headerarr, attributeName) {
  let obj = headerarr.find((o) => o.name === attributeName);
  return obj.value;
}

// function to display the result summary and more details.

function displayResultSummary() {
  finalObjectArray.forEach((element) => {
    let requestDiv = document.createElement("div");
    requestDiv.classList.add("result-summary-tile");
    requestDiv.id = `${element.id}`;
    let requesth2 = document.createElement("h2");
    let requesth2Text = document.createTextNode(` ${element.queryurl}`);
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

    // collapsable Button
    let collapseDiv = document.createElement("div");
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
    containerDiv.classList.add("content");

    const queryurlelement = document.createElement("h3");
    const queryurltext = document.createTextNode(
      `Query URL: ${element.queryurl}`
    );
    queryurlelement.appendChild(queryurltext);
    containerDiv.appendChild(queryurlelement);

    const querymethodelement = document.createElement("h3");
    const querymethodtext = document.createTextNode(
      `Method: ${element.method}`
    );
    querymethodelement.appendChild(querymethodtext);
    containerDiv.appendChild(querymethodelement);

    const queryresponseStatuselement = document.createElement("h3");
    const queryresponseStatustext = document.createTextNode(
      `Response: ${element.responseStatus}`
    );
    queryresponseStatuselement.appendChild(queryresponseStatustext);
    containerDiv.appendChild(queryresponseStatuselement);

    if (element.method !== "GET") {
      if (
        element.user ||
        element.snowflakeRequestId ||
        element.role ||
        element.queryString ||
        element.serverIPAddress ||
        element.startDayTime
      ) {

        const serverIPAddresselement = document.createElement("h3");
        const serverIPAddresstext = document.createTextNode(
          `Server IP Address:: ${element.serverIPAddress}`
        );
        serverIPAddresselement.appendChild(serverIPAddresstext);
        containerDiv.appendChild(serverIPAddresselement);

        const userelement = document.createElement("h3");
        const usertext = document.createTextNode(`User: ${element.user}`);
        userelement.appendChild(usertext);
        containerDiv.appendChild(userelement);

        const roleelement = document.createElement("h3");
        const roletext = document.createTextNode(`Role: ${element.role}`);
        roleelement.appendChild(roletext);
        containerDiv.appendChild(roleelement);

        const snowflakeRequestIdelement = document.createElement("h3");
        const snowflakeRequestIdtext = document.createTextNode(
          `Snowflake request ID: ${element.snowflakeRequestId}`
        );
        snowflakeRequestIdelement.appendChild(snowflakeRequestIdtext);
        containerDiv.appendChild(snowflakeRequestIdelement);

        const startDayTimeelement = document.createElement("h3");
        const startDayTimetext = document.createTextNode(
          `Start Day time: ${element.startDayTime}`
        );
        startDayTimeelement.appendChild(startDayTimetext);
        containerDiv.appendChild(startDayTimeelement);

        collapseDiv.appendChild(containerDiv);

        // Logic to work with collapsable button, TODO- As of now its listening to double click check and correct it to single click.

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
      }
    }
  });
}

// function to fetch the requested entries
function fetchRequestEntries() {
  for (var object in requestObjects) {
    //variable to store the parameters of the request.
    let position = object;
    let request = requestObjects[object];

    // Values for the requests and response
    let objRequests = request.request;
    let objResponse = request.response;

    // final extrcter object.
    let objectFinal = {};

    //creating an array with all the extracter fields.
    objectFinal.id = position;
    objectFinal.time = request.time;
    objectFinal.startDayTime = request.startedDateTime;
    objectFinal.serverIPAddress = request.serverIPAddress;

    // fetching values from the request header
    objectFinal.method = objRequests.method;
    objectFinal.queryurl = objRequests.url;
    objectFinal.queryString = objRequests.queryString;

    var reqHeaders = objRequests.headers;

    // checking specific value which is present in the request header
    for (i in reqHeaders) {
      let allKeys = reqHeaders[i].name;

      // if the key is present append the attribute to the final array.

      // for x-snowflake-context, Used this to derive the username and snowflake accountURL
      if (allKeys == "x-snowflake-context") {
        let requestContexxt = fetchValuesFromHeaders(
          reqHeaders,
          "x-snowflake-context"
        );
        // name of the user

        objectFinal.user = requestContexxt.split(":")[0];

        // account url
        objectFinal.accountURL =
          requestContexxt.split(":")[2] + requestContexxt.split(":")[3];
        // for x-snowflake-role used to fetch the role
      } else if (allKeys == "x-snowflake-role") {
        objectFinal.role = fetchValuesFromHeaders(
          reqHeaders,
          "x-snowflake-role"
        );
        //x-snowflake-request-id fetched the snowflake request id using this.
      } else if (allKeys == "x-snowflake-request-id") {
        objectFinal.snowflakeRequestId = fetchValuesFromHeaders(
          reqHeaders,
          "x-snowflake-request-id"
        );
      }
    }

    // response status and text
    objectFinal.responseStatus = objResponse.status;
    objectFinal.responseText = objResponse.statusText;

    // push to final array
    finalObjectArray.push(objectFinal);
  }
  displayResultSummary();
}

/// Event listeners

// Listner for input item on the main page.
mainInputButton.addEventListener("change", readHarFile);
