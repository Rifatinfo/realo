export interface MenuSection {
  title: string
  items?: string[]
}

export interface MenuCategory {
  name: string
  columns: MenuSection[][]
  image?: string
}

export const menuData: MenuCategory[] = [
  {
    name: 'WOMEN',
    image:
      'https://cdn.magicpatterns.com/uploads/9RvnVNSv4UbLr2gEmpVy8P/mega_menu_.png',
    columns: [
      [{ title: 'VIEW ALL CATEGORIES' }, { title: 'NEW ARRIVALS' }],
      [
        {
          title: 'SAREE',
          items: [
            'Cotton',
            'Muslin',
            'Silk',
            'Katan',
            'Nakshi Kantha',
            'Jamdani',
            'Brac Silk',
          ],
        },
      ],
      [
        {
          title: 'SHALWAR KAMEEZ',
          items: ['Printed', 'Embroidered', 'Silk', 'Cotton'],
        },
        {
          title: 'KURTA',
          items: ['Long Kurta', 'Short Kurta', 'Printed'],
        },
      ],
      [
        {
          title: 'PANJABI',
          items: ['Fitted', 'Regular'],
        },
        {
          title: 'TOPS',
          items: ['Casual', 'Formal', 'Party Wear'],
        },
      ],
    ],
  },
  {
    name: 'KIDS',
    columns: [[{ title: 'NEWBORN' }, { title: 'BOYS' }, { title: 'GIRLS' }]],
  },
  {
    name: 'HOME DÉCOR',
    columns: [
      [
        {
          title: 'BED & BATH',
          items: ['Bed Covers', 'Cushion Covers', 'Towels'],
        },
      ],
      [
        {
          title: 'DINING',
          items: ['Table Cloths', 'Runners', 'Napkins', 'Placemats'],
        },
      ],
      [
        {
          title: 'HOME ACCENTS',
          items: ['Candles', 'Vases', 'Wall Art', 'Rugs'],
        },
      ],
    ],
  },
  {
    name: 'JEWELLERY',
    image:
      'https://cdn.magicpatterns.com/uploads/9RvnVNSv4UbLr2gEmpVy8P/mega_menu_.png',
    columns: [
      [
        {
          title: 'EARRINGS',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion', 'Gold-plated'],
        },
        {
          title: 'NECKLACES',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion'],
        },
      ],
      [
        {
          title: 'NECKLACE SETS',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion'],
        },
        {
          title: 'BRACELETS & BANGLES',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion'],
        },
      ],
      [
        {
          title: 'RINGS',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion'],
        },
        {
          title: 'NOSE PINS',
          items: ['Silver', 'Gold'],
        },
        {
          title: 'TOE RINGS',
        },
      ],
      [
        {
          title: 'ANKLETS',
          items: ['Silver', 'Fashion', 'Pearl'],
        },
        {
          title: 'LOCKETS & PENDANTS',
          items: ['Silver', 'Gold', 'Pearl', 'Fashion'],
        },
        { title: 'HAIR ACCESSORIES' },
        { title: 'JEWELLERY BOX' },
      ],
    ],
  },
  {
    name: 'WEDDING',
    columns: [[{ title: 'BRIDE' }, { title: 'GROOM' }, { title: 'GUESTS' }]],
  },
  {
    name: 'EID 26',
    columns: [
      [
        { title: "WOMEN'S COLLECTION" },
        { title: "MEN'S COLLECTION" },
        { title: "KIDS' COLLECTION" },
      ],
    ],
  },
]