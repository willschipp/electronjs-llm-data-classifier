import { useState } from 'react';
import { FileInput, HTMLTable, Card, Spinner } from  "@blueprintjs/core";
// import pdfToText from 'react-pdfToText';


function Upload() {

    const [file,setFile] = useState(null);
    const [text,setText] = useState(null);
    const [elapsed,setElapsed] = useState(null);
    const [classification,setClassification] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleFileSelect = async (e) => {
        //invoke the backend event
        console.log("file upload invoked");
        const startTimestampMs = Date.now();
        setLoading(true);
        //read
        const file = e.target.files[0];
        const path = window.electronAPI.path(file);

        window.electronAPI.parser(String(path))
            .then((result) => {
                console.log('parsed to text');
                return window.electronAPI.run(result);
            }).then((determinedClassification) => {
                setLoading(false); //stop loading
                setClassification(determinedClassification);
                const endTimestampMs = Date.now();
                setElapsed(endTimestampMs - startTimestampMs);
            });
    }

    return (
        <Card style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <p>
                <FileInput disabled={false} fill={true} text="Choose file..." onInputChange={handleFileSelect}/>  
            </p>
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