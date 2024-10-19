import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Route, Switch } from 'wouter'
import { DemoRealTimeListPage } from './pages/DemoRealTimeListPage'
import { DemoRealTimePage } from './pages/DemoRealTimePage'

function App() {
    return (
        <>
            <div className='flex flex-row w-full justify-center'>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
                <a href="https://pocketto.dev" target="_blank">
                    <div className="h-[48px] mt-3 ml-6 text-[48px]">P</div>
                </a>
            </div>
            <h1>Vite + React + Pocketto</h1>
            <p className="read-the-docs">
                Click on the Vite, React, and Pocketto logos to learn more
            </p>

            <div className='flex justify-center gap-4'>
                <Link href="/realtime-list">Real Time List Example</Link>
                <Link href="/realtime/new">Real Time Example</Link>
            </div>

            <Switch>
                <Route path="/realtime-list" component={DemoRealTimeListPage} />

                <Route path="/realtime/:id" component={DemoRealTimePage} />

                <Route>Click any of above link to proceed</Route>
            </Switch>
        </>
    )
}

export default App
