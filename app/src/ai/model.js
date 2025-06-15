const path = require('path')
const fs = require('fs');

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

            // NOTE: Uncomment this to change the cache directory
            // env.cacheDir = './.cache';
            env.localModelPath = path.join(__dirname,'./models');
            env.allowRemoteModels = false;


            this.instance = pipeline(this.task, this.model, { progress_callback, dtype:'fp16' });
        }

        return this.instance;
    }
}


class ExtractJSONFromPDF {
    // NOTE: Replace this with your own task and model
    // static task = 'image-text-to-text';
    static task = 'image-to-text';
    static model = 'SmolVLM-Instruct';

    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            // Dynamically import the Transformers.js library
            let { pipeline, env } = await import('@huggingface/transformers');

            // NOTE: Uncomment this to change the cache directory
            // env.cacheDir = './.cache';
            env.localModelPath = path.join(__dirname,'./models');
            env.allowRemoteModels = false;

            this.instance = pipeline(this.task, this.model, { progress_callback, dtype:'fp16' });
        }

        return this.instance;
    }
}


// The run function is used by the `transformers:run` event handler.
async function run(event, text) {
    const classifier = await ClassificationPipeline.getInstance();
    return await classifier(text);
}

async function extract(event,file) {
    //convert the file to an array
    // const fileData = fs.readFileSync(filePath);
    const byteArray = new Uint8Array(file);

    // const byteArray = await fileToByteArray(file);
    //prepare the message
    const messages = [
        {
            role: 'user',
            content: [
                {
                    type: 'image',
                    image: byteArray // Use byte array instead of URL
                },
                {
                    type: 'text',
                    text: 'convert the text in this pdf to a JSON object'
                }
            ]
        }
    ];
    //execute
    const extractor = await ExtractJSONFromPDF.getInstance();
    // const output = await extractor({text: messages, max_new_tokens: 60, return_full_text: false});
    const output = await extractor({text: messages});
    return output
}

module.exports = {
    run,
    extract
}