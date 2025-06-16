import { useState } from 'react';
import { FileInput, Button } from  "@blueprintjs/core";



function Upload() {

    const handleFileSelect = async () => {
        //invoke the backend event
        console.log("file upload invoked");
    }

    return (
        <>
            <FileInput disabled={false} text="Choose file..." onInputChange={handleFileSelect}/>
        </>
    )
}

export default Upload