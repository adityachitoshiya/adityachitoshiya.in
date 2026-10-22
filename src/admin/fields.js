// What the admin can edit, section by section. Mirrors api/_lib/schema.js;
// the server re-validates everything on save.

const t = (label, opts = {}) => ({ type: 'text', label, ...opts })
const area = (label) => ({ type: 'textarea', label })
const url = (label) => ({ type: 'url', label })
const image = (label) => ({ type: 'image', label })
const video = (label) => ({ type: 'video', label })
const list = (label, item, opts = {}) => ({ type: 'list', label, item, ...opts })

export const sections = [
  {
    key: 'profile',
    title: 'Profile & hero',
    fields: {
      first: t('First name'),
      last: t('Last name'),
      heroImage: image('Hero photo (transparent PNG works best)'),
      tagline: t('Tagline'),
      disciplines: t('Disciplines line'),
      intro: area('About paragraph (word-by-word reveal)'),
      mission: area('Mission line'),
      email: t('Email'),
      phone: t('Phone'),
      location: t('Location'),
      social: t('Social handle'),
      behance: url('Behance URL'),
      github: url('GitHub URL'),
    },
  },
  {
    key: 'snapshot',
    title: '10-second snapshot',
    fields: {
      role: t('One-line role'),
      years: t('Experience (e.g. 4+ yrs)'),
      companies: list('Companies', t('Company')),
      names: list('Worked with (also shown in hero)', t('Name')),
      tools: list('Toolkit', t('Tool')),
      people: list('Photo cards', { name: t('Name'), note: t('Caption'), img: image('Photo') }, { titleKey: 'name' }),
    },
  },
  {
    key: 'brands',
    title: 'Brand strip',
    list: list('Brands', t('Brand')),
  },
  {
    key: 'reels',
    title: 'Showreel',
    list: list('Reels', { title: t('Title'), src: video('Video (MP4 or upload)') }, { titleKey: 'title' }),
  },
  {
    key: 'projects',
    title: 'Selected work',
    list: list('Projects', {
      name: t('Name'), type: t('Type'), desc: t('Short description'),
      company: t('Done at (company, same spelling as in Experience)'), year: t('Year (optional)'),
      link: url('Link to the real work (Behance, Instagram, YouTube…, optional)'), img: image('Image or cover'),
    }, { titleKey: 'name' }),
  },
  {
    key: 'caseStudy',
    title: 'Case study',
    fields: {
      title: t('Title'),
      client: t('Client'),
      role: t('Your role'),
      years: t('Dates'),
      brief: area('Brief'),
      did: list('What I did', t('Point')),
      hero: image('Main image'),
      shots: list('More images', { img: image('Image'), cap: t('Caption') }, { titleKey: 'cap' }),
    },
  },
  {
    key: 'experience',
    title: 'Experience',
    list: list('Jobs & education', {
      year: t('Dates'), company: t('Company'), place: t('Place / type'), role: t('Role'),
      desc: area('Description'), img: image('Hover image'),
    }, { titleKey: 'company' }),
  },
  {
    key: 'services',
    title: 'Services',
    list: list('Services', { title: t('Title'), body: area('Description'), tags: list('Tags', t('Tag')) }, { titleKey: 'title' }),
  },
  {
    key: 'viral',
    title: 'Went viral',
    list: list('Viral videos & posts', {
      title: t('Title'),
      link: url('Link (YouTube, Instagram, LinkedIn…)'),
      views: t('Views (e.g. 1.2M or 850K)'),
      company: t('Made for / at'),
      thumb: image('Thumbnail (optional for YouTube; needed for Instagram)'),
    }, { titleKey: 'title' }),
  },
  {
    key: 'viralShots',
    title: 'Viral screenshots',
    list: list('Screenshots (Instagram insights, YouTube analytics, profile)', {
      img: image('Screenshot'),
      caption: t('Caption, e.g. "Reel insights: 2.1M views"'),
      link: url('Link (optional)'),
    }, { titleKey: 'caption' }),
  },
  {
    key: 'skills',
    title: 'Skills',
    list: list('Skill groups', { title: t('Group name'), items: list('Skills in this group', t('Skill')) }, { titleKey: 'title' }),
  },
]

// A field descriptor has a string `type` ('text', 'list', ...). A list item
// shape is a plain object of descriptors and may itself contain a field
// named "type" (projects do), so check that the value is a string.
export const isField = (x) => typeof x?.type === 'string'

export function emptyOf(item) {
  if (isField(item)) return item.type === 'list' ? [] : ''
  return Object.fromEntries(Object.entries(item).map(([k, f]) => [k, emptyOf(f)]))
}
