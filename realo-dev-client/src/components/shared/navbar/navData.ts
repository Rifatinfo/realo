import type { MenuItem } from "./Navbar";

export const categories: MenuItem[] = [
  {
    label: "Fashions",
    children: [
      {
        label: "Men",
        children: [
          {
            label: "Panjabi",
            href: "/fashions/men-panjabi",
          },
          {
            label: "Pajama",
            href: "/fashions/men-pajama",
          },
          {
            label: "Panjabi & Pajama Set",
            href: "/fashions/men-panjabi-pajama",
          },
          {
            label: "Shirt",
            href: "/fashions/men-shirt",
          },
          {
            label: "T-Shirt",
            href: "/fashions/men-t-shirt",
          },
          {
            label: "Polo Shirt",
            href: "/fashions/men-polo",
          },
          {
            label: "Jeans",
            href: "/fashions/men-jeans",
          },
          {
            label: "Pants & Trousers",
            href: "/fashions/men-pants-trousers",
          },
          {
            label: "Formal Wear",
            href: "/fashions/men-formal-wear",
          },
          {
            label: "Blazer & Suit",
            href: "/fashions/men-blazer-suit",
          },
          {
            label: "Jackets",
            href: "/fashions/men-jackets",
          },
          {
            label: "Lungi",
            href: "/fashions/men-lungi",
          },
        ],
      },
      {
        label: "Women",
        children: [
          {
            label: "Sari",
            href: "/women/sari",
          },
          {
            label: "Salwar Kameez",
            href: "/women/salwar-kameez",
          },
          {
            label: "Kurti",
            href: "/women/kurti",
          },
          {
            label: "Three Piece",
            href: "/women/three-piece",
          },
          {
            label: "Lehenga",
            href: "/women/lehenga",
          },
          {
            label: "Western",
            href: "/women/western",
          },
          {
            label: "Tops",
            href: "/women/tops",
          },
          {
            label: "Tunic",
            href: "/women/tunic",
          },
          {
            label: "Pants & Trousers",
            href: "/women/pants-trousers",
          },
          {
            label: "Skirts",
            href: "/women/skirts",
          },
          {
            label: "Hijab & Scarf",
            href: "/women/hijab-scarf",
          },
          {
            label: "Dupatta",
            href: "/women/dupatta",
          },
        ],
      },
      {
        label: "Kids & Baby",
        children: [
          {
            label: "Trending Now",
            href: "/fashions/kids-baby-trending-now",
          },
          {
            label: "Offer Now",
            href: "/fashions/kids-baby-offer-now",
          },
          {
            label: "Popular/Hit collection",
            href: "/fashions/kids-baby-hit-collection",
          },
        ],
      },
      {
        label: "Traditional Wear",
        href: "/fashions/traditional-wear",
      },

      {
        label: "Muslim Wear",
        href: "/fashions/muslim-wear",
      },
      {
        label: "Western Wear",
        href: "/fashions/western-wear",
      },
      {
        label: "Innerwear",
        href: "/fashions/innerwear",
      },
      {
        label: "Maternal Wear",
        href: "/fashions/maternal-wear",
      },
    ],
  },
  {
    label: "Shoes",
    children: [
      {
        label: "Men",
        children: [
          {
            label: "Boys",
            href: "/shoes/men-boys",
          },
          {
            label: "Adult",
            href: "/shoes/men-adult",
          },
          {
            label: "Senior",
            href: "/shoes/men-senior",
          },
        ],
      },
      {
        label: "Women",
        children: [
          {
            label: "Girls",
            href: "/shoes/women-girls",
          },
          {
            label: "Adult",
            href: "/shoes/women-adult",
          },
          {
            label: "Senior",
            href: "/shoes/women-senior",
          },
        ],
      },
      {
        label: "Kids & Baby",
        href: "/shoes/kids-baby",
      },
    ],
  },

  {
    label: "Bags & Baggage",
    children: [
      {
        label: "School",
        href: "/bags-baggage/school",
      },
      {
        label: "Kidz",
        href: "/bags-baggage/kidz",
      },
      {
        label: "Office",
        href: "/bags-baggage/office",
      },
      {
        label: "Ladies Bag",
        href: "/bags-baggage/ladies-bag",
      },
      {
        label: "Travel",
        href: "/bags-baggage/travel",
      },
    ],
  },

  {
    label: "Jewelry & Accessories",
    children: [
      {
        label: "Watches",
        href: "/jewelry-accessories/watches",
      },
      {
        label: "Sunglass",
        href: "/jewelry-accessories/sunglass",
      },
      {
        label: "Maternal Accessories",
        href: "/jewelry-accessories/maternal-accessories",
      },
      {
        label: "Wallet",
        href: "/jewelry-accessories/wallet",
      },
    ],
  },

  {
    label: "Health & Beauty",
    children: [
      {
        label: "Eyewear",
        href: "/health-beauty/eyewear",
      },
    ],
  },

  {
    label: "Home decor",
    children: [
      {
        label: "Kitchen",
        href: "/living-style/kitchen",
      },
      {
        label: "Comforter",
        href: "/living-style/comforter",
      },
      {
        label: "Bed Sheet",
        href: "/living-style/bed-sheet",
      },
      {
        label: "Pillow",
        href: "/living-style/pillow",
      },
      {
        label: "Curtain",
        href: "/living-style/curtain",
      },
      {
        label: "Wallmate",
        href: "/living-style/wallmate",
      },
      {
        label: "Gift & Accessories",
        href: "/living-style/gift-accessories",
      },
    ],
  },

  {
    label: "Furniture",
    children: [
      {
        label: "Reading",
        href: "/furniture/reading",
      },
      {
        label: "Drawing",
        href: "/furniture/drawing",
      },
      {
        label: "Living",
        href: "/furniture/living",
      },
      {
        label: "Office",
        href: "/furniture/office",
      },
    ],
  },

  {
    label: "Gadget",
    href: "/gadget",
  },

  {
    label: "Hobby",
    children: [
      {
        label: "Gardening",
        href: "/hobby/gardening",
      },
      {
        label: "Fishing",
        href: "/hobby/fishing",
      },
      {
        label: "Travel",
        href: "/hobby/travel",
      },
      {
        label: "Pet",
        href: "/hobby/pet",
      },
      {
        label: "Aquarium",
        href: "/hobby/aquarium",
      },
      {
        label: "Swimming",
        href: "/hobby/swimming",
      },
    ],
  },

  {
    label: "Sports & Fitness",
    children: [
      {
        label: "Baby Toys",
        href: "/sports-fitness/baby-toys",
      },
      {
        label: "Gym Accessories",
        href: "/sports-fitness/gym-accessories",
      },
      {
        label: "Swimming",
        href: "/sports-fitness/swimming",
      },
    ],
  },

  {
    label: "Books & Stationery",
    href: "/books-stationery",
  },

  {
    label: "Electrical & Electronics",
    href: "/electrical-electronics",
  },

  {
    label: "Food & Groceries",
    href: "/food-groceries",
  },
];
export const navItems: MenuItem[] = [
  {
    label: "CATEGORIES",
    children: categories,
  },
  {
    label: "OUR BRAND",
    children: [
      {
        label: "Our Brand",
        children: [
          
          {
            label: "Windrise",
            href: "/windrise",
          },
        ],
      },
      {
        label: "Primer Brand",
        children: [
           {
            label: "Colourrose",
            href: "/colourrose",
          },
          {
            label: "Stylo",
            href: "/stylo",
          },
        ],
      },
    ],
  },
  {
    label: "BLOG",
    children: [
      {
        label: "Life Style",
        href: "/blog",
      },
      {
        label: "Latest Posts",
        href: "/blog",
      },
      {
        label: "Style Guide",
        href: "#",
      },
      {
        label: "Lookbook",
        href: "#",
      },
    ],
  },
  {
    label: "HELP AND SUPPORT",
    children: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        label: "Refund & Returns Policy",
        href: "/refund-returns",
      },
      {
        label: "Shipping & Delivery",
        href: "/shipping-delivery",
      },
      {
        label: "Terms & Conditions",
        href: "/terms-conditions",
      },
      {
        label: "Shipping & Exchange",
        href: "/shipping-exchange",
      },
    ],
  },
  {
    label: "WORK WITH US",
    children: [
      {
        label: "Become a Investor",
        href: "/become-investor",
      },
      {
        label: "Become a Merchant",
        href: "/become-a-merchant",
      },
      {
        label: "Become an Affiliate Marketer",
        href: "/become-an-affiliate-marketer",
      },
      {
        label: "Career",
        href: "/work-with-us/career",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ],
  },
];
