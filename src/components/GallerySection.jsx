import { useEffect, useState } from 'react'

export function GallerySection({ gallery, onMakePuzzle }) {
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (!selectedImage) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedImage(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedImage])

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
            <div className="image-wrap"><img src={item.image} alt={`Enlarge ${item.title}`} onClick={() => setSelectedImage(item)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedImage(item) }} role="button" tabIndex="0" />
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
                  {selectedImage && <div className="image-modal" role="dialog" aria-modal="true" aria-label={`${selectedImage.title} enlarged image`} onClick={() => setSelectedImage(null)}><div className="image-modal-card" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedImage(null)} aria-label="Close enlarged image">×</button><img src={selectedImage.image} alt={selectedImage.title} /><div className="modal-copy"><div><h3>{selectedImage.title}</h3><p>{selectedImage.message}</p></div><button className="puzzle-cta modal-puzzle-cta" onClick={() => onMakePuzzle(selectedImage)}>Make this a puzzle <span>↗</span></button></div></div></div>}
                  </section>
}
