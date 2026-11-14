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
  tagline: 'Visual Creative Director',
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
  'Jaipur Comic Con', 'The Prime Walk', 'Moonj Store', 'Looks Salon', 'Ekaari Jewels', 'Varaha Jewels',
]

// `ratio` is the shape of the cover/preview ("16:9", "9:16", "4:5", "1:1"…);
// the card takes that shape so nothing is cropped. Without it a card is 4:5.
export const projects = [
  { name: 'The Prime Walk', ratio: '16:9', category: 'product,strategy', type: 'Logo design + logo reveal', desc: 'Brand mark for The Prime Walk pageant, and a 3D logo reveal in After Effects for its launch and social media posts.', company: 'The Prime Walk', img: '/work/prime-walk-logo-ae.jpg', video: '/work/prime-walk-logo-ae.mp4' },
  { name: 'Pincode', ratio: '16:9', category: 'youtube', type: 'Visual design', desc: 'Visual design for "Pincode" by Catharsis x Reyy, a Rajasthan desi hip-hop track on Spit Kulture.', company: 'Spit Kulture', link: 'https://www.youtube.com/watch?v=CFOdyeqKkuM', img: '/work/pincode-music-video.jpg' },
  { name: 'Why Is Vulgar Content Trending?', ratio: '16:9', category: 'youtube,viral', type: 'Motion graphics', desc: 'Motion graphics for an Abhi and Niyu explainer on why vulgar content trends in India. 1.3M views.', company: 'Abhi and Niyu', link: 'https://www.youtube.com/watch?v=qeS2Sfvrd5Y', img: '/work/abhi-niyu-vulgar-content.jpg' },
  { name: 'How Blinkit Makes Money', ratio: '16:9', category: 'youtube,strategy', type: 'Content writing', desc: 'Script for a Paisa Decode explainer on the economics of a ₹518 Blinkit order and dark stores. 129K views.', company: 'Paisa Decode', link: 'https://www.youtube.com/watch?v=mjpT-dwFNuA', img: '/work/paisa-decode-blinkit.jpg' },
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
    desc: 'Designed the logo and its launch reveal, and planned the media and social content for event communication and audience engagement across the promotional channels.',
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
    title: 'Social Media & Meta Ads',
    body: 'Meta ad campaigns on Instagram and Facebook, influencer collaborations, and day-to-day posting and community replies that keep an audience engaged.',
    tags: ['Meta Ads', 'Influencer Marketing', 'Instagram', 'Engagement'],
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
  role: 'Visual creative director: brand campaigns, motion, reels and social media',
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
      'Instagram & Social Media Management', 'Meta Ads Management', 'Influencer Marketing', 'Social Media Engagement',
      'Community Management', 'Campaign Planning & Execution', 'Marketing Strategy',
      'Growth Strategy', 'Content Strategy', 'Performance Marketing',
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
  { title: 'Why is Vulgar Content trending in India?', link: 'https://www.youtube.com/watch?v=qeS2Sfvrd5Y', views: '1.3M', company: 'Abhi and Niyu · motion graphics', thumb: '' },
  { title: 'How Does Blinkit Make Money on a ₹518 Order?', link: 'https://www.youtube.com/watch?v=mjpT-dwFNuA', views: '129K', company: 'Paisa Decode · content writing', thumb: '' },
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

// Instagram accounts Aditya runs. Follower counts as seen on 13 Nov 2026;
// update them in the admin. `link` is optional (defaults to the profile).
export const socials = [
  { handle: 'theprimewalkshow', name: 'The Prime Walk', category: 'Miss India Prime pageant', followers: '1,098', work: 'Logo, launch reveal and social media', link: '' },
  { handle: 'themoonjstore', name: 'Moonj Store', category: 'Craft fashion, Jaipur', followers: '84.4K', work: 'Social media', link: '' },
  { handle: 'looksalonjaipur', name: 'Looks Salon', category: 'Luxury salon, Jaipur', followers: '36.6K', work: 'Social media', link: '' },
  { handle: 'regripindia', name: 'Regrip', category: 'Tyre recycling', followers: '4,376', work: 'Brand content, reels and social media', link: '' },
  { handle: 'ekaarijewels', name: 'Ekaari Jewels', category: 'Festive and wedding jewellery', followers: '477', work: 'Social media', link: '' },
]

// AI-made social media creatives and product photo shoots, shown in the
// "AI for social media and product photo shoot" section. `img` is a still;
// the section hides itself while this list is empty.
export const aiShoots = [
  { title: "Maggi 2-Minute Noodles", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/maggi-masala-shoot.jpg" },
  { title: "Fogg Body Spray", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/fogg-royal-shoot.jpg" },
  { title: "Dettol Antiseptic + Handwash", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/dettol-hygiene-shoot.jpg" },
  { title: "iPhone, titanium", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/iphone-titanium-shoot.jpg" },
  { title: "iPhone 18 Pro (concept)", note: "Concept render \u00b7 AI imagined, not a real product", img: "/ai/iphone-18-pro-concept.jpg" },
  { title: "iPhone 18 (concept)", note: "Concept render \u00b7 AI imagined, not a real product", img: "/ai/iphone-18-concept.jpg" },
  { title: "Realme phone", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/realme-yellow-shoot.jpg" },
  { title: "boAt earbuds", note: "Product shoot \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/boat-earbuds-shoot.jpg" },
  { title: "Maggi: Barish + Maggi", note: "Instagram post \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/maggi-barish-post.jpg" },
  { title: "Fogg: Own The Night", note: "Instagram post \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/fogg-own-the-night-post.jpg" },
  { title: "boAt: Turn Up The Beat", note: "Instagram post \u00b7 AI concept \u00b7 not affiliated with the brand", img: "/ai/boat-turn-up-the-beat-post.jpg" },
]

// Prompts I use to make AI images for social media and product shoots.
export const aiPrompts = [
  {
    "title": "Luxury perfume on stone",
    "category": "Product shoot",
    "prompt": "A luxury perfume bottle with a smoked-glass body and brushed gold cap on a polished dark stone plinth, warm rim light, subtle reflections, charcoal gradient background, shallow depth of field, ultra-sharp commercial quality."
  },
  {
    "title": "Floating sneaker",
    "category": "Product shoot",
    "prompt": "A minimalist running sneaker floating above a seamless matte grey studio floor, dramatic side light, soft shadow underneath, one orange accent on the sole."
  },
  {
    "title": "Skincare on wet stone",
    "category": "Product shoot",
    "prompt": "A frosted glass serum bottle with a sage-green dropper on a wet pale stone slab, water droplets, a leaf shadow falling across it, soft daylight, creamy beige background."
  },
  {
    "title": "Watch macro on slate",
    "category": "Product shoot",
    "prompt": "A navy-dial steel wristwatch angled on dark slate, golden rim light, macro detail on the bezel, deep black background."
  },
  {
    "title": "Splash drink can",
    "category": "Product shoot",
    "prompt": "A cold drink can bursting out of a splash of water and ice cubes, frozen mid-air, vivid colour backdrop, high-speed flash look."
  },
  {
    "title": "Coffee pour",
    "category": "Product shoot",
    "prompt": "A ceramic cup of coffee with a slow pour of milk swirling in, steam rising, rustic wood table, warm morning window light."
  },
  {
    "title": "Jewellery on silk",
    "category": "Product shoot",
    "prompt": "A gold necklace draped over folded champagne silk, soft diffused light, tiny sparkle highlights, blurred floral background."
  },
  {
    "title": "Headphones on colour block",
    "category": "Product shoot",
    "prompt": "Over-ear headphones standing on a bold single-colour block, hard sunlight shadow, pop-art minimal composition."
  },
  {
    "title": "Sunglasses in sand",
    "category": "Product shoot",
    "prompt": "Sunglasses half-buried in warm sand with a long golden-hour shadow and a hint of sea in the background."
  },
  {
    "title": "Handbag in a gallery",
    "category": "Product shoot",
    "prompt": "A structured leather handbag on a white plinth in a minimal gallery room, soft top light, one dramatic shadow on the wall."
  },
  {
    "title": "Food hero burger",
    "category": "Product shoot",
    "prompt": "A towering burger with melting cheese and crisp lettuce on a dark board, smoke curling behind, moody side light, appetite-first food ad."
  },
  {
    "title": "Packaged snack explosion",
    "category": "Product shoot",
    "prompt": "A snack packet in the centre with the snack pieces exploding outward around it, bright flat background, playful ad energy."
  },
  {
    "title": "Candle at dusk",
    "category": "Product shoot",
    "prompt": "A scented candle in an amber glass jar glowing on a window sill at dusk, soft bokeh city lights behind."
  },
  {
    "title": "Phone in neon",
    "category": "Product shoot",
    "prompt": "A smartphone on a wet black surface with neon pink and cyan reflections, rain mist, night-city launch poster look."
  },
  {
    "title": "Festive offer post",
    "category": "Instagram post",
    "prompt": "A square Instagram festive offer post for a retail brand: bold headline space at the top, product cluster in the middle, warm gold and maroon palette, diyas and marigold border."
  },
  {
    "title": "Product launch teaser",
    "category": "Instagram post",
    "prompt": "A 4:5 launch teaser post: the product half hidden in shadow, a single beam of light, space for the words 'Coming soon', dark premium mood."
  },
  {
    "title": "Before and after split",
    "category": "Instagram post",
    "prompt": "A clean split-screen post showing before and after, even lighting on both halves, a thin divider line, modern sans-serif label space."
  },
  {
    "title": "Quote card",
    "category": "Instagram post",
    "prompt": "A minimal quote card on a textured off-white paper background, large serif quote space, small brand mark at the bottom, soft shadow."
  },
  {
    "title": "Carousel cover",
    "category": "Instagram post",
    "prompt": "A carousel cover slide: strong one-line hook space, an oversized number, a tidy grid background, high contrast, scroll-stopping."
  },
  {
    "title": "Customer review post",
    "category": "Instagram post",
    "prompt": "A review post design: five gold stars, a speech-bubble card on a soft gradient, product photo peeking from the corner."
  },
  {
    "title": "Behind the scenes",
    "category": "Instagram post",
    "prompt": "A candid behind-the-scenes shot of a small studio set, lights and a camera visible, warm handheld feel, casual social vibe."
  },
  {
    "title": "Meme-style brand post",
    "category": "Instagram post",
    "prompt": "A relatable meme-format post on a flat colour background, big caption space, the product placed naturally in the scene."
  },
  {
    "title": "Sale countdown",
    "category": "Instagram post",
    "prompt": "A bold sale post with a giant percentage number, diagonal colour blocks, confetti, product pop-out shadow."
  },
  {
    "title": "Founder story post",
    "category": "Instagram post",
    "prompt": "A portrait-led story post: the founder at work, natural window light, a short caption area on a clean strip."
  },
  {
    "title": "Recipe or how-to",
    "category": "Instagram post",
    "prompt": "A step-by-step how-to post: four small photo tiles in a grid with numbered circles and a clean white frame."
  },
  {
    "title": "Giveaway post",
    "category": "Instagram post",
    "prompt": "A giveaway post: gift box overflowing with the brand's products, ribbon swirls, bright celebratory colours, rules space at the bottom."
  },
  {
    "title": "Hook shot",
    "category": "Reel & video",
    "prompt": "A 9:16 opening frame: the product slams into the screen with a flash, a huge one-word hook space, high-energy colour."
  },
  {
    "title": "Unboxing POV",
    "category": "Reel & video",
    "prompt": "A first-person unboxing frame: hands opening a premium box on a desk, soft top light, tissue paper, ASMR calm."
  },
  {
    "title": "Day in the life",
    "category": "Reel & video",
    "prompt": "A 9:16 day-in-the-life frame: morning routine shot by a window, warm tones, handheld movement, relatable."
  },
  {
    "title": "Product reveal wipe",
    "category": "Reel & video",
    "prompt": "A three-frame reveal: a dark scene, a light sweep, the product fully lit with a glossy highlight."
  },
  {
    "title": "Text-on-screen explainer",
    "category": "Reel & video",
    "prompt": "A kinetic-type explainer frame: one giant word centred on a flat colour, the rest of the line in small mono type beneath."
  },
  {
    "title": "Transformation reel",
    "category": "Reel & video",
    "prompt": "A before/after transformation frame: the same angle twice with a fast whip transition between, matched lighting."
  },
  {
    "title": "Street interview frame",
    "category": "Reel & video",
    "prompt": "A street interview framing: subject mid-chest, microphone in frame, shallow background, daylight."
  },
  {
    "title": "Slow-motion pour",
    "category": "Reel & video",
    "prompt": "A slow-motion liquid pour frame, backlit, tiny bubbles and strands of light, cinematic macro."
  },
  {
    "title": "Trend remix",
    "category": "Reel & video",
    "prompt": "A trending-format remix frame: split into two panels, creator on the left, the product demo on the right, bold captions."
  },
  {
    "title": "Outro CTA",
    "category": "Reel & video",
    "prompt": "A closing frame: product centred, a calm gradient, space for a follow prompt, soft vignette."
  },
  {
    "title": "Logo on packaging",
    "category": "Brand & logo",
    "prompt": "A minimalist logo mark applied to a kraft paper box, foil stamping, soft studio shadow."
  },
  {
    "title": "Brand colour board",
    "category": "Brand & logo",
    "prompt": "A brand board: five-colour palette swatches, type specimens, a logo tile and a photo tile on a neat grid."
  },
  {
    "title": "Storefront mockup",
    "category": "Brand & logo",
    "prompt": "A shop storefront at dusk with the new signage glowing, passers-by blurred, warm interior light."
  },
  {
    "title": "Business card flat lay",
    "category": "Brand & logo",
    "prompt": "A flat lay of business cards, letterhead and a pen on a linen surface, soft diagonal light."
  },
  {
    "title": "Packaging line-up",
    "category": "Brand & logo",
    "prompt": "A line-up of three packaging sizes of one product in a consistent colour system, seamless background."
  },
  {
    "title": "App icon showcase",
    "category": "Brand & logo",
    "prompt": "A phone showing a new app icon grid with the brand icon highlighted, soft glass reflections."
  },
  {
    "title": "Merch set",
    "category": "Brand & logo",
    "prompt": "A tote bag, cap and T-shirt with the same brand mark arranged on a pastel backdrop."
  },
  {
    "title": "Brand moodboard",
    "category": "Brand & logo",
    "prompt": "A moodboard collage: texture swatches, product close-ups and typography clips, one accent colour throughout."
  },
  {
    "title": "Glass bottle render",
    "category": "3D & motion",
    "prompt": "A 3D-rendered glass bottle with caustic light on a mirrored floor, studio HDRI, photoreal."
  },
  {
    "title": "Exploded product view",
    "category": "3D & motion",
    "prompt": "An exploded view of a phone with each part floating apart and thin leader lines, dark studio backdrop."
  },
  {
    "title": "Isometric workspace",
    "category": "3D & motion",
    "prompt": "An isometric 3D desk scene with a laptop, plants and warm lamps, soft pastel palette."
  },
  {
    "title": "Liquid metal logo",
    "category": "3D & motion",
    "prompt": "A chrome liquid-metal 3D logo melting and re-forming on a black reflective floor."
  },
  {
    "title": "Floating gadgets",
    "category": "3D & motion",
    "prompt": "Several small gadgets floating in a gradient void with soft shadows below, clean tech ad."
  },
  {
    "title": "Abstract loop",
    "category": "3D & motion",
    "prompt": "A seamless abstract loop of soft coloured spheres drifting through a foggy studio, calm and satisfying."
  },
  {
    "title": "Hero in the wild",
    "category": "Ad concept",
    "prompt": "The product in an unexpected landscape, such as a perfume on a snowy mountain ridge, epic wide shot, one hero light."
  },
  {
    "title": "Giant product city",
    "category": "Ad concept",
    "prompt": "A giant product towering over a miniature city at sunrise, forced-perspective ad, dreamy haze."
  },
  {
    "title": "Ingredient burst",
    "category": "Ad concept",
    "prompt": "The product surrounded by its raw ingredients flying outward, fresh and bright, high-speed look."
  },
  {
    "title": "Tiny people world",
    "category": "Ad concept",
    "prompt": "Tiny people working around an oversized product, tilt-shift look, playful storytelling."
  },
  {
    "title": "Cinematic lifestyle",
    "category": "Ad concept",
    "prompt": "A lifestyle scene with the product used naturally, warm film colour, shallow depth, golden hour."
  },
  {
    "title": "Negative space minimal",
    "category": "Ad concept",
    "prompt": "A tiny product in a vast empty single-colour frame, one soft shadow, confident minimal ad."
  }
]
