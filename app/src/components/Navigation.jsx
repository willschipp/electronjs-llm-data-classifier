import { useState } from 'react';
import { Alignment, Navbar, Button } from  "@blueprintjs/core";

function Navigation() {
    return (
        <Navbar>
            <Navbar.Group align={Alignment.START}>
                <Navbar.Heading>Data Classification Assistant</Navbar.Heading>
                <Navbar.Divider />
                <Button className="bp5-minimal" icon="home" text="Home"/>
                <Button className="bp5-minimal" icon="document" text="Upload"/>
            </Navbar.Group>
        </Navbar>
    )
}

export default Navigation