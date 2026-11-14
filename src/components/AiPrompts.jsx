import { useMemo, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '../lib/gsap'
import { useContent } from '../content'

// A library of the prompts I use for AI social media creatives and product
// shoots. Filter by group, tap Copy to take one.
export default function AiPrompts() {
  const { aiPrompts } = useContent()
  const root = useRef(null)
  const [group, setGroup] = useState('All')
  const [copied, setCopied] = useState(-1)

  const groups = useMemo(() => ['All', ...new Set(aiPrompts.map((p) => p.category).filter(Boolean))], [aiPrompts])
  const shown = aiPrompts.filter((p) => group === 'All' || p.category === group)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('.aiprompts__title', { type: 'lines,chars', mask: 'lines', linesClass: 'ln' })
      gsap.from(split.chars, {
        yPercent: 110, stagger: 0.03, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.aiprompts__title', start: 'top 85%' },
      })
    },
    { scope: root, dependencies: [aiPrompts] },
  )

  const copy = (text, n) => {
    const done = () => { setCopied(n); setTimeout(() => setCopied(-1), 1400) }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => {})
    else done()
  }

  if (!aiPrompts.length) return null
  return (
    <section className="aiprompts" id="my-prompts" ref={root}>
      <div className="aiprompts__head">
        <h2 className="aiprompts__title">My prompts</h2>
        <span className="section-label">({String(aiPrompts.length).padStart(2, '0')}) creative prompts · tap copy</span>
      </div>
      <div className="aiprompts__tabs" role="tablist" aria-label="Prompt groups">
        {groups.map((g) => (
          <button key={g} role="tab" aria-selected={g === group} className={`aiprompts__tab mono${g === group ? ' is-on' : ''}`} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>
      <div className="aiprompts__grid">
        {shown.map((p, n) => (
          <article className="aiprompt" key={p.title + n}>
            <span className="aiprompt__cat mono muted">{p.category}</span>
            <h3 className="aiprompt__title">{p.title}</h3>
            <p className="aiprompt__text">{p.prompt}</p>
            <button className="aiprompt__copy mono" onClick={() => copy(p.prompt, n)} aria-label={`Copy prompt: ${p.title}`}>
              {copied === n ? 'Copied' : 'Copy prompt'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
