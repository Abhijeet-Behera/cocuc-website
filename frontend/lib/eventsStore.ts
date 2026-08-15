import { EventItem, CreateEventPayload } from '../types/events';
import { extractFolderId, countWords, SAMPLE_FALLBACK_IMAGES } from './googleDrive';

export const INITIAL_EVENTS: EventItem[] = [
  // ── YOUTH WING EVENTS ──────────────────────────────────────────
  {
    id: 'evt-youth-01',
    title: 'IGNITE: Annual Youth Winter Retreat 2025',
    wingId: 'youth-wing',
    wingName: 'Youth Wing',
    eventDate: '2025-12-28',
    location: 'Bethel Campsite & Retreat Centre, Chandaka Valley',
    authorName: 'Pastor Youth Coordinator',
    createdAt: '2025-12-30T10:00:00Z',
    isFeatured: true,
    folderId: '1YouthIgniteRetreat2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1YouthIgniteRetreat2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['youth-wing'],
    wordCount: 384,
    description: `The Annual Youth Winter Retreat 2025, themed "IGNITE: Unshakable Faith in a Changing World," gathered over 160 teenagers and young adults across Bhubaneswar for three transformative days of deep scripture immersion, acoustic worship under the open sky, team-building obstacle courses, and late-night fireside discussions.

Keynote sessions led by guest ministers unpacked practical discipleship for university students and young professionals navigating corporate cultures, digital fatigue, and moral pressures. Through dedicated small breakout groups, mentors guided our youth through spiritual journaling, relational accountability, and finding identity rooted in the Gospel rather than worldly metrics.

The evening campfires became moments of profound dedication where dozens of young people recommitted their lives to Christ and stepped forward for local mission involvement. Saturday afternoon featured high-energy team dynamics—including the legendary muddy obstacle relay, biblical trivia championships, and acoustic songwriting workshops. We give thanks to the supervisory committee, parent volunteers, and kitchen crew who served tirelessly with warm meals and infectious joy.`
  },
  {
    id: 'evt-youth-02',
    title: 'Youth Leadership Summit & Acoustic Worship Night',
    wingId: 'youth-wing',
    wingName: 'Youth Wing',
    eventDate: '2025-08-18',
    location: 'Youth Hall, Union Church Bhubaneswar',
    authorName: 'Youth Council',
    createdAt: '2025-08-19T11:00:00Z',
    isFeatured: false,
    folderId: '1YouthLeadershipSummitFolder',
    folderUrl: 'https://drive.google.com/drive/folders/1YouthLeadershipSummitFolder',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['youth-wing'],
    wordCount: 220,
    description: `An intensive leadership development symposium equipping student leaders, Sunday school helpers, and campus fellowship conveners. 

The summit featured interactive breakout labs on servant leadership, conflict resolution in ministry teams, and digital media evangelism. The evening concluded with an uninterrupted acoustic candle-lit worship encounter where young people prayed for universities, high schools, and local outreach efforts across Odisha.`
  },
  {
    id: 'evt-youth-03',
    title: 'Campus Discipleship & Creative Gospel Arts Workshop',
    wingId: 'youth-wing',
    wingName: 'Youth Wing',
    eventDate: '2025-05-10',
    location: 'Activity Center & Media Lab',
    authorName: 'Youth Media Team',
    createdAt: '2025-05-12T09:00:00Z',
    isFeatured: false,
    folderId: '1YouthArtsWorkshopFolder',
    folderUrl: 'https://drive.google.com/drive/folders/1YouthArtsWorkshopFolder',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['youth-wing'],
    wordCount: 210,
    description: `A creative gathering combining songwriting, spoken word poetry, graphic design, and video production to empower Christian students to communicate biblical truths through modern arts. Participants collaborated on 4 new worship tracks and a video testimony series.`
  },

  // ── CULTURAL WING EVENTS ───────────────────────────────────────
  {
    id: 'evt-cultural-01',
    title: 'Symphony of Grace: Easter Cantata & Cultural Pageant',
    wingId: 'cultural-wing',
    wingName: 'Cultural Wing',
    eventDate: '2025-04-20',
    location: 'Main Sanctuary, Union Church Bhubaneswar',
    authorName: 'Cultural Committee Head',
    createdAt: '2025-04-22T14:30:00Z',
    isFeatured: true,
    folderId: '1CulturalEasterPageant2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1CulturalEasterPageant2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['cultural-wing'],
    wordCount: 310,
    description: `A triumphant evening celebrating the Resurrection of Jesus Christ through orchestral arrangements, Odia and English traditional hymns, liturgical choreography, and dramatic monologues depicting the road to Emmaus.

Over 450 attendees filled the sanctuary as the 40-member Combined Church Choir harmonized anthems alongside live violin, cello, keyboard, and percussion accompaniment. The drama team presented a soul-stirring portrayal of Peter's redemption, reminding every believer of unconditional mercy. The evening concluded with a fellowship banquet celebrating regional culinary traditions.`
  },
  {
    id: 'evt-cultural-02',
    title: 'Christmas Carol Festival & Regional Gospel Drama Night',
    wingId: 'cultural-wing',
    wingName: 'Cultural Wing',
    eventDate: '2025-12-22',
    location: 'Main Sanctuary & Church Lawns',
    authorName: 'Drama & Music Society',
    createdAt: '2025-12-24T18:00:00Z',
    isFeatured: false,
    folderId: '1CulturalChristmasFestivalFolder',
    folderUrl: 'https://drive.google.com/drive/folders/1CulturalChristmasFestivalFolder',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['cultural-wing'],
    wordCount: 230,
    description: `A joyful festive celebration bringing together choir groups, youth drama performers, and children for an enchanting evening of classic Odia, Hindi, and English carols. The grounds were adorned with traditional brass lanterns, and a live nativity presentation touched hearts across all generations.`
  },

  // ── SPORTS WING EVENTS ─────────────────────────────────────────
  {
    id: 'evt-sports-01',
    title: 'Fellowship Cup 2025: Inter-Branch Cricket & Badminton Championship',
    wingId: 'sports-wing',
    wingName: 'Sports Wing',
    eventDate: '2025-11-15',
    location: 'Kalinga Stadium Sports Complex, Ground B',
    authorName: 'Sports Wing Secretary',
    createdAt: '2025-11-16T18:00:00Z',
    isFeatured: true,
    folderId: '1SportsFellowshipCup2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1SportsFellowshipCup2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['sports-wing'],
    wordCount: 265,
    description: `The 2025 Fellowship Cup brought together 12 regional church teams in a spirited weekend of cricket, doubles badminton, and relay races. 

Emphasizing Christian sportsmanship, physical wellness, and camaraderie, the tournament witnessed thrilling finishes, with the Youth Warriors lifting the cricket trophy and the Men's Fellowship taking home the badminton championship. Refreshment kiosks organized by volunteers kept players hydrated, and devotional huddles preceded each match.`
  },
  {
    id: 'evt-sports-02',
    title: 'Annual Unity Marathon & Family Fitness Walkathon',
    wingId: 'sports-wing',
    wingName: 'Sports Wing',
    eventDate: '2025-02-16',
    location: 'Ekamra Kanan Botanical Gardens to Church Grounds',
    authorName: 'Fitness Committee',
    createdAt: '2025-02-18T08:00:00Z',
    isFeatured: false,
    folderId: '1SportsMarathonFolder',
    folderUrl: 'https://drive.google.com/drive/folders/1SportsMarathonFolder',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['sports-wing'],
    wordCount: 195,
    description: `A refreshing 5K morning run and 3K family walkathon promoting healthy living, bodily stewardship, and community bonding. Over 180 participants of all ages from 7 to 72 completed the route with medals, fresh fruit baskets, and morning tea on the church lawns.`
  },

  // ── TECHNICAL WING EVENTS ──────────────────────────────────────
  {
    id: 'evt-technical-01',
    title: 'Acoustics & Live Streaming Masterclass 2025',
    wingId: 'technical-wing',
    wingName: 'Technical Wing',
    eventDate: '2025-09-10',
    location: 'Media Production Suite & Audio Booth',
    authorName: 'Head of Media & IT',
    createdAt: '2025-09-12T09:00:00Z',
    isFeatured: false,
    folderId: '1TechMasterclass2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1TechMasterclass2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['technical-wing'],
    wordCount: 290,
    description: `A hands-on training workshop for sound engineers, camera operators, and broadcast technicians. 

Participants received practical instruction in 32-channel digital mixing consoles, frequency balance, vocal equalization, Dante audio networking, and multi-PTZ camera switching for uninterrupted YouTube live streams. A new cohort of 8 student volunteers graduated and joined the active Sunday production roster.`
  },

  // ── WOMEN'S WING EVENTS ────────────────────────────────────────
  {
    id: 'evt-women-01',
    title: 'Grace & Flourish: Annual Women’s Convention & Craft Expo',
    wingId: 'women-wing',
    wingName: 'Women’s Wing',
    eventDate: '2025-10-04',
    location: 'Union Church Fellowship Hall',
    authorName: 'Women Fellowship President',
    createdAt: '2025-10-06T11:00:00Z',
    isFeatured: true,
    folderId: '1WomenConvention2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1WomenConvention2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['women-wing'],
    wordCount: 320,
    description: `An uplifting convention focusing on biblical womanhood, maternal leadership, and cottage prayer movements. 

The convention featured practical workshops on home entrepreneurship, nutrition, and mental well-being, accompanied by an artisanal craft exhibition displaying handmade textiles, hand-embroidered scripture bookmarks, and baked goods. All sales proceeds went toward supporting educational scholarships for orphan girls.`
  },
  {
    id: 'evt-women-02',
    title: 'Mothers in Prayer: Quarterly Fasting & Intercession Assembly',
    wingId: 'women-wing',
    wingName: 'Women’s Wing',
    eventDate: '2025-07-14',
    location: 'Cottage Prayer Center & Sanctuary',
    authorName: 'Prayer Secretary',
    createdAt: '2025-07-16T10:00:00Z',
    isFeatured: false,
    folderId: '1WomenPrayerAssemblyFolder',
    folderUrl: 'https://drive.google.com/drive/folders/1WomenPrayerAssemblyFolder',
    coverImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['women-wing'],
    wordCount: 190,
    description: `A devoted half-day fasting and prayer vigil bringing together mothers, grandmothers, and daughters to intercede for church families, youth education, marriage protection, and local community healing.`
  },

  // ── SUNDAY SCHOOL WING EVENTS ──────────────────────────────────
  {
    id: 'evt-sundayschool-01',
    title: 'Kingdom Champions: Vacation Bible School (VBS) 2025',
    wingId: 'sunday-school-wing',
    wingName: 'Sunday School Wing',
    eventDate: '2025-06-12',
    location: 'Church Activity Grounds & Classrooms',
    authorName: 'Sunday School Superintendent',
    createdAt: '2025-06-15T16:00:00Z',
    isFeatured: true,
    folderId: '1VBSChampions2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1VBSChampions2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['sunday-school-wing'],
    wordCount: 340,
    description: `Over 220 joyful children gathered for 5 memorable days of scripture memory, energetic action songs, puppet shows, creative crafts, and missionary storytelling. 

Trained volunteer teachers guided children through the Armor of God (Ephesians 6), teaching courage, honesty, and kindness in daily school life. The grand finale ceremony included group choral presentations, Bible verse recitations, and prize distributions in front of proud parents.`
  },

  // ── SOCIAL OUTREACH WING EVENTS ────────────────────────────────
  {
    id: 'evt-outreach-01',
    title: 'Healing Touch: Mega Free Health & Eye Care Camp',
    wingId: 'social-outreach-wing',
    wingName: 'Social Outreach Wing',
    eventDate: '2025-08-23',
    location: 'Community Health Hall & Outreach Clinic, Salia Sahi',
    authorName: 'Outreach Coordinator',
    createdAt: '2025-08-25T13:00:00Z',
    isFeatured: true,
    folderId: '1OutreachHealthCamp2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1OutreachHealthCamp2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['social-outreach-wing'],
    wordCount: 280,
    description: `In partnership with Christian medical doctors and volunteer optometrists, the Social Outreach Wing served 380 underprivileged families with general consultations, free pediatric checks, blood pressure screenings, and prescription eyewear distribution. 

Volunteer nurses counseled mothers on hygiene and infant nutrition while church prayer teams prayed for patients requesting intercession.`
  },

  // ── WORSHIP & MUSIC WING EVENTS ────────────────────────────────
  {
    id: 'evt-worship-01',
    title: 'Night of Worship & Choral Thanksgiving 2025',
    wingId: 'worship-music-wing',
    wingName: 'Worship & Music Wing',
    eventDate: '2025-11-29',
    location: 'Main Sanctuary, Union Church',
    authorName: 'Choir Director',
    createdAt: '2025-11-30T17:00:00Z',
    isFeatured: true,
    folderId: '1NightOfWorship2025Folder',
    folderUrl: 'https://drive.google.com/drive/folders/1NightOfWorship2025Folder',
    coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80',
    images: SAMPLE_FALLBACK_IMAGES['worship-music-wing'],
    wordCount: 310,
    description: `An unforgettable three-hour continuous worship encounter bringing together acoustic worship teams, classical choir anthems, and spontaneous congregation prayer. 

The sanctuary was filled with an atmosphere of reverent adoration and tears of thanksgiving. Musicians from all generations ministered together with one unified voice in praise to the Almighty.`
  }
];

let globalEventsMemory: EventItem[] = [...INITIAL_EVENTS];

export function getAllEvents(wingId?: string, search?: string): EventItem[] {
  let list = [...globalEventsMemory];

  if (wingId) {
    list = list.filter((e) => e.wingId.toLowerCase() === wingId.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.wingName.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => {
    const dateA = new Date(a.eventDate || a.createdAt).getTime();
    const dateB = new Date(b.eventDate || b.createdAt).getTime();
    return dateB - dateA;
  });
}

export function createEventItem(payload: CreateEventPayload): EventItem {
  const folderId = payload.folderId || extractFolderId(payload.folderUrl) || `folder-${Date.now()}`;
  const images =
    payload.images && payload.images.length > 0
      ? payload.images
      : SAMPLE_FALLBACK_IMAGES[payload.wingId] || SAMPLE_FALLBACK_IMAGES['default'];

  const wordCount = countWords(payload.description);

  const newEvent: EventItem = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: payload.title.trim(),
    wingId: payload.wingId,
    wingName: payload.wingName || payload.wingId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: payload.description.trim(),
    wordCount,
    folderUrl: payload.folderUrl.trim(),
    folderId,
    images,
    coverImage: payload.coverImage || images[0],
    eventDate: payload.eventDate || new Date().toISOString().split('T')[0],
    location: payload.location || 'Church Campus',
    authorName: payload.authorName || 'Church Admin',
    createdAt: new Date().toISOString(),
    isFeatured: true,
  };

  globalEventsMemory = [newEvent, ...globalEventsMemory];
  return newEvent;
}

export function deleteEventItem(id: string): boolean {
  const initialLength = globalEventsMemory.length;
  globalEventsMemory = globalEventsMemory.filter((e) => e.id !== id);
  return globalEventsMemory.length < initialLength;
}
