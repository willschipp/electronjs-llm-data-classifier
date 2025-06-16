const { path } = require('path');
const { addon: ov } = require('openvino-node');

//models
//image-to-text Xenova/trocr-small-printed
//document-question-answering Xenova/donut-base-finetuned-docvqa

class ClassificationPipeline {
// NOTE: Replace this with your own task and model
    static task = 'text-classification';
    // static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static model = 'distilbert-base-uncased-finetuned-sst-2-english';
    // static model = 'JasperLS/deberta-v3-base-pii-identifier-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            // Dynamically import the Transformers.js library
            let { pipeline, env } = await import('@huggingface/transformers');
            env.localModelPath = path.join(__dirname,'./models');
            // env.localModelPath = './models';
            env.allowRemoteModels = false;
            this.instance = pipeline(this.task, this.model, { progress_callback, dtype:'fp16' });
        }
        //return
        return this.instance;
    }    
}

// The run function is used by the `transformers:run` event handler.
// export async function run(event, text) {
async function run(event, text) {
    const classifier = await ClassificationPipeline.getInstance();
    return await classifier(text);
}

// export async function detect(event) {
async function detect(event) {
    const core = new ov.Core();
    return core.getAvailableDevices();
}

module.exports = {
    run,
    detect
}