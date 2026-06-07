export const profile = {
  name: 'Sakshi Chitnis',
  shortName: 'Sakshi',
  role: 'Java Full Stack Developer',
  location: 'Delhi, India',
  email: 'sakshi.chitnis23@gmail.com',
  phone: '+91-9755257205',
  headline: 'Event-driven microservices, React frontends, and cloud-native systems.',
  subhead:
    'Java. Spring Boot. Kafka. React. Kubernetes. Cloud. Building enterprise-scale products for financial data and high-throughput backend systems.',
  links: {
    email: 'mailto:sakshi.chitnis23@gmail.com?subject=Java%20Full%20Stack%20Developer%20Opportunity',
    portfolio: 'https://sakshichitnis27.github.io/sakshi-portfolio/',
    linkedin: 'https://www.linkedin.com/in/sakshi-chitnis-0333881ab/',
    github: 'https://github.com/sakshichitnis27',
    leetcode: 'https://leetcode.com/u/sakshi_chitnis/',
    resume: 'https://drive.google.com/file/d/1Seo4Rg7PZlc7ZZBv0eTGMWA96N-Oj-C-/view?usp=sharing',
    docIntel: 'https://github.com/sakshichitnis27/Document-AI-Hub',
  },
} as const;

export const impactMetrics = [
  { value: '4+', label: 'years experience' },
  { value: '1M+', label: 'Kafka events/day' },
  { value: '99.99%', label: 'production uptime' },
  { value: '30-100', label: 'global institutions' },
  { value: '-30%', label: 'processing latency' },
  { value: '+40%', label: 'query performance' },
  { value: '<50ms', label: 'Elasticsearch queries' },
  { value: '90%', label: 'test coverage' },
  { value: '435+', label: 'LeetCode problems' },
  { value: '10M+', label: 'indexed documents' },
] as const;

export const techTicker = [
  'Java',
  'JavaScript',
  'TypeScript',
  'Python',
  'Spring Boot',
  'Spring MVC',
  'Spring Cloud',
  'REST APIs',
  'gRPC',
  'Spring Security',
  'OAuth2',
  'JWT',
  'RBAC',
  'React.js',
  'Angular',
  'PostgreSQL',
  'MySQL',
  'Oracle SQL',
  'Redis',
  'MongoDB',
  'Cassandra',
  'Elasticsearch',
  'Kafka',
  'RabbitMQ',
  'WebSockets',
  'Hibernate',
  'Maven',
  'AWS',
  'GCP',
  'Azure',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'Terraform',
  'Grafana',
  'Prometheus',
  'Datadog',
  'Kibana',
  'JUnit',
  'Mockito',
  'SonarQube',
  'Postman',
  'RAG',
  'GitHub Copilot',
] as const;

export const journey = [
  {
    id: 'education',
    label: 'RGPV',
    status: '2018 - 2022',
    title: 'B.Tech in Computer Science',
    line: 'Completed B.Tech in Computer Science from Rajiv Gandhi Prodyogiki Vishwavidyalaya with GPA 8.4/10.0, building the foundation for backend engineering, data structures, databases, and distributed systems.',
    proof: ['Computer Science', 'GPA 8.4/10', 'Engineering foundation'],
    accent: '#60a5fa',
  },
  {
    id: 'hcl',
    label: 'HCL Technologies',
    status: 'Aug 2022 - Feb 2024',
    title: 'Software Developer',
    line: 'Built responsive user management and role-based authorization screens in React for 2,000+ enterprise users, integrated backend APIs for access control and secure sessions, improved REST API response time by 17%, and increased test coverage from 45% to 90% while resolving SonarQube issues.',
    proof: ['React UI', 'RBAC', '2,000+ users', '17% faster APIs', '90% test coverage'],
    accent: '#22d3ee',
  },
  {
    id: 'deloitte',
    label: 'Deloitte',
    status: 'Feb 2024 - Nov 2025',
    title: 'Software Developer',
    line: 'Built multithreaded Kafka consumers processing 1M+ events/day, designed Redis-based feature flags and bitwise segmentation, migrated monolith services to Kubernetes-backed microservices, implemented gRPC/REST APIs, optimized Redis/Cassandra performance by 40%, and improved Elasticsearch search to sub-50ms across 10M+ documents.',
    proof: ['1M+ events/day', 'Feature Flags', 'Kubernetes', 'gRPC/REST', 'Sub-50ms search'],
    accent: '#23f6a5',
  },
  {
    id: 'neoxam',
    label: 'NeoXam',
    status: 'Nov 2025 - Present',
    title: 'Java Software Engineer',
    line: 'Contributing to NeoXam DataHub, an enterprise financial data platform used by 30-100 global institutions, across feed processing, validation governance, audit tracking, downstream distribution, CI/CD release pipelines, Java/Spring ingestion workflows, and AI-assisted development.',
    proof: ['NeoXam DataHub', '30-100 institutions', 'Financial data', 'CI/CD ownership', 'AI-assisted delivery'],
    accent: '#8b5cf6',
  },
  {
    id: 'global',
    label: 'Global Opportunities',
    status: 'Open to roles',
    title: 'Java Full Stack / Backend Engineering',
    line: 'Open to global Java Full Stack, Java Backend, Spring Boot, microservices, cloud-native, and platform engineering opportunities where secure, observable, high-throughput systems matter.',
    proof: ['Java Full Stack', 'Spring Boot', 'Kafka', 'React', 'Cloud-native'],
    accent: '#f59e0b',
  },
] as const;

export const projects = [
  {
    id: 'docintel',
    title: 'DocIntel',
    kind: 'AI-powered document analysis platform',
    description:
      'A React and Spring Boot platform for uploading documents, extracting text, storing metadata, and generating AI summaries with LangChain, LlamaIndex, PostgreSQL, and PDFBox.',
    proof: ['Document upload UI', 'AI summaries', 'PDFBox extraction', 'Fallback handling'],
    stack: ['React', 'Spring Boot', 'PostgreSQL', 'LangChain', 'LlamaIndex'],
    href: profile.links.docIntel,
  },
  {
    id: 'kafka-consumers',
    title: 'Kafka Event Consumers',
    kind: 'High-throughput event pipeline',
    description:
      'Multithreaded Kafka consumers processing 1M+ events/day with retry mechanisms, backpressure handling, and latency optimization under sustained production load.',
    proof: ['1M+ events/day', 'Retry handling', '30% latency reduction'],
    stack: ['Kafka', 'Java', 'Spring Boot', 'Backpressure', 'Monitoring'],
    href: profile.links.github,
  },
  {
    id: 'jwt-authentication',
    title: 'JWT Authentication System',
    kind: 'Secure token-based authentication',
    description:
      'A secure login and logout authentication system using JSON Web Tokens, Spring Security, token expiration, and session management to protect user data and API endpoints.',
    proof: ['JWT login/logout', 'Token expiration', 'Secure API access', 'Session protection'],
    stack: ['Java', 'Spring Boot', 'Spring Security', 'Hibernate', 'REST API', 'MySQL', 'Postman'],
    href: 'https://github.com/sakshichitnis27/JWT-implementation',
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
    icon: 'M16 4 8.5 11.5a3.5 3.5 0 0 0 0 5L12 20 M8.5 11.5 12 8 M9 15h8',
  },
  {
    label: 'Resume',
    href: profile.links.resume,
    icon: 'M6 2h8l4 4v16H6z M14 2v6h6 M8 13h8M8 17h8M8 9h3',
  },
] as const;

export const certs = [
  'AWS Certified Cloud Practitioner',
  'Google Cloud Certified - Professional Cloud Architect',
] as const;
