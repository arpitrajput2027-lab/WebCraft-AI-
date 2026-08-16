import { generateResponse } from "../config/openRouter.js";
import { User } from "../models/userModel.js";
import { Website } from "../models/websiteModel.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- REALISTIC, LONG-FORM CONTENT (Write actual paragraphs, features, and testimonials relevant to the user's prompt. NO 'lorem ipsum', NO short generic text like 'Welcome to our site')
- Smooth transitions & hover effects
- Continuous single-page layout (Landing page style with sections like Hero, About, Services/Features, Testimonials, Contact)
- Navigation bar links MUST scroll to sections on the same page using IDs (e.g. href="#about")
- NO multi-page links or separate HTML pages
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- NO page tab-switching with Javascript
- ALL content MUST be visible in a single continuous scrollable layout
- Use native HTML anchor links (href="#about") for navigation
- No page reloads
- No dead UI
- No broken buttons

--------------------------------------------------
LAYOUT STRUCTURE (MANDATORY)
--------------------------------------------------
- ALL sections MUST be stacked vertically in a single page
- DO NOT use CSS like 'display: none' to hide sections
- Users should be able to scroll from top to bottom to see everything
- The Navigation Bar MUST be sticky/fixed at the top

--------------------------------------------------
REQUIRED SECTIONS (STACKED VERTICALLY)
--------------------------------------------------
- Hero Section (Full viewport height, strong call to action)
- About / Mission Section
- Features / Services Section
- Testimonials / Social Proof Section
- Contact Form / Footer Section

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation MUST use smooth scrolling anchor links (e.g., <a href="#features">)
- Forms must have JS validation but NOT submit anywhere
- Buttons must show hover + active states
- Add subtle reveal animations on scroll using Intersection Observer or pure CSS

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "title": "Short, meaningful project name (3-5 words max, like 'Fitness Studio Landing Page' or 'SaaS Dashboard')",
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" })
    }
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.credits < 10) {
      return res.status(400).json({ message: "You have not enough credits to generate a website" })
    }

    const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt)
    let raw = ""
    let parsed = null
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(finalPrompt)
      parsed = await extractJson(raw)

      if (!parsed) {
        raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON")
        parsed = await extractJson(raw)
      }
    }
    if (!parsed.code) {
      return res.status(400).json({ message: "AI returned invalid response" })
    }
    const website = await Website.create({
      user: user._id,
      title: parsed.title || prompt.slice(0, 60),
      latestCode: parsed.code,
      conversation: [
        { role: "user", content: prompt },
        { role: "ai", content: parsed.message }
      ]
    })
    user.credits = user.credits - 10
    await user.save()
    return res.status(201).json({
      websiteId: website._id,
      remainingCredits: user.credits
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }
    return res.status(200).json(website)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const changeWebsite = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" })
    }
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.credits < 5) {
      return res.status(400).json({ message: "You have not enough credits to generate a website" })
    }

    const udpatePrompt = `
    UPDATE THIS HTML WEBSITE.
    
    CURRENT CODE:
    ${website.latestCode}

    USER REQUEST:
    ${prompt}

    RETURN RAW JSON ONLY:
    {
      "message":"Short confirmation",
      "code":"<UPDATE FULL HTML>"
    }
    `

    let raw = ""
    let parsed = null
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(udpatePrompt)
      parsed = await extractJson(raw)

      if (!parsed) {
        raw = await generateResponse(udpatePrompt + "\n\nRETURN ONLY RAW JSON")
        parsed = await extractJson(raw)
      }
    }
    if (!parsed.code) {
      return res.status(400).json({ message: "AI returned invalid response" })
    }

    website.conversation.push(
      { role: "ai", content: parsed.message },
      { role: "user", content: prompt },
    )

    website.latestCode = parsed.code
    await website.save()
    user.credits = user.credits - 5
    await user.save()
    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCredits: user.credits
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getAllWebsite = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id })
    return res.status(200).json(websites)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(404).json({ message: "Website not found" })
    }
    return res.status(200).json({ message: "Website deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const renameWebsite = async (req, res) => {
  try {
    const { title } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" })
    }
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: title.trim() },
      { new: true }
    )
    if (!website) {
      return res.status(404).json({ message: "Website not found" })
    }
    return res.status(200).json({ message: "Renamed successfully", title: website.title })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}