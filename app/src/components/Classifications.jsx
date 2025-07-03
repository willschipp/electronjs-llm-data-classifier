import { useEffect } from "react";

import { Card, HTMLTable } from  "@blueprintjs/core";

function Classifications() {

    const classifications = [
        {
            "name":"Restricted",
            "description":"Most sensitive data limited in use to specific people"
        },
        {
            "name":"Sensitive PII",
            "description":"Personally Identifiable Information that could be used to harm an individual"
        },
        {
            "name":"Confidential PII",
            "description":"Personally Identifiable Information that could be used to facilitate unlawful activity"
        },
        {
            "name":"Confidential",
            "description":"non-PII data that relates to business and requires high levels of protection"
        },
        {
            "name":"Internal PII",
            "description":"Personally Identifiable Information that does not meet the criteria of Sensitive of Confidential PII"
        },
        {
            "name":"Internal",
            "description":"non-PII data intended for business purposes and requires moderate protection"
        },
        {
            "name":"Public Information",
            "description":"Publicly available data that does not compromise confidentiality, integrity or availability"
        }        
    ];

    return (
        <Card style={{ flex: '1 1 auto' }}>
            <HTMLTable>
                <thead>
                    <tr>
                        <th>
                            Classification
                        </th>
                        <th>
                            Description
                        </th>                        
                    </tr>
                </thead>
                <tbody>
                    {classifications && classifications.map((classification,idx) => (
                        <tr key={idx}>
                            <td><b>{classification.name}</b></td>
                            <td>{classification.description}</td>
                        </tr>
                    )) }
                </tbody>
            </HTMLTable>
        </Card>
    )
}

export default Classifications