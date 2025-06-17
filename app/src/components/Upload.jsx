import { useState } from 'react';
import { FileInput, Button, Card, Spinner } from  "@blueprintjs/core";
import pdfToText from 'react-pdfToText';


function Upload() {

    const [file,setFile] = useState(null);
    const [text,setText] = useState(null);
    const [classification,setClassification] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleFileSelect = async (e) => {
        //invoke the backend event
        console.log("file upload invoked");
        setLoading(true);
        //read
        const file = event.target.files[0];
        const extractedText = await pdfToText(file);
        setText(extractedText);
        //invoke the model to classify this
        console.log("invoking classification...");
        // const result = await 
        window.electronAPI.run(extractedText)
            .then((result) => {
                setLoading(false);
                setClassification(result);
            });
        // setClassification(result);
    }

    return (
        <Card>
            <FileInput disabled={false} fill={true} text="Choose file..." onInputChange={handleFileSelect}/>  
            {loading && (<Spinner/>)}
            {classification && (
                <div>{JSON.stringify(classification,null,2)}</div>
            )}          
        </Card>
    )
}

export default Upload