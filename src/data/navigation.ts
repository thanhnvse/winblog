export interface NavItem {
  label: string
  to: string
  highlight?: boolean
}

export interface LocationItem {
  country: string
  cities: string[]
  to: string
  image: string
}

export const mainNav: NavItem[] = [
  { label: 'Technologies', to: '/technologies' },
  { label: 'Economics', to: '/economics' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Administration', to: '/administration' },
  { label: 'Login', to: '/login', highlight: true },
]

export const menuLinks: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Technologies', to: '/technologies' },
  { label: 'Economics', to: '/economics' },
  { label: 'Administration', to: '/administration' },
  { label: 'About Us', to: '/about' },
]

export const menuSecondaryLinks: NavItem[] = [
  { label: 'Experiences', to: '/experiences' },
  { label: 'Clients', to: '/clients' },
  { label: 'Careers', to: '/careers' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'White Papers', to: '/whitepapers' },
  { label: 'Contact Us', to: '/contact' },
]

export const industryLinks: NavItem[] = [
  { label: 'Telecom', to: '/administration/telecom' },
  { label: 'Edtech', to: '/administration/edtech' },
  { label: 'Fintech', to: '/administration/fintech' },
  { label: 'Healthcare', to: '/administration/healthcare' },
  { label: 'Agriculture', to: '/administration/agriculture' },
  { label: 'Enterprise', to: '/administration/enterprise' },
  { label: 'E-commerce', to: '/administration/e-commerce' },
  { label: 'Real Estate', to: '/administration/real-estate' },
]

export const locations: LocationItem[] = [
  {
    country: 'India',
    cities: ['Bangalore', 'Mumbai', 'Chennai', 'Hyderabad'],
    to: '/locations/india',
    image: '2_50.webp',
  },
  {
    country: 'USA',
    cities: ['San Jose', 'Dallas', 'Salt Lake City'],
    to: '/locations/usa',
    image: 'US-Female-at-Pizzas-new-transformed.webp',
  },
  {
    country: 'UAE',
    cities: ['Dubai'],
    to: '/locations/uae',
    image: 'UAE-transformed.webp',
  },
  {
    country: 'Vietnam',
    cities: ['Ho Chi Minh City'],
    to: '/locations/vietnam',
    image: 'vietnam.webp',
  },
]

export const socialLinks = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/lollypop-studio/' },
  { label: 'Instagram', url: 'https://www.instagram.com/lollypop.design/' },
  { label: 'X', url: 'https://x.com/lollypop_studio' },
  { label: 'Facebook', url: 'https://www.facebook.com/lollypop.india' },
  { label: 'Dribbble', url: 'https://dribbble.com/lollypop_studio' },
]
