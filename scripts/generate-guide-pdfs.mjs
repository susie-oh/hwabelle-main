import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const outputDir = path.resolve("public/guides");
const tempHtmlDir = path.resolve("dist/temp_pdf_html");

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(tempHtmlDir, { recursive: true });

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const baseCss = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --primary: #1E342B;
  --primary-light: #F4F7F5;
  --accent: #C48B71;
  --accent-light: #FAF6F0;
  --text-dark: #1E2822;
  --text-muted: #5C7065;
  --border: #DDE6E0;
  --border-light: #EBF0ED;
}

@page {
  size: A4;
  margin: 18mm 16mm 18mm 16mm;
  @bottom-right {
    content: counter(page);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 8pt;
    color: #8A9E94;
  }
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  color: var(--text-dark);
  line-height: 1.65;
  font-size: 10pt;
  background: #FFFFFF;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.guide-container {
  max-width: 100%;
}

.header-banner {
  border-bottom: 2px solid var(--primary);
  padding-bottom: 12px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.logo-brand {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 11pt;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--primary);
  text-transform: uppercase;
}

.brand-motto {
  font-family: 'Playfair Display', serif;
  font-size: 9pt;
  font-style: italic;
  color: var(--text-muted);
}

.badge {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--border);
  font-size: 7.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 24pt;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.2;
  margin: 0 0 8px 0;
}

.subtitle {
  font-family: 'Playfair Display', serif;
  font-size: 12pt;
  font-style: italic;
  color: var(--accent);
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.meta-row {
  display: flex;
  gap: 16px;
  font-size: 8.5pt;
  color: var(--text-muted);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 20px;
}

h2 {
  font-family: 'Playfair Display', serif;
  font-size: 14pt;
  font-weight: 700;
  color: var(--primary);
  margin: 22px 0 10px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
  page-break-after: avoid;
}

h3 {
  font-family: 'Playfair Display', serif;
  font-size: 11.5pt;
  font-weight: 600;
  color: var(--primary);
  margin: 16px 0 6px 0;
  page-break-after: avoid;
}

p {
  margin: 0 0 10px 0;
  color: #2D3A32;
}

strong {
  font-weight: 600;
  color: var(--primary);
}

em {
  font-style: italic;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0 18px 0;
  font-size: 8.5pt;
  page-break-inside: avoid;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

th {
  background-color: var(--primary);
  color: #FFFFFF;
  font-weight: 600;
  text-align: left;
  padding: 7px 10px;
  font-size: 8pt;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

td {
  padding: 7px 10px;
  border-bottom: 1px solid var(--border);
  color: var(--text-dark);
}

tr:nth-child(even) {
  background-color: var(--primary-light);
}

.alert-box {
  background-color: var(--primary-light);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  padding: 10px 14px;
  border-radius: 6px;
  margin: 14px 0;
  font-size: 9pt;
  page-break-inside: avoid;
}

.alert-box strong {
  color: var(--accent);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 14px 0;
  page-break-inside: avoid;
}

.card {
  border: 1px solid var(--border);
  background: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
}

.card h4 {
  font-family: 'Playfair Display', serif;
  font-size: 10.5pt;
  color: var(--primary);
  margin: 0 0 4px 0;
}

.card p {
  font-size: 8.5pt;
  color: var(--text-muted);
  margin: 0;
}

pre {
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 7.5pt;
  line-height: 1.5;
  color: var(--primary);
  margin: 12px 0;
  page-break-inside: avoid;
}

ul, ol {
  margin: 0 0 10px 0;
  padding-left: 18px;
}

li {
  margin-bottom: 4px;
  color: #2D3A32;
}

.cta-box {
  background: linear-gradient(135deg, var(--primary) 0%, #12221B 100%);
  color: #FFFFFF;
  padding: 18px 22px;
  border-radius: 10px;
  margin-top: 24px;
  text-align: center;
  page-break-inside: avoid;
}

.cta-box h3 {
  color: #FFFFFF;
  font-size: 13pt;
  margin: 0 0 6px 0;
}

.cta-box p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 8.5pt;
  margin: 0 0 10px 0;
}

.cta-link {
  display: inline-block;
  background: var(--accent);
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 700;
  font-size: 8.5pt;
  padding: 6px 18px;
  border-radius: 6px;
}

.footer-stamp {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  font-size: 7.5pt;
  color: #8A9E94;
}
`;

// Guide 1: Master Pressing Guide HTML
const guide1Html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Beginner's Master Guide to Flower Pressing</title>
<style>${baseCss}</style>
</head>
<body>
<div class="guide-container">
  <div class="header-banner">
    <div class="logo-brand">H W A B E L L E &nbsp; B O T A N I C A L S</div>
    <div class="brand-motto">Fresh today. Fragile tomorrow. Framed forever.</div>
  </div>

  <span class="badge">Official Botanical Masterclass</span>
  <h1>The Beginner's Master Guide to Flower Pressing</h1>
  <div class="subtitle">How to Preserve Wedding Bouquets, Garden Blooms, and Sentimental Keepsakes in Crystal-Clear Acrylic</div>

  <div class="meta-row">
    <span><strong>Author:</strong> Hwabelle Botanical Design Studio</span>
    <span>•</span>
    <span><strong>Website:</strong> hwabelle.shop</span>
    <span>•</span>
    <span><strong>Skill Level:</strong> Beginner to Advanced</span>
  </div>

  <h2>Welcome to the Art of Botanical Preservation</h2>
  <p>Flower pressing is more than a timeless craft—it is the art of capturing a fleeting moment in nature and transforming it into permanent, vibrant artwork. Whether you are preserving your wedding bridal bouquet, saving petals from a memorial or anniversary, or turning garden blooms into framed botanical keepsakes, pressing allows delicate petals to retain their intricate structure and vivid color for decades.</p>
  <p>This master guide covers everything you need to achieve professional-grade results from your first press: understanding the science of moisture extraction, preparing your botanical layers, avoiding browning and mold, and finishing your pressed blooms into archival-grade framed art.</p>

  <h2>1. The Science of Botanical Preservation: Why Flowers Brown</h2>
  <p>To press flowers successfully, you must understand what happens inside plant tissue when it is flattened:</p>
  
  <h3>1. The Enemy is Moisture</h3>
  <p>Fresh flowers are composed of 80% to 95% water. When flower tissue is crushed without rapid moisture evacuation, trapped water breaks cell walls and triggers <strong>enzymatic oxidation</strong> (the same chemical reaction that turns sliced apples brown).</p>

  <h3>2. The Role of Constant, Even Pressure</h3>
  <p>Uneven pressure causes petals to wrinkle and curl. Traditional wooden presses warp under humidity and tighten unevenly with straps or center screws. <strong>Acrylic flower presses with four-corner brass bolt clamping</strong> deliver uniform 360-degree flat pressure, keeping every petal tissue flush against absorbent drying materials.</p>

  <h3>3. Light and Heat Factors</h3>
  <p>Flowers must dry in a cool, dark, and dry environment. Direct sunlight during the pressing phase bleaches delicate pigments (especially anthocyanins in reds, blues, and purples).</p>

  <h2>2. The Acrylic Advantage: Why Clear Plates Matter</h2>
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Traditional Wooden Press</th>
        <th>Hwabelle Acrylic Flower Press</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Arrangement Visibility</strong></td>
        <td>Blind alignment (cannot see petal shifts)</td>
        <td><strong>100% Transparent</strong> (adjust petals in real-time before clamping)</td>
      </tr>
      <tr>
        <td><strong>Pressure Distribution</strong></td>
        <td>Uneven belt/strap tension</td>
        <td><strong>Corner Brass Precision Bolts</strong> (consistent multi-point torque)</td>
      </tr>
      <tr>
        <td><strong>Material Durability</strong></td>
        <td>Can warp, absorb humidity, or harbor mold</td>
        <td><strong>Non-porous medical-grade acrylic</strong> (easy to sanitize and dry)</td>
      </tr>
      <tr>
        <td><strong>Visual Design Experience</strong></td>
        <td>Opaque and heavy</td>
        <td><strong>Modern elegant tabletop aesthetic</strong> (observe curing without opening)</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Step-by-Step Pressing Protocol</h2>
  <h3>Phase 1: Harvesting & Flower Preparation</h3>
  <ul>
    <li><strong>Harvest at Peak Bloom:</strong> Pick flowers when petals are fully open and vibrant, but before edges begin to dry or turn translucent.</li>
    <li><strong>Timing is Everything:</strong> Harvest mid-morning on a dry, sunny day after morning dew has completely evaporated (10:00 AM – 11:30 AM). Never press wet or rain-soaked flowers.</li>
    <li><strong>Trim Stems & Calyxes:</strong> Cut stems flush against the base with sharp floral snips. For bulky flowers (roses, carnations), slice the thick green receptacle in half vertically.</li>
  </ul>

  <h3>Phase 2: Building the "Drying Sandwich"</h3>
  <p>The secret to crisp, mold-free botanicals is the 5-layer absorption stack:</p>
  <pre>
[ Top Acrylic Press Plate (Crystal Clear) ]
  ├── [ Cardstock Dry Board (Rigid Support) ]
  ├── [ Sponge Paper Layer (Cushions Petal Curves & Distributes Pressure) ]
  ├── [ Blotting Paper Sheet (High-Absorption Moisture Wick) ]
  │     🌸 [ YOUR ARRANGE FLOWER SPECIMENS (0.5" Spacing) ] 🌸
  ├── [ Blotting Paper Sheet ]
  ├── [ Sponge Paper Layer ]
  ├── [ Cardstock Dry Board ]
[ Bottom Acrylic Press Plate ]
  </pre>
  
  <div class="alert-box">
    <strong>SPACING RULE:</strong> Leave at least 0.5 inches (1.2 cm) of empty space between flowers on the blotting paper so moisture from neighboring blooms does not cause damp spots.
  </div>

  <h3>Phase 3: Tightening & Clamping</h3>
  <ul>
    <li>Align the four brass corner bolts through the acrylic plates.</li>
    <li>Hand-tighten all four wing nuts evenly in an <strong>"X" pattern</strong> (top-left, bottom-right, top-right, bottom-left) to distribute pressure symmetrically.</li>
    <li>Tighten until the sponge layers compress firmly—do not overtighten to the point of crushing delicate petals.</li>
    <li>Check the arrangement through the transparent acrylic plate to ensure no petals shifted during tightening.</li>
  </ul>

  <h2>4. Drying Schedule & Timeline Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>Flower Variety</th>
        <th>Moisture Level</th>
        <th>Recommended Pressing Time</th>
        <th>Blotter Change Required?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Pansies, Violas, Johnny Jump-Ups</strong></td>
        <td>Low</td>
        <td><strong>4 – 7 Days</strong></td>
        <td>No</td>
      </tr>
      <tr>
        <td><strong>Delphinium, Larkspur, Cosmos</strong></td>
        <td>Low</td>
        <td><strong>5 – 8 Days</strong></td>
        <td>No</td>
      </tr>
      <tr>
        <td><strong>Baby's Breath, Lavender, Ferns</strong></td>
        <td>Very Low</td>
        <td><strong>3 – 5 Days</strong></td>
        <td>No</td>
      </tr>
      <tr>
        <td><strong>Hydrangeas (Individual Florets)</strong></td>
        <td>Medium</td>
        <td><strong>7 – 10 Days</strong></td>
        <td>Optional at Day 3</td>
      </tr>
      <tr>
        <td><strong>Ranunculus, Anemones, Daisies</strong></td>
        <td>Medium-High</td>
        <td><strong>10 – 14 Days</strong></td>
        <td>Yes (Change at Day 3 & Day 7)</td>
      </tr>
      <tr>
        <td><strong>Roses (Sliced or Petal-by-Petal)</strong></td>
        <td>High</td>
        <td><strong>14 – 21 Days</strong></td>
        <td>Yes (Change at Day 2, Day 5, Day 10)</td>
      </tr>
      <tr>
        <td><strong>Peonies, Dahlias (Dissected Petals)</strong></td>
        <td>High</td>
        <td><strong>18 – 25 Days</strong></td>
        <td>Yes (Change every 3 days)</td>
      </tr>
    </tbody>
  </table>

  <div class="alert-box">
    <strong>THE 48-HOUR BLOTTER SWAP RULE:</strong> For thick blooms (roses, ranunculus, lilies), open your press after 48 hours and replace the damp blotting paper with fresh dry sheets. This dramatically reduces browning risk and locks in vivid colors.
  </div>

  <h2>5. How to Test for 100% Dryness</h2>
  <ul>
    <li><strong>The Touch Test:</strong> Gently touch the center of the bloom with a clean, dry fingertip. It should feel like crisp, delicate parchment or tissue paper. If it feels cool, supple, or damp, clamp it back into the press for another 4–7 days.</li>
    <li><strong>The Tweezer Lift:</strong> Lift the flower using flat-tip botanical tweezers. A fully cured bloom will remain rigid and horizontal without drooping.</li>
  </ul>

  <h2>6. Post-Press Finishing, Framing & Display</h2>
  <ul>
    <li><strong>Glass-on-Glass Floating Frames:</strong> Place your arrangement between two panes of UV-filtering glass. Secure petals with microscopic dots of archival, acid-free PVA glue.</li>
    <li><strong>UV Resin Casting:</strong> Encapsulate pressed blooms in crystal resin for coasters, jewelry, and botanical trays. Ensure flowers are 100% dry before resin pouring.</li>
    <li><strong>Herbarium Mounting:</strong> Mount specimens on heavy 300gsm acid-free watercolor paper with handwritten botanical classifications.</li>
  </ul>

  <h2>7. Troubleshooting Common Mistakes</h2>
  <table>
    <thead>
      <tr>
        <th>Issue</th>
        <th>Root Cause</th>
        <th>Solution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Petals turned brown / translucent</strong></td>
        <td>Moisture trapped inside or flower was pressed wet</td>
        <td>Change blotter paper within first 48 hours; press only dry blooms</td>
      </tr>
      <tr>
        <td><strong>Petals stuck to blotting paper</strong></td>
        <td>High sugar or nectar content in petals</td>
        <td>Use parchment or wax paper liners between bloom and blotter</td>
      </tr>
      <tr>
        <td><strong>Colors faded quickly after framing</strong></td>
        <td>Exposure to direct sunlight or non-UV glass</td>
        <td>Display away from direct sun; use UV-resistant frame glass</td>
      </tr>
      <tr>
        <td><strong>Petals wrinkled or curled</strong></td>
        <td>Uneven pressure during clamping</td>
        <td>Use corner bolt acrylic press; tighten in an X-pattern</td>
      </tr>
    </tbody>
  </table>

  <div class="cta-box">
    <h3>The Hwabelle Acrylic Flower Press Kit</h3>
    <p>Dual crystal-clear acrylic plates (10"x10" Large + 3"x3" Pocket), heavy blotter sheets, compression sponges, and brass hardware.</p>
    <a href="https://hwabelle.shop/product/flower-press-kit" class="cta-link">Explore the Kit at hwabelle.shop</a>
  </div>

  <div class="footer-stamp">
    <span>Hwabelle Botanicals • hwabelle.shop</span>
    <span>The Beginner's Master Guide to Flower Pressing</span>
  </div>
</div>
</body>
</html>`;

// Guide 2: Selection & Harvesting Field Guide HTML
const guide2Html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Botanical Selection & Harvesting Field Guide</title>
<style>${baseCss}</style>
</head>
<body>
<div class="guide-container">
  <div class="header-banner">
    <div class="logo-brand">H W A B E L L E &nbsp; B O T A N I C A L S</div>
    <div class="brand-motto">Fresh today. Fragile tomorrow. Framed forever.</div>
  </div>

  <span class="badge">Official Botanical Field Manual</span>
  <h1>The Botanical Selection & Harvesting Field Guide</h1>
  <div class="subtitle">How to Forage, Pick, and Prepare Blooms for Flawless Pressed Flower Art</div>

  <div class="meta-row">
    <span><strong>Author:</strong> Hwabelle Botanical Design Studio</span>
    <span>•</span>
    <span><strong>Website:</strong> hwabelle.shop</span>
    <span>•</span>
    <span><strong>Skill Level:</strong> All Levels</span>
  </div>

  <h2>The Secret to Great Botanical Art Starts in the Garden</h2>
  <p>Not all flowers are created equal when it comes to pressing. Some blooms naturally press into tissue-thin, translucent masterpieces with almost zero effort, while others contain dense moisture cores that will turn brown and rot if not properly prepped and dissected beforehand.</p>
  <p>Whether you are harvesting from your backyard garden, foraging wild meadow florals, or dissecting a lavish wedding bouquet, this field guide teaches you how to select, harvest, and prepare any flower species for flawless results.</p>

  <h2>1. The 4 Golden Rules of Harvesting</h2>
  <div class="card-grid">
    <div class="card">
      <h4>Rule 1: The Morning Sun Window (10:00 – 11:30 AM)</h4>
      <p>Harvest after morning dew evaporates from petals, but before midday sun causes wilting or loss of turgor pressure.</p>
    </div>
    <div class="card">
      <h4>Rule 2: Peak Bloom Only (80%–100%)</h4>
      <p>Select flowers that have just opened. Avoid browning petal tips, insect bites, or flowers actively shedding oily pollen.</p>
    </div>
    <div class="card">
      <h4>Rule 3: Immediate Pressing</h4>
      <p>Petals begin wilting within 15–30 minutes of cutting. Keep cut stems in cool water in shade until ready to press.</p>
    </div>
    <div class="card">
      <h4>Rule 4: Clean, Angled Cuts</h4>
      <p>Use sterile, razor-sharp floral snips. Cut stems at a 45-degree angle without crushing the vascular bundle.</p>
    </div>
  </div>

  <h2>2. Flower Suitability Tiers</h2>
  <h3>Tier 1: Naturally Flat & Fast-Drying (Dry in 3–7 Days)</h3>
  <ul>
    <li><strong>Pansies & Violas:</strong> The gold standard of pressing. Retain ultra-vivid purples, yellows, and deep velvety blacks.</li>
    <li><strong>Delphinium & Larkspur:</strong> Petals press paper-thin and hold electric blue and lavender hues for years.</li>
    <li><strong>Cosmos & Buttercups:</strong> Delicate single-layer petals that create ethereal floating frame art.</li>
    <li><strong>Baby's Breath (Gypsophila):</strong> Excellent filler; dries crisp white in under 4 days.</li>
    <li><strong>Fern Fronds & Maidenhair:</strong> Flat greenery that adds architectural lines to arrangements.</li>
  </ul>

  <h3>Tier 2: Medium Petals & Delicate Centers (Dry in 7–12 Days)</h3>
  <ul>
    <li><strong>Hydrangeas:</strong> Do not press the entire head! Snip individual 4-petal florets from the cluster.</li>
    <li><strong>Anemones & Poppies:</strong> Remove thick stamens/pistils if pollen-dense, or blot heavily under the center disc.</li>
    <li><strong>Sweet Peas & Bleeding Hearts:</strong> Press sideways in profile to capture whimsical natural curves.</li>
  </ul>

  <h3>Tier 3: Dense & Bulky Blooms (Requires Dissection — Dry in 14–21 Days)</h3>
  <p>Flowers with thick, fleshy receptacles (roses, peonies, dahlias, carnations) cannot be pressed whole. If pressed without prep, the center stays wet while outer petals crumble.</p>

  <h2>3. The 3D Flower Dissection Technique</h2>
  <h3>Method A: The Petal-by-Petal Deconstruction</h3>
  <ol>
    <li>Gently pluck individual petals from the outer rim inward.</li>
    <li>Group petals by size (outer guard petals, medium middle petals, small inner curls).</li>
    <li>Press each petal individually between blotter sheets with 0.5" spacing.</li>
    <li>After 14 days of curing, reconstruct the 3D rose into a flat 2D spiral on archival cardstock using microscopic dots of acid-free PVA glue.</li>
  </ol>

  <h3>Method B: The Calyx Halving Method (Profile Slice)</h3>
  <ol>
    <li>Using a craft blade, slice the flower head vertically straight down through the center of the stem and green calyx.</li>
    <li>Gently scoop out the bulky, moisture-dense inner seed chamber with tweezers.</li>
    <li>Lay both halves flat, cut-side down, on the blotting paper.</li>
    <li>This preserves the iconic silhouette of the rosebud or carnation without excess bulk.</li>
  </ol>

  <h2>4. Greenery, Foliage & Botanical Accents</h2>
  <table>
    <thead>
      <tr>
        <th>Foliage Type</th>
        <th>Best Varieties</th>
        <th>Pressing Note</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Delicate Ferns</strong></td>
        <td>Maidenhair, Bracken, Boston Fern</td>
        <td>Place face down; press in 3–5 days</td>
      </tr>
      <tr>
        <td><strong>Silver / Muted Greens</strong></td>
        <td>Silver Dollar Eucalyptus, Dusty Miller</td>
        <td>Scrape thick stem bark with knife edge before pressing</td>
      </tr>
      <tr>
        <td><strong>Aromatic Herbs</strong></td>
        <td>Lavender sprigs, Rosemary, Thyme</td>
        <td>Retains subtle herbal fragrance and rigid texture</td>
      </tr>
      <tr>
        <td><strong>Ornamental Grasses</strong></td>
        <td>Bunny tails, Feather grass, Wheat heads</td>
        <td>Flatten gently with fingers before clamping</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Color Retention Science</h2>
  <ul>
    <li><strong>White Flowers (Bridal Lilies, White Roses):</strong> Lack protective pigments and turn amber easily. Swap blotter sheets every 24 hours for the first 3 days.</li>
    <li><strong>Red & Burgundy Flowers:</strong> Deep red pigments can turn very dark purple if dried too slowly. Add extra sponge pads to accelerate moisture draw.</li>
    <li><strong>Yellow & Orange Flowers (Marigolds, Sunflowers):</strong> Carotenoid pigments are extremely stable and maintain near 100% color vibrancy for decades.</li>
  </ul>

  <div class="alert-box">
    <strong>GARDEN FORAGER'S QUICK CHECKLIST:</strong>
    <br>✓ Harvested between 10:00 AM and 11:30 AM
    <br>✓ Zero moisture or dew droplets on petals
    <br>✓ Stems trimmed flush with 45° angle cut
    <br>✓ Heavy flowers sliced in half or deconstructed into petals
    <br>✓ Spaced at least 0.5" apart on Hwabelle blotting sheets
    <br>✓ Bolted evenly in X-pattern on Hwabelle Acrylic Press
  </div>

  <div class="cta-box">
    <h3>The Hwabelle Acrylic Flower Press Kit</h3>
    <p>Dual crystal-clear acrylic plates (10"x10" Large + 3"x3" Pocket), heavy blotter sheets, compression sponges, and brass hardware.</p>
    <a href="https://hwabelle.shop/product/flower-press-kit" class="cta-link">Explore the Kit at hwabelle.shop</a>
  </div>

  <div class="footer-stamp">
    <span>Hwabelle Botanicals • hwabelle.shop</span>
    <span>The Botanical Selection & Harvesting Field Guide</span>
  </div>
</div>
</body>
</html>`;

// Guide 3: Quick Start Guide HTML
const guide3Html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Press Flowers in 4 Simple Steps: Official Quick-Start Guide</title>
<style>${baseCss}</style>
</head>
<body>
<div class="guide-container">
  <div class="header-banner">
    <div class="logo-brand">H W A B E L L E &nbsp; B O T A N I C A L S</div>
    <div class="brand-motto">Fresh today. Fragile tomorrow. Framed forever.</div>
  </div>

  <span class="badge">Official Quick-Start Guide</span>
  <h1>Press Flowers in 4 Simple Steps</h1>
  <div class="subtitle">The Official Hwabelle Quick-Start Visual Operating Manual</div>

  <div class="meta-row">
    <span><strong>Framework:</strong> CHOOSE → ARRANGE → PRESS → CREATE</span>
    <span>•</span>
    <span><strong>Website:</strong> hwabelle.shop</span>
  </div>

  <h2>The 4-Step Picture-Book Framework</h2>
  <div class="card-grid">
    <div class="card">
      <h4>1. CHOOSE — Peak Fresh Blooms</h4>
      <p>Harvest flowers mid-morning after dew evaporates. Pick blooms 80%–100% open with zero moisture or browning. Trim stems flush with sharp floral snips.</p>
    </div>
    <div class="card">
      <h4>2. ARRANGE — 5-Layer Stack</h4>
      <p>Lay the acrylic plate, cardstock board, sponge pad, and blotter paper. Arrange flowers face-down with 0.5" spacing. Top with blotter, sponge, and cardstock.</p>
    </div>
    <div class="card">
      <h4>3. PRESS — Symmetrical Torque</h4>
      <p>Place the clear top plate, look through to verify petal alignment, insert corner bolts, and tighten wing nuts evenly in an X-pattern until sponges compress firmly.</p>
    </div>
    <div class="card">
      <h4>4. CREATE — Archival Framing</h4>
      <p>Cure for 1 to 3 weeks in a cool dark closet. Test with the Touch Test (feels like dry parchment). Lift with tweezers and mount in double-pane UV floating glass.</p>
    </div>
  </div>

  <h2>The 5-Layer Absorption Stack Diagram</h2>
  <pre>
[ Top Acrylic Press Plate (Crystal Clear) ]
  ├── [ Cardstock Dry Board (Rigid Support) ]
  ├── [ Sponge Compression Layer (Cushions Petal Curves) ]
  ├── [ Blotting Paper Sheet (High-Absorption Moisture Wick) ]
  │     🌸 [ YOUR ARRANGE FLOWER SPECIMENS (0.5" Spacing) ] 🌸
  ├── [ Blotting Paper Sheet ]
  ├── [ Sponge Compression Layer ]
  ├── [ Cardstock Dry Board ]
[ Bottom Acrylic Press Plate ]
  </pre>

  <h2>Hwabelle Press Kit Anatomy & Specifications</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Specification</th>
        <th>Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Large Acrylic Press Plates</strong></td>
        <td>10" × 10" (Dual 6mm Clear Acrylic)</td>
        <td>360° transparent view and warp-free flat pressure for full bouquet layouts.</td>
      </tr>
      <tr>
        <td><strong>Pocket Acrylic Press Plates</strong></td>
        <td>3" × 3" Portable Press</td>
        <td>Compact field press for garden walks, hiking, and travel foraging.</td>
      </tr>
      <tr>
        <td><strong>Heavyweight Blotting Sheets</strong></td>
        <td>250gsm Pure Cellulose</td>
        <td>Rapidly wicks moisture away from petal cellular walls to prevent browning.</td>
      </tr>
      <tr>
        <td><strong>Sponge Compression Pads</strong></td>
        <td>High-Density Open-Cell Foam</td>
        <td>Cushions petal curves and distributes uniform torque across varying thicknesses.</td>
      </tr>
      <tr>
        <td><strong>Solid Brass Hardware</strong></td>
        <td>4 Corner Precision Bolts & Wing Nuts</td>
        <td>Ensures multi-point flat clamping pressure that never loosens over time.</td>
      </tr>
    </tbody>
  </table>

  <h2>Care & Maintenance</h2>
  <ul>
    <li><strong>Sanitizing Plates:</strong> Wipe acrylic plates with a soft microfiber cloth and mild soapy water. Never use abrasive scrubbers or harsh ammonia-based solvents.</li>
    <li><strong>Reusing Blotters:</strong> If blotting paper is damp but clean, dry flat on a rack in a warm room before reusing. Replace discolored sheets.</li>
    <li><strong>Storage:</strong> Store the assembled press inside the included protective felt pouch away from direct heat and sunlight.</li>
  </ul>

  <div class="cta-box">
    <h3>The Hwabelle Acrylic Flower Press Kit</h3>
    <p>Everything you need for archival flower preservation is included in the box.</p>
    <a href="https://hwabelle.shop/product/flower-press-kit" class="cta-link">Explore the Kit at hwabelle.shop</a>
  </div>

  <div class="footer-stamp">
    <span>Hwabelle Botanicals • hwabelle.shop</span>
    <span>Press Flowers in 4 Simple Steps</span>
  </div>
</div>
</body>
</html>`;

// Write temporary HTML files
const file1 = path.join(tempHtmlDir, "guide1.html");
const file2 = path.join(tempHtmlDir, "guide2.html");
const file3 = path.join(tempHtmlDir, "guide3.html");

await fs.writeFile(file1, guide1Html, "utf-8");
await fs.writeFile(file2, guide2Html, "utf-8");
await fs.writeFile(file3, guide3Html, "utf-8");

const pdf1 = path.join(outputDir, "hwabelle-flower-pressing-master-guide.pdf");
const pdf2 = path.join(outputDir, "hwabelle-flower-selection-and-prep-guide.pdf");
const pdf3 = path.join(outputDir, "hwabelle-official-quick-start-guide.pdf");

console.log("Generating clean PDFs with headless Edge...");

const cmd1 = `powershell -Command "Start-Process '${edgePath}' -ArgumentList '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=${pdf1}', 'file:///${file1.replace(/\\\\/g, "/")}' -Wait"`;
const cmd2 = `powershell -Command "Start-Process '${edgePath}' -ArgumentList '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=${pdf2}', 'file:///${file2.replace(/\\\\/g, "/")}' -Wait"`;
const cmd3 = `powershell -Command "Start-Process '${edgePath}' -ArgumentList '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=${pdf3}', 'file:///${file3.replace(/\\\\/g, "/")}' -Wait"`;

await execAsync(cmd1);
await execAsync(cmd2);
await execAsync(cmd3);

const distOutputDir = path.resolve("dist/guides");
try {
  await fs.mkdir(distOutputDir, { recursive: true });
  await fs.copyFile(pdf1, path.join(distOutputDir, "hwabelle-flower-pressing-master-guide.pdf"));
  await fs.copyFile(pdf2, path.join(distOutputDir, "hwabelle-flower-selection-and-prep-guide.pdf"));
  await fs.copyFile(pdf3, path.join(distOutputDir, "hwabelle-official-quick-start-guide.pdf"));
} catch (err) {
  // dist may not exist during standalone run, ignore
}

console.log("PDF generation complete! Clean files saved to public/guides/ and dist/guides/");
