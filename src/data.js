// Content mirrors the live site (adityachitoshiya.in) data and the CV.
export const profile = {
  first: 'Aditya',
  last: 'Chitoshiya',
  email: 'adityachitoshiya12@gmail.com',
  phone: '+91 77270 88810',
  social: '@adityachitosh',
  location: 'Jaipur, India',
  behance: 'https://www.behance.net/adityachitosh',
  github: 'https://github.com/adityachitoshiya',
  tagline: 'Multidisciplinary Creator',
  disciplines: 'Design × Technology × AI',
  heroImage:
    'https://res.cloudinary.com/dd5zrsmok/image/upload/f_auto,q_auto,w_1800/v1786686336/portfolio_uploads/htlmqiglvtbglcyey0oh.webp',
  intro:
    "I'm a multidisciplinary creator working across motion graphics, product design, UI/UX and AI-driven development. My work bridges bold brand storytelling with functional, technology-first execution — for founders, creators and EdTech brands alike.",
  mission:
    "My mission is to turn ideas into powerful digital experiences. I'm building a future-ready studio where designers, developers and AI systems work as one.",
}

export const brands = [
  'Suniel Shetty', 'boAt', 'Aman Dhattarwal', 'Regrip', 'SleepyOwl', 'Dhruv Rathee',
  'Biedx', 'Abhi & Niyu', 'Vande Bharat / Adani TV', 'Bharat Ke Super Founders',
  'Mittsure', 'EA Jaipur', 'GetSetFly', 'Think Trail', 'Lumalearn', 'Pinaka',
]

export const projects = [
  { name: 'Regrip', type: 'Brand Campaign', desc: 'Advertising, founder stories, influencer content.', img: '/img/gallery_1.jpg' },
  { name: 'Biedx', type: 'EdTech Media', desc: 'Event capture, course design, visual education.', img: '/img/gallery_2.jpg' },
  { name: 'Mittsure', type: 'Publishing Design', desc: 'Book covers, magazines, brand identity.', img: '/img/gallery_3.jpg' },
  { name: 'Suniel Shetty', type: 'Celebrity Branding', desc: 'Face-of-brand creative coordination.', img: '/img/latest_main.jpg' },
  { name: 'Dhruv Rathee', type: 'Creator Content', desc: 'High-quality visual content creation.', img: '/img/latest_1.jpg' },
  { name: 'GetSetFly', type: 'Digital Campaigns', desc: 'Creative production & storytelling.', img: '/img/latest_2.jpg' },
  { name: 'Think Trail', type: 'Logo Design', desc: 'Educational book company branding.', img: '/img/welcome_1.jpg' },
  { name: 'Lumalearn', type: 'EdTech Branding', desc: 'Plantation-themed logo design.', img: '/img/welcome_2.jpg' },
  { name: 'Luma', type: 'Product Design', desc: 'Stationery brand identity.', img: '/img/intro_tall.jpg' },
  { name: 'Pinaka', type: 'Education Platform', desc: 'Visual identity & branding.', img: '/img/intro_short.jpg' },
]

export const experience = [
  {
    year: 'Sep 2025 — Now',
    company: 'Regrip India',
    place: 'Brand',
    role: 'Brand Transformation Lead',
    desc: 'Advertising campaigns, founder-focused storytelling, TED Talk-style influencer videos, celebrity coordination with Suniel Shetty.',
    img: '/img/latest_main.jpg',
  },
  {
    year: '— 2025',
    company: 'Biedx',
    place: 'Singapore EdTech',
    role: 'Media & Visual Education Specialist',
    desc: 'Event documentation, visual storytelling, understanding-friendly course design, marketing & media production.',
    img: '/img/work_1.jpg',
  },
  {
    year: '2022',
    company: 'Mittsure Technology',
    place: 'Publishing',
    role: 'Brand Identity Designer',
    desc: 'International & national book covers, magazine design & layout, premium brand identity upgrades for publishing and education.',
    img: '/img/work_2.jpg',
  },
  {
    year: '2018 — 2022',
    company: 'Anand ICE, Jaipur',
    place: 'Education',
    role: 'B.Tech, Computer Science',
    desc: 'Built the foundation for merging design thinking with technical development.',
    img: '/img/edu_banner.jpg',
  },
]

export const services = [
  {
    title: 'Motion Graphics',
    body: 'Ad films, founder stories and TED-style creator videos — motion that carries a brand’s voice.',
    tags: ['After Effects', 'Storyboards', 'Ad Films', 'Reels'],
  },
  {
    title: 'Product & UI/UX',
    body: 'Interfaces and product experiences designed to be understood at a glance and used with ease.',
    tags: ['Figma', 'Design Systems', 'Prototyping', 'Web'],
  },
  {
    title: 'Brand Identity',
    body: 'Logos, book covers, editorial layouts and identity upgrades for publishing, education and D2C brands.',
    tags: ['Logo', 'Editorial', 'Packaging', 'Campaigns'],
  },
  {
    title: 'AI Development',
    body: 'Python-driven automation and AI workflows that let design and engineering ship faster, together.',
    tags: ['Python', 'Automation', 'Gen AI', 'Tooling'],
  },
]

const cld = (path, t = 'f_auto,q_auto,w_1400') =>
  `https://res.cloudinary.com/dd5zrsmok/image/upload/${t}/${path}`
const vid = (path) =>
  `https://res.cloudinary.com/dd5zrsmok/video/upload/q_auto,w_1280/${path}.mp4`

export const snapshot = {
  role: 'Brand · Motion · Product designer who also codes',
  years: `${new Date().getFullYear() - 2022}+ yrs`,
  companies: ['Regrip India (now)', 'Biedx (Singapore)', 'Mittsure'],
  names: ['Suniel Shetty', 'Aman Dhattarwal', 'Dhruv Rathee', 'boAt'],
  tools: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Figma', 'AI tools'],
  people: [
    { name: 'Suniel Shetty', note: 'Face of Regrip — campaign shoot', img: cld('v1786704749/portfolio_uploads/dmj8q2us6vvlicbuayas.webp') },
    { name: 'Prahlad Modi', note: 'Regrip brand storytelling', img: cld('v1786704728/portfolio_uploads/y6k1qu2mrsodo88u9f89.webp') },
  ],
}

export const reels = [
  { title: 'Nike — Just Do It', src: vid('v1786646812/portfolio_uploads/ucximqvfwmrzfcglwopz') },
  { title: 'Ferrari SF90', src: vid('v1786647302/portfolio_uploads/lqkm6n5gfhfch83jtco9') },
  { title: 'Storytelling', src: vid('v1786702939/portfolio_uploads/dbtzab1ulvmjtigjtjj5') },
  { title: 'Product Can CGI', src: vid('v1786704201/portfolio_uploads/rckwvylryzofmtrraeq3') },
  { title: 'ReachNext', src: vid('v1786702952/portfolio_uploads/k51kwx7mvngyebik8mfg') },
]

export const caseStudy = {
  client: 'Regrip',
  title: 'Regrip × Suniel Shetty',
  role: 'Brand Transformation Lead',
  years: 'Sep 2025 — Now',
  brief:
    'Transform how Regrip shows up — advertising campaigns, founder-led stories, influencer films and a Bollywood face of the brand.',
  did: [
    'Advertising campaigns end to end — concept, shoot, edit',
    'Founder-focused storytelling for social',
    'TED Talk-style influencer videos',
    'Celebrity coordination with Suniel Shetty',
    'DigiFest booth & marketing cart for on-ground activation',
  ],
  hero: cld('v1786689143/portfolio_uploads/uychg4fvwnk6tuhw5stn.webp', 'f_auto,q_auto,w_1800'),
  shots: [
    { img: cld('v1786693174/portfolio_uploads/hvilh4beukl6bovsyetm.png'), cap: 'DigiFest booth activation' },
  ],
}
