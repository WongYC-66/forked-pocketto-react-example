import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRealtimeArray, useRealtimeValue } from './lib/hooks/usePocketto';
import { Dummy } from './models/Dummy.p';

function App() {
    const [count, setCount] = useState(0);
    const dummy = useRealtimeValue(new Dummy());
    const dummyList = useRealtimeArray(Dummy, { order: 'asc' });
    console.log('dummyList: ', dummyList);

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={async () => {
                    setCount((count) => count + 1);

                    // dummy.setRandomName();
                    // await dummy.save();

                    const dummyItem = new Dummy();
                    dummyItem.setRandomName();
                    await dummyItem.save();
                }}>
                    count is {count}
                </button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <div className='text-blue-800'>New Name: {dummy.name}</div>
            <div className=''>
                {
                    dummyList.map((dummy, index) => {
                        return <p key={index} className='text-bold'>{dummy.name}</p>;
                    })
                }
            </div>
        </>
    )
}

export default App
