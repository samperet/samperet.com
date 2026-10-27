// The CV: the roles, their highlights and the rest of the résumé, shown on /career/ and read by
// Merlin when he answers questions about Sam (src/lib/knowledge.ts).
import { ALPS_PHOTOS, AIRBNB_PHOTOS, type Photo } from './photos';

export type Skill = 'strategy' | 'relationships' | 'systems' | 'design';
export type Highlight = { text: string; skills: Skill[] };
export type Role = {
  id: string;
  name: string;
  full?: string;
  title: string;
  dates: string;
  place?: string;
  href?: string;
  summary: string;
  stat?: { value: string; label: string };
  highlights: Highlight[];
  groups?: { title: string; highlights: Highlight[] }[];
  logo?: Logo;
  photos?: Photo[];
  strip?: boolean; // photos as a small row of thumbnails rather than a grid
  // Projects worth naming on their own, each with its partner's logo.
  projects?: { logo: Logo; partner: string; title: string; text: string; skills: Skill[] }[];
};
// Logos keep their own colours. Files are trimmed PNGs in public/logos/.
export type Logo = { src: string; width: number; height: number };
export const LOGOS = {
  alps: { src: '/logos/alps.png', width: 414, height: 160 },
  airbnb: { src: '/logos/airbnb.png', width: 512, height: 160 },
  snhu: { src: '/logos/snhu.png', width: 209, height: 200 },
  altmba: { src: '/logos/altmba.png', width: 763, height: 160 },
  bdo: { src: '/logos/bdo.png', width: 416, height: 160 },
  nasa: { src: '/logos/nasa.png', width: 195, height: 160 },
  mit: { src: '/logos/mit.png', width: 692, height: 160 },
  nurv: { src: '/logos/nurv.png', width: 565, height: 160 },
  foundersWanted: { src: '/logos/founders-wanted.png', width: 796, height: 160 },
} satisfies Record<string, Logo>;

export const SKILLS: { key: Skill; label: string }[] = [
  { key: 'strategy', label: 'Strategy' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'systems', label: 'Systems' },
  { key: 'design', label: 'Design' },
];

export const contact = {
  phone: '603.531.1077',
  email: 'sam@peret.net',
  linkedin: 'https://www.linkedin.com/in/samperet',
  github: 'https://github.com/samperet',
};

export const summary = [
  'Technology and operations leader with 18 years of experience building organizations, developing technical solutions, and helping emerging technologies reach enterprise customers. Combines early-career experience in solutions engineering, software QA, and automation with executive-level leadership in enterprise technology commercialization, strategic partnerships, and organizational development.',
  'Founding team member at Airbnb’s Portland office, helping scale operations from 14 to 800 employees in three years. Second employee at Acadia Leadership Partners, where I built the operational infrastructure supporting a network of senior executive advisors and technology partners, contributing to an organization averaging $1.25 million in annual revenue per employee.',
  'Currently focused on enterprise AI adoption, intelligent automation, and building practical systems that help organizations understand, implement, and scale new technologies. Particularly energized by zero-to-one environments where technical fluency, human-centered leadership, and thoughtful operating processes create lasting impact.',
];

export const competencies: { name: string; items: string; skill: Skill }[] = [
  { name: 'Organizational leadership', items: 'Zero-to-one team building, recruiting, onboarding, operational scaling, cross-functional collaboration', skill: 'relationships' },
  { name: 'Enterprise AI & technology', items: 'AI adoption, intelligent automation, technical discovery, solution evaluation, enterprise technology commercialization', skill: 'strategy' },
  { name: 'Technical foundations', items: 'Solutions engineering, software QA, scripting and automation, IT systems, web technologies, technical troubleshooting', skill: 'systems' },
  { name: 'Customer engagement', items: 'Executive stakeholder management, enterprise consulting, requirements discovery, solution positioning, strategic partnerships', skill: 'relationships' },
  { name: 'Operational excellence', items: 'Process architecture, scalable workflows, knowledge management, training programs, performance improvement', skill: 'systems' },
  { name: 'Communication & strategy', items: 'Translating technical complexity, executive presentations, product positioning, organizational change', skill: 'design' },
];

export const roles: Role[] = [
  {
    id: 'alps',
    name: 'ALPS',
    full: 'Acadia Leadership Partners',
    title: 'Managing Director · Founding Team Member',
    dates: 'November 2017 – present',
    place: 'Burlington, Vermont',
    href: 'https://acadialps.com',
    logo: LOGOS.alps,
    summary:
      'Joined as the company’s second employee to help build an organization connecting experienced executive advisors with emerging technology companies and enterprise customers. Responsible for developing much of the infrastructure supporting recruiting, engagement, commercialization, and business operations.',
    stat: { value: '$1.25M', label: 'annual revenue per employee, averaged over eight years' },
    highlights: [
      { text: 'Built an organization from the ground up: the recruiting, onboarding, engagement, and operational systems supporting a network of more than 220 senior executive advisors and partners.', skills: ['relationships', 'systems'] },
      { text: 'Established scalable business infrastructure: internal technology systems, marketing operations, collaboration workflows, and the processes supporting enterprise opportunity development and execution.', skills: ['systems', 'design'] },
      { text: 'Advanced enterprise AI adoption: worked with technology providers and enterprise stakeholders to identify opportunities for AI, intelligent automation, cybersecurity, and digital transformation across healthcare, financial services, automotive, and other industries.', skills: ['strategy'] },
      { text: 'Bridged technical teams and executive stakeholders: collaborated with technology founders, engineers, former Big Four consultants, and senior enterprise leaders to translate complex technical capabilities into actionable business opportunities.', skills: ['relationships', 'strategy'] },
      { text: 'Developed repeatable engagement processes: frameworks for identifying customer needs, evaluating solutions, coordinating technical expertise, and moving opportunities from initial discovery through commercial engagement.', skills: ['systems', 'design'] },
      { text: 'Supported technology commercialization: helped emerging technology companies refine enterprise positioning, develop partnerships, and navigate complex buying organizations.', skills: ['strategy', 'relationships'] },
      { text: 'Worked across high-stakes environments: senior military leadership, healthcare executives, cybersecurity specialists, and Fortune 500 decision-makers on complex technology and operational challenges.', skills: ['relationships'] },
      { text: 'Led cross-functional initiatives spanning technical discovery, marketing, sales, partner development, internal systems, and operational strategy.', skills: ['strategy', 'systems'] },
    ],
    strip: true,
    photos: ALPS_PHOTOS,
  },
  {
    id: 'founders-wanted',
    name: 'Founders Wanted',
    logo: LOGOS.foundersWanted,
    title: 'Co-Founder & Operations Officer',
    dates: 'November 2015 – October 2017',
    place: 'Greater Boston',
    summary:
      'Co-founded a venture-development organization designed to commercialize patented technologies by matching promising intellectual property with experienced entrepreneurial leadership.',
    highlights: [
      { text: 'Developed the operational model for identifying, evaluating, and commercializing intellectual property from academic and commercial institutions.', skills: ['strategy', 'systems'] },
      { text: 'Built relationships with patent holders, researchers, technology transfer offices, and prospective commercialization partners.', skills: ['relationships'] },
      { text: 'Recruited, interviewed, and evaluated experienced CEOs to lead new ventures.', skills: ['relationships'] },
      { text: 'Assessed early-stage technologies for commercial viability, market potential, and organizational readiness.', skills: ['strategy'] },
      { text: 'Established repeatable processes for opportunity evaluation, leadership recruitment, venture formation, and company launch.', skills: ['systems', 'design'] },
      { text: 'Worked across technical, commercial, and organizational disciplines to move ideas toward viable businesses.', skills: ['strategy'] },
    ],
    projects: [
      {
        logo: LOGOS.nasa,
        partner: 'NASA',
        title: 'Precision blasting',
        text: 'Brought a NASA-patented technology for precision-based blasting toward market.',
        skills: ['strategy', 'systems'],
      },
      {
        logo: LOGOS.mit,
        partner: 'MIT',
        title: 'AI keyboard timing for Parkinson’s',
        text: 'With MIT, AI software that reads the timing of a person’s typing and could diagnose Parkinson’s disease.',
        skills: ['strategy', 'relationships'],
      },
    ],
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    title: 'Senior Manager, Operations',
    dates: 'February 2014 – July 2015',
    place: 'Portland, Oregon',
    logo: LOGOS.airbnb,
    summary:
      'Founding member of Airbnb’s Portland office, joining an early group responsible for adapting the company’s San Francisco culture and operational practices to a rapidly growing regional operation.',
    stat: { value: '14 → 800', label: 'employees in the Portland office over three years' },
    highlights: [
      { text: 'Supported exceptional organizational growth: helped scale the Portland office from approximately 14 to 800 employees over three years as part of its founding team.', skills: ['relationships', 'systems'] },
      { text: 'Designed operational workflows: customer support processes and systems that supported consistent service delivery across a rapidly expanding organization.', skills: ['systems', 'design'] },
      { text: 'Built onboarding and training programs: courses, learning experiences, and operational guidance to help new employees become effective quickly.', skills: ['design', 'relationships'] },
      { text: 'Led complex customer escalations requiring independent judgment, cross-functional coordination, and substantial resource allocation.', skills: ['relationships', 'strategy'] },
      { text: 'Helped design the workplace: collaborated with internal design teams on office spaces, custom furniture, conference rooms, and shared facilities supporting the organization’s culture and growth.', skills: ['design'] },
      { text: 'Scaled organizational culture: helped translate Airbnb’s founding principles into practical employee experiences as the Portland team expanded.', skills: ['relationships', 'design'] },
      { text: 'Introduced employee wellness initiatives: developed a meditation practice that expanded into a global employee program.', skills: ['relationships'] },
    ],
    photos: AIRBNB_PHOTOS,
  },
  {
    id: 'cloud-nurv',
    name: 'Cloud Nurv',
    logo: LOGOS.nurv,
    title: 'Business Development & Operations',
    dates: 'February 2013 – February 2014',
    place: 'Perth, Australia',
    summary: 'Third employee at an early-stage unified communications technology company.',
    highlights: [
      { text: 'Developed the company’s initial business development strategy and enterprise customer engagement processes.', skills: ['strategy', 'systems'] },
      { text: 'Established strategic partnerships and commercial relationships to support market entry.', skills: ['relationships', 'strategy'] },
      { text: 'Designed early sales workflows, customer support processes, and operational practices.', skills: ['systems', 'design'] },
      { text: 'Worked closely with technical leadership to communicate product capabilities, identify customer requirements, and refine market positioning.', skills: ['relationships', 'strategy'] },
    ],
  },
  {
    id: 'whaleback',
    name: 'Whaleback Systems',
    title: 'Solutions Engineering, Sales & Quality Assurance',
    dates: 'March 2008 – July 2010',
    place: 'Portsmouth, New Hampshire',
    summary: 'Progressively responsible technical and commercial roles spanning software quality assurance, solutions engineering, sales, and marketing.',
    stat: { value: '80%', label: 'of recurring QA tasks automated' },
    highlights: [],
    groups: [
      {
        title: 'Solutions Engineer',
        highlights: [
          { text: 'Conducted technical discovery and on-site consultations to identify customer requirements and recommend solutions.', skills: ['relationships', 'systems'] },
          { text: 'Helped identify new markets and applications for emerging technology products.', skills: ['strategy'] },
          { text: 'Developed interactive technical demonstrations and sales tools for trade shows and customer presentations.', skills: ['design', 'systems'] },
        ],
      },
      {
        title: 'Inside Sales & Marketing',
        highlights: [
          { text: 'Developed a referral program contributing to a 200% increase in sales.', skills: ['strategy', 'relationships'] },
          { text: 'Established processes for lead generation, partner engagement, and customer development.', skills: ['systems'] },
        ],
      },
      {
        title: 'Quality Assurance Engineer Intern',
        highlights: [
          { text: 'Tested and debugged daily software releases, identifying defects and supporting product quality improvements.', skills: ['systems'] },
          { text: 'Automated approximately 80% of recurring QA tasks using Windows scripting tools.', skills: ['systems', 'design'] },
        ],
      },
    ],
  },
];

export type Example = { href: string; src: string; full: string; alt: string; name: string; note: string };
export const initiatives: { title: string; items: string[]; example?: Example }[] = [
  {
    title: 'Enterprise AI adoption & solution discovery',
    items: [
      'Work with emerging AI companies and enterprise stakeholders to evaluate practical applications of generative AI, intelligent automation, and enterprise knowledge systems.',
      'Explore AI-powered onboarding, knowledge delivery, and interactive experiences that help users understand unfamiliar technologies and complex business processes.',
      'Develop approaches for making sophisticated technology accessible to nontechnical audiences through conversational interfaces, interactive presentations, and guided workflows.',
      'Collaborate with technical and commercial stakeholders to identify implementation considerations, enterprise constraints, and opportunities for adoption.',
    ],
  },
  {
    title: 'Digital systems & prototyping',
    items: [
      'Design and prototype web-based applications, interactive experiences, and workflow tools.',
      'Use modern AI-assisted development workflows to accelerate experimentation and translate product concepts into working prototypes.',
      'Explore integrations among web applications, AI systems, business processes, and internal knowledge resources.',
      'Apply a practical, user-centered approach to system design, prioritizing clarity, usability, and maintainability.',
    ],
    example: {
      href: 'https://www.fuseanalytics.com',
      src: '/work/fuseanalytics-800.webp',
      full: '/work/fuseanalytics.webp',
      alt: 'The fuseanalytics.com homepage: “Retire your legacy enterprise apps. Keep the data.”, with a product screenshot and a Book a demo button',
      name: 'fuseanalytics.com',
      note: 'An example of this work: the site for an HCM and payroll data-archiving company, built with AI-assisted development. Retention, turnover and M&A tools, a demo request that lands in the sales pipeline, and an AI assistant that hands a conversation to the team when a visitor asks for a person.',
    },
  },
];

export const education: { school: string; degree: string; dates: string; place?: string; logo?: Logo; notes: string[] }[] = [
  {
    school: 'Southern New Hampshire University',
    logo: LOGOS.snhu,
    degree: 'Bachelor of Science, Business Administration',
    dates: 'May 2008',
    place: 'Manchester, New Hampshire',
    notes: ['Three-Year Honors Program', 'Vice President, Student Government', 'President, Audio Visual Club'],
  },
  {
    school: 'altMBA',
    logo: LOGOS.altmba,
    degree: 'Seth Godin’s altMBA Program',
    dates: 'July 2016',
    notes: ['Early participant in an intensive leadership and business development program emphasizing decision-making, creative problem-solving, communication, and organizational change.'],
  },
];

export const boards = [
  { org: 'FuzionFit', role: 'Board Member', years: '2011–2020' },
  { org: 'Portsmouth Public Media', role: 'Vice President & Board Member', years: '2010–2011' },
  { org: 'Zev Yoga', role: 'Board Member', years: '2009–2015' },
  { org: 'Harambe Entrepreneur Alliance', role: 'Board Member', years: '2008–2012' },
];

export const awards: { title: string; org: string; year: string; text: string; logo?: Logo }[] = [
  { title: 'Innovation Award', org: 'BDO USA', year: '2020', text: 'Recognition for innovation in technology and business solutions.', logo: LOGOS.bdo },
];
