import { useEffect, useState } from 'react'
import { ContentContext, fetchContent } from './content'

export default function ContentProvider({ children, onReady }) {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let live = true
    fetchContent().then((c) => {
      if (!live) return
      setContent(c)
      onReady?.()
    })
    return () => { live = false }
  }, [onReady])

  if (!content) return null
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
