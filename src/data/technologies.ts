import imgTelecom from '@/assets/hero.png'
import imgSportstech from '@/assets/images/Team-Discussion-1.webp'
import imgRealEstate from '@/assets/images/Working-culture-1.1.webp'
import imgEcommerce from '@/assets/images/Freshtohome-Banner.webp'
import imgFintech from '@/assets/images/Design-Thinking-StickyNotes.webp'
import imgEdtech from '@/assets/images/Girl-Illustrting-2_11zon-1.webp'
import imgHealthcare from '@/assets/images/stanza-banner.webp'
import imgAgriculture from '@/assets/images/Vietnam-Team-Meeting-2.webp'
import imgEnterprise from '@/assets/images/designing-for-generative-ai-whitepaper.webp'

export interface ContentSection {
  type: 'paragraph' | 'heading' | 'blockquote' | 'list' | 'table'
  content: string
  items?: string[]
  rows?: string[][]
}

export interface Technology {
  id: string
  title: string
  description: string
  image: string
  author: string
  authorRole: string
  postedDate: string
  lastUpdated: string
  content: ContentSection[]
}

export const technologies: Technology[] = [
  {
    id: 'telecom',
    title: 'Powering the Future of Telecom with Cutting-Edge Design & Technology',
    description:
      'We design seamless digital experiences for telecom providers, from network management dashboards to customer-facing apps that simplify connectivity.',
    image: imgTelecom,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '18 March, 2026',
    lastUpdated: '18 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'The telecom industry is undergoing a massive digital transformation, and design plays a critical role in shaping how users interact with network services, IoT platforms, and communication tools.',
      },
      {
        type: 'paragraph',
        content:
          'From 5G rollouts to smart home ecosystems, telecom companies face the challenge of making complex technology accessible to everyday users. The key lies in intuitive interfaces that abstract away technical complexity while giving power users the control they need.',
      },
      {
        type: 'heading',
        content: 'Key Challenges in Telecom UX',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Network management dashboards with real-time data visualization',
          'Self-service portals that reduce customer support costs',
          'IoT device management interfaces for smart home and enterprise solutions',
          'Billing and subscription management with transparent pricing',
        ],
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
      {
        type: 'heading',
        content: 'Our Approach',
      },
      {
        type: 'paragraph',
        content:
          'We combine deep user research with iterative prototyping to create telecom experiences that are both powerful and intuitive. Our design process starts with understanding the end user — whether they are a network engineer monitoring infrastructure or a consumer managing their mobile plan.',
      },
      {
        type: 'paragraph',
        content:
          'By focusing on progressive disclosure and contextual help, we ensure that complex telecom features are accessible without overwhelming users.',
      },
    ],
  },
  {
    id: 'sportstech',
    title: 'UX/UI Design to Revolutionize the Sportstech Industry',
    description:
      'From fitness tracking to live streaming platforms, we craft engaging sports technology experiences that keep users active and connected.',
    image: imgSportstech,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '15 March, 2026',
    lastUpdated: '15 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Sports technology is where passion meets innovation. Designing for athletes, coaches, and fans requires understanding the emotional intensity of competition and the precision of performance data.',
      },
      {
        type: 'paragraph',
        content:
          'The sportstech industry demands interfaces that work in high-pressure, real-time environments — from live match tracking to wearable device dashboards that display biometric data at a glance.',
      },
      {
        type: 'heading',
        content: 'Design Principles for Sportstech',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Real-time data visualization that is glanceable and actionable',
          'Gamification elements that motivate and engage users',
          'Accessibility across devices — from smartwatches to stadium screens',
          'Social features that build community around shared sporting experiences',
        ],
      },
      {
        type: 'paragraph',
        content:
          'We design sportstech products that match the energy and excitement of the sports they serve, while maintaining the clarity and usability that users need to make split-second decisions.',
      },
    ],
  },
  {
    id: 'real-estate',
    title: 'UI/UX Design that Humanises Real Estate & Construction',
    description:
      'We build intuitive property platforms, virtual tour experiences, and construction management tools that simplify complex real estate workflows.',
    image: imgRealEstate,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '12 March, 2026',
    lastUpdated: '12 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Real estate is one of the most significant decisions people make. The digital experience should inspire confidence, provide clarity, and simplify the journey from search to settlement.',
      },
      {
        type: 'paragraph',
        content:
          'Whether it\'s a first-time homebuyer browsing listings or a project manager tracking construction milestones, real estate platforms must balance rich visual content with structured, actionable information.',
      },
      {
        type: 'heading',
        content: 'Transforming Property Experiences',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Immersive virtual tours and 3D property visualization',
          'Smart search and filtering that understands buyer intent',
          'Construction project dashboards with milestone tracking',
          'Document management and digital signing workflows',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Our designs bridge the gap between the physical and digital worlds of real estate, creating experiences that feel as tangible and trustworthy as an in-person property visit.',
      },
    ],
  },
  {
    id: 'e-commerce',
    title: 'Craft Experiences that Embrace Your Business Growth with Exceptional UI UX',
    description:
      'From product discovery to checkout, we design e-commerce experiences that drive conversions and build customer loyalty.',
    image: imgEcommerce,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '10 March, 2026',
    lastUpdated: '10 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'In e-commerce, every pixel matters. A well-designed product page can be the difference between a sale and an abandoned cart. We design shopping experiences that feel effortless and delightful.',
      },
      {
        type: 'paragraph',
        content:
          'The modern consumer expects a seamless, personalized shopping experience across all devices. From product discovery through AI-powered recommendations to one-tap checkout, every interaction must reduce friction and build trust.',
      },
      {
        type: 'heading',
        content: 'E-commerce Design That Converts',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Intuitive product browsing with smart filters and search',
          'Streamlined checkout flows that minimize cart abandonment',
          'Personalization engines that surface relevant products',
          'Mobile-first design for on-the-go shopping',
        ],
      },
      {
        type: 'paragraph',
        content:
          'We use data-driven design to optimize every step of the customer journey, ensuring that your e-commerce platform not only attracts visitors but converts them into loyal customers.',
      },
    ],
  },
  {
    id: 'fintech',
    title: 'Simplifying Complexities of Fintech through Design',
    description:
      'We make financial products accessible and trustworthy through thoughtful UX — from banking apps to trading platforms and digital wallets.',
    image: imgFintech,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '8 March, 2026',
    lastUpdated: '8 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Financial technology carries a unique responsibility: users trust these platforms with their money, their data, and their financial futures. Design must earn and maintain that trust at every interaction.',
      },
      {
        type: 'paragraph',
        content:
          'Fintech products often deal with complex data — transaction histories, investment portfolios, credit scores, and regulatory compliance. The challenge is presenting this information in a way that empowers users rather than overwhelming them.',
      },
      {
        type: 'heading',
        content: 'Building Trust Through Design',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Clear, transparent pricing and fee structures',
          'Security-first design patterns that reassure users',
          'Data visualization that makes financial data actionable',
          'Onboarding flows that simplify KYC and compliance requirements',
        ],
      },
      {
        type: 'heading',
        content: 'Impact Metrics',
      },
      {
        type: 'table',
        content: '',
        rows: [
          ['Metric', 'Before', 'After'],
          ['User Onboarding Rate', '34%', '78%'],
          ['Transaction Completion', '62%', '91%'],
          ['Support Tickets', '1,200/month', '340/month'],
        ],
      },
      {
        type: 'paragraph',
        content:
          'By prioritizing clarity and security in our designs, we help fintech companies build products that users trust and return to daily.',
      },
    ],
  },
  {
    id: 'edtech',
    title: 'Reinvigorating the Edtech Industry with Design-Based Innovations',
    description:
      'We design learning platforms that engage students and educators alike, making education accessible, interactive, and impactful.',
    image: imgEdtech,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '5 March, 2026',
    lastUpdated: '5 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Education is the most powerful tool for changing the world. Digital learning platforms must honor that power by creating experiences that inspire curiosity, maintain engagement, and deliver measurable outcomes.',
      },
      {
        type: 'paragraph',
        content:
          'The edtech landscape has evolved dramatically. Today\'s learners expect interactive, personalized experiences that adapt to their pace and learning style. Educators need tools that simplify content creation and provide insights into student progress.',
      },
      {
        type: 'heading',
        content: 'Designing for Learning Outcomes',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Adaptive learning paths that personalize content delivery',
          'Interactive assessments with immediate, constructive feedback',
          'Collaboration tools that foster peer-to-peer learning',
          'Analytics dashboards for educators to track student progress',
        ],
      },
      {
        type: 'paragraph',
        content:
          'We believe that great edtech design is invisible — it gets out of the way and lets learning happen naturally, while quietly guiding users toward their goals.',
      },
    ],
  },
  {
    id: 'healthcare',
    title: 'Using Design to Empower the Healthcare Industry',
    description:
      'From telemedicine to patient management systems, we create healthcare solutions that prioritize usability, accessibility, and trust.',
    image: imgHealthcare,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '3 March, 2026',
    lastUpdated: '3 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'In healthcare, design can literally save lives. Intuitive interfaces for medical professionals reduce errors, while patient-facing apps improve adherence and outcomes.',
      },
      {
        type: 'paragraph',
        content:
          'Healthcare UX demands the highest standards of accessibility, clarity, and reliability. Whether designing for a surgeon in an operating room or a patient managing chronic conditions at home, every interaction must be precise and trustworthy.',
      },
      {
        type: 'heading',
        content: 'Healthcare Design Priorities',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Telemedicine platforms with seamless video and data sharing',
          'Electronic health record systems that reduce clinician burnout',
          'Patient portals with clear health information and action items',
          'WCAG-compliant designs ensuring accessibility for all users',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Our healthcare designs are built on empathy — understanding the stress, urgency, and vulnerability that users experience in healthcare contexts, and designing interfaces that provide calm, clarity, and confidence.',
      },
    ],
  },
  {
    id: 'agriculture',
    title: 'Empowering Agriculture through Design and Technology',
    description:
      'We design digital tools for the agriculture ecosystem — from farm management to supply chain solutions that connect farmers to markets.',
    image: imgAgriculture,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '1 March, 2026',
    lastUpdated: '1 March, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Agriculture feeds the world, yet the industry has been slow to adopt digital tools. Thoughtful design can bridge this gap by creating solutions that respect the realities of farming while bringing the benefits of technology to the field.',
      },
      {
        type: 'paragraph',
        content:
          'Agricultural users often work in challenging conditions — outdoors, with limited connectivity, and with varying levels of digital literacy. Our designs account for these realities with offline-first approaches, simple interfaces, and multilingual support.',
      },
      {
        type: 'heading',
        content: 'AgriTech Solutions We Design',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Farm management platforms with weather and crop monitoring',
          'Supply chain tracking from farm to table',
          'Marketplace apps connecting farmers directly to buyers',
          'IoT dashboards for precision agriculture and irrigation',
        ],
      },
      {
        type: 'paragraph',
        content:
          'By designing for the unique constraints of agricultural users, we create digital tools that are adopted and valued, not abandoned after the first season.',
      },
    ],
  },
  {
    id: 'enterprise',
    title: 'Humanizing Enterprise Solutions through Design',
    description:
      'We simplify complex enterprise workflows with intuitive dashboards, CRM/ERP systems, and internal tools that boost productivity.',
    image: imgEnterprise,
    author: 'Win Nguyen',
    authorRole: 'Technology Lead',
    postedDate: '25 February, 2026',
    lastUpdated: '25 February, 2026',
    content: [
      {
        type: 'blockquote',
        content:
          'Enterprise software doesn\'t have to be ugly or confusing. When internal tools are well-designed, employees are more productive, more satisfied, and make fewer errors.',
      },
      {
        type: 'paragraph',
        content:
          'Enterprise applications often suffer from feature bloat, inconsistent interfaces, and steep learning curves. We bring consumer-grade design thinking to enterprise software, creating tools that employees actually want to use.',
      },
      {
        type: 'heading',
        content: 'Enterprise Design Focus Areas',
      },
      {
        type: 'list',
        content: '',
        items: [
          'Data-rich dashboards with customizable views and drill-downs',
          'Workflow automation interfaces that reduce manual processes',
          'Design systems that ensure consistency across enterprise platforms',
          'Role-based interfaces that show relevant information to each user',
        ],
      },
      {
        type: 'heading',
        content: 'ROI of Enterprise UX',
      },
      {
        type: 'table',
        content: '',
        rows: [
          ['Metric', 'Improvement'],
          ['Employee Onboarding Time', 'Reduced by 60%'],
          ['Task Completion Rate', 'Increased by 45%'],
          ['Support Requests', 'Decreased by 70%'],
        ],
      },
      {
        type: 'paragraph',
        content:
          'Great enterprise design pays for itself through increased productivity, reduced training costs, and higher employee satisfaction.',
      },
    ],
  },
]
