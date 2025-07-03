import { useEffect } from 'react';
import { Card } from  "@blueprintjs/core";

function Home() {

    const fetchData = async () => {
        console.log("checking openvino...");
        //interact with openvino
        try {
            const result = await window.electronAPI.detect(); //nothing to pass
            const output = document.getElementById("output");
            output.innerText = result;
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <Card style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <p>Data Classification Helper</p>
            <div id="output"></div>
        </Card>
    )
}

export default Home