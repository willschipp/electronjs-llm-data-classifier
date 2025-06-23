// import { PdfReader } from 'pdfreader';
import { readPdfText } from 'pdf-text-reader'; 

export default async function parser(event,path) {
    //process the file
    return await readPdfText({url: path});
}