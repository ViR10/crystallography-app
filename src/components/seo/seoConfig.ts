export const BASE_URL = 'https://crystallography.netlify.app';

export const CREATOR_ORG = {
  '@type': 'Organization',
  name: 'ViR Developers',
  url: 'https://virdevelopers.netlify.app',
  sameAs: [
    'https://github.com/ViR10',
    'https://virdevelopers.netlify.app'
  ]
};

export const CREATOR_PERSON = {
  '@type': 'Person',
  name: 'Adeel Shahid',
  jobTitle: 'Lead Platform Architect & Software Engineer',
  url: 'https://adeelshahid.netlify.app',
  sameAs: [
    'https://github.com/ViR10',
    'https://www.linkedin.com/in/adeel0014',
    'https://adeelshahid.netlify.app'
  ]
};

export const seoData = {
  home: {
    title: 'Crystallography — Learn Miller Indices, Crystal Planes & Directions in 3D',
    description: 'Master crystallography and Miller indices with interactive 3D unit cells. Explore crystallographic directions [uvw], crystal planes (hkl), and practice with 300+ problems.',
    canonical: `${BASE_URL}/`,
    keywords: 'crystallography, Miller indices, crystal planes, crystallographic directions, unit cell, materials science education, Simple Cubic, XRD analysis, Bragg law, metallurgical engineering',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          url: BASE_URL,
          name: 'CrystalloGraphy',
          description: 'Interactive 3D Crystallographic Learning Platform for Materials Science and Metallurgy',
          publisher: CREATOR_ORG
        },
        {
          '@type': 'WebApplication',
          '@id': `${BASE_URL}/#webapp`,
          name: 'CrystalloGraphy Interactive Platform',
          url: BASE_URL,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Any (Desktop & Mobile Browser)',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          author: CREATOR_PERSON,
          publisher: CREATOR_ORG
        }
      ]
    }
  },

  fundamentals: {
    title: 'Crystallography Fundamentals — Unit Cells, Crystal Lattices & 3D Coordinates',
    description: 'Learn the fundamentals of crystallography: crystal lattices, unit cell geometry, Simple Cubic (SC) corner atoms, coordination numbers, and 3D coordinate frames.',
    canonical: `${BASE_URL}/learn/fundamentals`,
    keywords: 'crystallography fundamentals, crystal lattice, unit cell, simple cubic, coordination number, atomic packing factor, cubic crystal structures, materials science',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/dashboard` },
            { '@type': 'ListItem', position: 3, name: 'Fundamentals', item: `${BASE_URL}/learn/fundamentals` }
          ]
        },
        {
          '@type': 'Course',
          name: 'Crystallography Fundamentals: Lattices, Unit Cells & Symmetry',
          description: 'Comprehensive introduction to crystal lattices, unit cell definitions, corner atom sharing, coordination number, and Cartesian coordinate reference frames in metallurgy.',
          provider: CREATOR_ORG
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is a crystal lattice in materials science?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A crystal lattice is an infinite, periodic, three-dimensional array of geometric points in space where every lattice point possesses identical physical and atomic surroundings.'
              }
            },
            {
              '@type': 'Question',
              name: 'What is a unit cell in crystallography?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A unit cell is the smallest repeating structural volume of a crystal lattice that retains the full symmetry, geometry, and chemical stoichiometry of the entire crystal structure.'
              }
            },
            {
              '@type': 'Question',
              name: 'How many atoms are in a Simple Cubic (SC) unit cell?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A Simple Cubic (SC) unit cell contains exactly 1 net atom. It has 8 corner atoms, and each corner atom is shared equally among 8 adjacent unit cells (8 × 1/8 = 1 atom).'
              }
            }
          ]
        }
      ]
    }
  },

  millerIndices: {
    title: 'Miller Indices for Directions [uvw] — Step-by-Step Vector Tracing Guide',
    description: 'Complete guide to Miller indices for crystallographic directions [uvw]. Learn vector coordinates, bracket notation, origin shifts for negative indices, and direction families.',
    canonical: `${BASE_URL}/learn/miller-indices`,
    keywords: 'Miller indices directions, [uvw] notation, directional vectors, origin shift crystallography, negative indices overbar, direction families <uvw>, materials engineering',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/dashboard` },
            { '@type': 'ListItem', position: 3, name: 'Directions [uvw]', item: `${BASE_URL}/learn/miller-indices` }
          ]
        },
        {
          '@type': 'Course',
          name: 'Mastering Crystallographic Directions [uvw] and Vector Notation',
          description: 'Detailed curriculum covering vector coordinates, bracket syntax, origin shifting rules for negative indices, and direction families in cubic crystal systems.',
          provider: CREATOR_ORG
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What are Miller indices for crystallographic directions [uvw]?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Miller indices for directions are a triplet of reduced integers enclosed in square brackets [uvw] representing the directional vector connecting a reference origin to point (u, v, w) in terms of unit cell lattice parameters.'
              }
            },
            {
              '@type': 'Question',
              name: 'How do negative coordinates work in crystallographic directions?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Negative indices are written with an overbar above the integer (e.g., [1̄10]). Whenever a vector points along a negative axis, the reference coordinate origin is shifted to a positive corner of the unit cell so the vector remains fully contained inside the unit cell volume.'
              }
            },
            {
              '@type': 'Question',
              name: 'What is the difference between [uvw] and <uvw>?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Square brackets [uvw] denote one specific crystallographic direction vector, whereas angle brackets <uvw> denote an entire family of symmetry-equivalent directions (e.g., <100> includes [100], [010], [001], [1̄00], [01̄0], and [001̄]).'
              }
            }
          ]
        }
      ]
    }
  },

  crystalPlanes: {
    title: 'Crystal Planes (hkl) — Calculating Miller Indices from Intercepts',
    description: 'Learn how to calculate Miller indices for crystal planes (hkl). Master axial intercepts, reciprocal space inversion, clearing fractions, and planes parallel to axes.',
    canonical: `${BASE_URL}/learn/crystal-planes`,
    keywords: 'crystal planes, Miller indices planes, (hkl) notation, plane intercepts, reciprocal space, clearing fractions, plane families {hkl}, (100) (110) (111) planes, XRD indexing',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/dashboard` },
            { '@type': 'ListItem', position: 3, name: 'Planes (hkl)', item: `${BASE_URL}/learn/crystal-planes` }
          ]
        },
        {
          '@type': 'Course',
          name: 'Crystal Planes (hkl): Intercepts, Reciprocals & Planar Density',
          description: 'Step-by-step masterclass on calculating Miller indices for planes, intercept reciprocal inversion, handling parallel axes (infinity), and identifying {100}, {110}, and {111} families.',
          provider: CREATOR_ORG
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do you calculate Miller indices (hkl) for a crystal plane?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: '1. Find the intercepts of the plane with the x, y, and z axes in unit cell units (p, q, r). 2. Take the reciprocal of each intercept (1/p, 1/q, 1/r). 3. Clear fractions by multiplying by the least common multiple (LCM). 4. Enclose the resulting integers in round parentheses (hkl).'
              }
            },
            {
              '@type': 'Question',
              name: 'What does an index of 0 mean in crystal planes (hkl)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'An index of 0 means the plane is parallel to that crystallographic axis and intercepts it at infinity (since 1/∞ = 0). For example, the (100) plane is parallel to both the y and z axes.'
              }
            },
            {
              '@type': 'Question',
              name: 'What does the (111) plane represent in a cubic crystal?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The (111) plane intercepts all three axes at unit length (1, 1, 1). In cubic systems, it forms an equilateral triangular cut across the unit cell and is the closest-packed octahedral plane.'
              }
            }
          ]
        }
      ]
    }
  },

  practice: {
    title: 'Crystallography Practice Arena — 300+ Miller Indices Problems & Quizzes',
    description: 'Test your crystallography skills with 300+ randomized practice problems, Blitz time-attack mode, and Boss Battles for directions [uvw] and crystal planes (hkl).',
    canonical: `${BASE_URL}/practice`,
    keywords: 'Miller indices practice, crystallography practice problems, crystal planes quiz, crystallography test, Blitz mode crystallography, materials science exam prep',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Practice Arena', item: `${BASE_URL}/practice` }
          ]
        },
        {
          '@type': 'WebApplication',
          name: 'Crystallography Practice Arena',
          description: 'Gamified quiz and problem-solving engine with 300+ crystallography questions, Blitz timers, and Boss endurance battles.',
          url: `${BASE_URL}/practice`,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Any'
        }
      ]
    }
  },

  guidedDirections: {
    title: 'Guided Miller Indices Practice — Step-by-Step Direction Vector Calculator',
    description: 'Step-by-step assisted problem solving for crystallographic directions [uvw]. Input coordinates with real-time verification and 3D vector feedback.',
    canonical: `${BASE_URL}/practice/guided`,
    keywords: 'guided Miller indices practice, step by step direction vector, crystallographic directions calculator, [uvw] practice tool',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Practice', item: `${BASE_URL}/practice` },
            { '@type': 'ListItem', position: 3, name: 'Guided Directions', item: `${BASE_URL}/practice/guided` }
          ]
        }
      ]
    }
  },

  guidedPlanes: {
    title: 'Guided Crystal Planes Practice — Step-by-Step (hkl) Intercept Solver',
    description: 'Assisted step-by-step problem solver for crystal planes (hkl). Calculate intercepts, find reciprocals, clear fractions, and plot 3D planar cuts.',
    canonical: `${BASE_URL}/practice/planes-guided`,
    keywords: 'guided crystal planes practice, (hkl) intercept solver, reciprocal calculator crystallography, crystal plane step by step',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Practice', item: `${BASE_URL}/practice` },
            { '@type': 'ListItem', position: 3, name: 'Guided Planes', item: `${BASE_URL}/practice/planes-guided` }
          ]
        }
      ]
    }
  },

  sandbox: {
    title: '3D Crystallography Visualizer & Sandbox — Plot (hkl) Planes & [uvw] Vectors',
    description: 'Free interactive 3D crystallography sandbox. Orbit-rotate unit cells, test custom (hkl) planes and [uvw] vectors, and inspect crystallographic orientations.',
    canonical: `${BASE_URL}/sandbox`,
    keywords: 'crystallography 3D visualizer, Miller indices sandbox, unit cell simulator, 3D crystal plane viewer, interactive crystallography CAD',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: '3D Sandbox', item: `${BASE_URL}/sandbox` }
          ]
        },
        {
          '@type': 'WebApplication',
          name: '3D Crystallography Expert Sandbox',
          description: 'Freeform rotatable 3D unit cell simulation sandbox for custom Miller indices planes (hkl) and direction vectors [uvw].',
          url: `${BASE_URL}/sandbox`,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Any'
        }
      ]
    }
  },

  mastery: {
    title: 'Crystallography Mastery Credential & Final Capstone Assessment',
    description: 'Earn your Crystallography Mastery Certificate. Complete the capstone exam covering unit cells, directional vectors, and crystal planes.',
    canonical: `${BASE_URL}/mastery`,
    keywords: 'crystallography mastery certificate, materials engineering credential, crystallography exam certification, Miller indices badge',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Mastery Credential', item: `${BASE_URL}/mastery` }
          ]
        }
      ]
    }
  },

  about: {
    title: 'About CrystalloGraphy — Educational Mission, Team & Technology',
    description: 'Discover the mission behind CrystalloGraphy. Built by Adeel Shahid and ViR Developers to make materials science and crystallography intuitive and accessible.',
    canonical: `${BASE_URL}/about`,
    keywords: 'about CrystalloGraphy, ViR Developers, Adeel Shahid portfolio, materials science educational software, crystallography collective',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: `${BASE_URL}/about` }
          ]
        },
        {
          '@type': 'AboutPage',
          name: 'About CrystalloGraphy and ViR Developers',
          description: 'Educational mission, technical architecture, and creator profiles for the CrystalloGraphy interactive learning platform.',
          url: `${BASE_URL}/about`,
          publisher: CREATOR_ORG,
          author: CREATOR_PERSON
        }
      ]
    }
  },

  dashboard: {
    title: 'Student Dashboard — My Crystallography Learning Progress',
    description: 'Personalized crystallography student dashboard. Resume curriculum tracks, view level progression, and track arena accuracy.',
    canonical: `${BASE_URL}/dashboard`,
    robots: 'noindex, nofollow'
  }
};
