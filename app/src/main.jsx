import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//style
import "normalize.css/normalize.css";
import '@blueprintjs/core/lib/css/blueprint.css';
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

createRoot(document.getElementById('root')).render(
    <App />,
)
