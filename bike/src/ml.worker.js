import { RandomForestRegressor, rng } from './forest.js'


self.onmessage = ({ data }) => {
  if (data.type === 'train') {
    const { rows } = data
    const brands = [...new Set(rows.map(r => r.brand))].sort()
    const enc = r => [brands.indexOf(r.brand), r.age, r.engine_cc, r.km_driven, r.owner_count]
    const idx = rows.map((_, i) => i)
    const rand = rng(42)
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]] }
    const cut = Math.floor(idx.length * 0.8)
    const tr = idx.slice(0, cut), te = idx.slice(cut)
    const t0 = performance.now()
    const model = new RandomForestRegressor({ nEstimators: 80, maxDepth: 14, minSamples: 2, maxFeatures: 0.8, seed: 42 })
    model.fit(tr.map(i => enc(rows[i])), tr.map(i => rows[i].price))
    const trainMs = performance.now() - t0
    const pred = model.predict(te.map(i => enc(rows[i])))
    const y = te.map(i => rows[i].price)
    const n = y.length, mean = y.reduce((a, b) => a + b, 0) / n
    let ae = 0, se = 0, st = 0
    y.forEach((v, k) => { const e = v - pred[k]; ae += Math.abs(e); se += e * e; st += (v - mean) ** 2 })
    self.model = model; self.enc = enc
    self.postMessage({
      type: 'trained', brands, trainMs,
      metrics: { mae: ae / n, rmse: Math.sqrt(se / n), r2: 1 - se / st, nTrain: tr.length, nTest: n },
      points: y.map((v, k) => ({ actual: v, predicted: Math.round(pred[k]), name: rows[te[k]].bike_name }))
    })
  }
  if (data.type === 'predict') {
    self.postMessage({ type: 'prediction', price: self.model.predict([self.enc(data.input)])[0] })
  }
}
