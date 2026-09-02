export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: string;
  quote: string;
  avatar: string;
  initials: string;
}

export const HERO_TESTIMONIAL: Testimonial = {
  id: 'hero-rahul',
  name: 'Dr. Rahul Sharma',
  role: 'Top Ranker, Dhaka Medical College (DMC)',
  rating: '4.9',
  quote:
    '"The structured approach and clinical precision of ShopnerCoat were instrumental in securing my rank. It\'s not just a platform; it\'s a rigorous academic companion."',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop',
  initials: 'RS',
};

export const TOP_TESTIMONIALS: Testimonial[] = [
  {
    id: 'ayesha',
    name: 'Ayesha Siddiqua',
    role: 'BSc Nursing, Armed Forces Medical College',
    rating: '4.8',
    quote:
      '"The comprehensive study materials and timely mock exams perfectly aligned with the nursing admission syllabus. Highly recommended for focused preparation."',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
    initials: 'AS',
  },
  {
    id: 'tanvir',
    name: 'Tanvir Hasan',
    role: 'Faculty of Pharmacy, University of Dhaka',
    rating: '5.0',
    quote:
      '"ShopnerCoat\'s dedicated pharmacy modules clarified complex pharmacological concepts. The interface is distraction-free, which is crucial during high-stakes study sessions."',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop',
    initials: 'TH',
  },
];

export const WIDE_TESTIMONIAL: Testimonial = {
  id: 'nusrat',
  name: 'Nusrat Jahan',
  role: 'BDS, Shaheed Suhrawardy Medical College Dental Unit',
  rating: '4.9',
  quote:
    '"The rigorous testing environment simulated the actual exam perfectly. The analytics provided post-exam helped me pinpoint my weak areas in dental anatomy. A truly indispensable tool for any serious candidate."',
  avatar: 'https://images.unsplash.com/photo-1594824813608-54b6d49cb0c9?q=80&w=256&auto=format&fit=crop',
  initials: 'NJ',
};
