import { Category } from '../types';

export const categoriesData: Category[] = [
  {
    id: '1',
    name: 'سيارات',
    slug: 'cars',
    description: 'سيارات مستعملة وجديدة للبيع',
    icon: '🚗',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop',
    listingsCount: 1250,
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '11',
        name: 'تويوتا',
        slug: 'toyota',
        description: 'سيارات تويوتا مستعملة',
        categoryId: '1',
        listingsCount: 320,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '12',
        name: 'هونداي',
        slug: 'hyundai',
        description: 'سيارات هونداي مستعملة',
        categoryId: '1',
        listingsCount: 285,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '13',
        name: 'نيسان',
        slug: 'nissan',
        description: 'سيارات نيسان مستعملة',
        categoryId: '1',
        listingsCount: 195,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '14',
        name: 'هوندا',
        slug: 'honda',
        description: 'سيارات هوندا مستعملة',
        categoryId: '1',
        listingsCount: 165,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '15',
        name: 'فورد',
        slug: 'ford',
        description: 'سيارات فورد مستعملة',
        categoryId: '1',
        listingsCount: 125,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '16',
        name: 'شيفروليه',
        slug: 'chevrolet',
        description: 'سيارات شيفروليه مستعملة',
        categoryId: '1',
        listingsCount: 160,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'جوالات',
    slug: 'phones',
    description: 'أجهزة الجوال والتابلت المستعملة',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    listingsCount: 890,
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '21',
        name: 'آيفون',
        slug: 'iphone',
        description: 'أجهزة آيفون مستعملة',
        categoryId: '2',
        listingsCount: 420,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '22',
        name: 'سامسونج',
        slug: 'samsung',
        description: 'أجهزة سامسونج مستعملة',
        categoryId: '2',
        listingsCount: 285,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '23',
        name: 'هواوي',
        slug: 'huawei',
        description: 'أجهزة هواوي مستعملة',
        categoryId: '2',
        listingsCount: 95,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '24',
        name: 'شاومي',
        slug: 'xiaomi',
        description: 'أجهزة شاومي مستعملة',
        categoryId: '2',
        listingsCount: 90,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'عقارات',
    slug: 'real-estate',
    description: 'عقارات للبيع والإيجار',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    listingsCount: 650,
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '31',
        name: 'شقق للإيجار',
        slug: 'apartments-rent',
        description: 'شقق سكنية للإيجار',
        categoryId: '3',
        listingsCount: 285,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '32',
        name: 'شقق للبيع',
        slug: 'apartments-sale',
        description: 'شقق سكنية للبيع',
        categoryId: '3',
        listingsCount: 190,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '33',
        name: 'فلل للبيع',
        slug: 'villas-sale',
        description: 'فلل سكنية للبيع',
        categoryId: '3',
        listingsCount: 95,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '34',
        name: 'أراضي للبيع',
        slug: 'land-sale',
        description: 'أراضي سكنية وتجارية للبيع',
        categoryId: '3',
        listingsCount: 80,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '4',
    name: 'إلكترونيات',
    slug: 'electronics',
    description: 'أجهزة إلكترونية وكمبيوتر',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    listingsCount: 720,
    isActive: true,
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '41',
        name: 'أجهزة كمبيوتر',
        slug: 'computers',
        description: 'أجهزة كمبيوتر مكتبي ومحمول',
        categoryId: '4',
        listingsCount: 320,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '42',
        name: 'كاميرات',
        slug: 'cameras',
        description: 'كاميرات تصوير احترافية',
        categoryId: '4',
        listingsCount: 185,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '43',
        name: 'ألعاب فيديو',
        slug: 'gaming',
        description: 'أجهزة ألعاب وإكسسوارات',
        categoryId: '4',
        listingsCount: 215,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '5',
    name: 'أثاث',
    slug: 'furniture',
    description: 'أثاث منزلي ومكتبي',
    icon: '🪑',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    listingsCount: 450,
    isActive: true,
    sortOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '51',
        name: 'غرف نوم',
        slug: 'bedrooms',
        description: 'أثاث غرف النوم',
        categoryId: '5',
        listingsCount: 160,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '52',
        name: 'غرف جلوس',
        slug: 'living-room',
        description: 'أثاث غرف الجلوس',
        categoryId: '5',
        listingsCount: 145,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '53',
        name: 'أثاث مكتبي',
        slug: 'office-furniture',
        description: 'أثاث مكاتب وشركات',
        categoryId: '5',
        listingsCount: 85,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '54',
        name: 'أثاث مطبخ',
        slug: 'kitchen-furniture',
        description: 'أثاث وخزائن مطبخ',
        categoryId: '5',
        listingsCount: 60,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '6',
    name: 'أجهزة منزلية',
    slug: 'home-appliances',
    description: 'أجهزة منزلية وكهربائية',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    listingsCount: 380,
    isActive: true,
    sortOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '61',
        name: 'ثلاجات',
        slug: 'refrigerators',
        description: 'ثلاجات منزلية',
        categoryId: '6',
        listingsCount: 95,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '62',
        name: 'غسالات',
        slug: 'washing-machines',
        description: 'غسالات ملابس',
        categoryId: '6',
        listingsCount: 85,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '63',
        name: 'مكيفات',
        slug: 'air-conditioners',
        description: 'أجهزة تكييف',
        categoryId: '6',
        listingsCount: 120,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '64',
        name: 'أجهزة صغيرة',
        slug: 'small-appliances',
        description: 'أجهزة منزلية صغيرة',
        categoryId: '6',
        listingsCount: 80,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '7',
    name: 'ملابس',
    slug: 'clothing',
    description: 'ملابس رجالية ونسائية',
    icon: '👕',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    listingsCount: 320,
    isActive: true,
    sortOrder: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '71',
        name: 'ملابس رجالية',
        slug: 'mens-clothing',
        description: 'ملابس رجالية مستعملة',
        categoryId: '7',
        listingsCount: 150,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '72',
        name: 'ملابس نسائية',
        slug: 'womens-clothing',
        description: 'ملابس نسائية مستعملة',
        categoryId: '7',
        listingsCount: 170,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '8',
    name: 'ساعات وإكسسوارات',
    slug: 'watches-accessories',
    description: 'ساعات ومجوهرات وإكسسوارات',
    icon: '⌚',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
    listingsCount: 280,
    isActive: true,
    sortOrder: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '81',
        name: 'ساعات رجالية',
        slug: 'mens-watches',
        description: 'ساعات رجالية فاخرة',
        categoryId: '8',
        listingsCount: 125,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '82',
        name: 'ساعات نسائية',
        slug: 'womens-watches',
        description: 'ساعات نسائية فاخرة',
        categoryId: '8',
        listingsCount: 95,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '83',
        name: 'مجوهرات',
        slug: 'jewelry',
        description: 'مجوهرات وذهب',
        categoryId: '8',
        listingsCount: 60,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '9',
    name: 'معدات وأدوات',
    slug: 'tools-equipment',
    description: 'معدات وأدوات عمل',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    listingsCount: 190,
    isActive: true,
    sortOrder: 9,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '91',
        name: 'أدوات يدوية',
        slug: 'hand-tools',
        description: 'أدوات يدوية للعمل',
        categoryId: '9',
        listingsCount: 85,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '92',
        name: 'أدوات كهربائية',
        slug: 'power-tools',
        description: 'أدوات كهربائية للعمل',
        categoryId: '9',
        listingsCount: 105,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '10',
    name: 'مستلزمات أطفال',
    slug: 'baby-kids',
    description: 'مستلزمات وألعاب الأطفال',
    icon: '🍼',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    listingsCount: 240,
    isActive: true,
    sortOrder: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '101',
        name: 'ألعاب أطفال',
        slug: 'toys',
        description: 'ألعاب تعليمية وترفيهية',
        categoryId: '10',
        listingsCount: 125,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '102',
        name: 'ملابس أطفال',
        slug: 'kids-clothing',
        description: 'ملابس الأطفال',
        categoryId: '10',
        listingsCount: 85,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '103',
        name: 'عربات أطفال',
        slug: 'strollers',
        description: 'عربات وكراسي أطفال',
        categoryId: '10',
        listingsCount: 30,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '11',
    name: 'رياضة',
    slug: 'sports',
    description: 'معدات وأدوات رياضية',
    icon: '⚽',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    listingsCount: 165,
    isActive: true,
    sortOrder: 11,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '111',
        name: 'معدات رياضية',
        slug: 'sports-equipment',
        description: 'معدات وأدوات رياضية',
        categoryId: '11',
        listingsCount: 95,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '112',
        name: 'ملابس رياضية',
        slug: 'sportswear',
        description: 'ملابس وأحذية رياضية',
        categoryId: '11',
        listingsCount: 70,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '12',
    name: 'أخرى',
    slug: 'other',
    description: 'أصناف متنوعة أخرى',
    icon: '📦',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    listingsCount: 95,
    isActive: true,
    sortOrder: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    subcategories: [
      {
        id: '121',
        name: 'كتب',
        slug: 'books',
        description: 'كتب ومجلات',
        categoryId: '12',
        listingsCount: 45,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '122',
        name: 'تحف وهدايا',
        slug: 'collectibles',
        description: 'تحف وأشياء نادرة',
        categoryId: '12',
        listingsCount: 25,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '123',
        name: 'مواد خام',
        slug: 'raw-materials',
        description: 'مواد خام ومستلزمات',
        categoryId: '12',
        listingsCount: 25,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ]
  }
];