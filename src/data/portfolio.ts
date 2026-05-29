export const profile = {
  name: 'Vismay Tiwari',
  shortName: 'Vismay',
  role: 'Backend-heavy full stack engineer',
  location: 'Bengaluru, India',
  email: 'hire.vtiwari@gmail.com',
  headline: 'Backend, databases, LLM systems, production ownership.',
  subhead:
    'Payments. Databases. Event systems. LLM workflows. AI tooling. Built for scale, cost, and reliability.',
  links: {
    email: 'mailto:hire.vtiwari@gmail.com?subject=Portfolio%20conversation',
    linkedin: 'https://linkedin.com/in/vismaytiwari/',
    github: 'https://github.com/vismaytiwari',
    leetcode: 'https://leetcode.com/u/vismaytiwari/',
    stackoverflow: 'https://stackoverflow.com/users/10820780/vismay',
  },
} as const;

export const impactMetrics = [
  { value: '250K/day', label: 'micro-transactions' },
  { value: '10B', label: 'event-scale pipeline' },
  { value: '-60%', label: 'database lock reduction' },
  { value: '-50%', label: 'AI testing effort' },
  { value: '-40%', label: 'investigation time' },
  { value: '100+', label: 'microservices worked on' },
  { value: '200M', label: 'users scaled' },
  { value: '30+', label: 'A/B experiments' },
  { value: '-30%', label: 'Redis shard pressure' },
  { value: '+15%', label: 'search CTR lift' },
] as const;

export const techTicker = [
  'Python',
  'Go',
  'TypeScript',
  'Kafka',
  'RabbitMQ',
  'Redis',
  'PostgreSQL',
  'MySQL',
  'Elasticsearch',
  'Kubernetes',
  'AWS',
  'GCP',
  'Terraform',
  'Docker',
  'Airflow',
  'GraphQL',
  'FastAPI',
  'React',
  'Grafana',
  'LangChain',
  'Langfuse',
  'MCP',
  'RAG',
] as const;

export const journey = [
  {
    id: 'medicaps',
    label: 'Medi-Caps University',
    status: '2017 – 2021',
    title: 'BTech in CSE (AI)',
    line: 'The foundation: algorithms, data structures, and systems engineering.',
    proof: ['CS fundamentals', 'Systems base', 'Builder mindset'],
    accent: '#ffb84d',
  },
  {
    id: 'gammastack',
    label: 'Gammastack',
    status: '2021 – 2022',
    title: 'Real-time betting & Fraud systems',
    line: 'Built millisecond-sensitive real-time feeds using RabbitMQ and WebSockets, Golang A/B frameworks, and automated fraud detection pipelines via GCP Pub/Sub and Airflow.',
    proof: ['WebSockets/GraphQL', 'Golang Workers', 'GCP Pub/Sub'],
    accent: '#c77dff',
  },
  {
    id: 'past-consumer',
    label: 'Pocket FM',
    status: '2022 – 2025',
    title: 'Payments, Search, & Experimentation',
    line: 'Scaled payment systems to 250k/day, engineered streak rewards handling 10B events, reduced MySQL/Redis contention by 30-60%, and optimized LLM costs by 22%.',
    proof: ['250K/day Payments', '10B Events', 'MySQL/Redis Tuning', '-22% LLM Cost'],
    accent: '#00d2ff',
  },
  {
    id: 'somewhere',
    label: 'Enterprise Cloud Platform',
    status: '2025 – Present',
    title: 'AI Tooling & Global Microservices',
    line: 'Building AI-native developer tooling (MCP, LangChain) reducing debugging time by 50%, orchestrating agent evaluation pipelines, and working across 100+ highly distributed microservices while serving active on-call rotations.',
    proof: ['AI Agents & MCP', 'Langfuse Observability', 'Worked on 100+ Microservices', 'Active On-Call'],
    accent: '#23f6a5',
  },
  {
    id: 'call',
    label: 'Waiting for your call',
    status: 'Next role',
    title: 'Bring the hard problem',
    line: 'Revenue systems. Database bottlenecks. Event platforms. AI tooling. Ready for the next serious team.',
    proof: ['Senior backend', 'Global scale', 'Bengaluru'],
    accent: '#ff4da6',
  },
] as const;

export const projects = [
  {
    id: 'portfolio',
    title: 'This portfolio',
    kind: 'Interactive portfolio system',
    description:
      'A shader-driven Astro portfolio with a WebGL fluid field, Three.js workbench scene, GSAP scroll choreography, glass UI, and static deployment.',
    proof: ['Fluid WebGL background', 'Three.js workbench', 'GSAP scroll motion'],
    stack: ['Astro', 'TypeScript', 'Three.js', 'GSAP', 'WebGL'],
    href: '#view-source',
  },
  {
    id: 'hotdrop',
    title: 'HotDrop',
    kind: 'Local-first transfer app',
    description:
      'A direct transfer tool for moving files across macOS and Android over Wi-Fi or hotspot, using QR pairing with no internet, no cloud, and no cables.',
    proof: ['No-cloud LAN transfer', 'QR-paired sessions', 'Desktop + Android flow'],
    stack: ['Electron', 'TypeScript', 'Express 5', 'Node HTTPS', 'Vitest'],
    href: 'https://github.com/vismaytiwari/hotdrop',
  },
] as const;

export const socials = [
  {
    label: 'Email',
    href: profile.links.email,
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  },
  {
    label: 'LinkedIn',
    href: profile.links.linkedin,
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    label: 'GitHub',
    href: profile.links.github,
    icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  },
  {
    label: 'LeetCode',
    href: profile.links.leetcode,
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    label: 'StackOverflow',
    href: profile.links.stackoverflow,
    icon: 'M20 20H4v-4h16v4zM7 17h10M6.8 12.8l9.4 2 .4-1.9-9.4-2zM8.3 8.5l8.7 4 .9-1.7-8.7-4zM12 2L5.5 7.5l1.2 1.5L12 4.5l5.3 4.5 1.2-1.5z',
  },
] as const;

export const certs = [
  'HackerRank REST API — Intermediate',
  'Programming, Data Structures & Algorithms in Python (NPTEL)',
  'CCNA: Introduction to Networks',
] as const;
