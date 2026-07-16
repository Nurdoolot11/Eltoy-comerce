// ELTOY STROY — маалымат базасы (демо маалыматтар)
// Бардык тексттер кыргыз тилинде

export type Category = {
  slug: string
  name: string
  description: string
  icon: string
  image: string
  count: number
}

export type Brand = {
  slug: string
  name: string
  country: string
  productCount: number
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  image: string
  gallery: string[]
  rating: number
  reviewsCount: number
  stock: number
  sku: string
  badges: ('new' | 'popular' | 'sale' | 'featured')[]
  shortDescription: string
  description: string
  specs: { label: string; value: string }[]
}

export type Review = {
  id: string
  name: string
  city: string
  rating: number
  date: string
  text: string
}

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  content: string
}

export const categories: Category[] = [
  {
    slug: 'perforatorlor',
    name: 'Перфораторлор',
    description: 'Бетон жана таш үчүн күчтүү перфораторлор',
    icon: 'Hammer',
    image: '/images/product-rotary-hammer.png',
    count: 48,
  },
  {
    slug: 'dreldar',
    name: 'Дрелдер',
    description: 'Шуруповерттер жана соккулуу дрелдер',
    icon: 'Drill',
    image: '/images/product-drill.png',
    count: 63,
  },
  {
    slug: 'bolgarkalar',
    name: 'Болгаркалар',
    description: 'Бурчтук ажылоочу машиналар',
    icon: 'Disc3',
    image: '/images/product-grinder.png',
    count: 37,
  },
  {
    slug: 'generatorlor',
    name: 'Генераторлор',
    description: 'Бензиндик жана дизелдик генераторлор',
    icon: 'Zap',
    image: '/images/product-generator.png',
    count: 21,
  },
  {
    slug: 'kompressorlor',
    name: 'Компрессорлор',
    description: 'Аба компрессорлору жана жабдуулары',
    icon: 'Wind',
    image: '/images/product-compressor.png',
    count: 18,
  },
  {
    slug: 'shiretuu-apparattary',
    name: 'Ширетүү аппараттары',
    description: 'Инверторлор жана ширетүү жабдуулары',
    icon: 'Flame',
    image: '/images/product-welder.png',
    count: 26,
  },
  {
    slug: 'araalar',
    name: 'Араалар',
    description: 'Тегерек, тизмектүү жана торцтук араалар',
    icon: 'Scissors',
    image: '/images/product-saw.png',
    count: 34,
  },
  {
    slug: 'kol-shaymandary',
    name: 'Кол шаймандары',
    description: 'Ачкычтар, отверткалар жана комплекттер',
    icon: 'Wrench',
    image: '/images/product-handtools.png',
    count: 112,
  },
  {
    slug: 'olchoo-shaymandary',
    name: 'Өлчөө шаймандары',
    description: 'Лазердик деңгээлдер жана өлчөгүчтөр',
    icon: 'Ruler',
    image: '/images/product-measure.png',
    count: 29,
  },
  {
    slug: 'koopsuzduk',
    name: 'Коопсуздук каражаттары',
    description: 'Каскалар, көз айнектер жана мээлейлер',
    icon: 'HardHat',
    image: '/images/product-safety.png',
    count: 41,
  },
  {
    slug: 'batareyalar',
    name: 'Батареялар жана заряддагычтар',
    description: 'Аккумуляторлор жана заряддагычтар',
    icon: 'BatteryCharging',
    image: '/images/product-battery.png',
    count: 24,
  },
  {
    slug: 'kesuuchu-shaymandar',
    name: 'Кесүүчү шаймандар',
    description: 'Дисктер, бургулар жана насадкалар',
    icon: 'CircleDot',
    image: '/images/product-grinder.png',
    count: 87,
  },
]

export const brands: Brand[] = [
  { slug: 'bosch', name: 'Bosch', country: 'Германия', productCount: 148 },
  { slug: 'makita', name: 'Makita', country: 'Япония', productCount: 132 },
  { slug: 'dewalt', name: 'DeWalt', country: 'АКШ', productCount: 96 },
  { slug: 'milwaukee', name: 'Milwaukee', country: 'АКШ', productCount: 74 },
  { slug: 'hikoki', name: 'Hikoki', country: 'Япония', productCount: 58 },
  { slug: 'total', name: 'Total', country: 'Кытай', productCount: 210 },
  { slug: 'ingco', name: 'INGCO', country: 'Кытай', productCount: 186 },
  { slug: 'stanley', name: 'Stanley', country: 'АКШ', productCount: 121 },
]

function makeGallery(main: string): string[] {
  return [main, '/images/workshop.png', '/images/builder.png', '/images/cta-banner.png']
}

const baseSpecs = [
  { label: 'Кепилдик', value: '24 ай' },
  { label: 'Өлкө', value: 'Расмий импорт' },
  { label: 'Комплект', value: 'Кутуча менен' },
]

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'bosch-gbh-2-28-perforator',
    name: 'Bosch GBH 2-28 F Перфоратор',
    brand: 'bosch',
    category: 'perforatorlor',
    price: 18900,
    oldPrice: 23500,
    image: '/images/product-rotary-hammer.png',
    gallery: makeGallery('/images/product-rotary-hammer.png'),
    rating: 4.9,
    reviewsCount: 214,
    stock: 12,
    sku: 'BSH-GBH228F',
    badges: ['popular', 'sale', 'featured'],
    shortDescription: 'SDS-Plus, 880 Вт, 3.2 Дж соккулуу энергия менен профессионалдык перфоратор.',
    description:
      'Bosch GBH 2-28 F — бетон, кирпич жана таш менен иштөө үчүн иштелип чыккан профессионалдык перфоратор. Kickback Control коопсуздук системасы жана алмаштырылуучу патрону менен жабдылган. Күнүмдүк оор жүктөмдөргө туруктуу.',
    specs: [
      { label: 'Кубаттуулук', value: '880 Вт' },
      { label: 'Соккулуу энергия', value: '3.2 Дж' },
      { label: 'Патрон', value: 'SDS-Plus' },
      { label: 'Салмагы', value: '3.1 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p2',
    slug: 'makita-hr2470-perforator',
    name: 'Makita HR2470 Перфоратор',
    brand: 'makita',
    category: 'perforatorlor',
    price: 15400,
    image: '/images/product-rotary-hammer.png',
    gallery: makeGallery('/images/product-rotary-hammer.png'),
    rating: 4.8,
    reviewsCount: 176,
    stock: 8,
    sku: 'MKT-HR2470',
    badges: ['popular'],
    shortDescription: '780 Вт, 3 режимдүү ишенимдүү перфоратор.',
    description:
      'Makita HR2470 — 3 иштөө режими (бургулоо, соккулуу бургулоо, урма) менен туруктуу перфоратор. Жеңил корпусу узак иштөөдө колдун чарчоосун азайтат.',
    specs: [
      { label: 'Кубаттуулук', value: '780 Вт' },
      { label: 'Соккулуу энергия', value: '2.7 Дж' },
      { label: 'Режимдер', value: '3' },
      { label: 'Салмагы', value: '2.8 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p3',
    slug: 'dewalt-dcd796-shurupovert',
    name: 'DeWalt DCD796 Соккулуу шуруповерт',
    brand: 'dewalt',
    category: 'dreldar',
    price: 21300,
    oldPrice: 25900,
    image: '/images/product-drill.png',
    gallery: makeGallery('/images/product-drill.png'),
    rating: 4.9,
    reviewsCount: 302,
    stock: 20,
    sku: 'DW-DCD796',
    badges: ['sale', 'popular', 'featured'],
    shortDescription: '18В аккумулятордук соккулуу шуруповерт, брашсыз мотор.',
    description:
      'DeWalt DCD796 — брашсыз (brushless) мотор менен жабдылган күчтүү аккумулятордук шуруповерт. Эки жылдамдыгы жана LED жарыгы бар. Профессионалдар үчүн идеалдуу тандоо.',
    specs: [
      { label: 'Чыңалуу', value: '18 В' },
      { label: 'Айлануу моменти', value: '70 Нм' },
      { label: 'Мотор', value: 'Brushless' },
      { label: 'Салмагы', value: '1.6 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p4',
    slug: 'makita-df333d-drel',
    name: 'Makita DF333D Аккумулятордук дрель',
    brand: 'makita',
    category: 'dreldar',
    price: 9800,
    image: '/images/product-drill.png',
    gallery: makeGallery('/images/product-drill.png'),
    rating: 4.7,
    reviewsCount: 141,
    stock: 33,
    sku: 'MKT-DF333D',
    badges: ['new'],
    shortDescription: '12В компакттуу дрель-шуруповерт, күнүмдүк иштер үчүн.',
    description:
      'Makita DF333D — компакттуу жана жеңил дрель-шуруповерт. Үй жана майда оңдоо иштери үчүн эң ыңгайлуу вариант.',
    specs: [
      { label: 'Чыңалуу', value: '12 В' },
      { label: 'Айлануу моменти', value: '30 Нм' },
      { label: 'Патрон', value: '10 мм' },
      { label: 'Салмагы', value: '1.1 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p5',
    slug: 'bosch-gws-750-bolgarka',
    name: 'Bosch GWS 750 Болгарка',
    brand: 'bosch',
    category: 'bolgarkalar',
    price: 6900,
    oldPrice: 8400,
    image: '/images/product-grinder.png',
    gallery: makeGallery('/images/product-grinder.png'),
    rating: 4.8,
    reviewsCount: 188,
    stock: 45,
    sku: 'BSH-GWS750',
    badges: ['sale', 'popular'],
    shortDescription: '750 Вт, 125 мм диск, туруктуу бурчтук ажылоочу машина.',
    description:
      'Bosch GWS 750 — металл жана таш кесүү, тазалоо иштери үчүн туруктуу болгарка. Кайра иштетүүдөн коргоо жана ыңгайлуу кармагычы бар.',
    specs: [
      { label: 'Кубаттуулук', value: '750 Вт' },
      { label: 'Диск диаметри', value: '125 мм' },
      { label: 'Айлануу', value: '11000 айл/мүн' },
      { label: 'Салмагы', value: '1.8 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p6',
    slug: 'milwaukee-m18-bolgarka',
    name: 'Milwaukee M18 FUEL Болгарка',
    brand: 'milwaukee',
    category: 'bolgarkalar',
    price: 24700,
    image: '/images/product-grinder.png',
    gallery: makeGallery('/images/product-grinder.png'),
    rating: 4.9,
    reviewsCount: 97,
    stock: 6,
    sku: 'MLW-M18FUEL',
    badges: ['new', 'featured'],
    shortDescription: '18В аккумулятордук FUEL болгарка, симсиз эркиндик.',
    description:
      'Milwaukee M18 FUEL — POWERSTATE брашсыз мотор менен профессионалдык аккумулятордук болгарка. Симге көз каранды эмес күчтүү иш.',
    specs: [
      { label: 'Чыңалуу', value: '18 В' },
      { label: 'Диск диаметри', value: '125 мм' },
      { label: 'Мотор', value: 'POWERSTATE Brushless' },
      { label: 'Салмагы', value: '2.4 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p7',
    slug: 'total-tp152001-generator',
    name: 'Total TP152001 Генератор 2кВт',
    brand: 'total',
    category: 'generatorlor',
    price: 32900,
    oldPrice: 38000,
    image: '/images/product-generator.png',
    gallery: makeGallery('/images/product-generator.png'),
    rating: 4.6,
    reviewsCount: 64,
    stock: 9,
    sku: 'TTL-TP152001',
    badges: ['sale'],
    shortDescription: 'Бензиндик генератор 2.0 кВт, үй жана объект үчүн.',
    description:
      'Total TP152001 — үй, дача жана курулуш объектилери үчүн ишенимдүү бензиндик генератор. Электр өчкөндө туруктуу энергия камсыздайт.',
    specs: [
      { label: 'Кубаттуулук', value: '2.0 кВт' },
      { label: 'Отун', value: 'Бензин' },
      { label: 'Бак көлөмү', value: '15 л' },
      { label: 'Салмагы', value: '42 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p8',
    slug: 'ingco-ge30005-generator',
    name: 'INGCO GE30005 Генератор 3кВт',
    brand: 'ingco',
    category: 'generatorlor',
    price: 41500,
    image: '/images/product-generator.png',
    gallery: makeGallery('/images/product-generator.png'),
    rating: 4.5,
    reviewsCount: 38,
    stock: 4,
    sku: 'ING-GE30005',
    badges: ['popular'],
    shortDescription: 'Күчтүү 3.0 кВт бензиндик генератор.',
    description:
      'INGCO GE30005 — жогорку кубаттуулуктагы генератор. Курулуш аянтчалары жана коммерциялык колдонуу үчүн иштелип чыккан.',
    specs: [
      { label: 'Кубаттуулук', value: '3.0 кВт' },
      { label: 'Отун', value: 'Бензин' },
      { label: 'Бак көлөмү', value: '18 л' },
      { label: 'Салмагы', value: '54 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p9',
    slug: 'total-tc1010016-kompressor',
    name: 'Total Компрессор 50л',
    brand: 'total',
    category: 'kompressorlor',
    price: 27400,
    oldPrice: 31000,
    image: '/images/product-compressor.png',
    gallery: makeGallery('/images/product-compressor.png'),
    rating: 4.7,
    reviewsCount: 52,
    stock: 7,
    sku: 'TTL-TC101',
    badges: ['sale', 'popular'],
    shortDescription: '50 литрлик аба компрессору, 2 поршендүү.',
    description:
      'Total аба компрессору — боёо, пневмоинструмент жана шина толтуруу иштери үчүн. Туруктуу металл резервуар жана коргоо системасы менен.',
    specs: [
      { label: 'Бак көлөмү', value: '50 л' },
      { label: 'Кубаттуулук', value: '2.0 л.к.' },
      { label: 'Басым', value: '8 бар' },
      { label: 'Салмагы', value: '38 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p10',
    slug: 'ingco-ing-mma-shiretuu',
    name: 'INGCO MMA-200 Ширетүү инвертору',
    brand: 'ingco',
    category: 'shiretuu-apparattary',
    price: 11200,
    image: '/images/product-welder.png',
    gallery: makeGallery('/images/product-welder.png'),
    rating: 4.6,
    reviewsCount: 118,
    stock: 15,
    sku: 'ING-MMA200',
    badges: ['popular'],
    shortDescription: '200А инвертордук ширетүү аппараты, IGBT технологиясы.',
    description:
      'INGCO MMA-200 — IGBT технологиясындагы жеңил жана күчтүү ширетүү инвертору. Туруктуу дуга жана оңой башкаруу.',
    specs: [
      { label: 'Ток', value: '200 А' },
      { label: 'Технология', value: 'IGBT' },
      { label: 'Электрод', value: '1.6-4.0 мм' },
      { label: 'Салмагы', value: '4.5 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p11',
    slug: 'dewalt-dwe560-araa',
    name: 'DeWalt DWE560 Тегерек араа',
    brand: 'dewalt',
    category: 'araalar',
    price: 16800,
    oldPrice: 19500,
    image: '/images/product-saw.png',
    gallery: makeGallery('/images/product-saw.png'),
    rating: 4.8,
    reviewsCount: 89,
    stock: 11,
    sku: 'DW-DWE560',
    badges: ['sale', 'featured'],
    shortDescription: '1350 Вт тегерек араа, жыгач кесүү үчүн.',
    description:
      'DeWalt DWE560 — жыгач жана панелдерди так кесүү үчүн жеңил тегерек араа. Бурчту жана тереңдикти жөнгө салуу мүмкүнчүлүгү менен.',
    specs: [
      { label: 'Кубаттуулук', value: '1350 Вт' },
      { label: 'Диск', value: '184 мм' },
      { label: 'Кесүү тереңдиги', value: '65 мм' },
      { label: 'Салмагы', value: '3.7 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p12',
    slug: 'stanley-stmt-kol-shaymandar',
    name: 'Stanley 65 предметтүү комплект',
    brand: 'stanley',
    category: 'kol-shaymandary',
    price: 7300,
    oldPrice: 9200,
    image: '/images/product-handtools.png',
    gallery: makeGallery('/images/product-handtools.png'),
    rating: 4.7,
    reviewsCount: 245,
    stock: 60,
    sku: 'STN-STMT65',
    badges: ['sale', 'popular', 'new'],
    shortDescription: '65 предметтүү универсалдуу кол шаймандар комплекти.',
    description:
      'Stanley комплекти — үй жана автосервис үчүн керектүү бардык ачкычтар, башчалар жана отверткалар. Ыңгайлуу пластик кейс менен.',
    specs: [
      { label: 'Предметтер', value: '65 даана' },
      { label: 'Материал', value: 'Хром-ванадий' },
      { label: 'Кейс', value: 'Бар' },
      { label: 'Салмагы', value: '2.9 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p13',
    slug: 'bosch-gll-3-80-lazer',
    name: 'Bosch GLL 3-80 Лазердик деңгээл',
    brand: 'bosch',
    category: 'olchoo-shaymandary',
    price: 34500,
    image: '/images/product-measure.png',
    gallery: makeGallery('/images/product-measure.png'),
    rating: 4.9,
    reviewsCount: 71,
    stock: 5,
    sku: 'BSH-GLL380',
    badges: ['new', 'featured'],
    shortDescription: '360° лазердик деңгээл, 3 тегиздикте.',
    description:
      'Bosch GLL 3-80 — так курулуш иштери үчүн 360 градустук лазердик деңгээл. Дубал жана шыпты бир эле убакта белгилейт.',
    specs: [
      { label: 'Тегиздиктер', value: '3 x 360°' },
      { label: 'Диапазон', value: '30 м' },
      { label: 'Тактык', value: '±0.2 мм/м' },
      { label: 'Салмагы', value: '0.7 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p14',
    slug: 'ingco-kaska-komplekt-koopsuzduk',
    name: 'INGCO Коопсуздук комплекти',
    brand: 'ingco',
    category: 'koopsuzduk',
    price: 2400,
    oldPrice: 3100,
    image: '/images/product-safety.png',
    gallery: makeGallery('/images/product-safety.png'),
    rating: 4.5,
    reviewsCount: 133,
    stock: 120,
    sku: 'ING-SAFE01',
    badges: ['sale'],
    shortDescription: 'Каска, көз айнек жана мээлей — коопсуздук топтому.',
    description:
      'INGCO коопсуздук комплекти — курулуш аянтчасында иштөө үчүн негизги коргоочу каражаттар. Сапаттуу материалдардан жасалган.',
    specs: [
      { label: 'Курамы', value: 'Каска, айнек, мээлей' },
      { label: 'Стандарт', value: 'CE' },
      { label: 'Өлчөм', value: 'Универсалдуу' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p15',
    slug: 'makita-bl1850-batareya',
    name: 'Makita BL1850B Батарея 18В 5Ач',
    brand: 'makita',
    category: 'batareyalar',
    price: 8900,
    image: '/images/product-battery.png',
    gallery: makeGallery('/images/product-battery.png'),
    rating: 4.8,
    reviewsCount: 156,
    stock: 40,
    sku: 'MKT-BL1850B',
    badges: ['popular', 'new'],
    shortDescription: '18В 5.0Ач Li-Ion батарея индикатор менен.',
    description:
      'Makita BL1850B — заряд деңгээлин көрсөткөн индикатору бар күчтүү Li-Ion батарея. LXT платформасынын бардык шаймандарына туура келет.',
    specs: [
      { label: 'Чыңалуу', value: '18 В' },
      { label: 'Сыйымдуулугу', value: '5.0 Ач' },
      { label: 'Тип', value: 'Li-Ion' },
      { label: 'Индикатор', value: 'Бар' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p16',
    slug: 'hikoki-dh26pc-perforator',
    name: 'Hikoki DH26PC Перфоратор',
    brand: 'hikoki',
    category: 'perforatorlor',
    price: 17200,
    oldPrice: 20100,
    image: '/images/product-rotary-hammer.png',
    gallery: makeGallery('/images/product-rotary-hammer.png'),
    rating: 4.7,
    reviewsCount: 58,
    stock: 10,
    sku: 'HKI-DH26PC',
    badges: ['sale'],
    shortDescription: '830 Вт, SDS-Plus күчтүү перфоратор.',
    description:
      'Hikoki DH26PC — жапониялык сапаттагы туруктуу перфоратор. Бетон менен интенсивдүү иштөө үчүн иштелип чыккан.',
    specs: [
      { label: 'Кубаттуулук', value: '830 Вт' },
      { label: 'Соккулуу энергия', value: '2.9 Дж' },
      { label: 'Патрон', value: 'SDS-Plus' },
      { label: 'Салмагы', value: '2.9 кг' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p17',
    slug: 'total-tosli2001-kesuuchu-disk',
    name: 'Total Металл кесүүчү диск (25 даана)',
    brand: 'total',
    category: 'kesuuchu-shaymandar',
    price: 1200,
    image: '/images/product-grinder.png',
    gallery: makeGallery('/images/product-grinder.png'),
    rating: 4.6,
    reviewsCount: 210,
    stock: 300,
    sku: 'TTL-DISK25',
    badges: ['popular'],
    shortDescription: '125 мм металл кесүүчү дисктер, 25 даана топтом.',
    description:
      'Total кесүүчү дисктер — металлды тез жана таза кесүү үчүн. Экономикалык 25 даана топтом.',
    specs: [
      { label: 'Диаметри', value: '125 мм' },
      { label: 'Калыңдыгы', value: '1.2 мм' },
      { label: 'Саны', value: '25 даана' },
      { label: 'Материал', value: 'Металл' },
      ...baseSpecs,
    ],
  },
  {
    id: 'p18',
    slug: 'milwaukee-m18-shuruovert',
    name: 'Milwaukee M18 FUEL Шуруповерт',
    brand: 'milwaukee',
    category: 'dreldar',
    price: 27900,
    image: '/images/product-drill.png',
    gallery: makeGallery('/images/product-drill.png'),
    rating: 5.0,
    reviewsCount: 84,
    stock: 6,
    sku: 'MLW-M18DRV',
    badges: ['new', 'featured', 'popular'],
    shortDescription: '18В FUEL шуруповерт, 135 Нм момент.',
    description:
      'Milwaukee M18 FUEL шуруповерт — эң жогорку класстагы аккумулятордук инструмент. Күчтүү момент жана узак иштөө убактысы.',
    specs: [
      { label: 'Чыңалуу', value: '18 В' },
      { label: 'Айлануу моменти', value: '135 Нм' },
      { label: 'Мотор', value: 'POWERSTATE' },
      { label: 'Салмагы', value: '1.9 кг' },
      ...baseSpecs,
    ],
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Азамат Токтосунов',
    city: 'Бишкек',
    rating: 5,
    date: '2026-06-14',
    text: 'Тапшырыкты эртеси эле жеткиришти. Bosch перфоратору түп нускасы, кепилдик талону менен. Абдан ыраазымын!',
  },
  {
    id: 'r2',
    name: 'Гүлнара Асанова',
    city: 'Ош',
    rating: 5,
    date: '2026-05-30',
    text: 'Баасы башка дүкөндөргө караганда арзаныраак. Консультант бардык суроолорго жооп берди. Сунуштайм.',
  },
  {
    id: 'r3',
    name: 'Марат Жээнбеков',
    city: 'Бишкек',
    rating: 4,
    date: '2026-05-18',
    text: 'Сапаттуу инструменттер. Онлайн төлөм ыңгайлуу иштейт. Жеткирүү бир аз кечиктирилди, бирок баары жайында.',
  },
  {
    id: 'r4',
    name: 'Нурлан Кадыров',
    city: 'Каракол',
    rating: 5,
    date: '2026-04-27',
    text: 'Курулуш бригадасы үчүн көп инструмент алдык. Дүң баада жакшы арзандатуу беришти. Рахмат ELTOY STROY!',
  },
  {
    id: 'r5',
    name: 'Айгуль Сатыбалдиева',
    city: 'Жалал-Абад',
    rating: 5,
    date: '2026-04-10',
    text: 'WhatsApp аркылуу заказ кылдым, абдан тез жана ыңгайлуу. Товар сүрөттөгүдөй эле.',
  },
  {
    id: 'r6',
    name: 'Эрлан Мамытов',
    city: 'Бишкек',
    rating: 5,
    date: '2026-03-22',
    text: 'Makita батареяны издеп жүрсөм, ушул жерден таптым. Түп нуска, кепилдик менен. Ишеничтүү дүкөн.',
  },
]

export const news: NewsItem[] = [
  {
    id: 'n1',
    slug: 'jany-milwaukee-seriyasy',
    title: 'Жаңы Milwaukee M18 FUEL сериясы келди',
    excerpt:
      'Эң күчтүү аккумулятордук инструменттер эми ELTOY STROY складында. Профессионалдар үчүн жаңы мүмкүнчүлүктөр.',
    date: '2026-06-20',
    category: 'Жаңылык',
    image: '/images/product-grinder.png',
    content:
      'Milwaukee M18 FUEL сериясынын жаңы модельдери ELTOY STROY дүкөнүнө келип түштү. POWERSTATE брашсыз моторлор жана REDLITHIUM батареялары менен жабдылган бул инструменттер эң оор жүктөмдөрдө да туруктуу иштейт. Бардык моделдерге 3 жылдык расмий кепилдик берилет.',
  },
  {
    id: 'n2',
    slug: 'jazgy-arzandatuu',
    title: 'Жазгы чоң арзандатуу — 30% чейин',
    excerpt:
      'Перфораторлор, дрелдер жана болгаркаларга сезондук арзандатуу. Убакыт чектелген!',
    date: '2026-06-05',
    category: 'Акция',
    image: '/images/product-rotary-hammer.png',
    content:
      'Жаз мезгилине карата ELTOY STROY электроинструменттердин кеңири тизмесине 30%га чейин арзандатуу жарыялайт. Акция складдагы товарлар түгөнгөнчө уланат. Онлайн буйрутма бергенде кошумча жеткирүү бонусу.',
  },
  {
    id: 'n3',
    slug: 'osh-filial-achyldy',
    title: 'Ошто жаңы филиал ачылды',
    excerpt:
      'Эми түштүк региондун кардарлары үчүн да толук ассортимент жана тез жеткирүү жеткиликтүү.',
    date: '2026-05-15',
    category: 'Компания',
    image: '/images/workshop.png',
    content:
      'ELTOY STROY Ош шаарында жаңы заманбап дүкөн-складын ачты. Түштүк региондун бардык кардарлары эми инструменттерди жеринен көрүп, тез алып кетүү мүмкүнчүлүгүнө ээ. Филиалдын дареги жана иштөө убактысы байланыш бөлүмүндө.',
  },
  {
    id: 'n4',
    slug: 'kesuuchu-dsk-kenjeytuu',
    title: 'Расходниктердин ассортименти кеңейди',
    excerpt:
      'Кесүүчү дисктер, бургулар жана насадкалар эми дагы көбүрөөк — дүң баада.',
    date: '2026-04-28',
    category: 'Жаңылык',
    image: '/images/product-battery.png',
    content:
      'Биз расходник материалдардын — кесүүчү дисктердин, бургулардын жана насадкалардын — ассортиментин кыйла кеңейттик. Курулуш компаниялары үчүн атайын дүң баалар жана жеткирүү шарттары иштелип чыкты.',
  },
]

export const advantages = [
  {
    icon: 'BadgeCheck',
    title: '100% түп нуска',
    text: 'Бардык товарлар расмий дистрибьютордон, кепилдик талону менен.',
  },
  {
    icon: 'Truck',
    title: 'Тез жеткирүү',
    text: 'Бишкек боюнча 24 сааттын ичинде, регионго 1-3 күндө.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Расмий кепилдик',
    text: 'Ар бир инструментке 24 айга чейин расмий кепилдик.',
  },
  {
    icon: 'CreditCard',
    title: 'Ыңгайлуу төлөм',
    text: 'Банк картасы, накталай жана бөлүп төлөө мүмкүнчүлүгү.',
  },
  {
    icon: 'Headphones',
    title: 'Эксперт консультация',
    text: 'Тажрыйбалуу адистер туура тандоо жасоого жардам берет.',
  },
  {
    icon: 'RotateCcw',
    title: 'Оңой кайтаруу',
    text: '14 күндүн ичинде товарды кайтаруу же алмаштыруу.',
  },
]

export const stats = [
  { value: '15+', label: 'жылдык тажрыйба' },
  { value: '12 000+', label: 'товар ассортименти' },
  { value: '50 000+', label: 'ыраазы кардар' },
  { value: '8', label: 'дүйнөлүк бренд' },
]

export const faqs = [
  {
    q: 'Товарлар түп нускабы?',
    a: 'Ооба, ELTOY STROY бардык товарларды расмий дистрибьюторлордон гана алат. Ар бир инструментке кепилдик талону берилет.',
  },
  {
    q: 'Жеткирүү канча убакытта болот?',
    a: 'Бишкек шаары боюнча буйрутма 24 сааттын ичинде жеткирилет. Региондорго жеткирүү 1-3 жумуш күнүн алат.',
  },
  {
    q: 'Онлайн төлөө коопсузбу?',
    a: 'Ооба, төлөмдөр коргоолуу банктык шлюз аркылуу иштелет. Сиздин карта маалыматтарыңыз толук корголот.',
  },
  {
    q: 'Товарды кайтарса болобу?',
    a: '14 күндүн ичинде колдонулбаган товарды кайтарууга же алмаштырууга болот. Товардын кутучасы жана чеги сакталышы керек.',
  },
  {
    q: 'Дүң баада алса болобу?',
    a: 'Ооба, курулуш компаниялары жана бригадалар үчүн атайын дүң баалар бар. Байланыш бөлүмү аркылуу кайрылыңыз.',
  },
  {
    q: 'Кепилдик кызматы кандай иштейт?',
    a: 'Кепилдик мезгилинде бузулган товар акысыз оңдолот же алмаштырылат. Кепилдик талону жана сатып алуу чегин сактаңыз.',
  },
]

// Жардамчы функциялар
export function formatSom(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' сом'
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}

export function getBrandName(slug: string): string {
  return brands.find((b) => b.slug === slug)?.name ?? slug
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug)
}

export function getProductsByBrand(slug: string): Product[] {
  return products.filter((p) => p.brand === slug)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export function discountPercent(product: Product): number | null {
  if (!product.oldPrice) return null
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
}
