import { useState } from 'react';
import { TextArea, Button, Spinner, Card, Checkbox } from  "@blueprintjs/core";

function RawText() {

    const [entry,setEntry] = useState('');
    const [useLLM,setUseLLM] = useState(false);
    const [loading,setLoading] = useState(false);

    const handleChange = (e) => {
        setEntry(e.target.value);
    }

    const handleText = async () => {
        console.log("called handleText");
        const startTimestampMs = Date.now();
        setLoading(true);        
        const result = await window.electronAPI.run(entry,useLLM);
        setLoading(false);
        const output = document.getElementById('output');
        output.innerText = JSON.stringify(result,null,2);
    }

    const handleUseLLMChange = async (e) => {
        setUseLLM(!useLLM);
    }    

    return (
        <Card style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <p>
                <TextArea value={entry} onChange={handleChange} fill={true} rows={8}/>
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Checkbox checked={useLLM} onChange={handleUseLLMChange}>
                    Use local model to do the final assessment?
                </Checkbox>
            </div>            
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button text="Check" intent="primary" onClick={handleText}/>
                <Button text="Reset" intent="none"/>
            </div>
            {loading && (<Spinner/>)}
            <div id="output"></div>
        </Card>
    )
}

export default RawText