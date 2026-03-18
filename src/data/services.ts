export interface Service {
  title: string
  description: string
  items: string[]
  link: string
}

export const services: Service[] = [
  {
    title: 'Technology',
    description:
      'As a developer, I’m constantly swimming in a vast ocean where every wave brings a new technology. It’s a reminder that I must keep learning every day OR risk being overwhelmed and pulled under by the tide.',
    items: [
      'Heuristic Analysis',
      'Design Audit',
      'Usability Testing',
      'Ethnographic Research',
      'Emerging Trends',
      'UX research',
    ],
    link: '/technologies#technology',
  },
  {
    title: 'Economic',
    description:
      'As a person who has moments when I almost gave in to FOMO, following what others were doing. But I’ve come to realize that in this field, stepping in without truly understanding it turns money into lessons rather than profits. "It’s like a child leaving home and never returning — instead of bringing back happiness, it becomes a loss that quietly lingers."',
    items: [
      'Digital Branding',
      'User Experience Design',
      'User Interface Design',
      'Interaction Design',
      'AI Design Solutions',
      'Digital Prototyping',
      'Motion Graphics',
      'Illustrations and Iconography',
    ],
    link: '/economics#economic',
  },
  {
    title: 'Experience',
    description:
      'Having gone through quite a few failures in life, this is where I share my experiences across different aspects of it. Guided by a simple principle: "If I’ve fallen once, I won’t fall the same way again — and if you haven’t fallen yet, try your best not to."',
    items: [
      'Front-End Development',
      'Web Application Development',
      'Mobile Application Development',
      'Custom Application Development',
      'AI Solution Development',
      'SAAS Implementation',
    ],
    link: '/experiences#experience',
  },
]
