import { useState } from 'react'
import { inr, Panel } from '../util.jsx'
const COLS = ['bike_name', 'brand', 'age', 'engine_cc', 'km_driven', 'owner_count', 'city', 'price']

export default function Dataset({ rows }) {
  const [q, setQ] = useState(''); const [page, setPage] = useState(0)
  const f = rows.filter(r => !q || (r.bike_name + r.brand + r.city).toLowerCase().includes(q.toLowerCase()))
  const view = f.slice(page * 25, page * 25 + 25), pages = Math.ceil(f.length / 25)
  return (
    <Panel title="Dataset">
      <p className="mb-4 max-w-prose">Used bike listings from India (Kaggle "Used Bikes Prices in India", via GitHub). Exact duplicate rows removed: 32,648 → {rows.length.toLocaleString('en-IN')}. <a className="underline" href="/used_bikes.csv" download>Download CSV</a></p>
      <input value={q} onChange={e => { setQ(e.target.value); setPage(0) }} placeholder="Search bike, brand or city"
        className="border border-ink/30 px-3 py-2 mb-3 w-full sm:w-80" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-ink text-white">{COLS.map(c => <th key={c} className="text-left p-2 whitespace-nowrap">{c}</th>)}</tr></thead>
          <tbody>{view.map((r, i) => (
            <tr key={i} className="odd:bg-chrome/50">{COLS.map(c => <td key={c} className="p-2 whitespace-nowrap">{c === 'price' ? inr(r[c]) : r[c]}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
      <div className="flex gap-3 items-center mt-3">
        <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-ink text-white disabled:opacity-30">Previous</button>
        <span>Page {page + 1} of {pages} ({f.length.toLocaleString('en-IN')} rows)</span>
        <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-ink text-white disabled:opacity-30">Next</button>
      </div>
    </Panel>
  )
}
