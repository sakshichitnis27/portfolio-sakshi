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
  { value: '250K/day', label: 'microtransactions handled' },
  { value: '10B', label: 'event-scale feature surface' },
  { value: '-60%', label: 'database load reduction' },
  { value: '-30%', label: 'Redis shard pressure' },
  { value: '+6%', label: 'daily retention lift' },
  { value: '-22%', label: 'LLM cost reduction' },
] as const;

export const systemProfile = [
  {
    label: 'Backend',
    value: 'Revenue + data systems',
    detail: 'Payments / events / rollout controls',
  },
  {
    label: 'AI systems',
    value: 'LLM cost + eval loops',
    detail: 'Routing / MCP / agent workflows',
  },
  {
    label: 'Databases',
    value: 'Hot path ownership',
    detail: 'Locks / indexes / Redis pressure',
  },
  {
    label: 'Production',
    value: 'Owned after launch',
    detail: 'Runbooks / dashboards / reliability',
  },
] as const;

export const techTicker = [
  'Python',
  'Go',
  'TypeScript',
  'Kafka',
  'Redis',
  'PostgreSQL',
  'MySQL',
  'Elasticsearch',
  'Kubernetes',
  'AWS',
  'GCP',
  'Terraform',
  'Airflow',
  'LangChain',
  'Langfuse',
  'MCP',
] as const;

export const journey = [
  {
    id: 'medicaps',
    label: 'Medicaps',
    status: 'Origin',
    title: 'Computer science base',
    line: 'The foundation: algorithms, systems thinking, and the habit of building.',
    proof: ['CS fundamentals', 'Systems base', 'Builder mindset'],
    accent: '#ffb84d',
  },
  {
    id: 'gammastack',
    label: 'Gammastack',
    status: 'Realtime systems',
    title: 'Live data and fraud paths',
    line: 'Realtime feeds, payment-risk signals, cloud pipelines, and production delivery.',
    proof: ['RabbitMQ', 'WebSocket', 'GCP pipelines'],
    accent: '#c77dff',
  },
  {
    id: 'past-consumer',
    label: 'Pocket FM - past work',
    status: 'Scale chapter',
    title: 'Revenue, DB, events, AI',
    line: 'Built payments, retention loops, DB optimizations, search, LLM cost control, MCP workflows, and agent evals.',
    proof: ['250K/day', '10B events', '-60% DB load', '-22% LLM cost'],
    accent: '#00d2ff',
  },
  {
    id: 'somewhere',
    label: 'Current chapter',
    status: 'Quiet build mode',
    title: 'AI agents and sharp tools',
    line: 'Working quietly on agent workflows, MCP experiments, eval loops, and small systems that make software feel faster.',
    proof: ['AI agents', 'MCP', 'Evals'],
    accent: '#23f6a5',
  },
  {
    id: 'call',
    label: 'Waiting for your call',
    status: 'Next chapter',
    title: 'Bring the hard problem',
    line: 'Revenue systems. Database bottlenecks. Event platforms. AI tooling. Ready for the next serious team.',
    proof: ['Senior backend', 'Global', 'Bengaluru'],
    accent: '#ff4da6',
  },
] as const;

export const projects = [
  {
    id: 'portfolio',
    title: 'This portfolio',
    kind: 'Visual systems / frontend engineering',
    description:
      'A static Astro portfolio built as a shader-driven product surface: fast, responsive, and GitHub Pages-ready.',
    proof: ['WebGL fluid shader', 'Responsive Astro build', 'GitHub Pages-ready'],
    stack: ['Astro', 'TypeScript', 'WebGL', 'Tailwind', 'Static deploy'],
    href: 'https://github.com/vismaytiwari/portfolio',
  },
  {
    id: 'hotdrop',
    title: 'HotDrop',
    kind: 'Local transfer app',
    description:
      'Two-way macOS and Android file transfer over Wi-Fi or hotspot: no internet, no cloud, no cables.',
    proof: ['QR session flow', 'Resumable transfers', 'HTTPS + auth controls'],
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
  'AWS Solutions Architect - Associate',
  'IBM Machine Learning Practitioner',
] as const;
