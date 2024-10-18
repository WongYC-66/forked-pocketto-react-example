import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DatabaseManager, p } from 'pocketto'

p.setEnvironment('browser');
DatabaseManager.connect('default', {
    dbName: 'default',
}).then(async (localDb) => {
    const remoteDb = await DatabaseManager.connect('http://localhost:5984/test', {
        dbName: 'test',
        adapter: 'http',
        auth: {
            username: 'admin',
            password: 'qwer1234',
        }
    });
    localDb.sync(remoteDb, {
        live: true,
        retry: true,
    });
    p.setRealtime(true);
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
