import { useState } from 'react';

import { useNavigate } from 'react-router-dom'; //routing

import { Alignment, Navbar, Button } from  "@blueprintjs/core";

function Navigation() {

    const navigate = useNavigate();

    const handleHomeNavigation = (e) => {
        navigate('/');       
    }

    const handleUploadNavigation = (e) => {
        navigate('/upload');
    }



    return (
        <Navbar>
            <Navbar.Group align={Alignment.START}>
                <Navbar.Heading>Data Classification Assistant</Navbar.Heading>
                <Navbar.Divider />
                <Button className="bp5-minimal" icon="home" id="homeButton" text="Home" onClick={handleHomeNavigation}/>
                <Button className="bp5-minimal" icon="document" id="uploadButton" text="Upload" onClick={handleUploadNavigation}/>
            </Navbar.Group>
        </Navbar>
    )
}

export default Navigation