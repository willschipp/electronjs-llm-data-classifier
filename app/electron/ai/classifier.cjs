
const path = require('path');

const classifications = [
    {
        "rank":1,
        "name":"Restricted",
        "description":"Most sensitive data limited in use to specific people",
        "labels":["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "rank":2,
        "name":"Sensitive PII",
        "description":"Personally Identifiable Information that could be used to harm an individual",
        "labels":["DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "rank":3,
        "name":"Confidential PII",
        "description":"Personally Identifiable Information that could be used to facilitate unlawful activity",
        "labels":["DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "rank":4,
        "name":"Confidential",
        "description":"non-PII data that relates to business and requires high levels of protection",
        "labels":["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","TELEPHONENUM","USERNAME","ZIPCODE"]
    },
    {
        "rank":5,
        "name":"Internal PII",
        "description":"Personally Identifiable Information that does not meet the criteria of Sensitive of Confidential PII",
        "labels":["EMAIL","GIVENNAME","PASSWORD","SURNAME","TELEPHONENUM","USERNAME"]
    },
    {
        "rank":6,
        "name":"Internal",
        "description":"non-PII data intended for business purposes and requires moderate protection",
        "labels":["BUILDINGNUM","CITY","STREET","ZIPCODE"]
    },
    {
        "rank":7,
        "name":"Public Information",
        "description":"Publicly available data that does not compromise confidentiality, integrity or availability",
        "labels":[]
    }   
]

const senstivities = [
    {
        "sensitivity": 1, 
        "name": "PASSWORD"
    },
    {
        "sensitivity": 2, 
        "name": "CREDITCARDNUMBER"
    },
    {
        "sensitivity": 3, 
        "name": "SOCIALNUM"
    },
    { 
        "sensitivity": 4,
        "name": "TAXNUM"
    },
    {
        "sensitivity": 5, 
        "name": "DRIVERLICENSENUM"
    },
    {
        "sensitivity": 6,
        "name": "IDCARDNUM"
    },
    {
        "sensitivity": 7,
        "name": "DATEOFBIRTH"
    },
    {
        "sensitivity": 8,
        "name": "ACCOUNTNUM"
    },
    {
        "sensitivity": 9,
        "name": "EMAIL"
    },
    {
        "sensitivity": 10,
        "name": "TELEPHONENUM"
    },
    {
        "sensitivity": 11,
        "name": "USERNAME"
    },
    {
        "sensitivity": 12,
        "name": "GIVENNAME"
    },
    {
        "sensitivity": 13,
        "name": "SURNAME"
    },
    {
        "sensitivity": 14,
        "name": "STREET"
    },
    {
        "sensitivity": 15,
        "name": "BUILDINGNUM"
    },
    {
        "sensitivity": 16,
        "name": "ZIPCODE"
    },
    {
        "sensitivity": 17,
        "name": "CITY"
    }
]

const keywords = [
    "ACCOUNTNUM",
    "BUILDINGNUM",
    "CITY",
    "CREDITCARDNUMBER",
    "DATEOFBIRTH",
    "DRIVERLICENSENUM",
    "EMAIL",
    "GIVENNAME",
    "IDCARDNUM",
    "PASSWORD",
    "SOCIALNUM",
    "STREET",
    "SURNAME",
    "TAXNUM",
    "TELEPHONENUM",
    "USERNAME",
    "ZIPCODE"
]

class GenerationPipeline {
    // static task = 'text2text-generation';
    static task = 'text-generation';
    // static model = 'Llama-3.2-3B-Instruct';
    // static model = "LaMini-Flan-t5-783M";
    static model = "SmolLM2-1.7B-Instruct";
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance == null) {
            let { pipeline, env } = await import('@huggingface/transformers');
            env.localModelPath = path.join(__dirname,'./models');
            env.allowRemoteModels = false;// don't remote download
            this.instance = pipeline(this.task,this.model,{progress_callback}); //dtype:'fp16',device:'cpu'
        } //end if
        return this.instance; //singleton pattern
    }
    
}


function getClassifications() {
    return classifications;
}

function getRankings() {
    return senstivities;
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
    let found = []
    results.forEach(result => {
        if (keywords.some(keyword => result['label'].includes(keyword))) {
            if (result['score'] > 0.00001) {
                //it's good... add
                found.push(result['label'].replace('I-','')); //clean up
            }//end if
        } //end if
    });
    //return
    return found
}

/**
 * process flow
 * - convert to text if necessary --> done
 * - run through classification module to detect elements --> done
 * - collate elements to determine ranking --> logically or LLM?
 */

async function llmValidation(results) {
    const generator = await GenerationPipeline.getInstance();

    // let prompt = `transform the following results to match the following labels and return only the json object.  Results=${results}, labels=${JSON.stringify(senstivities)}`

    //pass the validation in and invoke the llm to determine
    // let prompt = `Using the following classifications and sensitivity ranking, determine which is the minimum classification name for the following set of results. 
    //             Respond only with the name of the best matching classification.
    //             sensitivity_ranking=${JSON.stringify(senstivities)}
    //             classifications=${JSON.stringify(classifications)} 
    //             results=${results}`;

    let messages = [
        {
            role:"system",
            content:"You are an expert document handler."
        },
        {
            role:"user",
            content:prompt
        }
    ]

    // console.log(prompt);
    const validationResults = await generator(messages);
    //return
    console.log(validationResults);
    return validationResults[0]['generated_text'];
    // return validationResults[0].generated_text.at(-1).content;
}

module.exports = {
    classifyResults,
    processResults,
    getClassifications,
    llmValidation,
    getRankings
}