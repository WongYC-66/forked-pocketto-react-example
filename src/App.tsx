import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Route, Switch } from 'wouter'
import { DemoRealTimeListView } from './views/DemoRealTimeListView'
import { DemoRealTimeView } from './views/DemoRealTimeView'

function App() {
    return (
        <>
            <div className='h-8'></div>
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
            <h1 className='flex flex-row w-full justify-center'>Vite + React + Pocketto</h1>
            <p className="flex flex-row w-full justify-center read-the-docs">
                Click on the Vite, React, and Pocketto logos to learn more
            </p>
            <div className='h-4'></div>
            <div className='flex justify-center gap-4'>
                <Link href="/realtime-list">Real Time List Example</Link>
                <Link href="/realtime/new">Real Time Example</Link>
            </div>
            <div className='h-16'></div>
            <Switch>
                <Route path="/realtime-list" component={DemoRealTimeListView} />

                <Route path="/realtime/:id" component={DemoRealTimeView} />

                <Route>
                    <div className='text-center'>
                        Click any of above link to proceed
                    </div>
                </Route>
            </Switch>
        </>
    )
}

export default App
