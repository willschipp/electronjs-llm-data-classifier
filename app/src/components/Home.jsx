import { useEffect } from 'react';
import { Card } from  "@blueprintjs/core";

function Home() {

    const fetchData = async () => {
        console.log("checking openvino...");
        //interact with openvino
        const result = await window.electronAPI.detect(); //nothing to pass
        const output = document.getElementById("output");
        output.innerText = result;
    }

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <Card>
            <p>Audit App</p>
            <div id="output"></div>
        </Card>
    )
}

export default Home