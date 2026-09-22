// Small Random Forest Regressor (bootstrap + random feature subsets + variance-reduction splits)
export function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646 }

function buildTree(X, y, idx, depth, o, rand) {
  const n = idx.length
  let sum = 0; for (const i of idx) sum += y[i]
  const mean = sum / n
  if (depth >= o.maxDepth || n < o.minSamples * 2) return { v: mean }
  const nf = X[0].length, k = Math.max(1, Math.round(nf * o.maxFeatures))
  const feats = [...Array(nf).keys()].sort(() => rand() - 0.5).slice(0, k)
  let best = null, bestScore = -Infinity
  for (const f of feats) {
    const s = idx.slice().sort((a, b) => X[a][f] - X[b][f])
    let ls = 0
    const step = Math.max(1, Math.floor(n / o.bins))
    for (let j = 0; j < n - 1; j++) {
      ls += y[s[j]]
      const nl = j + 1
      if (nl < o.minSamples || n - nl < o.minSamples) continue
      if (X[s[j]][f] === X[s[j + 1]][f] || (j % step && n > o.bins * 2)) continue
      const rs = sum - ls, score = ls * ls / nl + rs * rs / (n - nl)
      if (score > bestScore) { bestScore = score; best = { f, t: (X[s[j]][f] + X[s[j + 1]][f]) / 2 } }
    }
  }
  if (!best) return { v: mean }
  const L = [], R = []
  for (const i of idx) (X[i][best.f] <= best.t ? L : R).push(i)
  return { f: best.f, t: best.t, l: buildTree(X, y, L, depth + 1, o, rand), r: buildTree(X, y, R, depth + 1, o, rand) }
}
const walk = (n, x) => { while (n.v === undefined) n = x[n.f] <= n.t ? n.l : n.r; return n.v }

export class RandomForestRegressor {
  constructor(o = {}) { this.o = { nEstimators: 80, maxDepth: 14, minSamples: 2, maxFeatures: 0.8, bins: 64, seed: 42, ...o } }
  fit(X, y) {
    const rand = rng(this.o.seed); this.trees = []
    for (let t = 0; t < this.o.nEstimators; t++) {
      const idx = Array.from({ length: X.length }, () => Math.floor(rand() * X.length))
      this.trees.push(buildTree(X, y, idx, 0, this.o, rand))
    }
    return this
  }
  predict(X) { return X.map(x => this.trees.reduce((s, t) => s + walk(t, x), 0) / this.trees.length) }
}
