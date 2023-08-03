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
    // console.log("fileData", fileData);
    allRequests = fileData.log;
    // console.log("allRequests", allRequests);

    // console.log("temparr", temparr);
    fetchRequests();
    loadFileSection.hidden = true;
    loadSummary.hidden = false


  } catch (error) {
    console.log(error);
  }
}

// function to fetch all the requests, and return an array requestObjects with all the objects.

function fetchRequests() {
  var index = "";
  var request = "";
  var allRequestEntries = allRequests.entries;
  // console.log("allRequestEntries", allRequestEntries);
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

// this is a test finction can be deleted

document.addEventListener("click", (e) => {
  // Retrieve id from clicked element
  let elementId = e.target.id;
  // If element has id
  if (elementId !== "") {
    // console.log(elementId);
    if (elementId !== "load-file") {
      displayResultDetail(elementId);
    }
  }
  // If element has no id
  else {
    console.log("An element without an id was clicked.");
  }
});

// this is a test finction can be deleted

//function to fetch the requested values and store it in a seperate array
function displayResultSummary() {
  finalObjectArray.forEach((element) => {
    
    let requestDiv = document.createElement("div");
    requestDiv.classList.add("result-summary-tile");
    requestDiv.id = `${element.id}`;
    let requesth2 = document.createElement("h2");
    let requesth2Text = document.createTextNode(` ${element.queryurl}`);
    let requesth31 = document.createElement("h3");
    let requesth31Text = document.createTextNode(`${element.method}`);
    let requesth32 = document.createElement("h3");
    let request32text = document.createTextNode(
      `Status: ${element.responseStatus}`
    );
    let moreDetails = document.createElement("a");
    moreDetails.id = requestDiv.id;
    moreDetails.classList.add("more-details");
    moreDetails.href = `#${moreDetails.id}`;
    let moreDetailsText = document.createTextNode("More Details");

    requesth2.appendChild(requesth2Text);
    requesth31.appendChild(requesth31Text);
    requesth32.appendChild(request32text);
    requestDiv.appendChild(requesth2);
    requestDiv.appendChild(requesth31);
    requestDiv.appendChild(requesth32);
    moreDetails.appendChild(moreDetailsText);
    requestDiv.appendChild(moreDetails);
    resultSummary.appendChild(requestDiv);
  });
}

// function to display the result details, TODO, Fetch the value of the id and show the details of the requesst selected.
function displayResultDetail(id) {
  displayMoreDetails.hidden=false;
  finalObjectArray.forEach((element) => {
    // console.log(element);
    if (element.id == id) {
      // display the details section.

      let containerDiv = document.createElement("div");
    containerDiv.id = "detail-container-div"

      const queryurlelement = document.createElement("h3");
      const queryurltext = document.createTextNode(
        `Query URL: ${element.queryurl}`
      );
      queryurlelement.appendChild(queryurltext);
      const querymethodelement = document.createElement("h3");
      const querymethodtext = document.createTextNode(
        `Method: ${element.method}`
      );
      querymethodelement.appendChild(querymethodtext);
      const queryresponseStatuselement = document.createElement("h3");
      const queryresponseStatustext = document.createTextNode(
        `Response: ${element.responseStatus}`
      );
      queryresponseStatuselement.appendChild(queryresponseStatustext);

      containerDiv.appendChild(queryurlelement);
      containerDiv.appendChild(querymethodelement);
      containerDiv.appendChild(queryresponseStatuselement);
      

      resultDetails.appendChild(containerDiv);
      
      // console.log(element.queryurl);
      // console.log(element.method);
      // console.log(element.responseStatus);

      if (element.method !== "GET") {
        if (
          element.user ||
          element.snowflakeRequestId ||
          element.role ||
          element.queryString ||
          element.serverIPAddress ||
          element.startDayTime
        ) {
          console.log(element.user);
          console.log(element.snowflakeRequestId);
          console.log(element.role);
          console.log(element.serverIPAddress);
          console.log(element.startDayTime);

          const serverIPAddresselement = document.createElement("h3");
          const serverIPAddresstext = document.createTextNode(
            `Server IP Address:: ${element.serverIPAddress}`
          );
          serverIPAddresselement.appendChild(serverIPAddresstext);

          const userelement = document.createElement("h3");
          const usertext = document.createTextNode(`User: ${element.user}`);
          userelement.appendChild(usertext);

          const roleelement = document.createElement("h3");
          const roletext = document.createTextNode(`Role: ${element.role}`);
          roleelement.appendChild(roletext);

          const snowflakeRequestIdelement = document.createElement("h3");
          const snowflakeRequestIdtext = document.createTextNode(
            `Snowflake request ID: ${element.snowflakeRequestId}`
          );
          snowflakeRequestIdelement.appendChild(snowflakeRequestIdtext);

          const startDayTimeelement = document.createElement("h3");
          const startDayTimetext = document.createTextNode(
            `Start Day time: ${element.startDayTime}`
          );
          startDayTimeelement.appendChild(startDayTimetext);

          containerDiv.appendChild(serverIPAddresselement);
          containerDiv.appendChild(userelement);
          containerDiv.appendChild(roleelement);
          containerDiv.appendChild(snowflakeRequestIdelement);
          containerDiv.appendChild(startDayTimeelement);
          containerDiv.appendChild(resultDetails)
        }
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

    // console.log(request);

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
    // console.log(reqHeaders);

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
