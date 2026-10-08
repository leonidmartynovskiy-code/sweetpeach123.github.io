// Core, reusable facts for each Palm Beach County city we target.
// Used by the city hubs and every city×service page so the geographic
// differentiators stay consistent. Facts come from the client's city
// research (neighborhoods, home era, HOA profile) — no invented specifics.

export type Hoa = 'hoa' | 'none' | 'mixed' | 'property-specific';

export interface City {
  slug: string;
  name: string; // "Boca Raton"
  region: 'north' | 'south' | 'west' | 'central';
  neighborhoods: string[]; // real named areas
  homeEra: string; // typical era of the target homes
  hoa: Hoa;
  hoaNote: string; // one sentence on approvals in this city
  permitAuthority: string; // the municipality that pulls the permit
  setting: string; // short descriptor of the local landscape
  blurb: string; // one-liner used on the city hub
}

export const CITIES: City[] = [
  {
    slug: 'boca-raton',
    name: 'Boca Raton',
    region: 'south',
    neighborhoods: ['East Boca', 'Royal Palm Yacht & Country Club', 'Boca Islands', 'Old Floresta'],
    homeEra: '1970s–90s',
    hoa: 'mixed',
    hoaNote:
      'East Boca has plenty of non-HOA streets, while the gated clubs run architectural review — we prepare the submittal either way.',
    permitAuthority: 'the City of Boca Raton',
    setting: 'ocean-side and canal-front lots',
    blurb:
      "One of South Florida's most established addresses — much of East Boca was built in the 1970s–90s, and those original driveways and decks are ready for a refresh.",
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    region: 'north',
    neighborhoods: ['Admirals Cove', 'Jupiter Inlet Colony', 'Loxahatchee Club', 'Abacoa'],
    homeEra: '1990s–2000s',
    hoa: 'hoa',
    hoaNote:
      'Most of Jupiter sits inside gated golf and waterfront communities, so the architectural review board (ARB) approval matters — we handle that package.',
    permitAuthority: 'the Town of Jupiter',
    setting: 'waterfront and golf-course communities',
    blurb:
      'An affluent stretch of the north, full of 1990s–2000s waterfront and golf-community homes with yards ready to be reimagined.',
  },
  {
    slug: 'palm-beach-gardens',
    name: 'Palm Beach Gardens',
    region: 'north',
    neighborhoods: ['PGA National', 'BallenIsles', "Frenchman's Creek", 'Mirasol'],
    homeEra: '1990s–2000s',
    hoa: 'hoa',
    hoaNote:
      'The golf communities here run strict design guidelines — colors and patterns often need to match the community palette, which we build into the plan.',
    permitAuthority: 'the City of Palm Beach Gardens',
    setting: 'gated golf communities',
    blurb:
      'Golf-community homes from the 1990s–2000s whose yards have reached the age where the whole hardscape is ready for a refresh.',
  },
  {
    slug: 'wellington',
    name: 'Wellington',
    region: 'west',
    neighborhoods: ['Palm Beach Point', 'Aero Club', 'Grand Prix Village', 'Southfields'],
    homeEra: '1990s–2010s',
    hoa: 'mixed',
    hoaNote:
      'Many equestrian neighborhoods are non-HOA acreage, though the equestrian villages have their own rules — we confirm before we design.',
    permitAuthority: 'the Village of Wellington',
    setting: 'large equestrian estates',
    blurb:
      'Equestrian estates on acreage — long driveways, big aprons and heavy trailer loads make for some of the largest hardscape projects we build.',
  },
  {
    slug: 'west-palm-beach',
    name: 'West Palm Beach',
    region: 'central',
    neighborhoods: ['El Cid', 'SoSo (South of Southern)', 'Flamingo Park', 'Prospect Park'],
    homeEra: '1920s–40s',
    hoa: 'property-specific',
    hoaNote:
      'Check the property address, proposed work and any association rules before choosing a design. Historic status and the scope of exterior changes determine whether additional city review applies.',
    permitAuthority: 'the City of West Palm Beach',
    setting: 'historic in-town neighborhoods',
    blurb:
      "Historic homes in El Cid, SoSo and Flamingo Park — some of West Palm Beach's most sought-after, character-rich in-town streets.",
  },
  {
    slug: 'delray-beach',
    name: 'Delray Beach',
    region: 'south',
    neighborhoods: ['Lake Ida', 'Beach District', 'Tropic Isle', 'Del-Ida Park'],
    homeEra: '1950s–80s',
    hoa: 'property-specific',
    hoaNote:
      'Check the property address and proposed work with the city, including historic designation and any association rules. An address near Lake Ida or the beach does not establish which approvals apply.',
    permitAuthority: 'the City of Delray Beach',
    setting: 'coastal east-side neighborhoods',
    blurb:
      'The east side around Lake Ida and the beach is a world of its own — established, character-filled homes just minutes from the water.',
  },
  {
    slug: 'boynton-beach',
    name: 'Boynton Beach',
    region: 'south',
    neighborhoods: ['Intracoastal waterfront', 'Chapel Hill', 'Harbor Estates', 'Lake Eden'],
    homeEra: '1960s–90s',
    hoa: 'mixed',
    hoaNote:
      'It is a mix — waterfront pockets are often non-HOA, while newer communities run an HOA; we handle whichever applies to your street.',
    permitAuthority: 'the City of Boynton Beach',
    setting: 'Intracoastal and eastern neighborhoods',
    blurb:
      "Waterfront homes along the Intracoastal and Boynton's established eastern neighborhoods, many with original driveways ready for an upgrade.",
  },
];

export const cityBySlug = (slug: string) => CITIES.find((c) => c.slug === slug);
