const path = require('path');
const { addon: ov } = require('openvino-node');

const { classifyResults, processResults, getClassifications, llmValidation } = require('./classifier.cjs');

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
            this.instance = pipeline(this.task, this.model, { progress_callback, dtype:'fp16', device:'cpu'}); //CPU device
        }
        //return
        return this.instance;
    }    
}

// The run function is used by the `transformers:run` event handler.
// export async function run(event, text) {
async function run(event, text, use_llm = false) {
    const classifier = await ClassificationPipeline.getInstance();
    const results = await classifier(text);
    //process the results
    const processedResults = processResults(results)
    //try the LLM approach
    let classification = "";
    if (use_llm) {
        console.log("using LLM...")
        classification = llmValidation(processedResults);
    } else {
        //process the results
        console.log("returning simple results")
        classification = classifyResults(processedResults);
    } //end if
    // return processedResults;
    return classification;
}

async function classifications(event) {
    return getClassifications();
}

async function npuRunner(event,text) {
    //use the npu to load up the model
    const core = new ov.Core();
    const modelPath = path.join(__dirname,'./models/' + model_name);
    console.log(modelPath);
    const model = await core.readModel(modelPath);
    const device = "AUTO";
    const compiledModel = await core.compileModel(model, device);

    // 2. Tokenize input
    // Replace MODEL_NAME with your real model's tokenizer identifier
    // const tokenizer = await AutoTokenizer.from_pretrained('piiranha-v1-detect-personal-information-ONNX'); // or your specific model
    // // Adjust max_length as required
    // const encoded = await tokenizer(text, { 
    //     padding: true, 
    //     truncation: true, 
    //     max_length: 128, 
    //     return_tensors: 'np'
    // });

    // return null;

    // // 3. Prepare input tensor(s)
    // // Get input names as expected by your model (may differ)
    // const inputs = {};
    // inputs['input_ids'] = new ov.Tensor('i32', encoded.input_ids.shape, encoded.input_ids.data);
    // if (encoded.attention_mask) {
    //     inputs['attention_mask'] = new ov.Tensor('i32', encoded.attention_mask.shape, encoded.attention_mask.data);
    // }

    // // 4. Run inference
    // const inferenceResult = await compiledModel.infer(inputs);

    // // 5. Postprocess the output
    // // Get first output tensor (check the output name)
    // const outputKey = compiledModel.outputNames[0];
    // const logits = inferenceResult[outputKey].data;

    // // For classification: softmax + argmax.
    // const expScores = logits.map(Math.exp);
    // const sumExp = expScores.reduce((a, b) => a + b, 0);
    // const probabilities = expScores.map(e => e / sumExp);
    // const predictedClass = probabilities.indexOf(Math.max(...probabilities));
    // const confidence = Math.max(...probabilities);

    // // 6. Return results
    // return {
    //     predictedClass,   // integer class index, map to class label as needed
    //     confidence,       // confidence score
    //     probabilities     // all class probabilities
    // };

}

// export async function detect(event) {
async function detect(event) {
    const core = new ov.Core();
    return core.getAvailableDevices();
}

module.exports = {
    run,
    detect,
    npuRunner,
    classifications
}