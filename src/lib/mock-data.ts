import { Game, Devlog, SkillCategory, TimelineMilestone, ContactMessage } from '@/types';

export const MOCK_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Loop Forest',
    slug: 'loop-forest',
    short_description: 'An atmospheric horror experience built around exploration, isolation, and an ever-changing forest.',
    description: `Loop Forest is a deeply atmospheric psychological horror game where time and space bend inside an eerie, repeating pine forest. 

Players navigate through surreal environments where every step forward might loop back to where they started — but with haunting anomalies. Armed only with a flickering lantern and audio recorder, you must decode the forest's dark secrets before the fog consumes you completely.

Built using Unreal Engine 5's Lumen global illumination and Nanite virtualized geometry, Loop Forest delivers photorealistic visuals, hyper-immersive spatial audio, and dynamic environmental procedural shifts that ensure no two runs feel identical.`,
    genre: 'Psychological Horror',
    engine: 'Unreal Engine 5',
    status: 'In Development',
    release_date: 'Q4 2026',
    featured: true,
    cover_image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80',
    hero_image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    steam_url: 'https://store.steampowered.com',
    itch_url: 'https://rohanzstudios.itch.io/loop-forest',
    github_url: 'https://github.com/rohanzstudios/loop-forest-dev',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    images: [
      {
        id: 'img-1',
        game_id: 'game-1',
        image_url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Atmospheric mist and dynamic Lumen lighting in the dense forest core.',
        sort_order: 1
      },
      {
        id: 'img-2',
        game_id: 'game-1',
        image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        caption: 'The mysterious looping watchtower under moonlight.',
        sort_order: 2
      },
      {
        id: 'img-3',
        game_id: 'game-1',
        image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
        caption: 'Procedural anomaly zone with distorted spatial geometry.',
        sort_order: 3
      },
      {
        id: 'img-4',
        game_id: 'game-1',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Diegetic lantern UI and spatial audio frequency scanner.',
        sort_order: 4
      }
    ],
    features: [
      { id: 'f-1', game_id: 'game-1', title: 'Non-Euclidean Loop Mechanics', description: 'Environments warp seamlessly around camera angles, creating disorientation and mind-bending puzzle pathways.', sort_order: 1 },
      { id: 'f-2', game_id: 'game-1', title: 'Dynamic Atmospheric Audio', description: 'Full 3D spatial acoustics with real-time echo propagation and psychological audio hallucination triggers.', sort_order: 2 },
      { id: 'f-3', game_id: 'game-1', title: 'Lumen & Nanite Graphics', description: 'Next-gen real-time raytraced lighting and dense foliage density rendered at smooth frame rates.', sort_order: 3 },
      { id: 'f-4', game_id: 'game-1', title: 'Diegetic Interface', description: 'Minimalist HUD-free gameplay using in-world instruments, compass readings, and physical journal notes.', sort_order: 4 }
    ],
    technologies: [
      { id: 't-1', game_id: 'game-1', technology: 'Unreal Engine 5', sort_order: 1 },
      { id: 't-2', game_id: 'game-1', technology: 'C++', sort_order: 2 },
      { id: 't-3', game_id: 'game-1', technology: 'Blueprints', sort_order: 3 },
      { id: 't-4', game_id: 'game-1', technology: 'HLSL Shaders', sort_order: 4 },
      { id: 't-5', game_id: 'game-1', technology: 'Blender 3D', sort_order: 5 },
      { id: 't-6', game_id: 'game-1', technology: 'FMOD Spatial Audio', sort_order: 6 }
    ]
  },
  {
    id: 'game-2',
    title: 'Boulder Escape',
    slug: 'boulder-escape',
    short_description: 'A fast-paced endless runner focused on reaction, movement physics, and high-octane survival.',
    description: `Boulder Escape is a physics-driven, high-speed action endless runner where players sprint down collapsing mountain temples while evading giant rolling boulders, crumbling platforms, and ancient traps.

With fluid physics-based movement, wall-running, grappling hooks, and procedural obstacle generation, Boulder Escape challenges players to master twitch reflexes and momentum mechanics.

Originally built as a rapid gameplay prototype in Unity, the game has evolved into a polished arcade challenge featuring leaderboard integration, custom stylized shaders, and dynamic synthwave-boosted sound design.`,
    genre: 'Endless Runner / Action',
    engine: 'Unity',
    status: 'Prototype',
    release_date: 'Q3 2025',
    featured: true,
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    hero_image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
    itch_url: 'https://rohanzstudios.itch.io/boulder-escape',
    github_url: 'https://github.com/rohanzstudios/boulder-escape-unity',
    created_at: '2025-11-10T00:00:00Z',
    updated_at: '2026-06-20T00:00:00Z',
    images: [
      {
        id: 'img-5',
        game_id: 'game-2',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-velocity temple escape run with dynamic camera tilt.',
        sort_order: 1
      },
      {
        id: 'img-6',
        game_id: 'game-2',
        image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
        caption: 'Grappling mechanics across collapsing lava chasms.',
        sort_order: 2
      }
    ],
    features: [
      { id: 'f-5', game_id: 'game-2', title: 'Precision Momentum Physics', description: 'Intuitive acceleration, slope velocity bonuses, and wall-run chaining mechanics.', sort_order: 1 },
      { id: 'f-6', game_id: 'game-2', title: 'Procedural Trap Generation', description: 'Endlessly variation algorithm that crafts unpredictable obstacle sequences.', sort_order: 2 },
      { id: 'f-7', game_id: 'game-2', title: 'Stylized Cell Shader Engine', description: 'Custom written Unity URP shaders giving a distinct comic-book arcade look.', sort_order: 3 }
    ],
    technologies: [
      { id: 't-7', game_id: 'game-2', technology: 'Unity 2022 / 6', sort_order: 1 },
      { id: 't-8', game_id: 'game-2', technology: 'C#', sort_order: 2 },
      { id: 't-9', game_id: 'game-2', technology: 'Shader Graph', sort_order: 3 },
      { id: 't-10', game_id: 'game-2', technology: 'Cinemachine', sort_order: 4 }
    ]
  },
  {
    id: 'game-3',
    title: 'Cyber Nexus 2088',
    slug: 'cyber-nexus-2088',
    short_description: 'Sci-fi cyberpunk drone tactical shooter featuring hacking mechanics and neon lit vertical cityscapes.',
    description: `Cyber Nexus 2088 is a tactical third-person sci-fi game set in a dystopian futuristic metropolis. Command stealth drones, hijack enemy security networks, and execute precision tactical strikes in high-density vertical city sectors.`,
    genre: 'Sci-Fi Action / Tactics',
    engine: 'Unreal Engine 5',
    status: 'Alpha',
    release_date: '2027',
    featured: false,
    cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    hero_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    github_url: 'https://github.com/rohanzstudios/cyber-nexus-proto',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-07-15T00:00:00Z',
    images: [
      { id: 'img-7', game_id: 'game-3', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', caption: 'Neon lit cityscape aerial surveillance.', sort_order: 1 }
    ],
    features: [
      { id: 'f-8', game_id: 'game-3', title: 'Hacking Matrix Interface', description: 'Seamlessly switch control between stealth protagonist and combat drones.', sort_order: 1 }
    ],
    technologies: [
      { id: 't-11', game_id: 'game-3', technology: 'Unreal Engine 5', sort_order: 1 },
      { id: 't-12', game_id: 'game-3', technology: 'C++', sort_order: 2 }
    ]
  }
];

export const MOCK_DEVLOGS: Devlog[] = [
  {
    id: 'log-1',
    title: 'Building Non-Euclidean Spatial Loops in Unreal Engine 5',
    slug: 'building-non-euclidean-spatial-loops-ue5',
    excerpt: 'How we engineered seamless portal rendering and seamless spatial teleportation inside Loop Forest without player jitter.',
    content: `In horror game design, disrupting spatial geometry is one of the most potent tools for creating psychological unease. For **Loop Forest**, we wanted players to walk down a straight trail and unknowingly arrive back at the same watchtower — except the scenery around them has subtly altered.

### The Technical Challenge
Traditional level loading or simple position resets cause noticeable frame hitches, audio pops, or visual pops. We needed seamless geometry redirection using rendering portals and dynamic actor transformation matrices.

### Our Solution
1. **Stencil Buffer Portals**: We utilize custom render targets and stencil buffer masking to draw the destination space inside the portal frame before the player passes through.
2. **Seamless Relocation Triggers**: As the player's camera crosses the portal plane, we recalculate camera world position and momentum vectors instantly in C++, transferring player character state cleanly across coordinate spaces.
3. **Lumen Global Illumination Synchronization**: Lumen light caches are pre-warmed for both portal sides to avoid sudden lighting recalculation flickers.

The result is a mind-bending illusion where space wraps around itself with zero loading screens or stutter!`,
    cover_image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80',
    category: 'Architecture',
    published: true,
    published_at: '2026-07-28T00:00:00Z'
  },
  {
    id: 'log-2',
    title: 'Designing Fluid Physics Movement in Unity for Boulder Escape',
    slug: 'designing-fluid-physics-movement-unity',
    excerpt: 'Deep dive into momentum curves, wall-running math, and responsiveness tuning for fast arcade runner games.',
    content: `Movement in fast-paced arcade games can make or break player satisfaction. When developing **Boulder Escape**, our goal was to combine the precision of speedrunning platformers with the dynamic chaotic physics of a giant boulder rolling right behind you.

### Key Principles
* **Instant Directional Control**: Pure rigid body physics often feel "heavy" or unresponsive. We implemented custom velocity force overrides during airborne maneuvers.
* **Coyote Time & Jump Buffering**: Allowing a 150ms buffer window for jump inputs makes platforming feel forgiving and buttery smooth.
* **Camera Shake & Dynamic FOV**: Field of view scales dynamically with velocity vector magnitude, creating a tactile sensation of speed.`,
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    category: 'Mechanics',
    published: true,
    published_at: '2026-06-14T00:00:00Z'
  },
  {
    id: 'log-3',
    title: 'Custom Atmospheric Fog & Volumetric Lighting HLSL Shaders',
    slug: 'custom-atmospheric-fog-volumetric-shaders',
    excerpt: 'Writing lightweight volumetric raymarching HLSL shaders for immersive game environments.',
    content: `Atmosphere is everything in game environments. In this devlog, we break down our custom GLSL/HLSL raymarching fog shader designed to render localized mist clusters without killing GPU frame budgets.`,
    cover_image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Shader',
    published: true,
    published_at: '2026-05-02T00:00:00Z'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'GAME ENGINES',
    skills: [
      { name: 'Unreal Engine 5', level: 'Expert', description: 'Nanite, Lumen, C++, Blueprints, Chaos Physics, Niagara VFX, World Partition' },
      { name: 'Unity 3D', level: 'Advanced', description: 'C#, URP/HDRP, Shader Graph, Cinemachine, Input System, Addressables' },
      { name: 'Custom C++ Engines', level: 'Intermediate', description: 'OpenGL, DirectX 12, WebGL, Vulkan fundamentals, Math & Collision engines' }
    ]
  },
  {
    title: 'PROGRAMMING & SYSTEMS',
    skills: [
      { name: 'C++', level: 'Advanced', description: 'Memory management, OOP, templates, multi-threading, Unreal Engine API' },
      { name: 'C#', level: 'Advanced', description: 'Unity scripting, async/await, LINQ, design patterns, architecture' },
      { name: 'TypeScript / React / Next.js', level: 'Expert', description: 'Modern web stack, full-stack web applications, UI design systems' },
      { name: 'GLSL / HLSL Shaders', level: 'Intermediate', description: 'Vertex & fragment shaders, post-processing, custom lighting models' }
    ]
  },
  {
    title: '3D ART & ANIMATION',
    skills: [
      { name: 'Blender 3D', level: 'Advanced', description: 'Hard surface modeling, environment design, UV unwrapping, rigging, low-poly' },
      { name: 'Substance Painter', level: 'Intermediate', description: 'PBR texture baking, roughness/metalness workflows, wear & tear maps' },
      { name: 'Three.js / React Three Fiber', level: 'Expert', description: 'Interactive web 3D graphics, custom geometry, shader materials, lighting' }
    ]
  },
  {
    title: 'TOOLS & PIPELINES',
    skills: [
      { name: 'Git / GitHub / Perforce', level: 'Expert', description: 'Version control for large binary game repos, branching strategies' },
      { name: 'FMOD / Wwise Audio', level: 'Intermediate', description: 'Adaptive spatial audio integration, parameter triggers, event routing' },
      { name: 'DaVinci Resolve & Premiere', level: 'Advanced', description: 'Cinematic game trailer editing, color grading, sound design compilation' }
    ]
  }
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: '2023',
    title: 'First Step into Game Development',
    subtitle: 'Hobbyist Beginnings & C++ Fundamentals',
    description: 'Began exploring core game mathematics, 3D vector physics, and building initial C++ console engines and OpenGL graphic experiments.',
    tag: 'Foundation'
  },
  {
    year: '2024',
    title: 'Learning Unity & Rapid Prototyping',
    subtitle: 'Mechanics & Game Jams',
    description: 'Dived deep into Unity C# development, participating in game jams and creating physics-driven prototypes, including early builds of Boulder Escape.',
    tag: 'Unity'
  },
  {
    year: '2025',
    title: 'Unreal Engine 5 & High-Fidelity 3D',
    subtitle: 'Lumen, Nanite & C++ Systems',
    description: 'Transitioned to Unreal Engine 5. Focused on photorealistic atmospheric environments, custom shader development, and narrative design.',
    tag: 'Unreal Engine 5'
  },
  {
    year: '2026',
    title: 'Building Loop Forest & Studio Founding',
    subtitle: 'Rohanz Studios Official Identity',
    description: 'Established Rohanz Studios to showcase indie game projects, devlogs, and push the boundaries of immersive 3D interactive experiences.',
    tag: 'Rohanz Studios'
  }
];

export const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Alex Vance',
    email: 'alex@indiegamedesign.com',
    message: 'Hey Rohan, saw your Loop Forest portal devlog! Absolutely incredible work on the stencil portal math. Would love to connect regarding a game audio collaboration.',
    created_at: '2026-08-10T14:20:00Z',
    status: 'unread'
  },
  {
    id: 'msg-2',
    name: 'Sarah Connor',
    email: 'sarah@cybertechgames.io',
    message: 'Greetings from CyberTech Games! We are interested in discussing contract work for Unreal Engine 5 optimization and shaders.',
    created_at: '2026-08-05T09:15:00Z',
    status: 'read'
  }
];
