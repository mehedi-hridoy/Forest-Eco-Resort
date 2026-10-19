# FOREST ECO RESORT
## Master Website & Admin Panel Development Prompt

**Project type:** Premium eco-resort, hospitality, destination development, and villa ownership website  
**Location:** Bhabanipur, Rajendrapur, Gazipur, Bangladesh  
**Reference website:** https://sandylandbd.com/  
**Frontend:** Next.js, TypeScript  
**Backend:** Node.js, Express.js, TypeScript  
**Database:** PostgreSQL preferred for production; SQLite acceptable for local development  
**Admin panel:** Custom authenticated CMS and lead management dashboard  
**Primary objective:** Build a complete, responsive, immersive, conversion-focused website with a functional backend and comprehensive admin panel.

---

# PART 1 — ROLE, OBJECTIVE & PROJECT PHILOSOPHY

You are a senior product designer, creative director, UX architect, full-stack engineer, animation specialist, database architect, security engineer, and QA lead working together to deliver the complete digital platform for Forest Eco Resort.

Do not build a generic resort website. Do not simply reproduce a template. Do not create a collection of disconnected cards or a static visual mockup.

Build a coherent digital experience that communicates the scale, ambition, hospitality, natural surroundings, villa ownership opportunities, and four-phase development vision of Forest Eco Resort.

The website must combine five core experiences:

1. **Destination discovery:** Make visitors feel the atmosphere of the resort before they arrive.
2. **Hospitality storytelling:** Showcase the forest setting, accommodation, dining, recreation, wellness, and leisure experiences.
3. **Villa discovery:** Present private villas and duplex villas through architectural imagery and clear information.
4. **Ownership inquiry:** Explain the proposed ownership model, available documentation, member benefits, and investment-related information responsibly.
5. **Lead generation and operations:** Capture, organize, track, and manage inquiries through a secure admin panel.

The website must be visually exceptional while remaining fast, accessible, responsive, easy to maintain, and straightforward for non-technical administrators to operate.

## Design philosophy

Use Sandy Land as a reference for understanding how a destination development website communicates projects, accommodation, investment, amenities, and inquiries. Do not copy its visual identity, text, layouts, images, or branding.

Create an independent identity for Forest Eco Resort.

The desired experience should feel like an editorial journey through a premium nature destination. Visitors should encounter a series of connected visual scenes rather than conventional web sections stacked mechanically on a page.

Use oversized photography, atmospheric lighting, refined typography, deliberate whitespace, restrained animation, immersive image transitions, and a clear hierarchy of information.

Every animation must support the story. Never sacrifice readability, performance, or accessibility for visual effects.

---

# PART 2 — BRAND ASSETS & BRAND IDENTITY

## 2.1 Official brand resources

Use these supplied resources as the starting point:

- **Logo and brand assets:** https://drive.google.com/drive/folders/1nD8XcRswKmATGhF9qYJj8LGsvo9fBFyL?usp=drive_link
- **Brand guidelines:** https://drive.google.com/drive/folders/1cxXV8oWrQigurT2XupPfpPFimyAg-213?usp=drive_link
- **Villa collection 1:** https://drive.google.com/drive/folders/19LtIWti0T9t_71r8JcsN8dJ8kQxCwpsM?usp=sharing
- **Villa collection 2:** https://drive.google.com/drive/folders/14a2eaJ0Q-I3mxKHS07F96qGZRBvtuy1A?usp=sharing
- **Brochure and supporting materials:** https://drive.google.com/drive/folders/1qZqKZImVDfEhDJq8ZLTINXncdaTECewq?usp=drive_link

Inspect and use the actual assets where access is available. Do not assume that a shared Drive URL automatically grants access. If files cannot be retrieved, create an asset inventory request rather than pretending the files were inspected.

## 2.2 Brand colors and typography

Use the official brand guidelines as the authority.

The creative direction should generally support:

- Deep forest green for immersive backgrounds and nature-led sections.
- Warm ivory and off-white for readable content sections.
- Muted sage and botanical greens for secondary accents.
- Natural earth tones for architectural and landscape imagery.
- Restrained gold, sand, or warm stone accents where appropriate.

The project owner has specified the official font as **Nourd**. Verify the supplied font files, licensing, and available weights. If the font is unavailable, use a carefully selected temporary fallback and make the typography configurable.

Do not force every component into the same color scheme. Use alternating light and dark scenes while maintaining a consistent visual identity.

## 2.3 Visual standards

The site must demonstrate:

- Premium editorial art direction.
- Consistent typography and spacing.
- Large, intentional imagery.
- Balanced composition and asymmetrical layouts where appropriate.
- Minimal borders and unnecessary containers.
- Elegant, understated calls to action.
- Consistent iconography.
- Carefully designed mobile layouts.
- No excessive glassmorphism, neon gradients, generic dashboards, or decorative effects without purpose.

Use glass effects sparingly, for example on a floating navigation overlay or a contextual image caption, rather than across the entire interface.

## 2.4 Approved copy and positioning

**Primary headline:**

“Where Nature Becomes an Experience.”

**Primary subheadline:**

“A premium destination where nature, luxury, hospitality, adventure and leisure come together in one extraordinary setting.”

**Mission:**

“To create a premium destination where nature, luxury and hospitality come together—offering people meaningful experiences, peaceful escapes and memorable moments while preserving the beauty and balance of the natural environment.”

**Vision:**

“To become one of Bangladesh’s most distinctive eco-tourism destinations—where nature, world-class hospitality, thoughtful architecture and leisure come together to create a sustainable destination for living, relaxation and unforgettable experiences.”

**Brand context:**

Forest Eco Resort is a premium eco-tourism and destination development planned in the natural surroundings of Bhawal Forest, Rajendrapur, Gazipur. Its concept combines hospitality, destination living, family recreation, nature-based experiences, leisure, adventure, wellness, and private villa ownership opportunities.

Do not represent proposed facilities as operational unless their status has been verified.

---

# PART 3 — TECHNICAL ARCHITECTURE

## 3.1 Frontend

Build the public website using:

- Next.js with the App Router.
- TypeScript.
- React.
- Tailwind CSS or a well-structured CSS Modules design system.
- Framer Motion for interface transitions.
- GSAP and ScrollTrigger for selected advanced scroll-driven scenes.
- Next.js Image for responsive image optimization.
- A reusable component library designed specifically for this brand.

Use Server Components by default where practical. Use Client Components only where interactivity, state, or animation requires them.

Do not make every component client-rendered unnecessarily.

## 3.2 Backend

Build a Node.js and Express.js API using TypeScript.

The backend must handle:

- Authentication and session management.
- Public inquiry submissions.
- Lead storage and lead status updates.
- CMS content retrieval and editing.
- Gallery management.
- Villa and accommodation content.
- Masterplan phase management.
- Facility and experience management.
- Journal and news publishing.
- Brochure and document management.
- Site settings.
- User roles and permissions.
- Audit logs.
- Administrative analytics.
- Email notifications.
- Secure media upload workflows.

Validate every incoming request on the server.

## 3.3 Database

Use PostgreSQL for production unless the deployment environment requires another database.

Use a schema migration system and an ORM such as Prisma or Drizzle.

Recommended entities:

- `users`
- `roles`
- `permissions`
- `sessions` or refresh-token records
- `leads`
- `lead_activities`
- `lead_assignments`
- `pages`
- `page_sections`
- `site_settings`
- `navigation_items`
- `media_assets`
- `villa_types`
- `villas`
- `facilities`
- `experiences`
- `masterplan_phases`
- `masterplan_facilities`
- `gallery_albums`
- `gallery_items`
- `articles`
- `article_categories`
- `brochures`
- `inquiries`
- `audit_logs`

Add timestamps, appropriate indexes, foreign keys, publication status, and soft deletion where justified.

Keep sensitive data and operational records out of public API responses.

## 3.4 API conventions

Use a consistent `/api/v1` prefix.

Example endpoint groups:

- `/api/v1/auth`
- `/api/v1/pages`
- `/api/v1/settings`
- `/api/v1/leads`
- `/api/v1/villas`
- `/api/v1/facilities`
- `/api/v1/experiences`
- `/api/v1/masterplan`
- `/api/v1/gallery`
- `/api/v1/articles`
- `/api/v1/media`
- `/api/v1/brochures`
- `/api/v1/admin/analytics`

Implement appropriate HTTP status codes, schema validation, pagination, sorting, filtering, structured error responses, and API documentation.

Never expose administrative endpoints without authentication and authorization.

---

# PART 4 — GLOBAL WEBSITE COMPONENTS

## 4.1 Main navigation

Create a refined, responsive navigation system.

Navigation labels:

- Home
- The Estate
- The Experience
- Villas & Ownership
- In Harmony with Nature
- The Masterplan
- Discover Forest
- Journal & Updates
- Contact

Requirements:

- Transparent over the homepage hero.
- Smooth transition to a solid background as the page scrolls.
- Logo and navigation spacing must remain balanced.
- A clear ownership inquiry CTA.
- Mobile menu with accessible open and close controls.
- Keyboard-accessible dropdowns.
- Active-page indication.
- Escape-key support for closing the mobile menu.
- Scroll locking while the mobile menu is open.
- Correct navigation behavior on nested pages.
- No layout shifts when the navigation changes appearance.

On mobile, provide a compact menu and an optional discreet sticky inquiry button.

## 4.2 Footer

Create a branded, multi-section footer containing:

- Forest Eco Resort logo.
- Short brand statement.
- Primary navigation links.
- Villa and ownership links.
- Masterplan link.
- Journal and gallery links.
- Official contact details.
- Social media links.
- Privacy policy.
- Terms and conditions.
- Cookie or privacy preferences where applicable.
- Copyright information.
- A back-to-top control.

Official social accounts:

- Facebook: https://www.facebook.com/forestecoresort
- Instagram: https://www.instagram.com/forestecoresortbd/

Official location:

Gazipur, Rajendrapur, Bhabanipur, Bangladesh.

Contact numbers:

- 01897660045
- 01897660049
- 01897660050

Email supplied by the project owner:

`theforestecoresort@gmail.com`

The source information originally included `http://` before the email. Treat that as a formatting error, but verify the email address before production launch.

## 4.3 Floating inquiry action

Implement a discreet, persistent inquiry CTA.

It should:

- Appear after an appropriate scroll threshold.
- Avoid obscuring important mobile content.
- Open the inquiry form or navigate to the inquiry section.
- Support keyboard interaction.
- Have clear accessible text.
- Be dismissible where appropriate.

## 4.4 Global inquiry form

Create a reusable inquiry form that can be embedded in relevant pages.

Fields:

1. Full Name.
2. Mobile Number.
3. Email.
4. Area of Interest:
   - Villa Ownership
   - Investment
   - Resort Stay
   - Project Information
5. Preferred Villa / Unit:
   - Duplex Villa
   - Single Villa
   - Private Villa
6. Purpose of Interest:
   - Personal Use
   - Investment
   - Vacation
7. Preferred Contact Method:
   - Phone
   - WhatsApp
   - Email
8. Preferred Contact Time.
9. Message / Specific Requirement.
10. Consent to the applicable privacy notice.

Use conditional logic where appropriate. For example, villa-specific options should only be displayed when relevant.

Requirements:

- Client-side and server-side validation.
- Clear error messages beside the relevant field.
- Submission loading state.
- Duplicate-submission protection.
- Success confirmation.
- Failure recovery without losing valid input.
- Spam protection.
- Server-side sanitization.
- Accessible labels and focus management.
- Store the originating page and campaign attribution where available and permitted.

Notify the configured sales team through email and, if an approved integration is configured, WhatsApp.

Do not claim that WhatsApp notifications work unless an actual authorized provider and API integration are configured.

---

# PART 5 — HOMEPAGE

Route: `/`

The homepage must establish the emotional and visual identity of Forest Eco Resort immediately.

## Section 1: Cinematic hero

Build a full-viewport opening scene.

Content:

Headline: “Where Nature Becomes an Experience.”

Subheadline: “A premium destination where nature, luxury, hospitality, adventure and leisure come together in one extraordinary setting.”

Primary CTA: “Discover Forest”

Secondary CTA: “Explore Ownership”

Design requirements:

- Full-screen approved forest or villa imagery.
- Optional background video with a static poster fallback.
- Dark gradient or image overlay for readability.
- Large editorial typography.
- Minimal navigation.
- Small location identifier: Rajendrapur, Gazipur.
- Subtle scroll indicator.
- Slow, restrained image movement.
- Text reveals that do not delay access to the content.
- Mobile-specific image framing.
- No autoplay audio.

The hero must feel atmospheric, sophisticated, and welcoming.

## Section 2: Introduction to Forest

Introduce the project through a strong editorial layout.

Suggested headline:

“A destination shaped by nature.”

Explain that Forest Eco Resort is envisioned as a place combining nature, hospitality, private retreats, leisure, and destination experiences.

Use a split layout with large photography, supporting text, and a restrained CTA to explore the estate.

## Section 3: The destination vision

Show the wider concept behind Forest Eco Resort.

Cover:

- Nature and forest surroundings.
- Hospitality.
- Private villas.
- Family recreation.
- Dining.
- Leisure and wellness.
- Destination development.

Use a combination of landscape imagery and concise editorial text.

Do not present all facilities as currently operational without verification.

## Section 4: Featured experiences

Showcase selected experience categories:

- Stay.
- Dine.
- Explore.
- Reconnect.
- Celebrate.
- Unwind.

Each category should have a large image, short description, and a relevant destination link.

Avoid six identical cards. Use a deliberate editorial composition.

## Section 5: Villa discovery

Introduce the Private Villa and Duplex Villa collections.

Each featured villa should include:

- Approved image or render.
- Villa name.
- Short description.
- Verified specifications, where available.
- Relevant ownership CTA.

Do not invent bedroom counts, floor areas, prices, or availability.

## Section 6: Masterplan teaser

Introduce the four-phase destination development.

Show a continuous visual line or path with four milestones:

1. Forest Eco Resort Foundation.
2. Golf & Lifestyle Zone.
3. Premium Resort & Entertainment Zone.
4. Signature Luxury & Wellness Destination.

Use a concise description of each phase and a CTA to explore the full masterplan.

## Section 7: Nature and sustainability

Communicate the intended relationship between architecture, landscaping, nature, and responsible destination development.

Only use measurable environmental claims when supported by evidence.

Avoid unverified claims about carbon neutrality, biodiversity gains, certifications, or sustainability performance.

## Section 8: Gallery teaser

Create a visually rich image sequence linking to the gallery.

Include relevant filters or categories if appropriate:

- Architecture.
- Villas.
- Nature.
- Lifestyle.
- Facilities.
- Development.

Clearly distinguish conceptual renders from actual project photographs.

## Section 9: Journal and updates

Display recent published articles, project announcements, and verified updates.

Each item should include:

- Image.
- Category.
- Publication date.
- Title.
- Short excerpt.
- Read-more link.

Hide unpublished and draft articles from public visitors.

## Section 10: Closing CTA

Suggested headline:

“Your next chapter begins in nature.”

Provide clear options to:

- Request Ownership Details.
- Explore the Masterplan.
- Contact the Team.

## Section 11: Footer

Use the global footer described earlier.

---

# PART 6 — THE ESTATE / OUR STORY

Route: `/estate` or `/our-story`

Purpose: Establish the project’s identity, mission, vision, philosophy, and overall destination concept.

## Section 1: Editorial hero

Headline:

“A new perspective on getting away.”

Use atmospheric forest imagery and a concise introduction.

## Section 2: The story

Explain why Forest Eco Resort is being developed and the experience it aims to create.

Emphasize the combination of:

- Nature.
- Thoughtful architecture.
- Hospitality.
- Leisure.
- Family experiences.
- Private destination living.

Do not invent founder biographies, historical milestones, awards, or completed achievements.

## Section 3: Mission and vision

Display the approved mission and vision statements.

Use an elegant typographic treatment with generous whitespace.

## Section 4: The destination philosophy

Describe the relationship between the natural setting, accommodation, recreation, and hospitality.

Use an image-led editorial composition rather than a conventional feature grid.

## Section 5: Project overview

Introduce the overall development concept and its four-phase masterplan.

Use only approved project facts and clearly label planned development.

## Section 6: CTA

Link to:

- The Experience.
- The Masterplan.
- Villas & Ownership.

---

# PART 7 — THE EXPERIENCE

Route: `/experience`

Purpose: Showcase what visitors may experience at Forest Eco Resort.

## Section 1: Experience hero

Headline:

“Find your own rhythm.”

Use large landscape or resort imagery.

## Section 2: Stay

Showcase planned accommodation categories:

- Resort Rooms.
- Premium Resort Rooms.
- Family Suites.
- Private Villas.
- Duplex Villas.
- Luxury Suites, where relevant to the development plan.

Each accommodation item should be configurable through the CMS.

Do not imply that booking inventory or online reservations exist unless implemented and connected to a real booking system.

## Section 3: Dine

Showcase the intended dining experiences:

- Restaurant.
- Café.
- Additional Restaurants.
- Fine Dining.
- Rooftop Restaurant.
- Golf Café.

Use phase-specific labels where relevant.

Do not invent restaurant names, operating hours, menus, or food offerings.

## Section 4: Recreate

Showcase planned activities and facilities:

- Swimming.
- Walking and jogging.
- Outdoor recreation.
- Sports.
- Golf practice.
- Family recreation.
- Children's play facilities.
- Water recreation.
- Indoor games.
- Adventure and entertainment.

Clearly indicate which facilities are proposed, under development, or operational.

## Section 5: Celebrate

Highlight the intended event and gathering possibilities:

- Event Lawn.
- Convention Centre.
- Corporate Meetings.
- Banquet Facilities.
- Large Event Spaces.
- Family Events.

## Section 6: Wellness

Introduce the planned wellness offering:

- Spa.
- Fitness Centre.
- Sauna and Steam.
- Wellness Garden.
- Nature-oriented relaxation.

Do not imply that these services are open before their status is confirmed.

## Section 7: CTA

Link to the relevant facility, masterplan, and inquiry pages.

---

# PART 8 — VILLAS & OWNERSHIP

Route: `/villas-ownership`

This page is a major conversion destination. It must balance aspirational villa imagery with clear, trustworthy ownership information.

## Section 1: Immersive hero

Headline:

“Own a part of the extraordinary.”

Supporting copy:

“A private sanctuary shaped by nature. A slower way of living, surrounded by the quiet beauty of Bhawal.”

CTAs:

- Explore the Villas.
- Request Ownership Details.

Use approved villa renders as the primary visual asset.

## Section 2: Villa collection

Present the available villa categories through large, immersive editorial scenes.

### The Private Villa

Include:

- Villa description.
- Approved renders.
- Verified specifications.
- Relevant project phase.
- Ownership information, if applicable.
- CTA to request details.

### The Duplex Villa

Include:

- Villa description.
- Approved renders.
- Verified specifications.
- Relevant project phase.
- Ownership information, if applicable.
- CTA to request details.

Do not fabricate prices, room counts, sizes, completion dates, or availability.

## Section 3: Villa detail interaction

Where suitable, allow visitors to open a dedicated detail view or page.

Potential features:

- Image gallery.
- Floor-plan viewer, if supplied.
- Specifications.
- Project status.
- Brochure download.
- Inquiry CTA.

Do not create fake interactive floor plans or placeholder specifications that appear genuine.

## Section 4: Ownership concept

Explain the ownership structure in clear, accessible language.

The content should explain:

- What is being offered.
- What legal instrument governs the ownership.
- What the purchaser actually owns.
- Whether the offer is share-based, unit-based, or another legally defined structure.
- Applicable rights and restrictions.
- Transferability.
- Maintenance or service obligations, if applicable.
- Member benefits.
- Relevant documentation.

The legal and commercial details must be approved by the project owner and legal counsel before publication.

## Section 5: Proposed owner benefits

The project brief identifies the following potential benefits:

- Opportunity to participate in a premium forest eco-resort in Gazipur.
- Ownership documented through a registered deed of conveyance, subject to confirmation of the actual legal structure.
- Three complimentary days and two nights annually per eligible share, as proposed in the supplied brief.
- Discounts of up to 50–60% on selected resort stays and facilities, subject to confirmation.
- Potential discounted stays at other resorts operated by NEXCENT GROUP, subject to confirmation.
- Long-term ownership and possible financial upside.
- Potential asset value appreciation, which is not guaranteed.
- Transfer across generations, subject to applicable laws and the final ownership terms.
- Access to a nature-oriented personal retreat, subject to the actual rights and availability.

Present each benefit only after its details, eligibility, exclusions, and legal basis have been verified.

Do not promise financial returns or guaranteed appreciation.

Do not describe the offer as a regulated investment product, property ownership, or transferable share until its actual legal structure has been established.

## Section 6: Ownership process

Create a simple, configurable process illustration.

Example steps:

1. Submit an inquiry.
2. Speak with the sales team.
3. Review the project and relevant documents.
4. Understand the ownership structure and terms.
5. Proceed through the approved legal and commercial process.

These steps are illustrative and must be adjusted to the actual sales process.

## Section 7: Documents and brochures

Allow authorized administrators to upload approved documents.

Potential documents:

- Project brochure.
- Villa brochure.
- Approved floor plans.
- Ownership terms.
- Project overview.
- Applicable legal documentation.

Each downloadable file must have a clear title, version, publication status, and optional expiry date.

## Section 8: FAQ

Build a CMS-managed FAQ component.

Potential topics:

- What is Forest Eco Resort?
- Where is the project located?
- What villa categories are available?
- What does ownership mean?
- What documentation is provided?
- What benefits apply to owners?
- Can ownership be transferred?
- What facilities are planned?
- How can someone request a consultation?

Only publish answers that are factually approved.

## Section 9: Ownership inquiry

Embed the global inquiry form with the area of interest set to Villa Ownership by default.

Include source tracking to distinguish villa inquiries from general inquiries.

---

# PART 9 — IN HARMONY WITH NATURE / SUSTAINABILITY

Route: `/sustainability`

Purpose: Communicate the project's environmental philosophy responsibly.

## Section 1: Hero

Headline:

“Designed to belong.”

Use forest, landscaping, and architectural imagery.

## Section 2: The natural setting

Introduce the Bhawal Forest surroundings and the importance of the site's natural context.

Do not claim that the project is inside a protected forest or holds environmental approvals without verified documentation.

## Section 3: Design philosophy

Describe the intended approach to:

- Landscaping.
- Natural surroundings.
- Outdoor experiences.
- Building design.
- Water features.
- Recreational planning.
- Visitor experience.

Separate design intentions from measurable achievements.

## Section 4: Responsible development

Provide a CMS-managed section for verified initiatives.

Possible content categories:

- Water management.
- Landscape planning.
- Waste management.
- Energy efficiency.
- Native planting.
- Environmental management.
- Responsible visitor practices.

Do not state that any of these measures have been implemented unless evidence exists.

## Section 5: Updates and documentation

Allow administrators to publish approved sustainability-related updates and supporting documents.

## Section 6: CTA

Link to the Masterplan, The Estate, and Contact.

---

# PART 10 — MASTERPLAN: CONTINUOUS FOUR-PHASE TIMELINE

Route: `/masterplan`

This is one of the most important pages in the project.

**Do not build four disconnected cards. Do not create a conventional real-estate comparison table as the main design.**

The entire page should feel like one continuous journey from the foundation of the resort to its planned signature luxury and wellness destination.

## 10.1 Masterplan visual concept

Create a long-form, scroll-driven timeline.

The timeline should visually connect all four phases through one continuous line, path, landscape, or architectural progression.

Suggested visual approach:

- A cinematic introductory hero.
- A continuous vertical progress line on desktop and mobile.
- Four numbered phase markers.
- Alternating left-right editorial layouts on desktop.
- A single-column narrative on mobile.
- Large phase-specific images.
- Subtle scroll-linked reveals.
- A progress indicator showing the current phase.
- A consistent transition between phases.
- A closing summary and inquiry CTA.

The connecting timeline should remain visually coherent even when phase backgrounds change.

Do not force every section to remain pinned. Use pinned scenes selectively, and ensure the full page remains accessible to users who do not want motion.

## 10.2 Masterplan introduction

Headline:

“Four phases. One evolving destination.”

Supporting copy:

“Forest Eco Resort is envisioned as a phased destination development, bringing together hospitality, nature, recreation, lifestyle and wellness. Each phase introduces a distinct layer of the overall experience.”

Display the overall project concept without inventing a total investment figure, project completion date, or development approval status.

## 10.3 Phase 1 — Forest Eco Resort Foundation

**Phase label:** PHASE 01  
**Name:** Forest Eco Resort Foundation  
**Land:** 10 Bigha  
**Target Built-up / Development Area:** Approximately 3.5 lakh SFT  
**Indicative Development Cost:** Approximately ৳500 Crore

The cost figure is supplied by the project owner and must be presented as indicative, not independently verified.

### Visual direction

Begin the timeline with the foundation scene.

Use architectural imagery showing the entrance, reception, resort environment, villas, landscaping, and water features. Use approved project renders where available.

The visual should communicate the first layer of the destination taking shape.

### Main facilities

- Grand Entrance & Reception
- Main Lobby
- First International/Premium Hotel Block
- Resort Rooms
- Family Villas
- Restaurant & Café
- Swimming Pool
- Artificial Lake / Waterbody
- Landscaped Garden
- Forest / Nature Zone
- Walking / Jogging Track
- Children's Play Zone
- Internal Roads
- Parking
- Security & Service Facilities

Display these as a curated facility list, grouped by function where useful.

### Purpose

“Forest ECO Resorts-এর foundation এবং প্রথম পর্যায়ের operational destination তৈরি করা।”

### Narrative statement

“প্রথম Phase-এই আমরা এমন একটি core resort destination তৈরি করার পরিকল্পনা করছি, যেখানে customer hotel, villa, restaurant, swimming pool, lake এবং nature-based recreation একসঙ্গে পাবেন।”

Preserve the intended meaning and Bengali-English language mix. Allow the content administrator to edit the statement.

### Transition to Phase 2

The foundation scene should transition visually toward a more active recreation and lifestyle environment.

The connecting line should continue without interruption.

## 10.4 Phase 2 — Golf & Lifestyle Zone

**Phase label:** PHASE 02  
**Name:** Golf & Lifestyle Zone  
**Land:** 10 Bigha  
**Target Built-up / Development Area:** Approximately 4.5 lakh SFT

### Visual direction

Introduce a more expansive leisure environment.

Use suitable golf practice imagery, open landscapes, recreation areas, club facilities, and premium resort architecture.

Do not use imagery that implies a full championship golf course if the supplied project plan only specifies golf practice facilities and a driving range.

### Golf component

- Golf Practice Area
- Driving Range
- Golf Academy
- Putting Green
- Golf Lounge
- Golf Clubhouse
- Golf Café
- Golf Equipment / Pro Shop

### Other facilities

- Convention Centre
- Corporate Meeting Facilities
- Premium Resort Rooms
- Premium Villas
- Outdoor Recreation
- Sports Zone
- Event Lawn
- Additional Restaurants
- Landscape & Water Features

### Core concept

“Golf + Resort + Business + Lifestyle”

### Narrative statement

“Forest ECO Resorts-এর Phase–2-তে আমরা Golf & Lifestyle Zone যুক্ত করছি। এখানে Golf Practice Facility, Driving Range, Golf Academy এবং Clubhouse-এর পাশাপাশি Convention ও Corporate Event Facilities থাকবে।”

### Transition to Phase 3

Transition from the golf and lifestyle environment into a larger resort and entertainment setting.

Use imagery, scale, and typography to communicate a new layer of the destination.

## 10.5 Phase 3 — Premium Resort & Entertainment Zone

**Phase label:** PHASE 03  
**Name:** Premium Resort & Entertainment Zone  
**Land:** 10 Bigha  
**Target Built-up / Development Area:** Approximately 6 lakh SFT

### Visual direction

Communicate a larger hospitality and entertainment destination.

Use architectural visuals featuring a hotel tower, suites, villas, water recreation, indoor entertainment, and event spaces.

### Facilities

- Luxury Hotel Tower
- Premium Hotel Rooms
- Executive Suites
- Luxury Villas
- Premium Villas
- Family Suites
- Water Recreation Zone
- Indoor Entertainment
- Indoor Games
- Kids Entertainment
- Adventure / Recreation Zone
- Multiple Restaurants
- Banquet Facilities
- Large Event Space
- Additional Swimming Pool
- Premium Landscape

### Core concept

“Luxury Stay + Family Entertainment + Water Recreation”

### Narrative statement

“Phase–3-তে Forest ECO Resorts আরও বড় একটি luxury family destination হিসেবে develop হবে—যেখানে premium hotel, luxury villa, water recreation এবং indoor entertainment facilities থাকবে।”

### Transition to Phase 4

The visual experience should become more refined, intimate, and exclusive.

Move from family-oriented scale into signature luxury, wellness, and premium hospitality.

## 10.6 Phase 4 — Signature Luxury & Wellness Destination

**Phase label:** PHASE 04  
**Name:** Signature Luxury & Wellness Destination  
**Land:** 10 Bigha  
**Target Built-up / Development Area:** Approximately 6 lakh SFT

### Visual direction

Use premium architectural imagery, private luxury villas, wellness environments, fine dining, and calm landscaped settings.

The final phase should feel like the culmination of the entire destination journey.

### Premium facilities

- Presidential Villas
- Signature Villas
- Luxury Suites
- Premium Hotel Facilities
- Exclusive Club Facilities
- Spa & Wellness Centre
- Fitness Centre
- Sauna / Steam
- Wellness Garden
- Nature / Eco Zone
- Premium Restaurant
- Rooftop Restaurant
- Fine Dining
- VIP Lounge
- Premium Event Facilities
- Exclusive Recreation Facilities

### Core concept

“Luxury + Wellness + Exclusive Lifestyle”

### Narrative statement

“Phase–4 হবে Forest ECO Resorts-এর signature luxury zone—যেখানে Presidential Villa, Luxury Suite, Wellness, Spa, Fine Dining এবং premium lifestyle facilities নিয়ে একটি exclusive destination তৈরি করা হবে।”

## 10.7 Masterplan conclusion

Close the timeline with a wide landscape or aerial masterplan scene.

Headline:

“One destination. An evolving experience.”

Explain that the four phases represent the supplied development vision, subject to the project's approved plans, funding, permissions, construction progress, and final specifications.

Provide CTAs:

- Explore Villas & Ownership.
- Request Project Information.
- Contact the Team.

## 10.8 Masterplan data management

Every phase must be editable in the admin panel.

Administrators must be able to edit:

- Phase number.
- Phase name.
- Land allocation.
- Development area.
- Indicative cost, if applicable.
- Phase description.
- Core concept.
- Bengali narrative.
- Facility groups.
- Images and galleries.
- Status.
- Publication order.
- SEO metadata.

Recommended phase status options:

- Conceptual.
- Planned.
- In Development.
- Under Construction.
- Partially Operational.
- Operational.
- On Hold.

These statuses must be set from verified project information. Never assign them automatically.

Store numerical values separately from formatted display strings where possible, including the original unit and currency. The CMS should support Bengali and English text.

---

# PART 11 — DISCOVER FOREST / FACILITIES & ATTRACTIONS

Route: `/discover-forest`

Purpose: Provide a dedicated exploration page for the project's facilities and destination attractions.

## Section 1: Hero

Headline:

“Explore beyond the expected.”

Use an immersive landscape or aerial image.

## Section 2: Facility categories

Create CMS-managed categories such as:

- Hospitality.
- Villas & Accommodation.
- Dining.
- Water Recreation.
- Golf & Sports.
- Family Entertainment.
- Events & Business.
- Wellness.
- Nature & Leisure.

## Section 3: Facility detail scenes

Each facility should support:

- Name.
- Description.
- Category.
- Images.
- Project phase.
- Development status.
- Availability status.
- Optional location within the masterplan.
- Related facilities.
- CTA.

Use the actual project phase and verified status.

## Section 4: Facility explorer

Where an approved masterplan image or map is available, provide an interactive exploration feature.

Possible interactions:

- Select a facility.
- View a description.
- Jump to the associated phase.
- Open related images.

Do not invent geographic coordinates or a precise site layout.

## Section 5: CTA

Link to the Masterplan, Experience, and inquiry form.

---

# PART 12 — GALLERY

Route: `/gallery`

Purpose: Create a visually compelling library of the project's visual assets.

## Layout

Use a masonry-inspired or editorial image grid with varied image sizes.

Do not use an identical grid for every image.

## Categories

- Architecture.
- Villas.
- Nature.
- Hospitality.
- Lifestyle.
- Facilities.
- Masterplan.
- Construction & Development.

## Features

- Category filtering.
- Full-size lightbox.
- Keyboard navigation.
- Previous / next controls.
- Touch gestures on mobile.
- Lazy loading.
- Responsive image sizes.
- Accessible alt text.
- Optional captions.
- Optional phase association.
- Clear labels for render, concept image, photograph, and illustration.

The admin panel must support uploading, organizing, reordering, editing, publishing, and archiving gallery items.

Never present a concept render as a photograph of a completed facility.

---

# PART 13 — JOURNAL & UPDATES

Route: `/journal`

Purpose: Support project announcements, editorial content, news, and verified progress updates.

## Journal listing page

Include:

- Featured article.
- Category navigation.
- Article grid or editorial list.
- Publication date.
- Short excerpt.
- Author, if configured.
- Pagination or load-more behavior.

## Article categories

Examples:

- Project Updates.
- Architecture.
- Lifestyle.
- Nature.
- Hospitality.
- Events.
- Announcements.

## Article detail page

Route: `/journal/[slug]`

Include:

- Title.
- Hero image.
- Publication date.
- Category.
- Author, where applicable.
- Rich-text content.
- Image gallery.
- Related articles.
- Share links.
- SEO metadata.
- CTA where relevant.

## CMS publishing workflow

Support:

- Draft.
- In Review.
- Scheduled.
- Published.
- Archived.

Only published content should be visible publicly.

Validate article slugs and prevent conflicting URLs.

---

# PART 14 — LOCATION & CONTACT

Route: `/contact`

Purpose: Make it easy to locate the destination and contact the appropriate team.

## Section 1: Hero

Headline:

“Let’s start a conversation.”

## Section 2: Contact information

Display:

- Location: Gazipur, Rajendrapur, Bhabanipur, Bangladesh.
- Phone: 01897660045.
- Phone: 01897660049.
- Phone: 01897660050.
- Email: theforestecoresort@gmail.com, pending verification.

Telephone links must use the `tel:` scheme. Email links must use `mailto:`.

## Section 3: Map

Use the supplied location link:

https://share.google/d7AFZ0qrYmK0XDSn2

Use an appropriate map embed or external directions link. Verify the location before publishing an embedded map.

Do not invent latitude and longitude.

## Section 4: Inquiry form

Embed the complete inquiry form.

Allow users to select their interest and preferred contact method.

## Section 5: Social media

Link to the official Facebook and Instagram accounts.

## Section 6: Submission confirmation

After successful submission:

- Show a clear confirmation.
- Explain that the inquiry has been received.
- Provide the configured expected response time only if confirmed.
- Prevent duplicate submissions.
- Record the lead in the database.

---

# PART 15 — LEAD MANAGEMENT SYSTEM

This is a core business function, not an optional form-storage feature.

## 15.1 Lead lifecycle

Each lead should have:

- Unique lead ID.
- Full name.
- Mobile number.
- Email.
- Area of interest.
- Preferred villa / unit.
- Purpose of interest.
- Preferred contact method.
- Preferred contact time.
- Message.
- Lead source.
- Landing page.
- Campaign attribution, where available.
- Created date.
- Assigned staff member.
- Status.
- Priority.
- Internal notes.
- Activity history.
- Last contact date.
- Next follow-up date.
- Consent record, where applicable.

## 15.2 Lead statuses

Use a configurable workflow. Suggested defaults:

- New.
- Contacted.
- Qualified.
- Consultation Scheduled.
- Follow-up Required.
- Converted.
- Not Interested.
- Invalid / Spam.

## 15.3 Lead operations

Authorized staff should be able to:

- View leads.
- Search by name, email, phone, or lead ID.
- Filter by interest, status, date, source, and assigned staff.
- Sort by date and priority.
- Assign or reassign leads.
- Change status.
- Add internal notes.
- Record contact attempts.
- Schedule follow-ups.
- View the activity history.
- Export filtered records when authorized.
- Mark spam or invalid records.
- View lead detail pages.

Record important changes in an audit log.

## 15.4 Notifications

On new lead submission:

1. Validate the submission.
2. Store the lead in the database.
3. Create the lead activity record.
4. Trigger an email notification through a configured email service.
5. Trigger WhatsApp notification only when a legitimate provider integration is configured.
6. Return a successful response to the visitor.

Notification failures must not delete the lead or make a saved lead appear lost.

Provide retry handling and logging for failed notifications.

---

# PART 16 — ADMIN PANEL

Route: `/admin`

Build a secure, complete administration application.

It must not be a static dashboard with fake numbers or nonfunctional controls.

## 16.1 Admin authentication

Create:

- Login page.
- Secure logout.
- Password reset workflow.
- Session or token lifecycle management.
- Role-based access control.
- Login throttling.
- Optional multi-factor authentication.
- Session expiration.
- Audit logging for sensitive actions.

Never ship default production credentials.

Do not store authentication tokens in insecure browser storage when a secure server-managed session or appropriately protected cookie-based approach is available.

Use secure, HTTP-only cookies where appropriate, with CSRF protections for cookie-authenticated state-changing requests.

## 16.2 Admin dashboard

Show live database-backed metrics:

- Total inquiries.
- New inquiries.
- Qualified leads.
- Follow-ups due.
- Converted leads.
- Inquiry sources.
- Recent activity.
- Lead trends over time.

Add filters for relevant date ranges.

Every metric must be calculated from real records. If no data exists, show a proper empty state rather than fabricated figures.

## 16.3 Content management

Create dedicated modules for:

- Pages.
- Page sections.
- Navigation.
- Global settings.
- Villas.
- Experiences.
- Facilities.
- Masterplan.
- Gallery.
- Journal.
- Brochures.
- Contact details.
- Social media links.
- FAQs.
- SEO settings.

Support create, view, edit, publish, unpublish, archive, and reorder actions where appropriate.

Use confirmation dialogs for destructive operations.

## 16.4 Page editor

Administrators should be able to edit page content without changing source code.

Each page section should support appropriate fields such as:

- Section title.
- Eyebrow text.
- Body copy.
- Image.
- Mobile image.
- Background style.
- CTA label.
- CTA URL.
- Display order.
- Publication status.

Do not attempt to create a full unrestricted visual website builder unless it is necessary. A structured section editor is easier to maintain and safer.

## 16.5 Masterplan editor

Provide an especially complete masterplan editor.

Allow administrators to:

- Edit the four phases.
- Update the phase name.
- Edit the land allocation and development area.
- Update the indicative development cost.
- Add and remove facilities.
- Group facilities by category.
- Edit Bengali and English descriptions.
- Upload phase images.
- Reorder phases.
- Set publication status.
- Preview changes before publishing.

Add safeguards to prevent accidental deletion of published phase content.

## 16.6 Villa management

Allow administrators to manage:

- Villa category.
- Villa name.
- Description.
- Approved specifications.
- Gallery.
- Floor plans.
- Brochure.
- Associated phase.
- Publication status.
- Inquiry CTA.
- SEO metadata.

Do not assume that villa inventory or live booking availability exists. Add those capabilities only if a real source of inventory data is supplied.

## 16.7 Media library

Provide:

- Image upload.
- Document upload.
- Image preview.
- Alt text.
- Caption.
- Asset type.
- Phase or page association.
- File size and format validation.
- Publication status.
- Search and filters.
- Replace asset functionality.
- Optional focal-point selection for responsive crops.

Restrict upload formats and sizes. Validate actual file types, not only filename extensions.

Use secure storage rather than exposing arbitrary server file paths.

## 16.8 Brochure management

Allow administrators to:

- Upload approved PDFs.
- Set document titles.
- Add descriptions.
- Publish or unpublish documents.
- Replace expired versions.
- Track download events where appropriate.
- Restrict private documents when necessary.

Only approved public brochures should be downloadable without authentication.

## 16.9 User and permission management

Suggested roles:

**Super Admin**
- Full platform access.
- User management.
- Security settings.
- System configuration.

**Content Administrator**
- Pages.
- Masterplan.
- Villas.
- Facilities.
- Gallery.
- Journal.
- Media.

**Sales Manager**
- All leads.
- Lead assignments.
- Lead reports.
- Sales-team activity.

**Sales Executive**
- Assigned leads.
- Contact records.
- Notes.
- Follow-ups.

**Analyst / Viewer**
- Authorized reports and read-only content.

Enforce permissions in the backend, not only by hiding buttons in the frontend.

## 16.10 Settings

Provide admin settings for:

- Company contact details.
- Social media URLs.
- Sales notification email.
- WhatsApp integration status.
- SEO defaults.
- Analytics configuration.
- Consent settings.
- Map link.
- Default inquiry options.
- Brand assets.
- Footer content.
- Maintenance mode, if needed.

Do not store production secrets in editable public-facing settings.

---

# PART 17 — MOTION DESIGN & SCROLL EXPERIENCE

The motion system is one of the most important differentiators of this project.

## 17.1 Motion principles

Use motion to create continuity between scenes.

Preferred techniques:

- Image scale transitions.
- Clip-path image reveals.
- Scroll-linked opacity.
- Subtle parallax.
- Text masks.
- Layered foreground and background movement.
- Sticky storytelling sections.
- Smooth background-color transitions.
- Progressive reveal of phase content.
- Gentle horizontal movement where appropriate.
- Crossfades between related images.

Avoid excessive bounce, overshooting, flashy gradients, or constant movement.

## 17.2 Homepage motion

The hero should transition naturally into the next section.

As visitors scroll:

1. The hero image gradually scales or shifts.
2. The headline transitions out without abrupt disappearance.
3. The following section becomes visible through an image or background transition.
4. The navigation adapts to the new scene.
5. The next content section enters with restrained motion.

The animation must not block reading or make the site feel slow.

## 17.3 Villa motion

Use an editorial showcase where imagery and text appear in sequence.

A pinned horizontal villa showcase may be used on desktop if it improves storytelling. On mobile, use a natural vertical sequence or touch-friendly horizontal interaction.

Do not force horizontal scrolling onto users who expect normal page scrolling.

## 17.4 Masterplan motion

The timeline should have one continuous connecting line.

As the user scrolls:

- The line progresses.
- The active phase marker changes.
- Phase content reveals in sequence.
- Images transition naturally.
- The previous scene leads into the next.
- The overall progression remains clear without animation.

The timeline must also work when JavaScript animation is unavailable.

## 17.5 Performance and accessibility

Respect `prefers-reduced-motion`.

Provide a reduced-motion experience that removes or simplifies parallax, pinned scenes, and large movement.

Avoid animating layout-heavy properties when transform or opacity can achieve the same effect.

Prevent scroll hijacking, unexpected jumps, horizontal overflow, and layout shifts.

Use lazy loading and appropriate image sizes.

The experience must remain usable on low-powered mobile devices and slower connections.

---

# PART 18 — SEO, ANALYTICS & DISCOVERABILITY

Implement:

- Page titles and meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Social sharing images.
- XML sitemap.
- Robots.txt.
- Structured data where appropriate.
- Breadcrumbs on suitable pages.
- Clean, readable URLs.
- Image alt text.
- Internal links.
- Redirect management.
- Search-engine-friendly rendering.
- Article metadata.
- Custom 404 page.

Potential structured-data types should only be used when accurate, such as Organization, WebSite, Article, or LocalBusiness where the real-world entity and details qualify.

Do not fabricate star ratings, reviews, hotel ratings, or official certifications.

## Analytics

Provide a configurable analytics integration.

Track relevant events where permitted:

- Inquiry form opened.
- Inquiry form submitted.
- Villa detail viewed.
- Masterplan phase viewed.
- Brochure downloaded.
- Phone link clicked.
- Email link clicked.
- WhatsApp inquiry clicked.
- Contact CTA clicked.

Respect applicable privacy and consent requirements. Do not send sensitive form contents to analytics platforms.

---

# PART 19 — SECURITY & DATA PROTECTION

Treat security as a core requirement.

Implement:

- Server-side validation.
- Input sanitization.
- Parameterized database access.
- Authentication and authorization.
- Rate limiting.
- CSRF protection where applicable.
- Secure cookies.
- Appropriate CORS configuration.
- Secure password hashing.
- Secrets management.
- Upload validation.
- API error handling.
- Audit logs.
- Database backups.
- Dependency updates.
- Security headers.
- Protection against common injection and cross-site scripting attacks.

Do not expose:

- Database credentials.
- API secrets.
- JWT signing keys.
- Private documents.
- Internal lead notes.
- Administrative endpoints.
- Sensitive server logs.

Implement a privacy policy, data-retention policy, and an appropriate process for handling requests concerning personal information.

Use a secure method for exporting leads, and log sensitive exports.

---

# PART 20 — RESPONSIVE DESIGN

Design and test the complete experience across:

- Large desktop screens.
- Standard desktop and laptop screens.
- Tablets.
- Modern mobile devices.
- Small mobile screens.

The desktop experience can use larger pinned scenes and richer motion. The mobile experience must prioritize readability, natural vertical scrolling, responsive image crops, touch controls, and low resource consumption.

Requirements:

- No horizontal overflow.
- No clipped navigation.
- No text overlapping imagery.
- No unreadable contrast.
- No inaccessible hover-only interactions.
- Properly sized touch targets.
- Responsive typography.
- Mobile-specific image positioning.
- Stable image dimensions to avoid layout shift.

Do not simply shrink the desktop layout to fit a phone.

---

# PART 21 — PERFORMANCE REQUIREMENTS

Optimize for real-world connections and devices.

Targets should be measured rather than assumed.

Aim for:

- Strong Core Web Vitals.
- Fast initial rendering.
- Minimal unnecessary JavaScript.
- Responsive image delivery.
- Optimized fonts.
- Lazy loading for below-the-fold imagery.
- Efficient route-level code splitting.
- Minimal third-party scripts.
- Stable layouts.
- Graceful loading states.
- Proper caching.

Use modern image formats where supported and supply appropriate fallback behavior.

If a video is used, provide a poster image and ensure that the page remains attractive without video playback.

Do not sacrifice performance by loading every full-resolution image or animation library on the initial page load.

---

# PART 22 — CONTENT ACCURACY & PUBLICATION RULES

This project involves hospitality, property-related ownership, and investment-oriented communication. Accuracy is essential.

Follow these rules throughout the website:

1. Separate completed facilities from proposed facilities.
2. Separate verified facts from planning targets.
3. Label concept imagery and architectural renders.
4. Verify all prices, cost figures, and specifications.
5. Verify all ownership terms and legal documentation.
6. Do not promise guaranteed returns or appreciation.
7. Do not invent project approvals, partnerships, awards, certifications, or completion dates.
8. Do not imply that a booking system exists unless one is implemented.
9. Do not publish placeholder testimonials as genuine testimonials.
10. Do not display fake lead statistics or fabricated activity.
11. Preserve Bengali text accurately.
12. Support Bengali and English content in the CMS.
13. Keep all project-specific claims editable.
14. Require appropriate approval before publishing sensitive ownership or investment claims.

The website must be able to present planned development professionally without misleading visitors about the project's current status.

---

# PART 23 — TESTING & QUALITY ASSURANCE

Do not consider the project complete simply because the homepage loads.

## Functional testing

Test:

- All public routes.
- Navigation.
- Mobile navigation.
- Inquiry form validation.
- Inquiry database storage.
- Email notification integration.
- WhatsApp integration, if configured.
- Lead status updates.
- Lead assignment.
- Lead search and filtering.
- Media upload.
- Gallery management.
- Article publishing.
- Masterplan editing.
- Villa editing.
- Brochure downloads.
- User permissions.
- Authentication.
- Logout.
- Password reset.
- Error handling.
- Empty states.
- Pagination.
- Export permissions.

## Visual testing

Check:

- Desktop hero.
- Mobile hero.
- Navigation over light and dark scenes.
- Masterplan continuity.
- Phase transitions.
- Villa showcase.
- Image cropping.
- Typography.
- Footer.
- Inquiry forms.
- Admin dashboard.
- Admin tables.
- Modal dialogs.
- Loading and error states.

## Accessibility testing

Check:

- Keyboard navigation.
- Focus visibility.
- Screen-reader labels.
- Color contrast.
- Reduced motion.
- Heading hierarchy.
- Form errors.
- Modal focus management.
- Alternative text.
- Touch target sizes.

## Technical testing

Provide:

- Unit tests.
- API integration tests.
- Database migration tests.
- Authentication and authorization tests.
- End-to-end tests for the principal inquiry journey.
- Production build verification.
- Deployment smoke tests.

Run a complete production build and fix blocking errors before declaring completion.

---

# PART 24 — DEPLOYMENT & DELIVERABLES

Deliver a complete, runnable project—not merely a mockup, Figma design, screenshot, or frontend prototype.

Required deliverables:

1. Complete Next.js frontend.
2. Complete Node.js backend.
3. Database schema and migrations.
4. Secure admin authentication.
5. Functional admin panel.
6. Working lead management.
7. Functional CMS for all required pages.
8. Masterplan timeline and editor.
9. Villa and facility management.
10. Gallery and media management.
11. Journal and article management.
12. Inquiry notifications.
13. Environment variable templates.
14. Seed data clearly marked as demonstration content.
15. README with setup and deployment instructions.
16. API documentation.
17. Test suite.
18. Production build instructions.
19. Backup and restore instructions.
20. A clear list of required external services and credentials.

Use environment variables for secrets and integration configuration.

Provide separate development and production configuration instructions.

Document how to configure:

- Database.
- Email provider.
- WhatsApp provider, if used.
- Media storage.
- Domain and HTTPS.
- Analytics.
- Backups.
- Admin account provisioning.

Never include real production secrets in the repository.

---

# PART 25 — DEFINITION OF DONE

The website is complete only when all the following conditions are met:

- Every required public page exists and has coherent content.
- The design system is consistent and distinctive.
- The homepage feels immersive and premium.
- Scroll transitions work smoothly without hijacking normal scrolling.
- The Masterplan is one continuous four-phase timeline.
- All supplied masterplan facilities and Bengali concept statements are included.
- Villas & Ownership contains the required content and inquiry journey.
- Public forms submit successfully to the backend.
- Leads persist in the database.
- The admin panel uses real data.
- Administrators can manage pages, sections, phases, villas, facilities, gallery, journal, brochures, and settings.
- Role-based permissions are enforced by the backend.
- Notifications work with configured providers.
- Responsive layouts work on mobile and desktop.
- Accessibility and reduced-motion behavior are implemented.
- SEO fundamentals are complete.
- No fabricated claims, testimonials, prices, or project statuses appear as facts.
- The production build succeeds.
- Critical user journeys pass automated or documented manual tests.
- Deployment and maintenance instructions are complete.

Do not mark a feature complete when it is only visually represented. Every visible control must either perform its intended function or be clearly identified as unavailable.

---

# FINAL IMPLEMENTATION INSTRUCTION

Build the entire Forest Eco Resort website and administration platform as one cohesive product.

Start by inspecting the supplied assets and establishing the design system. Then implement the shared components, public pages, database schema, backend API, authentication, admin modules, and integrations.

Prioritize the homepage, the continuous Masterplan timeline, and Villas & Ownership, but ensure every required page and administrative workflow is delivered.

Use authentic project assets wherever available. Where assets are missing, create clearly labelled placeholders and document what is needed. Do not invent factual project information to fill gaps.

The final result must feel like a premium destination brand with a cinematic, nature-led experience, while operating as a genuine business website with secure administration, reliable inquiry management, and maintainable content workflows.

**Success is defined by both visual quality and operational completeness.**