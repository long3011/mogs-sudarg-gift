export function Header({ activeTab, onTabChange }) {
  return <>
    <section className="hero" id="top">
    <div className="eyebrow">A little birthday surprise</div>
    <h1>Unwrap the<br />
    <em>memories.</em>
    </h1>
    <p>Open a little box of memories, choose a favorite, and turn it into a birthday puzzle.</p>
    <nav className="tabs" aria-label="Main navigation">
    <button className={activeTab === 'gallery' ? 'tab active' : 'tab'} onClick={() => onTabChange('gallery')}>
    <span>01</span> Gift gallery</button>
    <button className={activeTab === 'puzzle' ? 'tab active' : 'tab'} onClick={() => onTabChange('puzzle')}>
    <span>02</span> Birthday puzzle</button></nav></section></>
}
