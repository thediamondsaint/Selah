export type Category = 'Patriarchs' | 'Prophets' | 'Kings' | 'Leaders' | 'Apostles' | 'Women'

export type Character = {
  name: string
  category: Category
  tagline: string
  era: string
  book: string
  testament: 'OT' | 'NT'
  emoji: string
}

export const CATEGORY_STYLE: Record<Category, { accent: string; bg: string; border: string }> = {
  Patriarchs: { accent: '#f59e0b', bg: 'rgba(28,18,0,0.85)',  border: '#78350f' },
  Prophets:   { accent: '#a78bfa', bg: 'rgba(24,18,43,0.85)', border: '#4c1d95' },
  Kings:      { accent: '#fbbf24', bg: 'rgba(26,20,0,0.85)',  border: '#854d0e' },
  Leaders:    { accent: '#4ade80', bg: 'rgba(5,30,16,0.85)',  border: '#14532d' },
  Apostles:   { accent: '#38bdf8', bg: 'rgba(0,24,38,0.85)',  border: '#075985' },
  Women:      { accent: '#fb7185', bg: 'rgba(26,0,16,0.85)',  border: '#9f1239' },
}

export const CATEGORY_ORDER: Category[] = ['Patriarchs', 'Prophets', 'Kings', 'Leaders', 'Apostles', 'Women']

export const ROSTER: Character[] = [
  // Patriarchs
  { name: 'Abraham', category: 'Patriarchs', tagline: 'Father of Nations',        era: 'c. 2000 BC', book: 'Genesis', testament: 'OT', emoji: '🌟' },
  { name: 'Isaac',   category: 'Patriarchs', tagline: 'Child of Promise',         era: 'c. 1900 BC', book: 'Genesis', testament: 'OT', emoji: '🐏' },
  { name: 'Jacob',   category: 'Patriarchs', tagline: 'Father of the Twelve',     era: 'c. 1850 BC', book: 'Genesis', testament: 'OT', emoji: '🪜' },
  { name: 'Joseph',  category: 'Patriarchs', tagline: 'Dreamer and Deliverer',    era: 'c. 1750 BC', book: 'Genesis', testament: 'OT', emoji: '🧥' },

  // Prophets
  { name: 'Moses',    category: 'Prophets', tagline: 'Lawgiver and Deliverer',    era: 'c. 1400 BC', book: 'Exodus',   testament: 'OT', emoji: '📜' },
  { name: 'Elijah',   category: 'Prophets', tagline: 'Prophet of Fire',           era: 'c. 870 BC',  book: '1 Kings',  testament: 'OT', emoji: '🔥' },
  { name: 'Isaiah',   category: 'Prophets', tagline: 'Prophet of the Messiah',    era: 'c. 700 BC',  book: 'Isaiah',   testament: 'OT', emoji: '✨' },
  { name: 'Jeremiah', category: 'Prophets', tagline: 'The Weeping Prophet',       era: 'c. 600 BC',  book: 'Jeremiah', testament: 'OT', emoji: '💧' },
  { name: 'Ezekiel',  category: 'Prophets', tagline: 'Prophet of Visions',        era: 'c. 590 BC',  book: 'Ezekiel',  testament: 'OT', emoji: '👁' },
  { name: 'Daniel',   category: 'Prophets', tagline: 'Faithful in Exile',         era: 'c. 600 BC',  book: 'Daniel',   testament: 'OT', emoji: '🦁' },
  { name: 'Jonah',    category: 'Prophets', tagline: 'The Reluctant Prophet',     era: 'c. 780 BC',  book: 'Jonah',    testament: 'OT', emoji: '🐋' },

  // Kings
  { name: 'Saul',    category: 'Kings', tagline: "Israel's First King",  era: 'c. 1050 BC', book: '1 Samuel', testament: 'OT', emoji: '👑' },
  { name: 'David',   category: 'Kings', tagline: 'The Shepherd King',    era: 'c. 1010 BC', book: '1–2 Samuel', testament: 'OT', emoji: '🎵' },
  { name: 'Solomon', category: 'Kings', tagline: 'The Wise King',        era: 'c. 970 BC',  book: '1 Kings',  testament: 'OT', emoji: '🦉' },

  // Leaders & Judges
  { name: 'Joshua', category: 'Leaders', tagline: 'Conqueror of Canaan', era: 'c. 1400 BC', book: 'Joshua',   testament: 'OT', emoji: '⚔️' },
  { name: 'Gideon', category: 'Leaders', tagline: 'Mighty Warrior',      era: 'c. 1190 BC', book: 'Judges',   testament: 'OT', emoji: '🗡️' },
  { name: 'Samson', category: 'Leaders', tagline: 'The Strong Man',      era: 'c. 1100 BC', book: 'Judges',   testament: 'OT', emoji: '💪' },
  { name: 'Samuel', category: 'Leaders', tagline: 'The Last Judge',      era: 'c. 1050 BC', book: '1 Samuel', testament: 'OT', emoji: '🕯️' },

  // Apostles
  { name: 'Peter',   category: 'Apostles', tagline: 'The Rock',                   era: '1st c. AD', book: 'Gospels',    testament: 'NT', emoji: '🪨' },
  { name: 'John',    category: 'Apostles', tagline: 'The Beloved Disciple',       era: '1st c. AD', book: 'Gospels',    testament: 'NT', emoji: '🕊️' },
  { name: 'James',   category: 'Apostles', tagline: 'Son of Thunder',             era: '1st c. AD', book: 'Gospels',    testament: 'NT', emoji: '⚡' },
  { name: 'Andrew',  category: 'Apostles', tagline: 'The First Called',           era: '1st c. AD', book: 'Gospels',    testament: 'NT', emoji: '🎣' },
  { name: 'Thomas',  category: 'Apostles', tagline: 'The Doubter',                era: '1st c. AD', book: 'Gospels',    testament: 'NT', emoji: '❓' },
  { name: 'Matthew', category: 'Apostles', tagline: 'Tax Collector turned Apostle', era: '1st c. AD', book: 'Gospels',  testament: 'NT', emoji: '📒' },
  { name: 'Paul',    category: 'Apostles', tagline: 'Apostle to the Gentiles',    era: '1st c. AD', book: 'Epistles',   testament: 'NT', emoji: '✍️' },

  // Women of the Bible
  { name: 'Eve',            category: 'Women', tagline: 'Mother of All Living',          era: 'Beginning', book: 'Genesis', testament: 'OT', emoji: '🍎' },
  { name: 'Sarah',          category: 'Women', tagline: 'Mother of Nations',             era: 'c. 2000 BC', book: 'Genesis', testament: 'OT', emoji: '👶' },
  { name: 'Deborah',        category: 'Women', tagline: 'Prophetess and Judge',          era: 'c. 1200 BC', book: 'Judges',  testament: 'OT', emoji: '🌴' },
  { name: 'Ruth',           category: 'Women', tagline: 'The Loyal Redeemed',            era: 'c. 1100 BC', book: 'Ruth',    testament: 'OT', emoji: '🌾' },
  { name: 'Esther',         category: 'Women', tagline: 'Queen for Such a Time',         era: 'c. 480 BC',  book: 'Esther',  testament: 'OT', emoji: '👑' },
  { name: 'Mary',           category: 'Women', tagline: 'Mother of Jesus',               era: '1st c. AD',  book: 'Gospels', testament: 'NT', emoji: '🌹' },
  { name: 'Mary Magdalene', category: 'Women', tagline: 'First Witness of the Resurrection', era: '1st c. AD', book: 'Gospels', testament: 'NT', emoji: '🌅' },
]
