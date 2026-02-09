export type StoreCategoryId = 'cars' | 'real_estate' | 'electronics' | 'furniture' | 'services'

export type StoreRecord = {
  slug: string
  name: { ar: string; en: string }
  category: StoreCategoryId
  cover_image_url?: string
  logo_image_url?: string
  city: { ar: string; en: string }
  address: { ar: string; en: string }
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  socials?: Partial<{
    facebook: string
    instagram: string
    tiktok: string
    youtube: string
  }>
  is_verified?: boolean
  is_open_now?: boolean
  rating?: number
  reviews_count?: number
  followers_count?: number
  description?: { ar: string; en: string }
  tags?: string[]
  services_offered?: { ar: string[]; en: string[] }
  business_categories?: { ar: string[]; en: string[] }
}

export const STORE_CATEGORIES: Array<{ id: StoreCategoryId; name: { ar: string; en: string } }> = [
  { id: 'cars', name: { ar: 'معارض سيارات', en: 'Car showrooms' } },
  { id: 'real_estate', name: { ar: 'مكاتب عقارات', en: 'Real estate offices' } },
  { id: 'electronics', name: { ar: 'إلكترونيات', en: 'Electronics' } },
  { id: 'furniture', name: { ar: 'أثاث', en: 'Furniture' } },
  { id: 'services', name: { ar: 'خدمات', en: 'Services' } },
]

export const MOCK_STORES: StoreRecord[] = [
  {
    slug: 'al-sultan-cars',
    name: { ar: 'معرض السلطان للسيارات', en: 'Al Sultan Cars' },
    category: 'cars',
    cover_image_url: '/stores/covers/cars.svg',
    logo_image_url: '/stores/logos/cars.svg',
    city: { ar: 'عمّان', en: 'Amman' },
    address: { ar: 'شارع المدينة المنورة، عمّان', en: 'Medina St, Amman' },
    phone: '+962790000001',
    whatsapp: '+962790000001',
    email: 'info@alsultan-cars.test',
    website: 'https://example.com',
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
    },
    is_verified: true,
    is_open_now: true,
    rating: 4.7,
    reviews_count: 182,
    followers_count: 12450,
    description: {
      ar: 'سيارات مستعملة ومكفولة، فحص شامل، وخيارات تمويل.',
      en: 'Certified used cars, inspections, and financing options.',
    },
    tags: ['تمويل', 'فحص', 'مكفول'],
    services_offered: {
      ar: ['بيع وشراء', 'تمويل', 'فحص شامل', 'تأمين', 'تبديل'],
      en: ['Buy & sell', 'Financing', 'Inspection', 'Insurance', 'Trade-in'],
    },
    business_categories: {
      ar: ['سيارات سيدان', 'SUV', 'سيارات كهربائية', 'تجاري'],
      en: ['Sedans', 'SUV', 'EV', 'Commercial'],
    },
  },
  {
    slug: 'blue-keys-real-estate',
    name: { ar: 'مكتب المفاتيح الزرقاء', en: 'Blue Keys Real Estate' },
    category: 'real_estate',
    cover_image_url: '/stores/covers/real-estate.svg',
    logo_image_url: '/stores/logos/real-estate.svg',
    city: { ar: 'إربد', en: 'Irbid' },
    address: { ar: 'دوار الثقافة، إربد', en: 'Culture Circle, Irbid' },
    phone: '+962790000002',
    whatsapp: '+962790000002',
    email: 'hello@bluekeys.test',
    website: 'https://example.com',
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    },
    is_verified: true,
    is_open_now: false,
    rating: 4.5,
    reviews_count: 94,
    followers_count: 7340,
    description: {
      ar: 'بيع وتأجير شقق ومحلات، إدارة أملاك، وتقييم عقاري.',
      en: 'Sales & rentals, property management, and appraisal.',
    },
    tags: ['تأجير', 'بيع', 'إدارة أملاك'],
    services_offered: {
      ar: ['بيع', 'تأجير', 'إدارة أملاك', 'تقييم', 'استشارات'],
      en: ['Sales', 'Rentals', 'Management', 'Appraisal', 'Consulting'],
    },
    business_categories: {
      ar: ['شقق', 'فلل', 'محلات', 'أراضي'],
      en: ['Apartments', 'Villas', 'Retail', 'Land'],
    },
  },
  {
    slug: 'golden-signal-electronics',
    name: { ar: 'إشارة الذهب للإلكترونيات', en: 'Golden Signal Electronics' },
    category: 'electronics',
    cover_image_url: '/stores/covers/electronics.svg',
    logo_image_url: '/stores/logos/electronics.svg',
    city: { ar: 'الزرقاء', en: 'Zarqa' },
    address: { ar: 'شارع الجيش، الزرقاء', en: 'Army St, Zarqa' },
    phone: '+962790000003',
    whatsapp: '+962790000003',
    email: 'support@goldensignal.test',
    website: 'https://example.com',
    socials: {
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
    },
    is_verified: false,
    is_open_now: true,
    rating: 4.2,
    reviews_count: 61,
    followers_count: 2210,
    description: {
      ar: 'هواتف، لابتوبات، إكسسوارات، وضمانات متنوعة.',
      en: 'Phones, laptops, accessories, and warranties.',
    },
    tags: ['هواتف', 'لابتوب', 'إكسسوارات'],
    services_offered: {
      ar: ['بيع أجهزة', 'صيانة', 'ضمان', 'تركيب', 'استبدال'],
      en: ['Retail', 'Repair', 'Warranty', 'Setup', 'Exchange'],
    },
    business_categories: {
      ar: ['هواتف', 'لابتوبات', 'ألعاب', 'إكسسوارات'],
      en: ['Phones', 'Laptops', 'Gaming', 'Accessories'],
    },
  },
]

