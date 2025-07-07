import { useState } from 'react';
import { FileInput, HTMLTable, Card, Spinner, Checkbox, Button } from  "@blueprintjs/core";
// import pdfToText from 'react-pdfToText';


function Upload() {

    const [file,setFile] = useState(null);
    const [useLLM,setUseLLM] = useState(false);
    const [elapsed,setElapsed] = useState(null);
    const [classification,setClassification] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleFileSelect = async (e) => {
        //invoke the backend event
        //read
        const file = e.target.files[0];
        const path = window.electronAPI.path(file);
        setFile(path)
    }

    const handleCheck = async (e) => {
        console.log("file upload invoked");
        const startTimestampMs = Date.now();
        setLoading(true);

        window.electronAPI.parser(String(file))
            .then((result) => {
                console.log('parsed to text');
                return window.electronAPI.run(result,useLLM);
            }).then((determinedClassification) => {
                setLoading(false); //stop loading
                setClassification(determinedClassification);
                const endTimestampMs = Date.now();
                setElapsed(endTimestampMs - startTimestampMs);
            });
    }
    
    const handleUseLLMChange = async (e) => {
        setUseLLM(!useLLM);
    }

    return (
        <Card style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <p>
                <FileInput disabled={false} fill={true} text="Choose file..." onInputChange={handleFileSelect}/>  
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Checkbox checked={useLLM} onChange={handleUseLLMChange}>
                    Use local model to do the final assessment?
                </Checkbox>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button text="Check" intent="primary" onClick={handleCheck}/>
                <Button text="Reset" intent="none"/>
            </div>
            {loading && (<Spinner/>)}
            {classification && (
                <HTMLTable>
                    <tbody>
                        <tr>
                            <td>Results</td>
                            <td>{JSON.stringify(classification,null,2)}</td>
                        </tr>
                        <tr>
                            <td>Elapsed Time</td>
                            <td>{elapsed}ms</td>
                        </tr>
                    </tbody>
                </HTMLTable>
            )}          
        </Card>
    )
}

export default Upload