import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DatabaseManager, p } from 'pocketto'

p.setEnvironment('browser');
DatabaseManager.connect('default', {
    dbName: 'default',
}).then(() => {
    p.setRealtime(true);
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
});
