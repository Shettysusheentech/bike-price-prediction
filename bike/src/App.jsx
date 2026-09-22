import { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import Dashboard from './pages/Dashboard.jsx'
import Dataset from './pages/Dataset.jsx'
import Prediction from './pages/Prediction.jsx'
import Performance from './pages/Performance.jsx'

const PAGES = ['Dashboard', 'Dataset', 'Prediction', 'Performance']

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [rows, setRows] = useState(null)
  const [model, setModel] = useState(null)
  const [error, setError] = useState('')
  const worker = useRef(null)

  useEffect(() => {
    worker.current = new Worker(new URL('./ml.worker.js', import.meta.url), { type: 'module' })
    worker.current.addEventListener('message', ({ data }) => { if (data.type === 'trained') setModel(data) })
    Papa.parse('/used_bikes.csv', {
      download: true, header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: r => { setRows(r.data); worker.current.postMessage({ type: 'train', rows: r.data }) },
      error: () => setError('Could not load used_bikes.csv. Check it is in /public.')
    })
    return () => worker.current.terminate()
  }, [])

  const ctx = { rows, model, worker: worker.current }
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight"><span className="text-fuel">₹</span> Bike Price Prediction</h1>
          <nav className="flex gap-1 flex-wrap">
            {PAGES.map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1.5 font-head text-lg ${page === p ? 'bg-fuel text-ink' : 'text-white/80 hover:text-white'}`}>{p}</button>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && <p className="text-red-700">{error}</p>}
        {!rows && !error && <p>Loading dataset…</p>}
        {rows && page === 'Dashboard' && <Dashboard {...ctx} />}
        {rows && page === 'Dataset' && <Dataset {...ctx} />}
        {rows && page === 'Prediction' && <Prediction {...ctx} />}
        {rows && page === 'Performance' && <Performance {...ctx} />}
      </main>
    </div>
  )
}
