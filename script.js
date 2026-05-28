// Typewriter for Roles
const roles = [
    "Bad Poet",
    "Professional Backend Developer",
    "System Architect in Training",
    "Latency Slayer",
    "Scale Master",
    "Database Optimizer"
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;
  const speed = 100, deleteSpeed = 50, delayBetween = 1000;
  const roleElem = document.getElementById('typewriter-roles');
  
  function typewriterRoles() {
    const currentRole = roles[roleIndex];
    if (!deleting) {
      if (charIndex < currentRole.length) {
        roleElem.textContent += currentRole.charAt(charIndex);
        charIndex++;
        setTimeout(typewriterRoles, speed);
      } else {
        deleting = true;
        setTimeout(typewriterRoles, delayBetween);
      }
    } else {
      if (charIndex > 0) {
        roleElem.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typewriterRoles, deleteSpeed);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typewriterRoles, delayBetween);
      }
    }
  }
  
  // Typewriter for description
  const descriptionText = 
    "I'm someone who finds poetry in server logs and music in metrics. " + 
    "While frontend developers paint on screens, I orchestrate the symphony of distributed systems, " +
    "where every log line tells a story and every metric holds a secret.";
  let descIndex = 0;
  const descSpeed = 50;
  const descElem = document.getElementById('typewriter-description');
  
  function typewriterDescription() {
    if (descIndex < descriptionText.length) {
      descElem.textContent += descriptionText.charAt(descIndex);
      descIndex++;
      setTimeout(typewriterDescription, descSpeed);
    }
  }
  
  // Code snippet
  const codeSnippet = `async def backend_engineer():
     profile = {
         "name": "Vismay Tiwari",
         "role": "Backend Engineer",
         "DSA Questions Solved": 530+ (if LeetCode is to be believed 🤷‍♂️)",
         "scale I worked on": {
                "users": "200M+ 🙌",
                "rpm": "2.5M/min 🚀",
                "QPS": "11K/s 🌪️"
            },
         "things I increased": {
                "ARPU": "cause who doesn't want money 💰",
                "retention": "no one likes goodbyes 👋",
                "engagement": "keeping users hooked 🎯",
                "scale": "handling traffic like a boss 🚦"
            },
         "how I do things":{
                "user-centric": "because at the end of the day, it's all about the user 👥",
                "clean code": "because life's too short for spaghetti 🍝",
                "TDD": "if it's not tested, it's broken 🧪",
                "agile": "embracing change, one sprint at a time 🏃‍♂️",
                "collaboration": "teamwork makes the dream work 🤝",
            },
         "tech I love (you can in detail below)": {
                "languages": "polyglot programmer - variety is the spice of code 🌶️",
                "databases": "SQL for sanity, NoSQL for vanity, cache for velocity 🎭",
                "messaging": "keeping microservices from becoming micro-service-sadness 📬",
                "storage": "from bits to big data, everything needs a home 💾",
                "infra": "if you can click it, you can code it (IaC ftw!) 🏗️",
                "observability": "because 3am alerts should be real emergencies 🔍",
                "scaling": "if it works on localhost, let's make it global 🌍",
                "containers": "works on my machine? now works everywhere 🐳",
                "cloud": "there's no place like 127.0.0.1, but cloud is a close second ☁️",
                "automation": "if you do it thrice, automate it twice 🤖"
            }
     }`;
  
    function typeCode() {
      const codeElement = document.getElementById('code-content');
      const lines = codeSnippet.split('\n');
      let lineIndex = 0;
      let charIndex = 0;
    
      function typeChar() {
        if (lineIndex < lines.length) {
          if (charIndex === 0) {
            codeElement.textContent += '\n';
          }
          
          if (charIndex < lines[lineIndex].length) {
            codeElement.textContent += lines[lineIndex][charIndex];
            charIndex++;
            // Random typing speed between 20ms and 50ms
            setTimeout(typeChar, Math.random() * 20);
          } else {
            lineIndex++;
            charIndex = 0;
            // Slight pause between lines
            setTimeout(typeChar, 100);
          }
          
          // Auto-scroll to bottom
          codeElement.scrollTop = codeElement.scrollHeight;
        }
      }
    
      // Start typing
      setTimeout(typeChar, 1000);  // Initial delay before starting
    }
  
  // Experience Data
  const experiences = [
    {
      role: "Senior Software Engineer",
      company: "Pocket FM",
      period: "2022 - 2025",
      description: `
        I helped scale revenue-critical backend systems for a 200M+ user audio platform across payments,
        subscriptions, experimentation, search, and high-traffic product paths.
      `,
      bullets: [
        "Reduced MySQL lock contention by tightening transaction scope, query shape, and hot-path data access.",
        "Shipped retention systems and product experiments that improved engagement and rollout confidence.",
        "Partnered on A/B experiments across ARPU, retention, and backend platform controls."
      ]
    },
    {
      role: "Software Engineer",
      company: "Gammastack",
      period: "2021 - 2022",
      description: `
        Built real-time betting systems where every millisecond counts, and established 
        bulletproof fraud detection to keep the party rolling.
      `,
      bullets: [
        "Engineered robust APIs for lightning-speed wagers in the gaming ecosystem.",
        "Implemented data pipelines that sift out the bad actors so the good times can roll.",
        "Optimized performance to ensure the house always stands (well, at least from a server standpoint)."
      ]
    }
  ];
  
  function populateExperience() {
    const expList = document.getElementById('experience-content');
    experiences.forEach(exp => {
      const expDiv = document.createElement('div');
      expDiv.className = 'exp-item';
      expDiv.innerHTML = `
        <div class="header">
          <div class="role">${exp.role}</div>
          <div class="company">${exp.company}</div>
          <div class="period">${exp.period}</div>
        </div>
        <p>${exp.description}</p>
      `;
      // Add bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        const ul = document.createElement('ul');
        exp.bullets.forEach(bullet => {
          const li = document.createElement('li');
          li.innerHTML = bullet;
          ul.appendChild(li);
        });
        expDiv.appendChild(ul);
      }
      expList.appendChild(expDiv);
    });
  }
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active');
  }
});
document.querySelectorAll('.nav-links button').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
const revealElements = document.querySelectorAll('.project-card, .skill-card, .exp-section');

const revealOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealOnScroll.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});
revealElements.forEach(element => {
  revealOnScroll.observe(element);
});




  // Smooth scroll function
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // Scroll to top functionality
  const scrollToTopButton = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopButton.style.display = 'flex';
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
      scrollToTopButton.style.display = 'none';
    }
  });
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Initialize typewriters and experience
  document.addEventListener('DOMContentLoaded', () => {
    typeCode();
    typewriterRoles();
    typewriterDescription();
    populateExperience();
  });
  
  // Terminal code content
  const terminalContent = document.getElementById('terminal-content');
  const codeSnippet_2 = `package main
  
  type Experience struct {
      Role        string    
      Company     string    
      Period      string    
      Highlights  []string  
      TechStack   []string  
  }
  
  type Portfolio struct {
      Experiences []Experience
      Stats struct {
          TotalYears     float64
          Companies      int
          Technologies   []string
      }
  }
  
  func main() {
      portfolio := Portfolio{
          Experiences: make([]Experience, 0),
          Stats: struct {
              TotalYears     float64
              Companies      int
              Technologies   []string
          }{
              TotalYears:   3.5,
              Companies:    2,
              Technologies: []string{
                  "Go", "Python", "MySQL",
                  "Redis", "Kubernetes",
              },
          },
      }
  
      loadExperiences(&portfolio)
      displayExperience(portfolio)
  }
  
  func loadExperiences(p *Portfolio) {
      // Load experience data
      // Parse and format experience details
  }
  
  func displayExperience(p Portfolio) {
      // Format and present experience data
      // Generate metrics and insights
  }`;
  // In script.js, update the techIcons object
  const techIcons = {
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
    MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    Redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    Kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    Kafka: "https://cdn.prod.website-files.com/62038ffc9cd2db4558e3c7b7/623b44a1913c46041e39c836_kafka.svg",
    Elasticsearch: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    Cassandra: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
    GCP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    Airflow: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    DynamoDB: "https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg",
    AWS: "https://cdn.worldvectorlogo.com/logos/amazon-web-services-4.svg",
    RabbitMQ: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg",
    Terraform: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    Redshift: "https://cdn.worldvectorlogo.com/logos/aws-redshift-logo.svg",
    Airflow: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
    Databricks: "https://www.vectorlogo.zone/logos/databricks/databricks-icon.svg"
  };

  const experiences_2 = [
    {
      role: "Senior Software Engineer",
      company: "Pocket FM",
      period: "2022 - 2025",
      heading:"**Scalability Adventures in OTT**",
      description: " Built and improved backend systems for a 200M+ user audio platform, handling payments, subscriptions, experimentation, search, and high-traffic product flows. Tuned MySQL queries and transaction paths to reduce lock contention, shipped retention features, and partnered on experiments that improved engagement and rollout confidence.",
      techStack: ["Python", "Go", "MySQL", "Redis", "Kubernetes", "Kafka", "Elasticsearch", "Cassandra", "GCP", "Airflow", "Redshift", "Databricks"]
    },
    {
      role: "Software Engineer",
      company: "Gammastack",
      period: "2021 - 2022",
      heading:"**Real-Time Betting at the Speed of Light**",
      description: "Engineered real-time betting systems where every millisecond was a high-stakes moment, ensuring users never missed the action. Built fraud detection pipelines that worked harder than a casino bouncer, keeping the ecosystem clean and secure. Designed lightning-fast APIs and optimized performance to handle growing traffic—because when it rains wagers, the servers need to shine.",
      techStack: ["Python", "Go", "PostgreSQL", "Redis", "DynamoDB", "Docker", "RabbitMQ", "Elasticsearch", "AWS", "Terraform"]
    }
  ];
  
  function renderExperiences() {
    const container = document.getElementById('experience-content');
    
    const highlightText = (text) => {
      return text
        // Highlight numbers and metrics
        .replace(/(\d+(?:\.\d+)?[MK+]?(?:\s*(?:RPM|users|servers))?)/g, '<span class="highlight">$1</span>')
        // Highlight technical terms
        .replace(/(MySQL|Redis|ARPU|A\/B)/g, '<span class="highlight-orange">$1</span>')
        // Highlight company name
        .replace(/(Pocket FM|India's)/g, '<span class="highlight-blue">$1</span>')
        // Replace the title with a styled version
        .replace(/\*\*(.*?)\*\*/g, '<span class="exp-title">$1</span>');
    };
  
    container.innerHTML = experiences_2.map(exp => `
      <div class="exp-section">
        <div class="exp-title">${exp.role}</div>
        <div class="exp-company">${exp.company}</div>
        <div class="exp-period">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${exp.period}
        </div>
        <div class="exp-description">
          ${highlightText(exp.heading)}
        </div>
        <div class="exp-description">
          ${highlightText(exp.description)}
        </div>
          <div class="tech-stack">
          ${exp.techStack.map(tech => `
            <div class="tech-badge">
              <img 
                src="${techIcons[tech] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'}" 
                alt="${tech} icon"
              />
              ${tech}
            </div>
          `).join('')}
        </div>
              </div>
            `).join('');
          }
  
  // Type animation for terminal
  function typeWriter(text, element, speed = 50) {
    element.textContent = '';
    let i = 0;
    let lines = text.split('\n');
    let currentLine = 0;
    
    function typeLine() {
      if (currentLine < lines.length) {
        if (i < lines[currentLine].length) {
          element.textContent += lines[currentLine].charAt(i);
          element.scrollTop = element.scrollHeight;
          i++;
          setTimeout(typeLine, speed);
        } else {
          element.textContent += '\n';
          currentLine++;
          i = 0;
          setTimeout(typeLine, speed * 2); // Slight pause between lines
        }
      }
    }
  
    // Add initial command prompt
    element.textContent = 'C:\\> go run experience.go\n\n';
    setTimeout(typeLine, speed * 4); // Pause before starting the code output
  }
  
  // Initialize both sides when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeWriter(codeSnippet_2, terminalContent);
        renderExperiences();
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(document.querySelector('.experience'));

  
  // Skill data object
  const skillsData = {
    Languages: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    ],
    Frameworks: [
      { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
      { name: "GIN", icon: "https://raw.githubusercontent.com/gin-gonic/logo/master/color.png" },
      { name: "FastAPI", icon: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" },
      { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
      { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
    ],
    Databases: [
      { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "Elasticsearch", icon: "https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Cassandra", icon: "https://www.vectorlogo.zone/logos/apache_cassandra/apache_cassandra-icon.svg" },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "DynamoDB", icon: "https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg" },
      { name: "Redshift", icon: "https://cdn.worldvectorlogo.com/logos/aws-redshift-logo.svg" },
      { name: "BigQuery", icon: "https://www.vectorlogo.zone/logos/google_bigquery/google_bigquery-icon.svg" },
    ],
    Queues: [
      { name: "Kafka", icon: "https://cdn.prod.website-files.com/62038ffc9cd2db4558e3c7b7/623b44a1913c46041e39c836_kafka.svg" },
      { name: "RabbitMQ", icon: "https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg" },
      { name: "GCP Pub/Sub", icon: "https://cdn.worldvectorlogo.com/logos/google-cloud-pub-sub-logo.svg" },
    ],
    "Cloud/DevOps": [
      { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "AWS", icon: "https://cdn.worldvectorlogo.com/logos/amazon-web-services-4.svg" },
      { name: "GCP", icon: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg" },
    ],
    Observability: [
      { name: "Kibana", icon: "https://www.vectorlogo.zone/logos/elasticco_kibana/elasticco_kibana-icon.svg" },
      { name: "Grafana", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
      { name: "Prometheus", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
      { name: "Datadog", icon: "https://cdn.worldvectorlogo.com/logos/datadog.svg" },
    ],
    "Infrastructure Management": [
      { name: "Terraform", icon: "https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg" },
    ],
    "Developer Tools": [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Metabase", icon: "https://www.vectorlogo.zone/logos/metabase/metabase-icon.svg" },
      { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    ],
    "Operating Systems": [
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
      { name: "Windows", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" },
      { name: "Mac", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
    ],
  };

// Dynamically populate the skills section
function populateSkills() {
  const skillCategoriesContainer = document.querySelector('.skills-container');
  skillCategoriesContainer.innerHTML = ''; // Clear existing content

  // Iterate over skill categories
  Object.entries(skillsData).forEach(([category, skills]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';

    // Add category title
    categoryDiv.innerHTML = `<h3>${category}</h3>`;

    // Create a container for skill icons
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'skill-icons';

    // Add each skill card
    skills.forEach(skill => {
      const skillCard = document.createElement('div');
      skillCard.className = 'skill-card';
      skillCard.innerHTML = `
        <img src="${skill.icon}" alt="${skill.name}">
        <span>${skill.name}</span>
      `;
      iconsContainer.appendChild(skillCard);
    });

    // Append iconsContainer to categoryDiv
    categoryDiv.appendChild(iconsContainer);

    // Append categoryDiv to the main container
    skillCategoriesContainer.appendChild(categoryDiv);
  });
}

// Call the populateSkills function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', populateSkills);
