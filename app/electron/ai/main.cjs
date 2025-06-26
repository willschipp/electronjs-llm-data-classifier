const path = require('path');
const { addon: ov } = require('openvino-node');

// const { create, globals } = require('webgpu');
// const { fileURLToPath} = require('url');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//models
//image-to-text Xenova/trocr-small-printed
//document-question-answering Xenova/donut-base-finetuned-docvqa

// Object.assign(globalThis,global);
// const navigator = { gpu: create([]) }



class ClassificationPipeline {
// NOTE: Replace this with your own task and model
    static task = 'text-classification';
    // static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    // static model = 'distilbert-base-uncased-finetuned-sst-2-english';
    // static model = 'onnx-community/piiranha-v1-detect-personal-information-ONNX';
    static model = 'piiranha-v1-detect-personal-information-ONNX';
    // static model = 'JasperLS/deberta-v3-base-pii-identifier-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        // const device = await(await navigator.gpu.requestAdapter()).requestDevice();

        if (this.instance === null) {
            // Dynamically import the Transformers.js library
            let { pipeline, env } = await import('@huggingface/transformers');
            env.localModelPath = path.join(__dirname,'./models');
            // env.localModelPath = './models';
            env.allowRemoteModels = false;
            this.instance = pipeline(this.task, this.model, { progress_callback, dtype:'fp16', device:'cpu'});
        }
        //return
        return this.instance;
    }    
}

function processPiiranhaResults(results) {
    //the results are a json array of objects
    //each object has a label
    //loop and check for if there are any instance of the key words
    let keywords = ["ACCOUNTNUM","BUILDINGNUM","CITY","CREDITCARDNUMBER","DATEOFBIRTH","DRIVERLICENSENUM","EMAIL","GIVENNAME","IDCARDNUM","PASSWORD","SOCIALNUM","STREET","SURNAME","TAXNUM","TELEPHONENUM","USERNAME","ZIPCODE"]
    let found = []
    results.forEach(result => {
        if (keywords.some(keyword => result['label'].includes(keyword))) {
            found.push(result['label'])
        } //end if
    });
    //return
    return found
}

// The run function is used by the `transformers:run` event handler.
// export async function run(event, text) {
async function run(event, text) {
    const classifier = await ClassificationPipeline.getInstance();
    const results = await classifier(text);
    //process the results
    const processResults = processPiiranhaResults(results)
    return processResults;
}

async function npuRunner(event,text) {
    //use the npu to load up the model
    const core = new ov.Core();
    const modelPath = path.join(__dirname,'./models/piiranha-v1-detect-personal-information-ONNX');
    console.log(modelPath);
    const model = await core.readModel(modelPath);
    const device = "AUTO";
    const compiledModel = await core.compileModel(model, device);

}

// export async function detect(event) {
async function detect(event) {
    const core = new ov.Core();
    return core.getAvailableDevices();
}

module.exports = {
    run,
    detect,
    npuRunner
}