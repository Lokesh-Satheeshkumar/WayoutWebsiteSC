export const featuredBanners = [
  {
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    title: 'Scenic escapes',
    subtitle: 'Curated weekend getaways',
  },
  {
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    title: 'Blue coastlines',
    subtitle: 'Sea breeze and sunset views',
  },
  {
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    title: 'Mountain retreats',
    subtitle: 'Cool air and pine forests',
  },
]

export const travelVibes = [
  {
    vibe_id: 2000,
    title: 'Adventure',
    subtitle: '12 Destinations',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  },
  {
    vibe_id: 2001,
    title: 'Relaxation',
    subtitle: '8 Destinations',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
  },
  {
    vibe_id: 2002,
    title: 'Culture',
    subtitle: '10 Destinations',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80',
  },
]

export const states = [
  {
    state_id: 1,
    name: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    description: 'A beautiful blend of hill stations, heritage towns, and coastal escapes.',
    cities: [
      {
        city_id: 100,
        state_id: 1,
        name: 'Ooty',
        description: 'Cool weather, tea plantations, and misty viewpoints.',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1000, name: 'Tea Factory & Museum', day: '1', time: '09:00 AM', place_img: 'https://images.unsplash.com/photo-1515446134809-993c501ca304?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1001, name: 'Doddabetta Peak', day: '1', time: '10:15 AM', place_img: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1002, name: 'Pykara Waterfalls', day: '1', time: '03:00 PM', place_img: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=700&q=80' },
        ],
      },
      {
        city_id: 101,
        state_id: 1,
        name: 'Kodaikanal',
        description: 'A romantic hill town wrapped in pine forests and lakes.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1010, name: 'Pillar Rocks', day: '1', time: '11:00 AM', place_img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1011, name: 'Coaker’s Walk', day: '1', time: '04:00 PM', place_img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80' },
        ],
      },
    ],
  },
  {
    state_id: 2,
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
    description: 'Lush backwaters, beaches, tea hills, and fragrant spice gardens.',
    cities: [
      {
        city_id: 102,
        state_id: 2,
        name: 'Wayanad',
        description: 'Waterfalls, caves, and dense forests make this valley unforgettable.',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1020, name: 'Banasura Sagar Dam', day: '1', time: '10:00 AM', place_img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1021, name: 'Edakkal Caves', day: '1', time: '12:30 PM', place_img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
        ],
      },
      {
        city_id: 103,
        state_id: 2,
        name: 'Kochi',
        description: 'A vibrant port city with heritage streets and waterfront charm.',
        image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1030, name: 'Fort Kochi', day: '1', time: '03:00 PM', place_img: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1031, name: 'Mattancherry Palace', day: '1', time: '05:00 PM', place_img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80' },
        ],
      },
    ],
  },
  {
    state_id: 3,
    name: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    description: 'Highlands, heritage sites, beaches, and modern city escapes.',
    cities: [
      {
        city_id: 104,
        state_id: 3,
        name: 'Coorg',
        description: 'Coffee plantations and misty hills with incredible panoramas.',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1040, name: 'Abbey Falls', day: '1', time: '12:00 PM', place_img: 'https://images.unsplash.com/photo-1505765058191-9b5f1cbf39d4?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1041, name: 'Raja Seat', day: '1', time: '04:00 PM', place_img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80' },
        ],
      },
      {
        city_id: 105,
        state_id: 3,
        name: 'Gokarna',
        description: 'A breezy beach town known for its calm coves and scenic trails.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1050, name: 'Om Beach', day: '1', time: '11:30 AM', place_img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1051, name: 'Vibuthi Falls', day: '1', time: '03:00 PM', place_img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80' },
        ],
      },
    ],
  },
  {
    state_id: 4,
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Sunlit beaches, Portuguese heritage, and lively nightlife.',
    cities: [
      {
        city_id: 106,
        state_id: 4,
        name: 'North Goa',
        description: 'Best for beaches, night markets, and sunset parties.',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1060, name: 'Baga Beach', day: '1', time: '04:30 PM', place_img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1061, name: 'Fort Aguada', day: '1', time: '06:30 PM', place_img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=700&q=80' },
        ],
      },
      {
        city_id: 107,
        state_id: 4,
        name: 'South Goa',
        description: 'Peaceful coastlines, villas, and quiet evenings.',
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
        places: [
          { place_id: 1070, name: 'Palolem Beach', day: '1', time: '05:00 PM', place_img: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=700&q=80' },
          { place_id: 1071, name: 'Dudhsagar Falls', day: '1', time: '11:30 AM', place_img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80' },
        ],
      },
    ],
  },
]

export const initialHistory = [
  { id: 1, label: 'Saved destination', title: 'Ooty', type: 'city' },
  { id: 2, label: 'Recently viewed', title: 'Wayanad', type: 'state' },
]
