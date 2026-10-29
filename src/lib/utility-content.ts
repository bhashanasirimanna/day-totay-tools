import { formatNumber } from "./converters";

export interface UtilityContent {
  slug: string;
  /** H1 and breadcrumb label. */
  name: string;
  /** <title>; the site template appends the brand. */
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  what: { heading: string; paragraphs: string[] };
  steps: { title: string; body: string }[];
  formulas: {
    heading: string;
    paragraphs: string[];
    /** Rendered as monospace chips. */
    formulas: string[];
    table?: { caption: string; headers: string[]; rows: string[][] };
  };
  faqs: { q: string; a: string }[];
}

const r = (n: number, d = 4) => formatNumber(Number(n.toFixed(d)));

const pxToRemRows = [8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64].map((px) => [
  `${px}px`,
  `${r(px / 16)}rem`,
]);
const pxToVhRows = [50, 100, 200, 300, 500, 540, 800, 1080].map((px) => [
  `${px}px`,
  `${r((px / 1080) * 100, 2)}vh`,
  `${r((px / 768) * 100, 2)}vh`,
]);
const vhToPxRows = [1, 10, 25, 50, 75, 100].map((vh) => [
  `${vh}vh`,
  `${r((vh / 100) * 1080, 2)}px`,
  `${r((vh / 100) * 768, 2)}px`,
]);

export const utilityContent: Record<string, UtilityContent> = {
  "ai-humanizer": {
    slug: "ai-humanizer",
    name: "AI Humanizer",
    seoTitle: "AI Humanizer - Make AI Text Sound 100% Human",
    seoDescription:
      "Rewrite AI-generated text so it sounds natural and human-written. Free AI humanizer with tone control, live word counts and one-click copy. No sign-up.",
    keywords: [
      "ai humanizer",
      "humanize ai text",
      "make ai text sound human",
      "ai text humanizer free",
      "rewrite ai text",
      "bypass ai detector",
    ],
    intro:
      "Paste text written by ChatGPT or another AI, pick a tone, and get a version that reads like a real person wrote it. Same meaning, more natural voice.",
    what: {
      heading: "What is an AI Humanizer?",
      paragraphs: [
        "An AI humanizer is a writing tool that rewrites machine-generated text so it sounds like it came from a person. AI models tend to write in a very even, polished way: similar sentence lengths, stock transitions such as “furthermore” and “moreover”, and tidy summaries that repeat what was just said. Readers notice this flatness even when they cannot say why.",
        "This tool uses a large language model, prompted to act as an experienced copywriter, to rewrite your draft. It varies sentence length and structure, swaps overused AI words for plain ones, and adjusts the voice to the tone you choose, all while keeping your facts, names, numbers and meaning intact.",
        "Typical uses include polishing blog posts, emails, product descriptions and essay drafts that began life as AI output. It is an editing aid, not a guarantee: no tool can promise that every AI detector will pass a text, so always read the result and make it your own.",
      ],
    },
    steps: [
      { title: "Paste your text", body: "Drop the AI-generated draft into the input box. The live counter shows words and characters, and the limit is 5,000 characters per request." },
      { title: "Choose a tone", body: "Pick Professional for work writing, Casual for a friendly voice, Engaging for lively blog-style copy, or Academic for a formal, measured register." },
      { title: "Humanize and copy", body: "Press Humanize Text and wait a few seconds. Read the result, tweak anything you like, then press Copy to Clipboard to use it elsewhere." },
    ],
    formulas: {
      heading: "How to make AI text sound human",
      paragraphs: [
        "Even without a tool, a few editing habits go a long way. The tool automates them, but knowing them helps you finish the job by hand.",
        "Vary your rhythm: mix short sentences with longer ones, and do not start every sentence the same way. Cut filler words and stock phrases such as “delve into”, “in today’s fast-paced world” and “it is important to note”. Prefer concrete detail, a specific example or a real opinion over general statements. Use contractions where the tone allows, and let the occasional question or fragment break the pattern. Finally, read the text aloud: if it sounds stiff, a person would not have written it that way.",
      ],
      formulas: [
        "Vary sentence length: short + medium + long",
        "Replace stock phrases with plain words",
        "Add one specific detail or opinion per paragraph",
      ],
    },
    faqs: [
      { q: "What does an AI humanizer do?", a: "It rewrites AI-generated text so it reads more naturally, with varied sentence structure, plainer word choices and a consistent tone, while keeping the original meaning." },
      { q: "Will it bypass AI detectors?", a: "It is designed to remove the patterns that detectors and readers associate with machine writing, but no tool can guarantee a pass. Detectors disagree with each other and change often, so review and personalize the final text." },
      { q: "Is the AI humanizer free?", a: "Yes. There is no sign-up and no watermark. The site is supported by advertising, and fair-use limits may apply when the service is busy." },
      { q: "Does it change the meaning of my text?", a: "It is instructed to keep your facts, names, numbers and key points. Still, always proofread the output, especially for technical or legal content." },
      { q: "Is my text stored?", a: "ToolBunch does not store the text you submit. It is sent securely to our AI provider only to generate the rewrite, so avoid pasting confidential or personal information." },
      { q: "How much text can I humanize at once?", a: "Up to 5,000 characters per request, which is roughly 800 words. For longer documents, process them in sections." },
      { q: "Which tone should I choose?", a: "Professional suits emails and reports, Casual suits social posts and chatty blogs, Engaging suits marketing copy, and Academic suits essays and formal writing." },
    ],
  },
  "px-to-vh": {
    slug: "px-to-vh",
    name: "PX to VH Converter",
    seoTitle: "PX to VH Converter - Viewport Height Calculator",
    seoDescription:
      "Convert pixels to vh instantly. Enter any viewport height and get an accurate CSS vh value, with the formula, a quick table and a one-click copy button.",
    keywords: ["px to vh", "pixels to vh", "px to vh converter", "css viewport height calculator", "px to viewport height"],
    intro:
      "Turn a pixel value into viewport height units. Set the viewport height you are designing for and copy a ready-to-use CSS value.",
    what: {
      heading: "What is a PX to VH converter and why use it?",
      paragraphs: [
        "A px to vh converter translates a fixed pixel size into vh, a CSS unit equal to 1% of the viewport height. One vh is one hundredth of the browser window's height, so 50vh is always half the visible screen, whatever the device.",
        "Designers hand over mockups in pixels, but full-screen hero sections, sticky panels and modals are usually built with vh so they scale with the screen. Converting by hand is easy to get wrong, especially when you switch between a 1080p desktop and a 768px laptop. This tool does the maths and lets you copy the result straight into your stylesheet.",
      ],
    },
    steps: [
      { title: "Enter the pixel value", body: "Type the size in pixels that you want to convert, for example the height of an element in your design file." },
      { title: "Set the viewport height", body: "Enter the viewport height in pixels, or pick a preset such as 1080 or 768. This is the height of the screen or browser window you are designing for." },
      { title: "Copy the result", body: "The vh value updates instantly. Press Copy vh value and paste it into your CSS." },
    ],
    formulas: {
      heading: "How PX to VH is calculated",
      paragraphs: [
        "Because 1vh equals 1% of the viewport height, you divide the pixel value by the viewport height and multiply by 100. The result depends entirely on the viewport height, which is why the same 300px is 27.78vh on a 1080px screen but 39.06vh on a 768px screen.",
        "Use the inner height of the browser window, not the monitor resolution. Browser toolbars take up space, so a 1080px monitor often has a viewport of about 950px.",
      ],
      formulas: ["vh = (px ÷ viewport height) × 100", "px = (vh ÷ 100) × viewport height"],
      table: {
        caption: "Pixels converted to vh at two common viewport heights",
        headers: ["Pixels", "At 1080px height", "At 768px height"],
        rows: pxToVhRows,
      },
    },
    faqs: [
      { q: "How do I convert px to vh?", a: `Divide the pixel value by the viewport height in pixels and multiply by 100. For example, 540px on a 1080px viewport is (540 ÷ 1080) × 100 = ${r((540 / 1080) * 100, 2)}vh.` },
      { q: "What is 100vh in pixels?", a: "100vh equals the full viewport height. On a 1080px tall viewport that is 1080px, and on a 768px tall viewport it is 768px." },
      { q: "Which viewport height should I use?", a: "Use the inner height of the window your users will most likely have. If you are unsure, test a few presets, or check window.innerHeight in your browser console." },
      { q: "Why does 100vh look too tall on mobile browsers?", a: "Mobile browsers hide and show the address bar as you scroll, so 100vh can be taller than the visible area. The dvh and svh units were added to CSS to handle this." },
      { q: "Is px to vh the same as px to vw?", a: "The formula is the same but vw uses the viewport width instead of the height. Divide by the viewport width and multiply by 100." },
    ],
  },

  "vh-to-px": {
    slug: "vh-to-px",
    name: "VH to PX Converter",
    seoTitle: "VH to PX Converter - Viewport Height to Pixels",
    seoDescription:
      "Convert vh to pixels for any screen height. Enter your viewport height, get the exact px value, see the formula and copy it with one click.",
    keywords: ["vh to px", "vh to pixels", "vh to px converter", "viewport height to pixels", "100vh in pixels"],
    intro:
      "Find out how many pixels a vh value really is. Enter the viewport height and copy the exact pixel size.",
    what: {
      heading: "What is a VH to PX converter and why use it?",
      paragraphs: [
        "A vh to px converter shows the pixel size behind a viewport height value. Since 1vh is 1% of the browser window's height, the pixel result changes with every screen.",
        "It is useful for debugging layouts, writing media queries, checking that a hero section fits above the fold, and translating CSS back into design specs that are written in pixels.",
      ],
    },
    steps: [
      { title: "Enter the vh value", body: "Type the viewport height units, for example 80 for 80vh." },
      { title: "Set the viewport height", body: "Enter the viewport height in pixels or choose a preset." },
      { title: "Copy the pixels", body: "The pixel value appears instantly. Press Copy px value to use it." },
    ],
    formulas: {
      heading: "How VH to PX is calculated",
      paragraphs: [
        "Divide the vh value by 100 to get a fraction of the screen, then multiply by the viewport height in pixels. 25vh on a 1080px screen is a quarter of 1080, which is 270px.",
        "The result is only exact for the viewport height you enter. On a different device, the same CSS value renders at a different pixel size.",
      ],
      formulas: ["px = (vh ÷ 100) × viewport height"],
      table: {
        caption: "vh converted to pixels at two common viewport heights",
        headers: ["Viewport height units", "At 1080px height", "At 768px height"],
        rows: vhToPxRows,
      },
    },
    faqs: [
      { q: "How do I convert vh to px?", a: `Multiply the vh value by the viewport height and divide by 100. For example, 50vh on a 900px viewport is (50 ÷ 100) × 900 = ${r(0.5 * 900, 0)}px.` },
      { q: "How many pixels is 1vh?", a: "1vh is 1% of the viewport height. On a 1080px viewport that is 10.8px, and on a 768px viewport it is 7.68px." },
      { q: "Is vh relative to the screen or the browser window?", a: "To the browser window's viewport, the area where the page is drawn, not the physical monitor. Toolbars and dev tools reduce it." },
      { q: "Does vh update when I resize the window?", a: "Yes. vh is recalculated whenever the viewport changes, so elements sized in vh grow and shrink with the window." },
    ],
  },

  "px-to-rem": {
    slug: "px-to-rem",
    name: "PX to REM Converter",
    seoTitle: "PX to REM Converter - Pixels to REM Calculator",
    seoDescription:
      "Convert px to rem with a custom base font size. Free CSS calculator with a quick conversion table, formula and one-click copy.",
    keywords: ["px to rem", "pixels to rem", "px to rem converter", "px to rem calculator", "css rem converter"],
    intro:
      "Convert pixel sizes to rem for scalable, accessible CSS. Set your root font size and copy the value.",
    what: {
      heading: "What is a PX to REM converter and why use it?",
      paragraphs: [
        "A px to rem converter turns fixed pixel sizes into rem units. One rem equals the font size of the root html element, which is 16px in most browsers unless you change it.",
        "Sizing text, spacing and breakpoints in rem lets your layout respect the font size a visitor has chosen in their browser. That makes sites more accessible than hard-coded pixels, and the converter saves you doing the division for every value in a design file.",
      ],
    },
    steps: [
      { title: "Enter the pixel value", body: "Type the size in pixels, such as 24 for a 24px heading." },
      { title: "Check the base font size", body: "The default is 16px. Change it if your html element uses another font-size, for example 10px." },
      { title: "Copy the rem value", body: "Press Copy rem value and paste it into your CSS." },
    ],
    formulas: {
      heading: "How PX to REM is calculated",
      paragraphs: [
        "Divide the pixel value by the root font size. With the default 16px base, 24px is 24 ÷ 16 = 1.5rem.",
        "If you set html { font-size: 62.5% } the base becomes 10px, so 24px is 2.4rem. Always use the same base here as in your stylesheet.",
      ],
      formulas: ["rem = px ÷ root font size", "px = rem × root font size"],
      table: {
        caption: "Pixels converted to rem at a 16px base",
        headers: ["Pixels", "REM (16px base)"],
        rows: pxToRemRows,
      },
    },
    faqs: [
      { q: "How do I convert px to rem?", a: "Divide the pixel value by the root font size. At the default 16px, 32px ÷ 16 = 2rem." },
      { q: "What is 16px in rem?", a: "16px is 1rem when the root font size is the browser default of 16px." },
      { q: "Should I use rem or px?", a: "Use rem for font sizes, spacing and widths that should scale with the user's font settings. Pixels are fine for borders and thin details that should stay fixed." },
      { q: "What is the difference between rem and em?", a: "rem is relative to the root element's font size, while em is relative to the current element's font size, so em values compound when nested." },
    ],
  },

  "rem-to-px": {
    slug: "rem-to-px",
    name: "REM to PX Converter",
    seoTitle: "REM to PX Converter - REM to Pixels Calculator",
    seoDescription:
      "Convert rem to px with your own base font size. Free CSS calculator with formula, examples and a one-click copy button.",
    keywords: ["rem to px", "rem to pixels", "rem to px converter", "rem to px calculator", "css rem to pixels"],
    intro:
      "See the pixel size behind any rem value. Set your root font size and copy the result.",
    what: {
      heading: "What is a REM to PX converter and why use it?",
      paragraphs: [
        "A rem to px converter shows how large a rem value renders in pixels. Because rem is relative to the root font size, the same 1.5rem can be 24px or 15px depending on your base.",
        "It helps when you need to match a rem-based stylesheet to a pixel-based design spec, debug spacing that looks off, or explain sizes to teammates who think in pixels.",
      ],
    },
    steps: [
      { title: "Enter the rem value", body: "Type the rem size, such as 1.25." },
      { title: "Check the base font size", body: "The default is 16px. Change it to match your html font-size." },
      { title: "Copy the pixel value", body: "Press Copy px value to copy the result." },
    ],
    formulas: {
      heading: "How REM to PX is calculated",
      paragraphs: [
        "Multiply the rem value by the root font size in pixels. At 16px, 1.5rem is 1.5 × 16 = 24px.",
        "Browsers let users raise or lower their default font size, so a rem-based layout can render larger than your calculation on their device. That is a feature, not a bug.",
      ],
      formulas: ["px = rem × root font size"],
      table: {
        caption: "REM converted to pixels at a 16px base",
        headers: ["REM", "Pixels (16px base)"],
        rows: [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4].map((rem) => [`${rem}rem`, `${r(rem * 16)}px`]),
      },
    },
    faqs: [
      { q: "How do I convert rem to px?", a: "Multiply the rem value by the root font size. At 16px, 2.5rem × 16 = 40px." },
      { q: "How many pixels is 1rem?", a: "1rem is 16px by default, or whatever font-size is set on the html element." },
      { q: "Why is my rem value not the pixel size I expect?", a: "Check the html font-size. If it is set to 62.5%, 1rem is 10px, and if a user changed their browser font size it will differ again." },
    ],
  },

  "hex-to-rgb": {
    slug: "hex-to-rgb",
    name: "HEX to RGB Converter",
    seoTitle: "HEX to RGB Converter - Color Code Converter",
    seoDescription:
      "Convert HEX color codes to RGB instantly with a live color preview. Supports 3, 4, 6 and 8 digit hex, with one-click copy for CSS.",
    keywords: ["hex to rgb", "hex to rgb converter", "hex color to rgb", "color code converter", "hex to rgba"],
    intro:
      "Paste a hex color code and get its RGB value with a live preview, ready to copy into your CSS.",
    what: {
      heading: "What is a HEX to RGB converter and why use it?",
      paragraphs: [
        "A HEX to RGB converter translates a hexadecimal color such as #2563eb into its red, green and blue values, rgb(37, 99, 235). Both describe the same color in different notation.",
        "Design tools usually export hex, but CSS functions, canvas code and transparency effects often need rgb or rgba. Converting by hand means working in base 16, so this tool does it instantly and shows the color so you can confirm it is right.",
      ],
    },
    steps: [
      { title: "Enter a hex code", body: "Type or paste a color such as #ff5733, or choose one with the color picker. The # is optional." },
      { title: "Check the preview", body: "The swatch shows the color. A red message appears if the code is not valid." },
      { title: "Copy the RGB value", body: "Press Copy RGB for the full rgb() string, or Copy values only for the three numbers." },
    ],
    formulas: {
      heading: "How HEX is converted to RGB",
      paragraphs: [
        "A six-digit hex code is three pairs: red, green and blue. Each pair is a base-16 number from 00 to ff, which equals 0 to 255. For #ff5733: ff = 255, 57 = 87, 33 = 51, giving rgb(255, 87, 51).",
        "Three-digit hex is shorthand where each digit is doubled, so #f80 means #ff8800. Eight-digit hex adds an alpha pair; the tool converts it to a 0 to 1 opacity and returns an rgba() value.",
      ],
      formulas: ["R = hex digits 1–2 → decimal", "G = hex digits 3–4 → decimal", "B = hex digits 5–6 → decimal"],
    },
    faqs: [
      { q: "How do I convert hex to RGB?", a: "Split the code into three pairs and convert each from base 16 to decimal. #1e90ff becomes 1e = 30, 90 = 144, ff = 255, so rgb(30, 144, 255)." },
      { q: "Does it work without the # symbol?", a: "Yes. Both ff5733 and #ff5733 are accepted." },
      { q: "Does it support 3-digit hex codes?", a: "Yes. #fff is expanded to #ffffff, which is rgb(255, 255, 255)." },
      { q: "What about transparency?", a: "Enter an 8-digit code such as #ff573380. The last pair is the alpha channel and the result is returned as rgba()." },
    ],
  },

  "rgb-to-hex": {
    slug: "rgb-to-hex",
    name: "RGB to HEX Converter",
    seoTitle: "RGB to HEX Converter - Color Code Converter",
    seoDescription:
      "Convert RGB values to a HEX color code instantly with a live preview. Enter red, green and blue, then copy the hex code for CSS in one click.",
    keywords: ["rgb to hex", "rgb to hex converter", "rgb to hex color", "color code converter", "rgb to html color"],
    intro:
      "Enter red, green and blue values and get the matching hex code, with a live preview you can copy.",
    what: {
      heading: "What is an RGB to HEX converter and why use it?",
      paragraphs: [
        "An RGB to HEX converter turns the three color channels of rgb(37, 99, 235) into the compact hex code #2563eb. Both notations are valid in CSS and describe exactly the same color.",
        "Hex is shorter and is the standard in design tools, brand guidelines and HTML attributes, so you will often need to convert values from code, screenshots or color pickers into hex.",
      ],
    },
    steps: [
      { title: "Enter red, green and blue", body: "Type a whole number from 0 to 255 in each field, or use the color picker." },
      { title: "Check the preview", body: "The swatch updates as you type. Out-of-range values show an error." },
      { title: "Copy the hex code", body: "Press Copy HEX, or Copy without # if you need the bare digits." },
    ],
    formulas: {
      heading: "How RGB is converted to HEX",
      paragraphs: [
        "Convert each channel from decimal to a two-digit base-16 number and join them after a #. For rgb(255, 87, 51): 255 = ff, 87 = 57, 51 = 33, giving #ff5733.",
        "Values below 16 need a leading zero, so 5 becomes 05 and rgb(0, 0, 5) is #000005.",
      ],
      formulas: ["HEX = # + hex(R) + hex(G) + hex(B)", "hex(n) = n in base 16, padded to 2 digits"],
    },
    faqs: [
      { q: "How do I convert RGB to hex?", a: "Convert red, green and blue to two-digit hexadecimal numbers and put them after a #. rgb(0, 128, 255) is #0080ff." },
      { q: "What range can RGB values be?", a: "Each channel is a whole number from 0 to 255, where 0 is none of that color and 255 is full intensity." },
      { q: "Is hex case sensitive?", a: "No. #FF5733 and #ff5733 are the same color. This tool outputs lowercase in the copy value." },
      { q: "What is rgb(255, 255, 255) in hex?", a: "#ffffff, which is white. rgb(0, 0, 0) is #000000, black." },
    ],
  },

  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    seoTitle: "Word Counter - Count Words & Characters Online",
    seoDescription:
      "Free online word counter. Count words, characters with and without spaces, sentences and paragraphs in real time as you type or paste text.",
    keywords: ["word counter", "character counter", "word count online", "count words", "paragraph counter", "reading time calculator"],
    intro:
      "Paste or type your text to count words, characters, sentences and paragraphs as you go. Nothing leaves your browser.",
    what: {
      heading: "What is a word counter and why use it?",
      paragraphs: [
        "A word counter measures the length of a piece of text: how many words, characters, sentences and paragraphs it contains. This one updates on every keystroke and also estimates reading time.",
        "Length limits are everywhere. Essays have word counts, meta descriptions and tweets have character caps, and ad copy, product titles and SMS messages all have hard limits. Checking length as you write saves time cutting or padding afterwards.",
      ],
    },
    steps: [
      { title: "Add your text", body: "Type in the box or paste text from any document. Counts update immediately." },
      { title: "Read the counts", body: "See words, characters with and without spaces, paragraphs, sentences and estimated reading time at the top." },
      { title: "Copy what you need", body: "Press Copy counts to copy the statistics, or Copy text to copy your text. Clear empties the box." },
    ],
    formulas: {
      heading: "How the counts are calculated",
      paragraphs: [
        "Words are groups of non-space characters separated by spaces, tabs or line breaks, so a hyphenated word like well-known counts as one. Characters count every letter, number, space and symbol, and the no-spaces figure leaves out spaces and tabs but still counts line breaks.",
        "Paragraphs are blocks of text separated by at least one blank line. Sentences are counted by ending punctuation (. ! ?). Reading time assumes about 238 words per minute, the average adult silent reading speed.",
      ],
      formulas: ["reading time = words ÷ 238 words per minute"],
    },
    faqs: [
      { q: "How does the word counter count words?", a: "It counts every group of characters separated by whitespace. Numbers and symbols standing alone count as words, just as in most word processors." },
      { q: "What is the difference between characters and characters without spaces?", a: "Characters counts everything, including spaces, tabs and line breaks. Characters without spaces leaves out the spaces and tabs, and the Spaces figure shows how many there are." },
      { q: "Is my text saved or uploaded?", a: "No. The counting runs in your browser and your text is never sent to a server." },
      { q: "How are paragraphs counted?", a: "A paragraph is a block of text separated from the next by a blank line. Single line breaks stay within the same paragraph." },
      { q: "How long should a meta description be?", a: "Around 155 characters, so search engines can show it without cutting it off. Use the character count to check." },
    ],
  },

  "password-generator": {
    slug: "password-generator",
    name: "Password Generator",
    seoTitle: "Password Generator - Strong Random Passwords",
    seoDescription:
      "Generate strong, random passwords with a custom length and uppercase, lowercase, number and symbol options. Created in your browser and never stored.",
    keywords: ["password generator", "strong password generator", "random password generator", "secure password", "generate password online"],
    intro:
      "Create a strong random password in one click. Choose the length and character types, then copy it.",
    what: {
      heading: "What is a password generator and why use it?",
      paragraphs: [
        "A password generator creates passwords from truly random characters instead of words and patterns that people choose. Human-made passwords tend to be short, reused and predictable, which is how most accounts get broken into.",
        "This generator uses your browser's built-in cryptographic random number generator. The password is created on your device, is never sent anywhere and is never stored, so only you ever see it.",
      ],
    },
    steps: [
      { title: "Set the length", body: "Drag the slider from 4 to 64 characters. Aim for at least 16 for important accounts." },
      { title: "Choose characters", body: "Tick uppercase, lowercase, numbers and symbols. At least one type must stay selected." },
      { title: "Copy the password", body: "A new password appears each time you change an option. Press Generate new for another one, then Copy password. Store it in a password manager." },
    ],
    formulas: {
      heading: "How password strength is estimated",
      paragraphs: [
        "Strength is measured in bits of entropy: the length multiplied by log2 of the number of possible characters. Each extra bit doubles the number of guesses an attacker needs. Length matters more than complexity, since every added character multiplies the possibilities.",
        "As a guide, below 40 bits is weak, 60 bits resists most online attacks, and 90 bits or more is very strong. A 16-character password using all four character types has about 100 bits.",
      ],
      formulas: ["entropy (bits) = length × log2(pool size)"],
    },
    faqs: [
      { q: "Is this password generator safe to use?", a: "Yes. Passwords are generated in your browser with the Web Crypto API (crypto.getRandomValues) and are never sent to a server or stored." },
      { q: "How long should my password be?", a: "At least 12 characters for general accounts and 16 or more for email, banking and password manager master passwords." },
      { q: "Should I include symbols?", a: "Symbols increase strength, but some sites reject certain ones. If a site refuses your password, turn off symbols and increase the length instead." },
      { q: "Can I reuse a generated password?", a: "No. Use a different password for every account so one breach cannot unlock the others, and keep them in a password manager." },
      { q: "Why does each password include every type I picked?", a: "The generator guarantees at least one character from each selected type, because many sites require it, then shuffles the result." },
    ],
  },
  "bg-remover": {
    slug: "bg-remover",
    name: "Image Background Remover",
    seoTitle: "Background Remover - Free Transparent PNG",
    seoDescription:
      "Remove the background from any image for free and download a transparent PNG. Runs in your browser, so your photo is never uploaded. No signup.",
    keywords: [
      "background remover",
      "remove background from image",
      "transparent background maker",
      "remove bg free",
      "png background remover",
    ],
    intro:
      "Upload a photo and get a transparent PNG in seconds. The AI runs inside your browser, so your image never leaves your device.",
    what: {
      heading: "What is an image background remover?",
      paragraphs: [
        "A background remover separates the subject of a photo, such as a person, product or pet, from everything behind it and makes the rest transparent. The result is a PNG cut-out you can place on any color, scene or design without the original backdrop.",
        "It is useful for product listings, profile pictures, presentations, thumbnails, stickers and quick mock-ups. Doing this by hand with a selection tool takes a long time, especially around hair and fine edges. An AI model finds the subject automatically and does the same job in a few seconds.",
      ],
    },
    steps: [
      { title: "Add your image", body: "Drag a PNG, JPG or WebP file onto the upload area, or click it to choose a file from your device. Images up to 20 MB are supported." },
      { title: "Wait a few seconds", body: "The first time you use the tool, the AI model downloads once and is then cached by your browser. After that the background is removed on your own device." },
      { title: "Compare and download", body: "The original and the cut-out appear side by side, with the transparent areas shown as a checkerboard. Press Download Transparent PNG to save the result." },
    ],
    formulas: {
      heading: "Privacy: your image is processed in your browser",
      paragraphs: [
        "Your photo is never uploaded to our servers or to any third party. The background is removed by an AI model that runs locally in your browser using WebAssembly, so there is no account, no upload queue and no copy of your image stored anywhere.",
        "The only network request is the one-time download of the model files, which contain no information about you or your images. Close the tab and the image is gone. Because everything runs on your device, speed depends on your hardware, and large photos take a little longer on older phones.",
      ],
      formulas: [],
    },
    faqs: [
      { q: "Is the background remover really free?", a: "Yes. There is no sign-up, no watermark and no limit on how many images you process. The site is supported by advertising." },
      { q: "Are my photos uploaded anywhere?", a: "No. The AI model runs in your browser, so your image stays on your device. Only the model files are downloaded, once, and your browser then caches them." },
      { q: "Why does the first image take longer?", a: "On first use the tool downloads the model (about 40 MB). It is cached afterwards, so later images start processing straight away, even on a slower connection." },
      { q: "What image formats can I use?", a: "PNG, JPG and WebP images up to 20 MB. The result is always a PNG, because it is the format that keeps transparent areas." },
      { q: "Which images work best?", a: "Photos with a clear subject and a visible edge between the subject and the background, such as portraits and products. Very busy scenes or subjects that blend into the backdrop can leave rough edges." },
      { q: "Can I use the cut-out commercially?", a: "The tool does not claim any rights to your images. You are responsible for having the right to use the original photo and to publish the result." },
    ],
  },
  "image-color-picker": {
    slug: "image-color-picker",
    name: "Image Color Picker",
    seoTitle: "Image Color Picker - HEX & RGB from a Photo",
    seoDescription:
      "Upload an image and click anywhere to get the exact HEX and RGB color. Free online eyedropper with one-click copy. Works in your browser, nothing is uploaded.",
    keywords: [
      "image color picker",
      "color picker from image",
      "get color from image",
      "hex color from photo",
      "online eyedropper",
    ],
    intro:
      "Upload a picture, then click or tap any spot to read its exact color. Copy the HEX or RGB code with one click.",
    what: {
      heading: "What is an image color picker?",
      paragraphs: [
        "An image color picker, also called an online eyedropper, reads the color of a single pixel in a picture and tells you its code. Instead of guessing a shade by eye, you point at it and get the exact value.",
        "Designers and developers use it to match a brand color from a logo, build a palette from a photograph, copy a shade from a screenshot, or check that a color in a mock-up matches the final design. The values are given as HEX, the format used in CSS and design tools, and as RGB, the red, green and blue levels from 0 to 255.",
      ],
    },
    steps: [
      { title: "Upload an image", body: "Drag a PNG, JPG or WebP file onto the upload area or click it to choose one. Screenshots, logos and photos all work." },
      { title: "Hover or click to pick", body: "Move your mouse over the image to preview the color under the cursor, then click to pick it. On a touch screen, tap the spot. Keyboard users can focus the image, move with the arrow keys and press Enter." },
      { title: "Copy the color code", body: "The large swatch shows the picked color with its HEX and RGB values. Press Copy next to either one to paste it into your CSS, design file or document." },
    ],
    formulas: {
      heading: "Privacy: your image is processed in your browser",
      paragraphs: [
        "The image is drawn onto an HTML canvas on your own device and the color is read from there. Nothing is uploaded, nothing is stored, and no network request is made when you use the picker, so private screenshots and unreleased designs stay private.",
        "Colors are read from the image at its original resolution, so you get the exact pixel value even when the preview is scaled down to fit your screen. If you pick a pixel that is partly transparent, the tool shows its color and tells you so.",
      ],
      formulas: ["HEX = #RRGGBB, where each pair is a value from 00 to FF", "RGB = rgb(red, green, blue), each from 0 to 255"],
    },
    faqs: [
      { q: "How do I get the HEX code of a color in an image?", a: "Upload the image, click the spot you want, and the HEX code appears next to the color swatch. Press Copy HEX to put it on your clipboard." },
      { q: "Is the color exact?", a: "Yes. The tool reads the pixel you click at the image's full resolution. Note that JPG compression can slightly change colors near edges, so click in a flat area for the truest value." },
      { q: "Is my image uploaded?", a: "No. The picker runs entirely in your browser, so your image never leaves your device." },
      { q: "Can I pick colors on a phone?", a: "Yes. Tap anywhere on the image to pick that color. The preview on hover is for mouse users, since touch screens have no hover." },
      { q: "What is the difference between HEX and RGB?", a: "They describe the same color in two ways. HEX is a six-digit code such as #2563EB used in CSS, and RGB lists the red, green and blue levels from 0 to 255, such as rgb(37, 99, 235)." },
      { q: "Which image formats are supported?", a: "PNG, JPG and WebP images up to 20 MB. For the most accurate colors, use a PNG or the original uncompressed image." },
    ],
  },
};
