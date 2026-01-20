export const showCaseProjects = [
  {
    title: "Cafe WebPage",
    website_prompt:
      "Please generate a beautiful, realistic landing page for a service that provides the ultimate coffee enthusiast a $200/month subscription that provides equipment rental and coaching for coffee roasting and creating the ultimate espresso. The target audience is a bay area middle-aged person who might work in tech and is educated, has disposable income, and is passionate about the art and science of coffee. Optimize for conversion for a 6 month signup.",
    link: " https://15-1768179859774.vercel.app/",
    previewImage:
      "https://ik.imagekit.io/yga9zy0ujk/Screenshot%202026-01-12%20at%2010.05.36%E2%80%AFAM.png",
  },
  {
    title: "AlphaQubit WebPage",
    website_prompt: `Create a premium, single-file scientific landing page for the AlphaQubit research paper (Nature 2024) using the provided HTML/CDN template.
                    Technical Requirements:
                    Immersive Hero: Use Vanta.net (configured with THREE) for a deep-charcoal and gold (#C5A059) quantum network background. Initialize Typed.js for a dynamic sub-headline about 'AI-driven error correction'.
                    Smooth Experience: Implement Lenis for momentum scrolling and AOS (Animate On Scroll) for elegant fade-in-up transitions on all text blocks.
                    Interactive Science:
                    Build a Surface Code Grid using Vanilla JS and Tailwind. Clicking 'Data Qubits' (circles) must toggle their state and programmatically highlight 'Stabilizer' (squares) based on parity logic.
                    Apply Vanilla-Tilt to the Author cards for a premium 3D hover effect.
                    UI/UX: Use Lucide-React icons for navigation and Flowbite for a sticky glassmorphism navbar and a responsive footer.
                    Visual Language: Use the 'Nobel Gold' (#C5A059) and Stone White palette. Use Playfair Display for headers and Inter for body text.
                    Structure: Hero Section -> The Noise Barrier (Intro) -> Interactive Decoder Diagram -> Performance Comparison Bar Chart -> The Research Team (Tilt Cards).
                    `,
    link: "https://34-1768183034167.vercel.app/",
    previewImage:
      "https://ik.imagekit.io/yga9zy0ujk/Screenshot%202026-01-12%20at%2010.02.28%E2%80%AFAM.png",
  },
  {
    title: "Solar System Explorer",
    website_prompt: `Create a single-page app in a single HTML file with the following requirements:
- Name: Solar System Explorer
- Goal: Visualize planets orbiting the sun.
- Features: Click planets for info, orbit speed control, and, drag to rotate, zoom in/out.
- The UI should be dark-themed and interactive.
`,
    link: "https://af-1768903745646.vercel.app/",
    previewImage: "https://ik.imagekit.io/yga9zy0ujk/image.png",
  },
  {
    title: "Stack Game",
    website_prompt: `Create a dark-themed, immersive web game experience titled "AI Generator Stack".
                    Design Style:
                    * Background: Use a radial gradient from dark violet (#1a1a24) to pure black.
                    * Font: Use 'Inter' or a similar sans-serif font.
                    * Theme: Cyberpunk/Minimalist with a "Code Generation" aesthetic.
                    Layout Requirements:
                    * Hero Section: This must be a full-screen (100vh) container housing a functional HTML5 Canvas game.
                    * UI Overlay: Inside the hero, include absolute-positioned elements for a "Status" header (h1: STATUS, h2: GENERATING CODE...), a large central Score counter (opacity 0.1), and a bottom "Loader Bar" with a pink-to-blue gradient.
                    * Navbar/Footer: Keep them minimal and dark to blend with the game background.
                    Game Logic (JavaScript):
                    * Implement a "Stack" game logic using requestAnimationFrame and a <canvas> element.
                    * Classes: Create a Block class (slides left/right) and a Debris class (falls with gravity when sliced).
                    * Mechanics:
                        1. Blocks spawn and move back and forth.
                        2. On click or Spacebar, the block stops.
                        3. Calculate overlap with the previous block.
                        4. Crucial: "Slice" the block—reduce its width to the overlap size and spawn a Debris particle for the excess part that falls off.
                        5. If missed completely, Game Over.
                        6. Camera should pan down as the stack grows.
                        7. Block colors should cycle through HSL hues.
                    Interactive Elements:
                    * Add a "Restart" button that appears only on Game Over.
                    * Add a simulated progress bar at the bottom that fills up slowly.
                    Technical Constraints:
                    * Use Tailwind for the UI overlay positioning.
                    * Embed the game logic in a <script> tag within the body.`,
    link: "https://dc-1768184100340.vercel.app/",
    previewImage:
      "https://ik.imagekit.io/yga9zy0ujk/Screenshot%202026-01-12%20at%2010.04.05%E2%80%AFAM.png",
  },
  {
    title: "Customer Journey Flow",
    website_prompt: `Create a single-page app in a single HTML file with the following requirements:
- Name: Customer Journey Flow
- Goal: Visualize a customer’s steps from awareness to purchase.
- Features: Editable stages, drag-and-drop connections.
- The UI should be clean and diagram-like.`,
    link: "https://54-1768906756381.vercel.app/",
    previewImage:
      "https://ik.imagekit.io/yga9zy0ujk/flow.png?updatedAt=1768907760841",
  },
  {
    title: "Academy WebPage",
    website_prompt:
      "Create a single-page app in a single HTML file with the following requirements: - Name: Online Academy - Goal: Promote a variety of online courses; coding, design, marketing, etc. - Features: Course syllabus, instructor bio, enrollment form. - The UI should be learning-focused with bright accents.",
    link: "https://e7-1768151552132.vercel.app/",
    previewImage:
      "https://ik.imagekit.io/yga9zy0ujk/Screenshot%202026-01-12%20at%2010.01.19%E2%80%AFAM.png",
  },
];
