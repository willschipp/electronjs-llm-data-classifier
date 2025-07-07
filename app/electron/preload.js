const { contextBridge, ipcRenderer, webUtils } = require('electron');
// import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
    },    
    run: (text,use_llm) => ipcRenderer.invoke('transformers:run',text,use_llm),
    npuRunner: (text) => ipcRenderer.invoke('openvino:npuRunner',text),
    detect: () => ipcRenderer.invoke('openvino:detect'),
    parser: (path) => ipcRenderer.invoke('document:parser',path),
    path: (file) => {
        const path = webUtils.getPathForFile(file);
        return path;
    },
    classifications: () => ipcRenderer.invoke('document:classification'),
    classificationValidator: (text) => ipcRenderer.invoke('classifier:llmValidation',text)
});