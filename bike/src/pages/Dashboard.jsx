import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter } from 'recharts'
import { inr, Panel, Training } from '../util.jsx'

export default function Dashboard({ rows, model }) {
  const byBrand = Object.values(rows.reduce((a, r) => {
    (a[r.brand] ??= { brand: r.brand, n: 0, sum: 0 }); a[r.brand].n++; a[r.brand].sum += r.price; return a
  }, {})).map(b => ({ brand: b.brand, count: b.n, avg: Math.round(b.sum / b.n) })).sort((a, b) => b.count - a.count).slice(0, 10)
  const byAge = Object.values(rows.reduce((a, r) => {
    if (r.age > 20) return a; (a[r.age] ??= { age: r.age, n: 0, sum: 0 }); a[r.age].n++; a[r.age].sum += r.price; return a
  }, {})).map(b => ({ age: b.age, avg: Math.round(b.sum / b.n) })).sort((a, b) => a.age - b.age)
  const median = [...rows].map(r => r.price).sort((a, b) => a - b)[Math.floor(rows.length / 2)]

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Listings" value={rows.length.toLocaleString('en-IN')} />
        <Stat label="Brands" value={new Set(rows.map(r => r.brand)).size} />
        <Stat label="Median price" value={inr(median)} />
        <Stat label="Test R²" value={model ? model.metrics.r2.toFixed(3) : '…'} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Top 10 brands by listings">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byBrand} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="brand" width={100} />
              <Tooltip /><Bar dataKey="count" fill="#14213D" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Average price by bike age">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byAge}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="age" label={{ value: 'Age (years)', position: 'insideBottom', offset: -4 }} />
              <YAxis tickFormatter={v => v / 1000 + 'k'} /><Tooltip formatter={inr} /><Bar dataKey="avg" fill="#FCA311" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Engine cc vs price" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="engine_cc" name="cc" type="number" />
              <YAxis dataKey="price" name="price" tickFormatter={v => v / 1000 + 'k'} /><Tooltip formatter={(v, n) => n === 'price' ? inr(v) : v} />
              <Scatter data={rows.filter((_, i) => i % 3 === 0)} fill="#14213D" fillOpacity={0.35} />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      </div>
      {!model && <Training />}
    </div>
  )
}
const Stat = ({ label, value }) => (
  <div className="bg-ink text-white p-4"><div className="text-sm text-white/70">{label}</div><div className="font-head text-3xl font-extrabold text-fuel">{value}</div></div>
)
