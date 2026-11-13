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
  tagline: 'Creative & Digital Marketing Specialist',
  disciplines: 'Campaigns · Motion · Content',
  heroImage:
    'https://res.cloudinary.com/dd5zrsmok/image/upload/f_auto,q_auto,w_1800/v1786686336/portfolio_uploads/htlmqiglvtbglcyey0oh.webp',
  intro:
    "I'm a creative and digital marketing professional with 4+ years across brand communication, campaign creatives, social media content, motion graphics, video production and digital experiences — for consumer brands, education, media and events.",
  mission:
    "My mission is to turn ideas into powerful digital experiences. I'm building a future-ready studio where designers, developers and AI systems work as one.",
}

export const brands = [
  'Suniel Shetty', 'Aman Dhattarwal', 'Regrip India', 'SleepyOwl', 'Abhi & Niyu',
  'Vande Bharat / Adani TV', 'Bharat Ke Super Founders', 'EA Jaipur', 'Mittsure',
  'Jaipur Comic Con', 'The Prime Walk', 'Varaha Jewels', 'Think Trail', 'Lumalearn', 'Luma', 'Pinaka',
]

// `ratio` is the shape of the cover/preview ("16:9", "9:16", "4:5", "1:1"…);
// the card takes that shape so nothing is cropped. Without it a card is 4:5.
export const projects = [
  { name: 'Bharat Ke Super Founders', ratio: '16:9', category: 'youtube', type: 'Logo animation', desc: 'Title and logo animation for the show.', company: 'Bharat Ke Super Founders', img: '/work/super-founders-logo.jpg', video: '/work/super-founders-logo.mp4' },
  { name: "D'una Perfume", ratio: '9:16', category: 'product', type: '3D product ad', desc: 'Concept perfume brand: three bottles modelled, lit and animated in Blender, cut into a 15-second reel with sound design.', company: '', img: '/work/duna-perfume.jpg', video: '/work/duna-perfume.mp4' },
  { name: 'Compounding Graph', ratio: '9:16', category: 'youtube,viral', type: 'Finance explainer graphic', desc: 'Spec reel made for this portfolio: ₹5,000 a month for 20 years at an assumed 12% a year, drawn as one line while the total counts up. Real compound maths, animated in code.', company: '', img: '/work/sip-graph.jpg', video: '/work/sip-graph.mp4' },
  { name: 'Jaipur Delivery Route', ratio: '9:16', category: 'saas', type: '3D map animation', desc: 'Spec ad for a delivery app: a 3D city, the route to Hawa Mahal draws itself, the pin drops and the ETA counts down to "Arrived".', company: '', img: '/work/jaipur-route.jpg', video: '/work/jaipur-route.mp4' },
  { name: 'Phone Teardown', ratio: '9:16', category: 'product', type: '3D exploded view', desc: 'Spec product reel: a phone turns and comes apart layer by layer, and each part gets a leader line and a label.', company: '', img: '/work/phone-breakdown.jpg', video: '/work/phone-breakdown.mp4' },
  { name: 'One Post a Day', ratio: '9:16', category: 'viral', type: 'Minimal line animation', desc: 'Spec social reel: a dot climbs five steps under one quiet line, then an orbit draws round it at the top and the line turns.', company: '', img: '/work/one-post-minimal.jpg', video: '/work/one-post-minimal.mp4' },
  { name: 'Jhatpat App Banner', ratio: '4:5', category: 'product', type: 'Motion banner', desc: 'Spec app banner in a quick-commerce style: products drop in, a 10-minute promise counts down. After Effects, 5.6 s loop.', company: '', img: '/work/banner-blinkit-style.jpg', video: '/work/banner-blinkit-style.mp4' },
  { name: 'Turant Diwali Deal', ratio: '4:5', category: 'product', type: 'Festive sale banner', desc: 'Spec Diwali sale banner: lights, flickering diyas, a 60% off count-up. After Effects, 5.6 s loop.', company: '', img: '/work/banner-zepto-festive.jpg', video: '/work/banner-zepto-festive.mp4' },
  { name: 'Big Bachat Days', ratio: '4:5', category: 'product', type: 'Mega-sale banner', desc: 'Spec mega-sale banner: gadgets on a sunburst stage, rupee coins, an 80% off count-up. After Effects, 5.6 s loop.', company: '', img: '/work/banner-bbd-sale.jpg', video: '/work/banner-bbd-sale.mp4' },
]

export const experience = [
  {
    year: 'Sep 2025 — Now',
    company: 'Regrip India',
    place: 'Brand & marketing',
    role: 'Creative Visual Designer',
    desc: 'Visual communication for brand campaigns and product storytelling; founder-focused narratives, influencer films and short-form video; social media and ad creatives; celebrity-led campaign content with Suniel Shetty.',
    img: '/img/latest_main.jpg',
  },
  {
    year: '2022',
    company: 'Mittsure',
    place: 'Education & publishing',
    role: 'Motion Graphic Designer',
    desc: 'Motion graphics, animated explainers, titles and visual assets for educational and publishing content and marketing deliverables.',
    img: '/img/work_2.jpg',
  },
  {
    year: '',
    company: 'The Prime Walk',
    place: 'Event',
    role: 'Media & Content Strategy Planner',
    desc: 'Planned media and content direction for event communication and audience engagement, aligned with event messaging and promotional channels.',
    img: '',
  },
  {
    year: '',
    company: 'Jaipur Comic Con',
    place: 'Event',
    role: 'Social Media',
    desc: 'Social media content and promotional communication for the event.',
    img: '',
  },
  {
    year: '',
    company: 'Adharshila by Regrip',
    place: 'Event',
    role: 'Event Management',
    desc: 'Event management support, coordination and execution.',
    img: '',
  },
  {
    year: '',
    company: 'Varaha Jewels',
    place: 'Online jewellery brand',
    role: 'E-commerce & Brand Project',
    desc: 'Product listings, pricing and online merchandising, plus advertising to support product visibility, organic orders and online sales.',
    img: '',
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
    title: 'Creative & Design',
    body: 'Campaign creatives, brand identity and product storytelling that stay consistent across every format.',
    tags: ['Photoshop', 'Illustrator', 'Brand Identity', 'Campaigns'],
  },
  {
    title: 'Motion & Video',
    body: 'Motion graphics, animated explainers, founder stories and short-form video built for social feeds.',
    tags: ['After Effects', 'Premiere Pro', 'Explainers', 'Reels'],
  },
  {
    title: 'Marketing & Content',
    body: 'Social media content, content strategy and campaign-led communication that keeps audiences engaged.',
    tags: ['Social Media', 'Content Strategy', 'Campaigns', 'Engagement'],
  },
  {
    title: 'Events & Digital',
    body: 'Event communication and coordination, plus UI/UX and AI-assisted workflows for digital brand experiences.',
    tags: ['Events', 'Figma', 'UI/UX', 'AI tools'],
  },
]

const cld = (path, t = 'f_auto,q_auto,w_1400') =>
  `https://res.cloudinary.com/dd5zrsmok/image/upload/${t}/${path}`
const vid = (path) =>
  `https://res.cloudinary.com/dd5zrsmok/video/upload/q_auto,w_1280/${path}.mp4`

export const snapshot = {
  role: 'Freelance video editor & motion designer: reels, explainers and 3D product ads',
  years: `${new Date().getFullYear() - 2022}+ yrs`,
  companies: ['Regrip India (now)', 'Mittsure', 'Varaha Jewels'],
  names: ['Suniel Shetty', 'Aman Dhattarwal', 'Abhi & Niyu', 'SleepyOwl'],
  tools: ['Premiere Pro', 'After Effects', 'Blender', 'CapCut', 'Photoshop', 'Illustrator', 'Figma', 'Canva', 'AI tools'],
  people: [
    { name: 'Suniel Shetty', note: 'Face of Regrip — campaign shoot', img: cld('v1786704749/portfolio_uploads/dmj8q2us6vvlicbuayas.webp') },
    { name: 'Prahlad Modi', note: 'Regrip brand storytelling', img: cld('v1786704728/portfolio_uploads/y6k1qu2mrsodo88u9f89.webp') },
  ],
}

export const reels = [
  { title: 'Intro — original motion', src: '/reel/intro.mp4' },
  { title: 'Nike — Just Do It', src: vid('v1786646812/portfolio_uploads/ucximqvfwmrzfcglwopz') },
  { title: 'Ferrari SF90', src: vid('v1786647302/portfolio_uploads/lqkm6n5gfhfch83jtco9') },
  { title: 'Storytelling', src: vid('v1786702939/portfolio_uploads/dbtzab1ulvmjtigjtjj5') },
  { title: 'Product Can CGI', src: vid('v1786704201/portfolio_uploads/rckwvylryzofmtrraeq3') },
  { title: 'ReachNext', src: vid('v1786702952/portfolio_uploads/k51kwx7mvngyebik8mfg') },
]

export const caseStudy = {
  client: 'Regrip',
  title: 'Regrip × Suniel Shetty',
  role: 'Creative Visual Designer',
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

export const skills = [
  {
    title: 'Video & Motion',
    items: [
      'Video Editing (Premiere Pro)', 'Short-form Reels & Shorts', 'Motion Graphics (After Effects)',
      'Kinetic Type & Captions', 'Explainer & Launch Videos', '3D Product Animation (Blender)',
      'Sound Design & Mixing', 'Colour Grading', 'Storyboarding & Scripting', 'YouTube Long-form Editing',
    ],
  },
  {
    title: 'Marketing & Growth',
    items: [
      'Instagram & Social Media Management', 'Campaign Planning & Execution', 'Marketing Strategy',
      'Growth Strategy', 'Content Strategy', 'Meta Ads Management', 'Performance Marketing',
      'Lead Generation', 'Audience Research', 'Campaign Analytics & Reporting',
    ],
  },
  {
    title: 'AI & Automation',
    items: [
      'AI Workflow Management', 'AI-Powered Process Automation', 'AI Tools Integration',
      'Prompt Engineering', 'Workflow Optimization', 'AI Agent Concepts', 'API Integration',
    ],
  },
  {
    title: 'Product & Business',
    items: [
      'Product Design', 'Product Strategy', 'Product Marketing', 'User Research', 'User Journey Mapping',
      'Product Growth', 'Customer Acquisition', 'Conversion Rate Optimization', 'Competitor Research',
    ],
  },
  {
    title: 'Project & Operations',
    items: [
      'Campaign Management', 'Project Coordination', 'Cross-Functional Collaboration',
      'Performance Tracking', 'Stakeholder Management', 'Process Documentation',
    ],
  },
]

// Work that went viral on social media, with real links and view counts
// (e.g. "1.2M"). The section hides itself when this is empty.
export const viral = [
  { title: 'How Dictatorship made China RICH', link: 'https://www.youtube.com/watch?v=lTvcPU19eRE', views: '1.4M', company: 'Abhi and Niyu', thumb: '' },
]

// Proof screenshots (Instagram insights, YouTube analytics, profile stats).
export const viralShots = []

// Vertical (9:16) reels, shown in the Reels section. `src` is a short MP4
// with sound, `poster` its cover frame.
export const shorts = [
  { title: "D'una Perfume", note: '3D product ad · Blender · concept brand', company: '', src: '/shorts/duna-perfume.mp4', poster: '/shorts/duna-perfume.jpg' },
  { title: 'Phone Teardown', note: '3D exploded view with labels · spec', company: '', src: '/shorts/phone-breakdown.mp4', poster: '/shorts/phone-breakdown.jpg' },
  { title: 'Jaipur Delivery Route', note: '3D map route animation · spec', company: '', src: '/shorts/jaipur-route.mp4', poster: '/shorts/jaipur-route.jpg' },
  { title: 'Compounding Graph', note: 'Finance graph with a live count · spec', company: '', src: '/shorts/sip-graph.mp4', poster: '/shorts/sip-graph.jpg' },
  { title: 'One Post a Day', note: 'Minimal line animation · spec', company: '', src: '/shorts/one-post-minimal.mp4', poster: '/shorts/one-post-minimal.jpg' },
]
