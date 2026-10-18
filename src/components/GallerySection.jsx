export function GallerySection({ gallery, onMakePuzzle }) {
  return <section className="gallery-section">
    <div className="section-heading">
      <div>
        <span className="kicker">The collection</span>
        <h2>Snapshots &amp; sentiments</h2>
        </div>
        <p>Every picture has a story.
          <br />Here are a few of ours.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((item, index) => 
            <article className={`memory-card card-${index + 1}`} key={item.id}>
            <div className="image-wrap"><img src={item.image} alt={item.title} />
            <button className="puzzle-cta" onClick={() => onMakePuzzle(item)}>Make this a puzzle <span>↗
              </span>
              </button>
              </div>
              <div className="card-copy">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                  </div>
                  <span className="card-number">0{index + 1}</span>
                  </div>
                  </article>)}
                  </div>
                  </section>
}
