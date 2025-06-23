import { useState } from 'react';
import { FileInput, Button, Card, Spinner } from  "@blueprintjs/core";
// import pdfToText from 'react-pdfToText';


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
        const file = e.target.files[0];
        const path = window.electronAPI.path(file);
        console.log(path);

        window.electronAPI.parser(String(path))
            .then((result) => {
                console.log('parsed to text');
                return window.electronAPI.run(result);
            }).then((determinedClassification) => {
                setLoading(false); //stop loading
                setClassification(determinedClassification);
            });
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