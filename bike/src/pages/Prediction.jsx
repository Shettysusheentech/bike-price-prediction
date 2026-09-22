import { useEffect, useState } from 'react'
import { inr, Panel, Training } from '../util.jsx'

export default function Prediction({ model, worker }) {
  const [f, setF] = useState({ brand: 'Royal Enfield', age: 4, engine_cc: 350, km_driven: 15000, owner_count: 1 })
  const [price, setPrice] = useState(null)
  useEffect(() => {
    if (!worker) return
    const h = ({ data }) => data.type === 'prediction' && setPrice(data.price)
    worker.addEventListener('message', h); return () => worker.removeEventListener('message', h)
  }, [worker])
  if (!model) return <Training />
  const set = k => e => setF({ ...f, [k]: k === 'brand' ? e.target.value : Number(e.target.value) })
  const run = () => worker.postMessage({ type: 'predict', input: f })
  const Field = ({ k, label, ...p }) => (
    <label className="block"><span className="font-semibold">{label}</span>
      <input type="number" value={f[k]} onChange={set(k)} className="mt-1 w-full border border-ink/30 px-3 py-2" {...p} /></label>
  )
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Panel title="Bike details">
        <div className="space-y-3">
          <label className="block"><span className="font-semibold">Brand</span>
            <select value={f.brand} onChange={set('brand')} className="mt-1 w-full border border-ink/30 px-3 py-2">{model.brands.map(b => <option key={b}>{b}</option>)}</select></label>
          {Field({ k: "age", label: "Age (years)", min: 1, max: 30 })}
          {Field({ k: "engine_cc", label: "Engine (cc)", min: 100, max: 1800 })}
          {Field({ k: "km_driven", label: "Kilometres driven", min: 0, step: 500 })}
          <label className="block"><span className="font-semibold">Owners</span>
            <select value={f.owner_count} onChange={set('owner_count')} className="mt-1 w-full border border-ink/30 px-3 py-2">
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n === 4 ? '4 or more' : n}</option>)}</select></label>
          <button onClick={run} className="w-full bg-fuel text-ink font-head text-xl font-extrabold py-3">Predict price</button>
        </div>
      </Panel>
      <section className="bg-ink text-white p-6 flex flex-col justify-center">
        <p className="text-white/70">Estimated resale price</p>
        <p className="font-head text-6xl font-extrabold text-fuel my-2">{price == null ? '—' : inr(price)}</p>
        {price != null && <p className="text-white/70">Typical error on unseen bikes: ± {inr(model.metrics.mae)} (MAE)</p>}
      </section>
    </div>
  )
}
