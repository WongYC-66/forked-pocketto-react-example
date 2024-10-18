import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRealtimeList, useRealtimeValue } from './lib/hooks/usePocketto';
import { Dummy } from './models/Dummy.p';

function App() {
    const [count, setCount] = useState(0);
    const dummy = useRealtimeValue(new Dummy());
    const [dList, setDList] = useState<Dummy[]>([]);
    const dummyList = useRealtimeList(Dummy, { order: 'desc', value: dList });

    useEffect(() => {
        Dummy
            .query()
            .orderBy('createdAt', 'desc')
            .get()
            .then(result => setDList(result));
    }, []);

    return (
        <>
            <div className='flex flex-row w-full justify-center'>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div>
                <button className='my-4 bg-gray-200 text-black active:scale-95' onClick={async () => {
                    setCount((count) => count + 1);
                    const dummyItem = new Dummy();
                    dummyItem.setRandomName();
                    dummyItem.setRandomHexColor();
                    await dummyItem.save();
                }}>
                    Click to add Dummy
                </button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            {/* <div className='text-blue-800'>New Name: {dummy.name}</div> */}
            <div className=''>
                {
                    dummyList.map((dummy, index) => {
                        return <p key={index} className='text-bold' style={{
                            color: dummy.color,
                        }}>{dummy.name}</p>;
                    })
                }
            </div>
        </>
    )
}

export default App
