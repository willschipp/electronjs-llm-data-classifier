import { useState } from 'react';
import { TextArea, Button, Card } from  "@blueprintjs/core";

function RawText() {

    const [entry,setEntry] = useState('');

    const handleChange = (e) => {
        setEntry(e.target.value);
    }

    const handleText = async () => {
        console.log("called handleText");
        const result = await window.electronAPI.run(entry);
        const output = document.getElementById('output');
        output.innerText = JSON.stringify(result,null,2);
    }

    return (
        <Card>
            <TextArea value={entry} onChange={handleChange} size="large" fill="true"/>
            {/* <Button text="Check" onClick={handleText}/> */}
            <div id="output"></div>
        </Card>
    )
}

export default RawText