const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI',{
    run: (text) => ipcRenderer.invoke('transformers:run',text),
    extract: (file) => ipcRenderer.invoke('transformers:extract',file)
});

//