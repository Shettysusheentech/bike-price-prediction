import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { inr, Panel, Training } from '../util.jsx'

export default function Performance({ model }) {
  if (!model) return <Training />
  const { mae, rmse, r2, nTrain, nTest } = model.metrics
  const max = Math.max(...model.points.map(p => Math.max(p.actual, p.predicted)))
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <M label="MAE" v={inr(mae)} /><M label="RMSE" v={inr(rmse)} /><M label="R²" v={r2.toFixed(4)} />
      </div>
      <Panel title="Actual vs predicted (test set)">
        <p className="mb-3 text-sm">Random Forest, 80 trees, max depth 14, 80% features per split. 80/20 split, seed 42. Train {nTrain.toLocaleString('en-IN')} · test {nTest.toLocaleString('en-IN')} rows. Trained in {(model.trainMs / 1000).toFixed(1)} s in this browser.</p>
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart><CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="actual" type="number" name="actual" domain={[0, max]} tickFormatter={v => v / 1000 + 'k'} />
            <YAxis dataKey="predicted" type="number" name="predicted" domain={[0, max]} tickFormatter={v => v / 1000 + 'k'} />
            <Tooltip formatter={inr} />
            <ReferenceLine segment={[{ x: 0, y: 0 }, { x: max, y: max }]} stroke="#FCA311" strokeWidth={2} />
            <Scatter data={model.points} fill="#14213D" fillOpacity={0.4} />
          </ScatterChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  )
}
const M = ({ label, v }) => (<div className="bg-white p-5 border-l-4 border-fuel"><div className="font-head text-xl">{label}</div><div className="font-head text-4xl font-extrabold">{v}</div></div>)
