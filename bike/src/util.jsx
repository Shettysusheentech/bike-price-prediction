export const inr = v => '₹' + Math.round(v).toLocaleString('en-IN')
export const Training = () => <p className="font-head text-xl">Training Random Forest in your browser…</p>
export const Panel = ({ title, children, className = '' }) => (
  <section className={`bg-white p-5 border-l-4 border-ink ${className}`}>
    {title && <h2 className="text-2xl font-bold mb-3">{title}</h2>}{children}
  </section>
)
