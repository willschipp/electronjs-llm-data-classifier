## Model optimization

### NPU fine tuning

#### Model

iiiorg/piiranha-v1-detect-personal-information

#### Prerequisites
```sh
pip install  nncf==2.14.1 onnx==1.17.0 optimum-intel==1.22.0
pip install openvino==2025.2 openvino-tokenizers==2025.2 openvino-genai==2025.2
```

#### Onnx export
 
```sh
optimum-cli export openvino -m iiiorg/piiranha-v1-detect-personal-information --weight-format int4 --sym --ratio 1.0 --group-size -1 piiranha-v1-detect-personal-information-npu
```