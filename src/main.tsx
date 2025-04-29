
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we have an element with id="root" to mount the app
const rootElement = document.getElementById("root");
if (!rootElement) {
  const errorMsg = "Root element not found!";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Create root and render app
const root = createRoot(rootElement);
root.render(<App />);
