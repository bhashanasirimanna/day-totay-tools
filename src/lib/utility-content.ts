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
  "css-unit-converter": {
    slug: "css-unit-converter",
    name: "CSS Unit Converter",
    seoTitle: "CSS Unit Converter - PX, REM, VH & VW Calculator",
    seoDescription:
      "Convert between px, rem, vh and vw instantly. Pick any source and target unit, set your base font size or viewport size, and copy the CSS value.",
    keywords: [
      "css unit converter",
      "px to rem",
      "rem to px",
      "px to vh",
      "vh to px",
      "px to vw",
      "vw to px",
      "px to rem converter",
      "css units calculator",
    ],
    intro:
      "Convert between px, rem, vh and vw in one place. Choose the units, set your base font size or viewport size, and copy a ready-to-use CSS value.",
    what: {
      heading: "What is a CSS unit converter and why use it?",
      paragraphs: [
        "A CSS unit converter translates a size from one CSS unit into another. Pixels (px) are fixed, rem scales with the root font size so text respects a user's browser settings, vh is 1% of the viewport height, which suits full-screen sections, sticky panels and modals, and vw is 1% of the viewport width, which suits fluid headings and full-width layouts.",
        "Design files usually hand over pixels, while a well-built stylesheet prefers rem for type and spacing and vh or vw for screen-relative layout. Converting by hand is easy to get wrong, especially when your base font size is not 16px or you switch between a 1080px desktop and a 768px laptop. This tool does the maths in both directions and lets you copy the result straight into your CSS.",
      ],
    },
    steps: [
      { title: "Pick your units", body: "Choose the unit you are converting from and the unit you want, from px, rem, vh and vw. The swap button flips them in one click." },
      { title: "Enter the value and context", body: "Type the number to convert. If rem is involved, set the base font size (16px by default). If vh is involved, set the viewport height in pixels, and if vw is involved, set the viewport width. Presets such as 1080 high or 1440 wide are one click away." },
      { title: "Copy the result", body: "The converted value updates as you type, with the formula underneath. Press Copy and paste it into your stylesheet." },
    ],
    formulas: {
      heading: "How CSS units are converted",
      paragraphs: [
        "Every conversion goes through pixels. 1rem equals the root font size (16px in most browsers), 1vh equals one hundredth of the viewport height, and 1vw equals one hundredth of the viewport width. That is why the same 300px is 27.78vh on a 1080px tall screen but 39.06vh on a 768px one, and 20.83vw on a 1440px wide screen.",
        "For vh and vw, use the inner size of the browser window rather than the monitor resolution. Toolbars take up space, so a 1080px tall monitor often has a viewport of about 950px, and a vertical scrollbar makes the usable width of vw slightly smaller than the window.",
      ],
      formulas: [
        "rem = px ÷ base font size",
        "px = rem × base font size",
        "vh = (px ÷ viewport height) × 100",
        "px = (vh ÷ 100) × viewport height",
        "vw = (px ÷ viewport width) × 100",
        "px = (vw ÷ 100) × viewport width",
      ],
      table: {
        caption: "Pixels converted to rem (16px base), vh (1080px tall) and vw (1440px wide)",
        headers: ["Pixels", "rem", "vh at 1080px", "vw at 1440px"],
        rows: [8, 12, 16, 24, 32, 48, 64, 100, 300, 540].map((px) => [
          `${px}px`,
          `${r(px / 16)}rem`,
          `${r((px / 1080) * 100, 2)}vh`,
          `${r((px / 1440) * 100, 2)}vw`,
        ]),
      },
    },
    faqs: [
      { q: "How do I convert px to rem?", a: `Divide the pixel value by the base font size. With the browser default of 16px, 24px is 24 ÷ 16 = ${r(24 / 16)}rem.` },
      { q: "How do I convert rem to px?", a: `Multiply the rem value by the base font size. At 16px, 1.5rem is 1.5 × 16 = ${r(1.5 * 16)}px.` },
      { q: "How do I convert px to vh?", a: `Divide the pixel value by the viewport height and multiply by 100. For example, 540px on a 1080px viewport is (540 ÷ 1080) × 100 = ${r((540 / 1080) * 100, 2)}vh.` },
      { q: "What is 100vh in pixels?", a: "100vh equals the full viewport height. On a 1080px tall viewport that is 1080px, and on a 768px tall viewport it is 768px." },
      { q: "How do I convert px to vw?", a: `Divide the pixel value by the viewport width and multiply by 100. For example, 360px on a 1440px wide viewport is (360 ÷ 1440) × 100 = ${r((360 / 1440) * 100, 2)}vw.` },
      { q: "How do I convert vw to px?", a: `Divide the vw value by 100 and multiply by the viewport width. At 1440px wide, 50vw is (50 ÷ 100) × 1440 = ${r(0.5 * 1440)}px.` },
      { q: "What is the difference between vh and vw?", a: "vh is 1% of the viewport height and vw is 1% of the viewport width. Use vh for things tied to screen height, such as hero sections, and vw for things that should scale with the width, such as fluid headings." },
      { q: "Should I use px, rem, vh or vw?", a: "Use rem for font sizes and spacing so they respect user font settings, px for hairlines and borders that must stay exact, vh for sizes tied to the screen height, and vw for sizes tied to the screen width." },
      { q: "What if my base font size is not 16px?", a: "Change the base font size field to match your html font-size. Some projects set 62.5% so that 1rem equals 10px, which makes the maths easier." },
      { q: "Can I convert between rem, vh and vw directly?", a: "Yes. The tool converts through pixels, so you can pick any pair of px, rem, vh and vw and set the base font size and the viewport size." },
    ],
  },
  "color-converter": {
    slug: "color-converter",
    name: "Color Converter",
    seoTitle: "Color Converter - HEX to RGB & RGB to HEX",
    seoDescription:
      "Convert HEX to RGB and RGB to HEX instantly with a live color preview. Supports 3, 4, 6 and 8 digit hex, a color picker and one-click copy for CSS.",
    keywords: [
      "color converter",
      "hex to rgb",
      "rgb to hex",
      "hex to rgb converter",
      "rgb to hex converter",
      "color code converter",
    ],
    intro:
      "Switch between HEX and RGB with a live preview. Type a code, pick a color, and copy the result straight into your CSS.",
    what: {
      heading: "What is a color converter and why use it?",
      paragraphs: [
        "A color converter translates a color between notations. HEX, such as #2563eb, and RGB, such as rgb(37, 99, 235), describe exactly the same color: the first in base 16, the second as red, green and blue levels from 0 to 255.",
        "Design tools usually export HEX, while CSS functions, canvas code and transparency effects often need rgb or rgba. Going the other way, you may have channel values from code and need a compact HEX for a design file. Converting by hand means working in base 16, so this tool does it instantly and shows the color so you can confirm it is right.",
      ],
    },
    steps: [
      { title: "Choose a direction", body: "Select HEX to RGB or RGB to HEX with the tabs above the converter." },
      { title: "Enter or pick a color", body: "Type a hex code or the three RGB values, or use the color picker. The swatch shows the color live, and a red message appears if the input is not valid." },
      { title: "Copy the result", body: "Press Copy to put the full value on your clipboard, or use the secondary button for just the numbers or the code without the #." },
    ],
    formulas: {
      heading: "How HEX and RGB are converted",
      paragraphs: [
        "A six-digit hex code is three pairs: red, green and blue. Each pair is a base-16 number from 00 to ff, which equals 0 to 255. For #ff5733: ff = 255, 57 = 87, 33 = 51, giving rgb(255, 87, 51). To go back, convert each channel to base 16 and pad it to two digits.",
        "Three-digit hex is shorthand where each digit is doubled, so #f80 means #ff8800. Eight-digit hex adds an alpha pair; the tool converts it to a 0 to 1 opacity and returns an rgba() value.",
      ],
      formulas: ["R = hex digits 1–2 → decimal", "G = hex digits 3–4 → decimal", "B = hex digits 5–6 → decimal", "HEX = #RRGGBB, each channel padded to two digits"],
    },
    faqs: [
      { q: "How do I convert hex to RGB?", a: "Split the code into three pairs and convert each from base 16 to decimal. #1e90ff becomes 1e = 30, 90 = 144, ff = 255, so rgb(30, 144, 255)." },
      { q: "How do I convert RGB to hex?", a: "Convert each of the red, green and blue values to base 16, pad each to two digits, and join them after a #. rgb(255, 87, 51) becomes ff, 57, 33, so #ff5733." },
      { q: "Does it work without the # symbol?", a: "Yes. Both ff5733 and #ff5733 are accepted." },
      { q: "Does it support 3-digit hex codes?", a: "Yes. #fff is expanded to #ffffff, which is rgb(255, 255, 255)." },
      { q: "What about transparency?", a: "Enter an 8-digit code such as #ff573380. The last pair is the alpha channel and the result is returned as rgba()." },
      { q: "What range can RGB values be?", a: "Each channel must be a whole number from 0 to 255. Anything outside that range is flagged as invalid." },
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
