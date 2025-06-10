// Source images
export const sourceImages = {
  anime: require('../assets/images/Sources/Anime-Logo-Transparent.png'),
  podcast: require('../assets/images/Sources/microphone-3404243_640.webp'),
  books: require('../assets/images/Sources/pngtree-book-logo-template-design-study-shape-vector-png-image_43696810.jpg'),
  reddit: require('../assets/images/Sources/Reddit_Logo_Icon.svg.png'),
  other: require('../assets/images/Sources/6325609.png'),
};

// Platform images
export const platformImages = {
  tiktok: require('../assets/images/Platforms/tik-tok.png'),
  instagram: require('../assets/images/Platforms/instagram.png'),
  shorts: require('../assets/images/Platforms/video.png'),
};

// Source posts data
export const sourcePosts = [
  { Item: { id: 'anime', thumbnail: sourceImages.anime, name: 'Anime' } },
  { Item: { id: 'podcast', thumbnail: sourceImages.podcast, name: 'Podcast' } },
  { Item: { id: 'books', thumbnail: sourceImages.books, name: 'Books' } },
  { Item: { id: 'reddit', thumbnail: sourceImages.reddit, name: 'Reddit' } },
  { Item: { id: 'other', thumbnail: sourceImages.other, name: 'Other' } },
];

// Platforms data
export const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: platformImages.tiktok },
  { id: 'instagram', name: 'IG', icon: platformImages.instagram },
  { id: 'shorts', name: 'Shorts', icon: platformImages.shorts },
];
