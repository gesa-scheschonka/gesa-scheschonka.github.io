/*
 * THIS FILE IS THE WEBSITE CONTENT TABLE.
 *
 * To add new work:
 * 1. Copy a complete {...} block in the PROJECTS table.
 * 2. Replace the values between quotation marks.
 * 3. Keep the designed cover, or add a cleared local image and its credit.
 *
 * Important:
 * - Every id must be unique (lowercase letters and hyphens only).
 * - month is a number from 1 to 12.
 * - Every block is followed by a comma.
 * - `sources` document the project facts; they are not image licences.
 * - `instagram` may contain one verified public post. Optional `slides` add
 *   more verified photo posts for an automatically rotating gallery. They are
 *   only loaded after the visitor has allowed optional Instagram content.
 * - Only add `image` after permission for public portfolio use. Use
 *   `imageRights: "cleared"` for unrestricted written approval,
 *   `imageRights: "licensed"` for a public licence such as Creative Commons,
 *   or `imageRights: "editorial"` only when the supplied terms explicitly
 *   allow editorial reuse and the case is published within those limits. Always add
 *   `imageCredit`, `imageSource` and a useful `imageAlt`.
 * - `media` creates a curated local photo/video edit. Every item needs a type,
 *   local src, useful alt text and confirmed public portfolio permission.
 * - Videos may add `originalSrc` for an untouched HEVC/HDR source. Compatible
 *   browsers use it in the detail view; the H.264 `src` remains the fallback.
 */

const SITE = {
  // Change this HEX value to choose a different accent colour.
  accentColor: "#1438f0",
  // accentColor: "#13df01", // Neon green
  // accentColor: "#ff5c00", // Orange
  firstName: "Gesa",
  lastName: "Scheschonka",
  initials: "GS",
  // The email is not stored here: it is written into the HTML at deploy time
  // as HTML character references, so it never appears in plain text.
  location: "Berlin",
  heroTitle: "I shape how brands show up in culture",
  heroIntro:
    "Strategic communication, integrated campaigns, partnerships and brand experiences.",
  statement:
    "I translate strategy into stories, relationships and experiences — with a clear sense of audience, timing and cultural relevance",
  aboutLead:
    "I combine a clear strategic perspective with a close eye for execution — from the first question to the final guest.",
  aboutBody:
    "My background spans beauty, fashion, lifestyle and design — fields where people, context and detail give communication and conversations its direction.",
  cvUrl: "",
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "Instagram", url: "https://www.instagram.com/" },
  ],
  legal: {
    fullName: "Gesa Scheschonka",
    street: "[Enter street and house number]",
    postalCity: "[Enter postcode and city]",
    country: "Deutschland",
    vatId: "",
    editorialResponsible: "Gesa Scheschonka",
  },
};

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │ WORK — one {...} block corresponds to one row in the content table         │
// └──────────────────────────────────────────────────────────────────────────────┘
const PROJECTS = [
  {
    id: "loreal-cannes-2024",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "L’Oréal Paris",
    name: "L’Oréal Paris at the 77th Cannes Film Festival",
    coverTitle: "Cannes 2024",
    category: "PR & Media Relations",
    summary:
      "PR and media support for L’Oréal Paris and its national brand faces during the 77th Festival de Cannes.",
    description:
      "PR and media support for L’Oréal Paris and its national brand faces during the 77th Festival de Cannes. The agency scope included interview and travel coordination, media relations, the Heidi Klum ambassador announcement and an on-site PR asset shoot.",
    year: 2024,
    month: 5,
    location: "Cannes",
    coverTheme: "cannes",
    coverVariant: 1,
    imageAlt: "Original graphic portfolio cover for L’Oréal Paris at Cannes 2024",
    instagram: {
      url: "https://www.instagram.com/p/C7CwgquIDpi/",
      slides: [
        "https://www.instagram.com/p/C7g1nL0odaP/",
        "https://www.instagram.com/p/C78pdPbNqqj/",
      ],
      account: "@lorealparis",
      label: "Cannes photo gallery",
      detailAspect: [4, 5],
      nativeCarousel: true,
    },
    services: ["Media Relations", "Interview Coordination", "Talent Relations", "Travel Coordination"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-cannes-2024/" },
      {
        label: "Festival de Cannes — official dates",
        url: "https://www.festival-cannes.com/en/press/press-releases/welcoming-you-to-the-77th-festival-de-cannes/",
      },
    ],
  },
  {
    id: "heidi-klum-loreal-ambassador",
    client: "L’Oréal Paris",
    name: "Heidi Klum Joins L’Oréal Paris",
    coverTitle: "New Brand Ambassador",
    category: "Brand Communications",
    summary:
      "Launch communications announcing Heidi Klum as a new L’Oréal Paris ambassador at the opening of Cannes 2024.",
    description:
      "Launch communications announcing Heidi Klum as a new L’Oréal Paris ambassador, timed to the opening of Cannes. The announcement introduced Revitalift Laser as her first campaign for the brand.",
    year: 2024,
    month: 5,
    location: "Cannes",
    coverTheme: "beauty",
    coverVariant: 2,
    image: "assets/projects/heidi-klum-loreal-ambassador/images/cover.jpg",
    imageRights: "editorial",
    imageCredit: "Image rights: L’Oréal Paris · Photo: Rankin for L’Oréal Paris",
    imageSource:
      "https://www.wiwo.de/adv/presseportal/loreal-paris-loreal-paris-verkuendet-heidi-klum-als-neue-inspirierende-markenbotschafterin/29800320.html",
    imageUsage:
      "Editorial use only under the supplied Presseportal terms. A professional portfolio may require additional written permission.",
    imagePosition: "50% 34%",
    imageAlt: "Official portrait of Heidi Klum for her L’Oréal Paris ambassador announcement",
    services: ["Launch Communications", "Media Relations", "Talent Communications", "Press Materials"],
    sources: [
      {
        label: "L’Oréal Paris press release and image terms",
        url: "https://www.wiwo.de/adv/presseportal/loreal-paris-loreal-paris-verkuendet-heidi-klum-als-neue-inspirierende-markenbotschafterin/29800320.html",
      },
      { label: "REICHERT+ Cannes case", url: "https://reichertplus.com/en/case-cannes-2024/" },
    ],
  },
  {
    id: "loreal-revitalift-laser-heidi-klum",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "L’Oréal Paris",
    name: "Revitalift Laser × Heidi Klum",
    coverTitle: "Revitalift Laser",
    category: "Campaign Communications",
    summary:
      "Communications around Heidi Klum’s first Revitalift Laser campaign, developed with McCann Germany for the DACH market.",
    description:
      "Communications around the first Revitalift Laser campaign featuring Heidi Klum. Developed with McCann Germany, the integrated rollout included a 20-second film with 15- and 6-second cutdowns across television, streaming and social media, supported by print and advertorial activity.",
    year: 2024,
    month: 9,
    location: "DACH",
    coverTheme: "beauty",
    coverVariant: 5,
    imageAlt: "Original graphic portfolio cover for the Revitalift Laser campaign with Heidi Klum",
    services: ["Campaign Communications", "Media Relations", "Integrated Rollout", "Partner Coordination"],
    sources: [
      {
        label: "HORIZONT campaign film",
        url: "https://www.horizont.net/video/LOral-Revitalift-Laser---Heidi-Klum-54245",
      },
      {
        label: "Campaign and production report",
        url: "https://www.leadersnet.de/news/83038%2Cerste-loreal-paris-kampagnen-mit-heidi-klum-starten.html",
      },
    ],
  },
  {
    id: "loreal-le-defile-2024",
    client: "L’Oréal Paris",
    name: "Le Défilé 2024 — Walk Your Worth",
    coverTitle: "Le Défilé 2024",
    category: "PR & Media Relations",
    summary:
      "PR and media relations for the seventh Le Défilé runway show at Place de l’Opéra in Paris.",
    description:
      "PR and media relations for the seventh Le Défilé runway show, including interview acquisition and coordination, support for national and international brand faces, talent communication and travel coordination.",
    year: 2024,
    month: 9,
    location: "Paris",
    coverTheme: "runway",
    coverVariant: 1,
    image: "assets/projects/loreal-le-defile-2024/images/cover.jpg",
    imageRights: "editorial",
    imageCredit: "Image rights: L’Oréal Paris · Photo: L’Oréal Paris",
    imageSource: "https://www.presseportal.de/pm/73372/5862145",
    imageUsage: "Editorial use only under the usage conditions supplied with the Presseportal image.",
    imageAlt:
      "L’Oréal Paris Le Défilé 2024 campaign visual featuring Kendall Jenner in front of the Palais Garnier in Paris",
    services: ["Media Relations", "Interview Coordination", "Talent Communications", "Travel Coordination"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-loreal-le-defile/" },
      {
        label: "Presseportal release and image terms",
        url: "https://www.presseportal.de/pm/73372/5862145",
      },
    ],
  },
  {
    id: "loreal-cannes-2025",
    client: "L’Oréal Paris",
    name: "L’Oréal Paris at Cannes Film Festival 2025",
    coverTitle: "Cannes 2025",
    category: "PR & Media Relations",
    summary:
      "International and national media coordination around L’Oréal Paris’s presence at the 78th Festival de Cannes.",
    description:
      "International and national media coordination around L’Oréal Paris’s Cannes presence, spanning television integration, interview planning, talent preparation, management liaison, briefings and content distribution.",
    year: 2025,
    month: 5,
    location: "Cannes",
    coverTheme: "cannes",
    coverVariant: 3,
    image: "assets/projects/loreal-cannes-2025/images/cover.jpg",
    imageRights: "editorial",
    imageCredit: "Image rights: L’Oréal Paris · Photo: L’Oréal Paris",
    imageSource: "https://www.presseportal.de/pm/73372/6044265",
    imageUsage:
      "Context image from an official L’Oréal Paris Cannes 2025 event. Editorial use only under the supplied Presseportal terms.",
    imagePosition: "50% 48%",
    imageAlt:
      "Iris Knobloch, Heo Gayoung, Viola Davis and Delphine Viguier-Hovasse at the L’Oréal Paris Cinéma de Demain Dinner in Cannes 2025",
    services: ["Media Relations", "TV Integration", "Interview Planning", "Content Distribution"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-loreal-cannes-2025/" },
      {
        label: "REICHERT+ project archive",
        url: "https://reichertplus.com/en/loreal-paris-cannes-film-festival-2025/",
      },
    ],
  },
  {
    id: "loreal-le-defile-2025",
    hidden: true, // removed from the site on request; data kept
    client: "L’Oréal Paris",
    name: "Le Défilé 2025 — Walk Your Worth",
    coverTitle: "Walk Your Worth",
    category: "PR & Media Relations",
    summary:
      "PR and media work for Le Défilé in Paris and its L’Oréal Paris pop-up continuation in Düsseldorf.",
    description:
      "PR and media work for Le Défilé in Paris and its Düsseldorf continuation, including interview acquisition for German media, on-site support and interview coordination around Heidi Klum’s pop-up appearance.",
    year: 2025,
    month: 9,
    location: "Paris · Düsseldorf",
    coverTheme: "runway",
    coverVariant: 4,
    image: "assets/projects/loreal-le-defile-2025/images/cover.jpg",
    imageRights: "editorial",
    imageCredit: "Image rights: L’Oréal Paris · Photo: L’Oréal Paris",
    imageSource: "https://www.presseportal.de/pm/73372/6126733",
    imageUsage: "Editorial use only under the usage conditions supplied with the Presseportal image.",
    imageAlt:
      "L’Oréal Paris Le Défilé 2025 campaign visual featuring Kendall Jenner in front of the Hôtel de Ville in Paris",
    services: ["Media Relations", "Interview Acquisition", "Pop-up Support", "On-site Coordination"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-walk-your-worth-2025/" },
      {
        label: "Presseportal release and image terms",
        url: "https://www.presseportal.de/pm/73372/6126733",
      },
    ],
  },
  {
    id: "about-you-fashion-circus-2024",
    client: "ABOUT YOU",
    name: "ABOUT YOU Fashion Circus",
    coverTitle: "Fashion Circus",
    category: "Event Communications",
    summary:
      "PR and media work for ABOUT YOU’s Fashion Circus during Berlin Fashion Week 2024.",
    description:
      "PR and media work for ABOUT YOU’s Fashion Circus, including interview coordination, media acquisition, guest management, red carpet and photocall operations, and on-site support.",
    year: 2024,
    month: 7,
    location: "Berlin",
    coverTheme: "fashion",
    coverVariant: 2,
    imageAlt: "Original graphic portfolio cover for ABOUT YOU Fashion Circus",
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/about-you-fashion-circus-2024/images/cover.jpg",
        alt: "Illuminated Circus Roncalli tent at the ABOUT YOU Fashion Circus",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/about-you-fashion-circus-2024/videos/video-01.mp4",
        originalSrc: "assets/projects/about-you-fashion-circus-2024/videos/originals/video-01.mp4",
        poster: "assets/projects/about-you-fashion-circus-2024/images/video-01-poster.jpg",
        alt: "Arrival atmosphere at the ABOUT YOU Fashion Circus",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/about-you-fashion-circus-2024/videos/video-02.mp4",
        originalSrc: "assets/projects/about-you-fashion-circus-2024/videos/originals/video-02.mp4",
        poster: "assets/projects/about-you-fashion-circus-2024/images/video-02-poster.jpg",
        alt: "Fashion and circus performance inside the big top",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/about-you-fashion-circus-2024/images/image-01.jpg",
        alt: "Aerial acrobat performing inside a transparent sphere",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/about-you-fashion-circus-2024/videos/video-03.mp4",
        originalSrc: "assets/projects/about-you-fashion-circus-2024/videos/originals/video-03.mp4",
        poster: "assets/projects/about-you-fashion-circus-2024/images/video-03-poster.jpg",
        alt: "Runway moment during ABOUT YOU Fashion Circus",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/about-you-fashion-circus-2024/images/image-02.jpg",
        alt: "Guests entering the illuminated Circus Roncalli venue",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/about-you-fashion-circus-2024/videos/video-04.mp4",
        originalSrc: "assets/projects/about-you-fashion-circus-2024/videos/originals/video-04.mp4",
        poster: "assets/projects/about-you-fashion-circus-2024/images/video-04-poster.jpg",
        alt: "Finale atmosphere at the ABOUT YOU Fashion Circus",
        hero: true,
      },
    ],
    services: ["Media Relations", "Guest Management", "Red Carpet", "On-site Support"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-fashion-circus-2024/" },
      {
        label: "Official ABOUT YOU release",
        url: "https://corporate.aboutyou.de/app/uploads/2024/06/24-06-05_ABOUT-YOU-FASHION-WEEK-2024-DIE-EINZIGARTIGE-PARTNERSCHAFT-MIT-CIRCUS-RONCALLI-DEFINIERT-DAS-FASHIONTAINMENT-IM-RAHMEN-DES-ABOUT-YOU-FASHION-CIRCUS-NEU.pdf",
      },
    ],
  },
  {
    id: "ewa-herzog-wrapped-in-silence-2024",
    client: "EWA HERZOG",
    name: "Ewa Herzog Runway Show @KÖNIG GALERIE",
    coverTitle: "Wrapped in Silence",
    category: "Fashion Communications",
    summary:
      "PR, guest and on-site support for Ewa Herzog’s Berlin Fashion Week comeback at KÖNIG GALERIE.",
    description:
      "After a five-year show break, Ewa Herzog presented the Spring/Summer 2025 collection Wrapped in Silence at KÖNIG GALERIE. The Berlin Fashion Week show brought 21 models to a 30-metre runway inside the gallery’s monumental nave.",
    year: 2024,
    month: 7,
    location: "Berlin",
    coverTheme: "silver",
    coverVariant: 5,
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/ewa-herzog-wrapped-in-silence-2024/images/cover.jpg",
        alt: "Ewa Herzog guest gifts aligned along the runway at KÖNIG GALERIE",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/ewa-herzog-wrapped-in-silence-2024/videos/video-01.mp4",
        originalSrc: "assets/projects/ewa-herzog-wrapped-in-silence-2024/videos/originals/video-01.mp4",
        poster: "assets/projects/ewa-herzog-wrapped-in-silence-2024/images/video-01-poster.jpg",
        alt: "Ewa Herzog branding at the head of the KÖNIG GALERIE runway",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/ewa-herzog-wrapped-in-silence-2024/videos/video-02.mp4",
        originalSrc: "assets/projects/ewa-herzog-wrapped-in-silence-2024/videos/originals/video-02.mp4",
        poster: "assets/projects/ewa-herzog-wrapped-in-silence-2024/images/video-02-poster.jpg",
        alt: "Models walking the Ewa Herzog Spring Summer 2025 finale",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ewa-herzog-wrapped-in-silence-2024/images/image-01.jpg",
        alt: "Backstage rails with looks prepared for the Ewa Herzog show",
        hero: true,
      },
    ],
    services: ["PR & Media Relations", "Concept Support", "Guest Management", "VIP & Red Carpet"],
    sources: [
      {
        label: "REICHERT+ case study",
        url: "https://reichertplus.com/en/grosses-comeback-ewa-herzog-feiert-glanzvolle-fashion-show-in-der-koenig-galerie/",
      },
      {
        label: "Berlin Fashion Week brand profile",
        url: "https://fashionweek.berlin/en/brands/ewa-herzog-1.html",
      },
    ],
  },
  {
    id: "about-you-fashionmania-2025",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "ABOUT YOU",
    name: "FASHIONMANIA by ABOUT YOU Fashion Week",
    coverTitle: "Fashionmania",
    category: "Event Communications",
    summary:
      "Press and media support for ABOUT YOU’s arena-format fashion event at the Uber Eats Music Hall.",
    description:
      "Press and media support for ABOUT YOU’s arena-format fashion event, including interview coordination, media and photographer acquisition, guest management, red carpet and photocall operations, and on-site support.",
    year: 2025,
    month: 4,
    location: "Berlin",
    coverTheme: "fashion",
    coverVariant: 6,
    imageAlt: "Original graphic portfolio cover for ABOUT YOU Fashionmania 2025",
    services: ["Media Relations", "Photographer Relations", "Guest Management", "Red Carpet"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-fashionmania-2025/" },
      {
        label: "Official ABOUT YOU event recap",
        url: "https://corporate.aboutyou.de/en/newsroom/press-releases/about-you-fashionmania-by-about-you-fashion-week-about-you-inszeniert-die-groesste-fashiontainment-show-aller-zeiten-und-begeistert-mit-einem-energiegeladenen-arena-event",
      },
    ],
  },
  {
    id: "vip-beauty-fashion-lounge-2025",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "REICHERT+",
    name: "R+ VIP Beauty & Fashion Lounge 2025",
    coverTitle: "VIP Lounge",
    category: "Event Communications",
    summary:
      "An agency-hosted Beauty & Fashion Lounge at Hotel de Rome during Berlin Fashion Week.",
    description:
      "Concept, planning and execution of the agency’s Beauty & Fashion Lounge during Berlin Fashion Week, spanning guest management, media and interview coordination, television support and on-site support for participating brand partners.",
    year: 2025,
    month: 7,
    location: "Berlin",
    coverTheme: "silver",
    coverVariant: 4,
    imageAlt: "Original graphic portfolio cover for the R+ VIP Beauty and Fashion Lounge 2025",
    services: ["Event Planning", "Guest Management", "Media Coordination", "TV Support"],
    sources: [
      { label: "REICHERT+ case study", url: "https://reichertplus.com/en/case-vip-lounge-2025/" },
    ],
  },
  {
    id: "gala-girls-camp-2025",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "ONE LUXURY · DOMES Resorts",
    name: "GALA Girls Camp 2025 × ONE LUXURY & DOMES Resorts",
    coverTitle: "GALA Girls Camp",
    category: "Brand Experience",
    summary:
      "Planning, coordination and on-site support for the 2025 GALA Girls Camp at Domes Miramare, Corfu.",
    description:
      "Planning, coordination and on-site support for ONE LUXURY and DOMES Resorts at the 2025 GALA Girls Camp, hosted at the Domes Miramare resort on Corfu.",
    year: 2025,
    month: 5,
    location: "Corfu",
    coverTheme: "resort",
    coverVariant: 5,
    imageAlt: "Original graphic portfolio cover for GALA Girls Camp 2025 at Domes Miramare",
    services: ["Event Planning", "Partner Coordination", "Guest Relations", "On-site Support"],
    sources: [
      {
        label: "REICHERT+ case study",
        url: "https://reichertplus.com/en/gala-girls-camp-2025-x-one-luxury-domes-resorts/",
      },
      {
        label: "Domes Miramare — official background",
        url: "https://domesresorts.com/this-is-the-legendary-domes-miramare/",
      },
    ],
  },
  {
    id: "replay-breuninger-united-to-inspire",
    client: "REPLAY × Breuninger",
    name: "Replay x Breuninger — United to Inspire",
    coverTitle: "United to Inspire",
    category: "Launch Communications",
    summary:
      "A Berlin launch moment for REPLAY and Breuninger’s anniversary capsule collaboration.",
    description:
      "A Berlin launch moment for REPLAY and Breuninger’s three-part capsule collaboration, created to mark Breuninger’s 140th and REPLAY’s 40th anniversaries. The teaser event featured the performance piece Solitude.",
    year: 2021,
    month: 10,
    location: "Berlin",
    coverTheme: "denim",
    coverVariant: 3,
    imageAlt: "Original graphic portfolio cover for REPLAY and Breuninger United to Inspire",
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/replay-breuninger-united-to-inspire/images/cover.jpg",
        alt: "REPLAY and Breuninger United to Inspire multi-screen installation",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/replay-breuninger-united-to-inspire/videos/video-01.mp4",
        poster: "assets/projects/replay-breuninger-united-to-inspire/images/video-01-poster.jpg",
        alt: "Moving-image installation at the United to Inspire launch",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/replay-breuninger-united-to-inspire/videos/video-02.mp4",
        poster: "assets/projects/replay-breuninger-united-to-inspire/images/video-02-poster.jpg",
        alt: "Performance atmosphere during the REPLAY and Breuninger event",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/replay-breuninger-united-to-inspire/images/image-01.jpg",
        alt: "United to Inspire event environment in warm red light",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/replay-breuninger-united-to-inspire/videos/video-03.mp4",
        poster: "assets/projects/replay-breuninger-united-to-inspire/images/video-03-poster.jpg",
        alt: "Guests and performance at the United to Inspire launch",
        hero: true,
      },
    ],
    services: ["Launch Communications", "Event PR", "Guest Relations", "Media Relations"],
    sources: [
      { label: "Production case", url: "https://bigcountry.berlin/project/replay-x-breuninger/" },
      {
        label: "Getty Images event archive",
        url: "https://www.gettyimages.dk/editorial-images/entertainment/event/x-breuninger-united-to-inspire-in-berlin/775708223",
      },
    ],
  },
  {
    id: "furla-society-berlin-2018",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "Furla",
    name: "The Furla Society — Berlin Dinner & Party",
    coverTitle: "The Furla Society",
    category: "Event Communications",
    summary:
      "Furla brought The Furla Society campaign to Berlin with a dinner, party and live performance.",
    description:
      "Furla brought The Furla Society to Berlin with a dinner and party at Borchardt, translating its Fall/Winter 2018 campaign into a live brand experience with fashion guests and a performance by Lary.",
    year: 2018,
    month: 10,
    location: "Berlin",
    coverTheme: "furla",
    coverVariant: 1,
    imageAlt: "Original graphic portfolio cover for The Furla Society Berlin event",
    services: ["Event Communications", "Guest Relations", "Media Relations", "On-site Support"],
    sources: [
      {
        label: "Getty Images event record",
        url: "https://www.gettyimages.ch/detail/nachrichtenfoto/tanja-trutschnig-lisa-banholzer-sonia-lyson-and-mandy-nachrichtenfoto/1051850322",
      },
      {
        label: "WELT event report",
        url: "https://www.welt.de/iconist/news/article181949160/Furla-Bogner-Airbnb-Die-wichtigsten-Events-der-Woche.html",
      },
    ],
  },
  {
    id: "furla-mfw-2022-2023",
    client: "Furla",
    name: "Furla @ MFW",
    coverTitle: "Furla @ MFW",
    category: "Fashion Week Communications",
    summary:
      "Three Milan Fashion Week presentations bringing Furla’s product stories into physical space.",
    description:
      "Across three Milan Fashion Week presentations from February 2022 to February 2023, Furla introduced the origami-inspired Bloom Bag, the purpose-led Metropolis Remix with She Is The Music and the Unica Furla Earth Limited Edition developed with Cyclica. The work connected product storytelling, media relations and on-site presentation support across each launch.",
    year: 2023,
    month: 2,
    dateLabel: "February 2022—February 2023",
    location: "Milan",
    coverTheme: "furla",
    coverVariant: 2,
    mediaAutoplay: 4000,
    previewLayout: "single",
    previewMediaType: "video",
    media: [
      {
        type: "video",
        src: "assets/projects/furla-mfw-2022-2023/videos/metropolis-remix.mp4",
        poster: "assets/projects/furla-mfw-2022-2023/images/metropolis-remix-poster.jpg",
        alt: "Furla Metropolis Remix presentation film from Milan Fashion Week",
        hero: true,
        size: "xl",
      },
      {
        type: "video",
        src: "assets/projects/furla-mfw-2022-2023/videos/unica-fw23.mp4",
        poster: "assets/projects/furla-mfw-2022-2023/images/unica-fw23-poster.jpg",
        alt: "Furla Unica FW23 presentation film from Milan Fashion Week",
        hero: true,
        size: "xl",
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/cover.jpg",
        alt: "Colourful Furla bags and folded product displays at Milan Fashion Week",
        hero: true,
        size: "lg",
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-01.jpg",
        alt: "Unica Furla Earth presentation with a planted installation and circular-economy message",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-02.png",
        alt: "Metropolis Remix bags presented in a spacious illuminated installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-03.jpg",
        alt: "Red Furla bag and glass photographed on a marble table",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-04.png",
        alt: "Unica Furla Earth Limited Edition presentation and floral installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-05.jpg",
        alt: "Mirrored display lined with colourful Furla bags",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-06.png",
        alt: "Metropolis Remix sound installation addressing gender inequality in music",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-07.jpg",
        alt: "Colourful folded Furla details arranged across a marble surface",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-08.png",
        alt: "Illuminated presentation of colourful Furla bags",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-09.jpg",
        alt: "Furla product display with blue, silver and turquoise bags",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-10.png",
        alt: "Furla presentation screen featuring the Unica campaign",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-11.png",
        alt: "Metropolis Remix presentation with campaign projection and product display",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-12.png",
        alt: "Light-frame installation carrying the Furla identity",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-13.png",
        alt: "Furla presentation booth composed from screens and blue light",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/image-14.jpg",
        alt: "Milan Duomo photographed during Milan Fashion Week",
        hero: true,
        preview: false,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-01.jpg",
        alt: "DJ performing beneath the Metropolis Remix campaign projection",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-02.jpg",
        alt: "Guest carrying a blue Metropolis Remix bag inside the presentation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-03.jpg",
        alt: "Guest carrying a red Metropolis Remix bag beside the purpose statement",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-04.jpg",
        alt: "Small Furla bags displayed on illuminated plinths",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-05.jpg",
        alt: "Metropolis Remix presentation viewed through the Furla entrance",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-06.jpg",
        alt: "Metropolis Remix campaign film playing inside the presentation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/metropolis-image-07.jpg",
        alt: "Wide view across the Metropolis Remix installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/unica-image-01.jpg",
        alt: "Unica Furla Earth installation framed by plants and mirrored surfaces",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/unica-image-02.jpg",
        alt: "Unica Furla Earth bag photographed against the presentation screen",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/unica-image-03.jpg",
        alt: "Close-up of the Unica Furla Earth bag at Triennale Milano",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/unica-image-04.jpg",
        alt: "Wide view of the Unica Furla Earth presentation at Triennale Milano",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/furla-mfw-2022-2023/images/unica-image-05.jpg",
        alt: "Turquoise Unica Furla Earth bag displayed inside the presentation",
        hero: true,
      },
    ],
    services: [
      "Fashion Week Communications",
      "Product Communications",
      "Media Relations",
      "Presentation Support",
      "Partner Storytelling",
    ],
    sources: [
      { label: "Bloom Bag — official Furla release", url: "https://prtimes.jp/main/html/rd/p/000000021.000084316.html" },
      {
        label: "Bloom Bag — Vogue Italia",
        url: "https://www.vogue.it/moda/article/borsa-tracolla-clutch-furla-milano-fashion-week-2022",
      },
      { label: "Metropolis Remix — official Furla release", url: "https://prtimes.jp/main/html/rd/p/000000042.000084316.html" },
      { label: "Metropolis Remix — Office Magazine", url: "https://officemagazine.net/node/5571" },
      {
        label: "Metropolis Remix — Vogue Italia",
        url: "https://www.vogue.it/moda/article/borse-furla-metropolis-remix-modelli",
      },
      { label: "Unica Furla Earth — FablStyle", url: "https://fablstyle.com/an-exclusive-edition-of-the-unica-furla-earth/" },
      { label: "Unica Furla Earth — Vogue Italia", url: "https://www.vogue.it/moda/article/irina-shayk-borsa-unica-furla" },
      {
        label: "Metropolis Remix — North Six production case",
        url: "https://northsix.com/works/Furla_MetropolisRemixBagPresentation",
      },
      {
        label: "Unica FW23 — North Six production case",
        url: "https://northsix.com/works/FurlaUnicaFW23Presentation",
      },
    ],
  },
  {
    id: "armani-beauty-bazaar-berlinale",
    client: "Armani Beauty × Harper’s Bazaar",
    name: "Armani Beauty x Harper’s Bazaar Dinner & Party, Berlinale 2023",
    coverTitle: "Berlinale Dinner",
    category: "Event Communications",
    summary:
      "An exclusive Armani Beauty and Harper’s Bazaar dinner during the 73rd Berlin International Film Festival.",
    description:
      "During Armani Beauty’s first year as the Berlinale’s principal beauty partner, Armani Beauty and Harper’s Bazaar hosted a dinner at The Feuerle Collection, followed by a party and DJ set by Honey Dijon.",
    year: 2023,
    month: 2,
    location: "Berlin",
    coverTheme: "night",
    coverVariant: 5,
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8732.jpg",
        alt: "Candlelit Armani Beauty dinner tables inside The Feuerle Collection",
        label: "Dinner atmosphere",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/armani-beauty-bazaar-berlinale/videos/img_8749.mp4",
        originalSrc: "assets/projects/armani-beauty-bazaar-berlinale/videos/originals/img_8749.mp4",
        poster: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8749-poster.jpg",
        alt: "Guests moving through the late-night party at The Feuerle Collection",
        label: "Late-night atmosphere",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/armani-beauty-bazaar-berlinale/videos/img_8750.mp4",
        originalSrc: "assets/projects/armani-beauty-bazaar-berlinale/videos/originals/img_8750.mp4",
        poster: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8750-poster.jpg",
        alt: "DJ performance during the Armani Beauty and Harper’s Bazaar evening",
        label: "DJ set",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_1324.jpg",
        alt: "Blue light installation with Armani Beauty and Harper’s Bazaar branding",
        label: "Light installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_1297.jpg",
        alt: "Armani Beauty and Harper’s Bazaar event branding projected inside the venue",
        label: "Brand environment",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8740.jpg",
        alt: "Giorgio Armani projection screens behind a blue light installation",
        label: "Projection room",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_7731.jpg",
        alt: "Long candlelit dinner table with flowers and red architectural lighting",
        label: "Table setting",
        hero: true,
        size: "lg",
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8742.jpg",
        alt: "Sculptural table installation beneath red Armani Beauty light projections",
        label: "Art installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_1299.jpg",
        alt: "Red Armani Beauty logo projected onto a concrete column",
        label: "Architectural branding",
        hero: true,
        size: "lg",
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_8741.jpg",
        alt: "Symmetrical view down the candlelit Armani Beauty dinner tables",
        label: "Dinner axis",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/armani-beauty-bazaar-berlinale/images/img_7720.jpg",
        alt: "Sculptural shadow cast across the concrete floor of The Feuerle Collection",
        label: "Light and shadow",
        hero: true,
      },
    ],
    services: ["Event Communications", "Guest Relations", "Media Relations", "On-site Support"],
    sources: [
      {
        label: "Harper’s Bazaar event recap",
        url: "https://www.harpersbazaar.de/zeitgeist/berlinale-armani-beauty-harpers-bazaar-party-mit-sydney-sweeney",
      },
      { label: "Official partnership announcement", url: "https://www.presseportal.de/pm/24390/5438387" },
      {
        label: "Inside Beauty event report",
        url: "https://www.redspa.de/2023/03/inside-beauty/armani-beautyexklusives-dinner-in-berlin/",
      },
    ],
  },
  {
    id: "mac-palina-rojinski-2018",
    client: "M·A·C Cosmetics × Palina Rojinski",
    name: "MAC Cosmetics x Palina Rojinski Launch Party",
    coverTitle: "Palina × M·A·C",
    category: "Launch Communications",
    summary:
      "A Berlin cocktail event for Palina Rojinski’s limited-edition M·A·C lipstick.",
    description:
      "A cocktail event celebrated Palina Rojinski’s limited-edition M·A·C lipstick, a peach-coral satin shade developed with the brand. A large tape-art portrait by Tape Over formed part of the installation.",
    year: 2018,
    month: 11,
    location: "Berlin",
    coverTheme: "red",
    coverVariant: 3,
    imageAlt: "Original graphic portfolio cover for the M·A·C Cosmetics and Palina Rojinski lipstick launch",
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/cover.png",
        alt: "Illuminated M·A·C installation featuring Palina Rojinski",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/mac-palina-rojinski-2018/videos/video-01.mp4",
        poster: "assets/projects/mac-palina-rojinski-2018/images/video-01-poster.jpg",
        alt: "Cocktail party atmosphere at the Palina Rojinski lipstick launch",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/image-01.png",
        alt: "Palina Rojinski and guests at the M·A·C launch event",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/image-02.png",
        alt: "Portrait installation for the limited-edition M·A·C lipstick",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/image-03.png",
        alt: "Event guests in front of the M·A·C and Palina Rojinski backdrop",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/image-04.png",
        alt: "Close-up of the graphic event installation",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/mac-palina-rojinski-2018/images/image-05.png",
        alt: "M·A·C launch setting with red graphic accents",
        hero: true,
      },
    ],
    services: ["Launch Communications", "Event PR", "Guest Relations", "Media Relations"],
    sources: [
      {
        label: "Getty Images event archive",
        url: "https://www.gettyimages.dk/editorial-images/entertainment/event/cosmetics-x-palina-rojinski-cocktail-party-in-berlin/775258206",
      },
      {
        label: "Tape Over installation",
        url: "https://www.behance.net/gallery/76109495/TAPE-ART-PORTRAIT-Palina-Rojinski",
      },
    ],
  },
  {
    id: "esprit-future-berlin-2022",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "ESPRIT",
    name: "The Future of ESPRIT Starts Now",
    coverTitle: "Laboratory of Nature",
    category: "Brand Experience",
    summary:
      "A Berlin presentation of ESPRIT’s new creative direction through the immersive Laboratory of Nature.",
    description:
      "ESPRIT presented its new creative direction through the Laboratory of Nature, combining circular-material research, projection environments, screen-printing and live music. Weval performed before a Honey Dijon set.",
    year: 2022,
    month: 10,
    location: "Berlin",
    coverTheme: "violet",
    coverVariant: 1,
    imageAlt: "Original graphic portfolio cover for ESPRIT Laboratory of Nature in Berlin",
    services: ["Brand Experience", "Event Communications", "Guest Relations", "Media Relations"],
    sources: [
      { label: "Production recap", url: "https://www.vmm.eu/en/esprit-global-vip-event-in-berlin/" },
      {
        label: "Getty Images event archive",
        url: "https://www.gettyimages.dk/editorial-images/entertainment/event/esprit-event-in-berlin/775891040",
      },
    ],
  },
  {
    id: "bulgari-bzero1-berlin-2021",
    client: "BVLGARI",
    name: "B.zero1 Rock Chain — Berlin Launch",
    coverTitle: "B.zero1 Rock Chain",
    category: "Launch Communications",
    summary:
      "A BVLGARI cocktail event in Berlin for the B.zero1 Rock Chain collection, with a live performance by UFO361.",
    description:
      "BVLGARI introduced the B.zero1 Rock Chain collection with a cocktail event staged in the future Alhambra concept store. UFO361 performed beneath an oversized B.zero1 ring, with Alexander ‘Ali’ Schwarz of Tiefschwarz DJing.",
    year: 2021,
    month: 11,
    location: "Berlin",
    coverTheme: "gold",
    coverVariant: 2,
    imageAlt: "Original graphic portfolio cover for the BVLGARI B.zero1 Rock Chain launch in Berlin",
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/bulgari-bzero1-berlin-2021/images/cover.png",
        alt: "Oversized BVLGARI B.zero1 ring installation at the Berlin launch",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-01.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-01-poster.jpg",
        alt: "B.zero1 launch installation in motion",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-02.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-02-poster.jpg",
        alt: "Guests inside the BVLGARI launch environment",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/bulgari-bzero1-berlin-2021/images/image-01.png",
        alt: "BVLGARI B.zero1 event installation viewed across the venue",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-03.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-03-poster.jpg",
        alt: "UFO361 performing at the BVLGARI Berlin launch",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-04.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-04-poster.jpg",
        alt: "Live performance and light design at the B.zero1 event",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-05.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-05-poster.jpg",
        alt: "Crowd atmosphere during the BVLGARI cocktail event",
        hero: true,
      },
      {
        type: "video",
        src: "assets/projects/bulgari-bzero1-berlin-2021/videos/video-06.mp4",
        poster: "assets/projects/bulgari-bzero1-berlin-2021/images/video-06-poster.jpg",
        alt: "Late-night moment from the BVLGARI B.zero1 launch",
        hero: true,
      },
    ],
    services: ["Launch Communications", "Event PR", "Talent Relations", "Guest Relations"],
    sources: [
      {
        label: "Vogue Germany event recap",
        url: "https://www.vogue.de/lifestyle/galerie/bulgari-bzero1-cocktailparty-berlin-ufo361",
      },
      { label: "Sleek event report", url: "https://www.sleek-mag.com/article/bulgari-celebrates-b-zero1-in-berlin/" },
    ],
  },
  {
    id: "made-berlin-2022",
    hidden: true, // awaiting confirmed photography — kept in data, not shown
    client: "MADE.COM",
    name: "Berlin Showroom & Never Ordinary",
    coverTitle: "Never Ordinary",
    category: "Design Communications",
    summary:
      "A series of Berlin brand moments spanning the redesigned MADE.COM showroom, a design panel and trend-report storytelling.",
    description:
      "MADE.COM reopened its redesigned 500 m² Berlin showroom and hosted a discussion with Schneid Studio on design, ceramics and sustainable consumption. The Berlin programme later presented six future-home directions through the Never Ordinary Trend Report.",
    year: 2022,
    month: 2,
    location: "Berlin",
    coverTheme: "cobalt",
    coverVariant: 4,
    imageAlt: "Original graphic portfolio cover for MADE.COM Berlin showroom and Never Ordinary programme",
    services: ["Design Communications", "Event PR", "Panel Format", "Trend Storytelling"],
    sources: [
      {
        label: "Cee Cee showroom and panel feature",
        url: "https://ceecee.cc/en/inspiration-rund-ums-thema-interior-wiedereroeffnung-des-showrooms-von-made-com-panel-talk-mit-schneid/",
      },
      {
        label: "Never Ordinary Trend Report",
        url: "https://www.forward-festival.com/article/made-com-launches-never-ordinary-trend-report",
      },
    ],
  },
  {
    id: "ritz-carlton-golden-gala-2019",
    client: "The Ritz-Carlton, Berlin",
    name: "The Golden Gala — Ritz Carlton Re-Opening",
    coverTitle: "The Golden Gala",
    category: "Event Communications",
    summary:
      "The grand reopening celebration for The Ritz-Carlton, Berlin after its extensive Art Deco-inspired refurbishment.",
    description:
      "The Golden Gala marked the reopening of The Ritz-Carlton, Berlin following an extensive refurbishment. Live music, choreography and Art Deco-inspired staging transformed the hotel into a theatrical celebration of its renewed spaces.",
    year: 2019,
    month: 3,
    location: "Berlin",
    coverTheme: "gold",
    coverVariant: 5,
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/cover.jpg",
        alt: "Theatrical staircase performance at The Ritz-Carlton Berlin Golden Gala",
        hero: true,
        size: "lg",
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-01.jpg",
        alt: "Golden Gala performance inside The Ritz-Carlton Berlin",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-02.png",
        alt: "Art Deco-inspired Golden Gala event setting",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-03.png",
        alt: "Guests and live entertainment at The Ritz-Carlton reopening",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-04.png",
        alt: "Golden performance tableau during the grand reopening",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-05.png",
        alt: "The Ritz-Carlton Berlin lobby staged for The Golden Gala",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-06.png",
        alt: "Live musicians performing at The Golden Gala",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-07.png",
        alt: "Art Deco costume and choreography at the reopening celebration",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/ritz-carlton-golden-gala-2019/images/image-08.jpg",
        alt: "Evening atmosphere inside The Ritz-Carlton Berlin",
        hero: true,
      },
    ],
    services: ["Event Communications", "Guest Relations", "Media Relations", "On-site Support"],
    sources: [
      {
        label: "Golden Gala production case",
        url: "https://www.freundevonfreunden.com/work/ritz-carlton-berlins-golden-gala-2019/",
      },
      {
        label: "Hotel refurbishment announcement",
        url: "https://www.hospitalitynet.org/announcement/41002566.html",
      },
    ],
  },
  {
    id: "genius-immersive-pre-opening",
    client: "Borealis Interactive Group",
    name: "GENIUS — Immersive Experience Pre-Opening",
    coverTitle: "Genius",
    category: "Culture Communications",
    summary:
      "The Berlin pre-opening of an interactive reinterpretation of Leonardo da Vinci’s life and ideas.",
    description:
      "The pre-opening introduced an interactive reinterpretation of Leonardo da Vinci through large-scale projections, tracking and augmented-reality elements, an enterable central cube and a 360-degree soundscape.",
    year: 2022,
    month: 1,
    location: "Berlin",
    coverTheme: "night",
    coverVariant: 6,
    mediaAutoplay: 1500,
    media: [
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/cover.jpg",
        alt: "Colourful floor-to-wall projection inside the GENIUS immersive experience",
        hero: true,
        size: "lg",
      },
      {
        type: "video",
        src: "assets/projects/genius-immersive-pre-opening/videos/video-01.mp4",
        poster: "assets/projects/genius-immersive-pre-opening/images/video-01-poster.jpg",
        alt: "Large-scale projections moving through the GENIUS exhibition",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-01.jpg",
        alt: "Visitors surrounded by Leonardo da Vinci-inspired projections",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-02.jpg",
        alt: "Immersive projection environment during the pre-opening",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-03.jpg",
        alt: "Projected artwork spanning the exhibition walls and floor",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-04.jpg",
        alt: "Interactive GENIUS installation with luminous colour and geometry",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-05.jpg",
        alt: "Guest perspective inside the GENIUS 360-degree visual environment",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-06.jpg",
        alt: "Atmospheric projection detail from the GENIUS experience",
        hero: true,
      },
      {
        type: "image",
        src: "assets/projects/genius-immersive-pre-opening/images/image-07.jpg",
        alt: "Pre-opening guests exploring the immersive exhibition",
        hero: true,
      },
    ],
    services: ["Culture Communications", "Pre-opening", "Media Relations", "Guest Relations"],
    sources: [
      { label: "Official producer announcement", url: "https://www.presseportal.de/pm/160718/5101201" },
      { label: "flora&faunavisions case study", url: "https://www.florafaunavisions.de/projects/3763/" },
      {
        label: "Technical production report",
        url: "https://fohonline.com/featured/immersive-tribute-to-leonardo-davincis-genius-in-berlin-gets-sonic-assist-from-db-soundscape/",
      },
    ],
  },
];

/*
 * CLIENTS
 *
 * Logo files are stored locally so the published site does not contact brand
 * websites or third-party CDNs. Campaign names use the parent brand mark plus
 * a short descriptor. If no reliable public logo file was available, the
 * verified brand name is used as a typographic wordmark instead.
 */
const CLIENTS = [
  { name: "L’Oréal Paris", logo: "assets/logos/loreal-paris.svg" },
  {
    name: "L’Oréal Paris — Stand Up",
    logo: "assets/logos/loreal-stand-up-transparent.png",
    logoVariant: "campaign",
  },
  {
    name: "The Maybourne Riviera",
    logo: "assets/logos/maybourne-riviera-wordmark.webp",
    logoVariant: "wide",
  },
  { name: "NEONAIL", logo: "assets/logos/neonail.svg" },
  { name: "DERMADROP", logo: "assets/logos/dermadrop.svg" },
  { name: "EWA HERZOG", logo: "assets/logos/ewa-herzog-wordmark.png" },
  { name: "Domes Resorts", logo: "assets/logos/domes.svg" },
  { name: "Aspria", wordmarkClass: "aspria" },
  {
    name: "Silk’n",
    logo: "assets/logos/silkn-transparent.png",
    logoVariant: "silk",
  },
  { name: "ABOUT YOU", logo: "assets/logos/about-you.svg" },
  {
    name: "Saint Laurent — Liebe ohne Gewalt",
    logo: "assets/logos/saint-laurent.svg",
    descriptor: "Liebe ohne Gewalt",
  },
  { name: "DOG1", logo: "assets/logos/dog1.svg" },
  {
    name: "Tommy Jeans",
    logo: "assets/logos/tommy-jeans-transparent.png",
    logoVariant: "stacked",
  },
  { name: "Furla", logo: "assets/logos/furla.svg", logoVariant: "compact" },
  {
    name: "Lilian von Trapp",
    logo: "assets/logos/lilian-von-trapp-wordmark.png",
    logoVariant: "wide",
  },
  { name: "holy shocolate" },
  { name: "MADE.COM", logo: "assets/logos/made.svg", logoVariant: "compact" },
  {
    name: "Strellson",
    logo: "assets/logos/strellson.svg",
    invertLogo: true,
  },
  {
    name: "Tommy Hilfiger",
    logo: "assets/logos/tommy-hilfiger.svg",
    logoVariant: "wide",
  },
  { name: "MARCEL VON BERLIN" },
  { name: "lala Berlin", logo: "assets/logos/lala-berlin.svg" },
  {
    name: "The Ritz-Carlton",
    logo: "assets/logos/ritz-carlton.svg",
    descriptor: "The Ritz-Carlton",
  },
  { name: "M·A·C Cosmetics", logo: "assets/logos/mac-cosmetics-wiki.png" },
  { name: "Jimmy Choo", logo: "assets/logos/jimmy-choo.svg" },
  { name: "JOOP!", logo: "assets/logos/joop.svg" },
  { name: "DRYKORN", logo: "assets/logos/drykorn.svg", logoVariant: "compact" },
  { name: "BVLGARI", logo: "assets/logos/bulgari.svg" },
  { name: "REPLAY", logo: "assets/logos/replay.svg" },
  {
    name: "Armani beauty",
    logo: "assets/logos/armani-beauty.svg",
    descriptor: "Beauty",
  },
];

window.PORTFOLIO_CONTENT = { site: SITE, projects: PROJECTS, clients: CLIENTS };

// Apply the colour immediately so preview changes are visible even before the
// rest of the page JavaScript has finished loading.
document.documentElement.style.setProperty("--accent", SITE.accentColor);
