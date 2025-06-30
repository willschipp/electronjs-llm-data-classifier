from transformers import AutoTokenizer, AutoModelForTokenClassification

model_id = "iiiorg/piiranha-v1-detect-personal-information"

# model_id = "elastic/distilbert-base-cased-finetuned-conll03-english"
model = AutoModelForTokenClassification.from_pretrained(model_id)

original_ner_model_dir = 'original_ner_model'
model.save_pretrained(original_ner_model_dir)

tokenizer = AutoTokenizer.from_pretrained(model_id)

from functools import partial
from optimum.intel import OVQuantizer

from optimum.intel import OVModelForTokenClassification

# def preprocess_fn(data, tokenizer):
#     examples = []
#     for data_chunk in data["tokens"]:
#         examples.append(' '.join(data_chunk))

#     return tokenizer(
#         examples, padding=True, truncation=True, max_length=128
#     )

# quantizer = OVQuantizer.from_pretrained(model)
# calibration_dataset = quantizer.get_calibration_dataset(
#     "conll2003",
#     preprocess_function=partial(preprocess_fn, tokenizer=tokenizer),
#     num_samples=100,
#     dataset_split="train",
#     preprocess_batch=True,
#     trust_remote_code=True
# )

# The directory where the quantized model will be saved
quantized_ner_model_dir = "quantized_ner_model"

# Apply static quantization and save the resulting model in the OpenVINO IR format
# quantizer.quantize(calibration_dataset=calibration_dataset, save_directory=quantized_ner_model_dir)


# import ipywidgets as widgets
import openvino as ov

core = ov.Core()
# device = widgets.Dropdown(
#     options=core.available_devices + ["AUTO"],
#     value='AUTO',
#     description='Device:',
#     disabled=False,
# )

# print(f"{device}")

optimized_model = OVModelForTokenClassification.from_pretrained(quantized_ner_model_dir, device="NPU")

from transformers import pipeline

ner_pipeline_optimized = pipeline("token-classification", model=optimized_model, tokenizer=tokenizer)


output = ner_pipeline_optimized(text)

print(f"text {text} entities {output}")