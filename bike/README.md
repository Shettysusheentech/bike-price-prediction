# Bike Price Prediction

React + Vite + Tailwind + Recharts. Random Forest Regressor trained in the browser (Web Worker, pure JS, `src/forest.js`).

Data: `public/used_bikes.csv` — Kaggle "Used Bikes Prices in India" (via github.com/shubhamA16/Bike-Price-Prediction), exact duplicates removed (7,324 rows).

Features used: brand, age (years), engine_cc, km_driven, owner_count. Target: price (INR).
Dataset has no `year`, fuel `mileage`, or `condition` column; age stands in for year.

Test metrics (80/20 split, seed 42): MAE ₹18,136 · RMSE ₹42,075 · R² 0.883.

    npm install
    npm run dev
    npm run build   # -> dist (Netlify reads netlify.toml)
