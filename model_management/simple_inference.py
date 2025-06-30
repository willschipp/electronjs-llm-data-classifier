# import openvino as ov

import openvino_genai as ov_genai
# # model_path = "piiranha-v1-detect-personal-information-npu"
# model_path = "piiranha-v1-detect-personal-information-ONNX"
model_path = "TinyLlama-1.1B-Chat-v1.0"
pipe = ov_genai.LLMPipeline(model_path, "NPU")
print(pipe.generate("a date of birth is 01/01/1980", max_new_tokens=100))

# from optimum.intel import OVModelForCausalLM
# model_id = "iiiorg/piiranha-v1-detect-personal-information"
# model_id = "iiiorg\\piiranha-v1-detect-personal-information-second"
# model = OVModelForCausalLM.from_pretrained(model_id,use_cache=False)
# print("saving...")

# from transformers import AutoTokenizer

# model.save_pretrained('pii_ov_model')

# tokenizer = AutoTokenizer.from_pretrained(model_id)

# inputs = tokenizer("date of birth is 01/01/1980", return_tensors="pt")
# outputs = model.generate(**inputs, max_new_tokens=50)
# print(tokenizer.decode(outputs[0], skip_special_tokens=True))