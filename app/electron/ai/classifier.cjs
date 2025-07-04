

const classifications = [
    {
        "name":"Restricted",
        "description":"Most sensitive data limited in use to specific people",
        "labels":["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "name":"Sensitive PII",
        "description":"Personally Identifiable Information that could be used to harm an individual",
        "labels":["DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "name":"Confidential PII",
        "description":"Personally Identifiable Information that could be used to facilitate unlawful activity",
        "labels":["DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "name":"Confidential",
        "description":"non-PII data that relates to business and requires high levels of protection",
        "labels":["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "name":"Internal PII",
        "description":"Personally Identifiable Information that does not meet the criteria of Sensitive of Confidential PII",
        "labels":["EMAIL","GIVENNAME","PASSWORD","SURNAME","TELEPHONENUM","USERNAME"]
    },
    {
        "name":"Internal",
        "description":"non-PII data intended for business purposes and requires moderate protection",
        "labels":["BUILDINGNUM","CITY","STREET","ZIPCODE"]
    },
    {
        "name":"Public Information",
        "description":"Publicly available data that does not compromise confidentiality, integrity or availability",
        "labels":[]
    }   
]

function getClassifications() {
    return classifications;
}

function classifyResults(results) {
    console.log(results)
    //receive an array of the results
    let classificationName = "";
    //check if the results match the labels for the classifications
    classifications.forEach(classification => {
        //check if the results match the labels
        let keywords = classification['labels'];
        let matches = 0;
        results.forEach(result => {
            if (keywords.some(keyword => result.includes(keyword))) {
                //have a match, increment
                matches += 1
            }//end if
        });
        if (matches == keywords.length) {
            //complete match
            classificationName = classification['name']
            return; //exit from the loop
        }
    });

    return classificationName;
}


function processResults(results) {
    //the results are a json array of objects
    //each object has a label
    //loop and check for if there are any instance of the key words
    let keywords = ["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    let found = []
    results.forEach(result => {
        if (keywords.some(keyword => result['label'].includes(keyword))) {
            if (result['score'] > 0.00001) {
                //it's good... add
                found.push(result['label']);
            }//end if
        } //end if
    });
    //return
    return found
}

module.exports = {
    classifyResults,
    processResults,
    getClassifications
}