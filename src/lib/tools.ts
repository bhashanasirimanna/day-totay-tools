export type IconName =
  | "file-text"
  | "combine"
  | "split"
  | "file-image"
  | "ruler"
  | "scale"
  | "thermometer"
  | "area"
  | "code"
  | "palette"
  | "type"
  | "key";

export interface Tool {
  slug: string;
  name: string;
  /** Visible H1 on the tool page. */
  headline: string;
  /** One-line summary used on cards. */
  shortDescription: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** <title> (the site template appends the brand). Keep under ~45 chars. */
  seoTitle: string;
  /** <meta name="description">. Keep under 155 chars. */
  seoDescription: string;
  keywords: string[];
  icon: IconName;
  featured?: boolean;

  // Upload workspace behaviour
  multiple: boolean;
  minFiles: number;
  cta: string;
  outputLabel: string;
  /** Extra control shown in the workspace. */
  option?: "page-range";

  steps: { title: string; body: string }[];
  article: {
    what: string[];
    why: { title: string; body: string }[];
    tips: string[];
  };
  faqs: { q: string; a: string }[];
  relatedTools: string[];
}

const allTools: Tool[] = [
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    headline: "PDF to Word Converter",
    shortDescription:
      "Turn a PDF into an editable Word document that keeps its layout, images and alignment.",
    intro:
      "Add a PDF and get back an editable DOCX file that follows the original page layout. No account, no watermark, no software to install.",
    seoTitle: "PDF to Word Converter – Free, No Signup",
    seoDescription:
      "Convert PDF to an editable Word (DOCX) file online for free, keeping layout, images and alignment. No signup, no watermark, nothing to install.",
    keywords: [
      "pdf to word",
      "pdf to docx",
      "convert pdf to word free",
      "pdf to word converter online",
      "editable word from pdf",
    ],
    icon: "file-text",
    featured: true,
    multiple: false,
    minFiles: 1,
    cta: "Convert to Word",
    outputLabel: "DOCX",
    steps: [
      {
        title: "Add your PDF",
        body: "Drag a file onto the upload area or choose one from your device. Files up to 50 MB are supported.",
      },
      {
        title: "Start the conversion",
        body: "Press Convert to Word. Most documents finish in a few seconds, longer files take a little more time.",
      },
      {
        title: "Download the DOCX",
        body: "Open the result in Microsoft Word, Google Docs or LibreOffice and edit it like any other document.",
      },
    ],
    article: {
      what: [
        "A PDF to Word converter turns a fixed-layout PDF into a DOCX file you can edit. PDFs are built for reading and printing: text, images and tables are placed at exact coordinates, which is why you can't simply click in and fix a typo. Converting rebuilds that content as a Word document that follows the original page layout.",
        "People use it to update letters, CVs and reports when the original file is lost, to reuse text and images from a brochure, or to quote a passage without retyping it. The converter does the structural work so you spend your time editing, not retyping.",
      ],
      why: [
        {
          title: "No signup, no watermark",
          body: "Open the page, convert, download. There is no trial period and nothing gets stamped on your pages.",
        },
        {
          title: "Layout that follows the original",
          body: "Text, images and alignment are placed where they sit in the PDF, so the Word file looks like the document you started with.",
        },
        {
          title: "Files are deleted right away",
          body: "Your PDF is sent to our converter, processed, and deleted as soon as the result is returned. We don't keep or read it.",
        },
        {
          title: "Works anywhere",
          body: "Phone, tablet or desktop, in any modern browser. No plugin and no desktop app.",
        },
      ],
      tips: [
        "Use the original PDF if you have it. Exports from Word or Google Docs convert far more cleanly than scans or photos of paper.",
        "Scanned PDFs are images of text. They need OCR first, which this tool doesn't do.",
        "Use the original PDF if you have it. PDFs exported from Word or Google Docs convert most accurately.",
        "Fonts that aren't installed on your computer are swapped by Word, which can shift line breaks slightly.",
        "Text sits in positioned boxes to match the PDF. For heavy rewriting, copy the text into a fresh document.",
        "Check tables after converting. They are reproduced visually and may not be real Word tables.",
      ],
    },
    faqs: [
      {
        q: "Is the PDF to Word converter really free?",
        a: "Yes. There is no charge, no signup and no watermark on the converted file. The site is supported by advertising.",
      },
      {
        q: "Will my formatting be preserved?",
        a: "Text, images and alignment are kept close to the original page. To match the PDF exactly, text sits in positioned boxes, so heavy editing can mean adjusting those boxes, and tables may need tidying. Simple documents such as letters and reports convert best.",
      },
      {
        q: "Can I convert a scanned PDF?",
        a: "No. Scanned documents are pictures of text, and this tool doesn't do OCR. You'll see a message if a file has no selectable text. PDFs created from Word, Docs or other software work.",
      },
      {
        q: "Is there a file size limit?",
        a: "Files up to 50 MB can be uploaded. If yours is larger, try splitting it first with our Split PDF tool and converting the parts.",
      },
      {
        q: "What happens to my uploaded file?",
        a: "It is sent to our converter over an encrypted connection, turned into a Word file, and deleted as soon as the result is returned. We don't store, read or share it.",
      },
    ],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "split-pdf"],
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    headline: "Merge PDF Files",
    shortDescription:
      "Combine several PDFs into a single document, in the order you choose.",
    intro:
      "Add two or more PDFs, put them in order and download one combined file. Free, with no watermark.",
    seoTitle: "Merge PDF Files Online – Free & Fast",
    seoDescription:
      "Combine multiple PDFs into one file in seconds. Reorder documents, no signup, no watermark. A free online PDF merger for any device.",
    keywords: [
      "merge pdf",
      "combine pdf files",
      "join pdf online",
      "pdf merger free",
      "merge pdf without watermark",
    ],
    icon: "combine",
    multiple: true,
    minFiles: 2,
    cta: "Merge PDFs",
    outputLabel: "PDF",
    steps: [
      {
        title: "Add your PDFs",
        body: "Drop two or more files onto the upload area, or choose them from your device. You can keep adding more.",
      },
      {
        title: "Set the order",
        body: "Use the arrows next to each file to move it up or down. The final document follows this order.",
      },
      {
        title: "Merge and download",
        body: "Press Merge PDFs and download the combined file as a single PDF.",
      },
    ],
    article: {
      what: [
        "Merging PDFs means joining several documents into one file, with the pages of each appearing one after another. It is the quickest way to send a single attachment instead of five, or to keep a contract, its appendices and a signed cover page together.",
        "Typical uses include bundling invoices for accounting, combining scanned pages into one document, assembling an application pack, and putting chapters of a report in a single file for printing.",
      ],
      why: [
        {
          title: "Order stays in your hands",
          body: "Rearrange files before merging so you don't have to fix the sequence afterwards.",
        },
        {
          title: "No quality loss",
          body: "Pages are joined as they are. Text stays sharp and images aren't recompressed.",
        },
        {
          title: "Free and unbranded",
          body: "No account, no watermark and no limit on how often you use it.",
        },
        {
          title: "Quick on any device",
          body: "Merge from your phone on the go or from a desktop with a folder full of files.",
        },
      ],
      tips: [
        "Name your files with numbers (01, 02, 03) so they arrive in the right order when you select a whole folder.",
        "Remove blank or duplicate pages first with the Split PDF tool if you only need part of a document.",
        "Check page orientation if you mix portrait and landscape files. Each page keeps its own orientation.",
        "Keep an eye on total size. Very large merged files can bounce off email attachment limits.",
      ],
    },
    faqs: [
      {
        q: "How many PDFs can I merge at once?",
        a: "You can combine as many files as you like, as long as each one is under 50 MB.",
      },
      {
        q: "Can I change the order of the files?",
        a: "Yes. Use the arrows beside each file to move it up or down before you merge.",
      },
      {
        q: "Will merging reduce the quality?",
        a: "No. Pages are joined without being re-rendered or recompressed, so the content looks exactly as it did.",
      },
      {
        q: "Does it work with password-protected PDFs?",
        a: "Protected files need to be unlocked first. Remove the password in your PDF viewer, then add the file here.",
      },
      {
        q: "Is the merged PDF watermarked?",
        a: "Never. The output contains only your pages.",
      },
    ],
    relatedTools: ["split-pdf", "pdf-to-word", "pdf-to-jpg"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    headline: "Split PDF Pages",
    shortDescription:
      "Separate a PDF into smaller files or pull out just the pages you need.",
    intro:
      "Upload a PDF, choose the pages to keep and download them as separate files. Free, with no watermark.",
    seoTitle: "Split PDF Pages Online – Free Tool",
    seoDescription:
      "Split a PDF into separate files or extract specific pages online. Pick ranges and download instantly. Free, no signup, no watermark.",
    keywords: [
      "split pdf",
      "extract pages from pdf",
      "separate pdf pages",
      "pdf splitter online",
      "split pdf by page range",
    ],
    icon: "split",
    multiple: false,
    minFiles: 1,
    cta: "Split PDF",
    outputLabel: "PDF files",
    option: "page-range",
    steps: [
      {
        title: "Add your PDF",
        body: "Drop the file onto the upload area or choose it from your device.",
      },
      {
        title: "Choose the pages",
        body: "Pick a range such as 1-3, or split every page into its own file.",
      },
      {
        title: "Download the result",
        body: "Get your new files individually or all together in one ZIP.",
      },
    ],
    article: {
      what: [
        "Splitting a PDF breaks one document into smaller parts. You can pull out a single page, keep a range such as pages 4 to 9, or turn every page into its own file.",
        "It is useful when you only need to share part of a document, when a file is too big to email, or when a scanned batch has to be separated into individual records like invoices or forms.",
      ],
      why: [
        {
          title: "Exactly the pages you want",
          body: "Specify ranges instead of cutting and pasting between documents.",
        },
        {
          title: "Original quality",
          body: "Pages are copied across as they are, with no recompression.",
        },
        {
          title: "Nothing to install",
          body: "Works in your browser, free, and without an account.",
        },
        {
          title: "Smaller files, easier sharing",
          body: "Send only the relevant section and stay under email attachment limits.",
        },
      ],
      tips: [
        "Use ranges like 1-3, 7, 10-12 to extract several sections in one pass.",
        "Split a very large PDF into parts before converting it to Word or images to keep each job fast.",
        "Keep the original. Splitting creates new files and never alters the source.",
        "If you later need the parts as one file again, the Merge PDF tool puts them back together.",
      ],
    },
    faqs: [
      {
        q: "Can I extract only certain pages?",
        a: "Yes. Enter the page numbers or ranges you want and only those pages are saved.",
      },
      {
        q: "Can I split every page into its own file?",
        a: "Yes. Choose the option to split all pages and you will receive one PDF per page.",
      },
      {
        q: "Does splitting change my original file?",
        a: "No. Your original is untouched. You receive new files containing the selected pages.",
      },
      {
        q: "Is there a page limit?",
        a: "There is no page limit, only a 50 MB limit per uploaded file.",
      },
      {
        q: "Is it free?",
        a: "Yes, with no signup and no watermark.",
      },
    ],
    relatedTools: ["merge-pdf", "pdf-to-jpg", "pdf-to-word"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    headline: "PDF to JPG Converter",
    shortDescription:
      "Export every page of a PDF as a sharp JPG image, ready to share or embed.",
    intro:
      "Upload a PDF and download each page as a high-quality JPG. Free, with no watermark.",
    seoTitle: "PDF to JPG Converter – Free Online",
    seoDescription:
      "Convert every page of a PDF into high-quality JPG images online. Free, no signup, no watermark. Works on desktop and mobile.",
    keywords: [
      "pdf to jpg",
      "convert pdf to image",
      "pdf to jpeg online",
      "pdf pages to images",
      "pdf to jpg free",
    ],
    icon: "file-image",
    multiple: false,
    minFiles: 1,
    cta: "Convert to JPG",
    outputLabel: "JPG images",
    steps: [
      {
        title: "Add your PDF",
        body: "Drag the file onto the upload area or pick it from your device.",
      },
      {
        title: "Convert the pages",
        body: "Press Convert to JPG. Each page is rendered as its own image.",
      },
      {
        title: "Download the images",
        body: "Save pages one by one, or grab them all together in a ZIP.",
      },
    ],
    article: {
      what: [
        "A PDF to JPG converter renders each page of a PDF as an image. The result is easy to drop into a slide deck, post on social media, attach to a chat or open on any device without a PDF reader.",
        "It is handy for sharing a single page from a brochure, using a diagram in a presentation, creating thumbnails, or sending a document to someone whose app only accepts images.",
      ],
      why: [
        {
          title: "Sharp output",
          body: "Pages are rendered at a high resolution so text stays readable when you zoom.",
        },
        {
          title: "One image per page",
          body: "Get clean, separate files that are simple to name, sort and reuse.",
        },
        {
          title: "No signup or watermark",
          body: "Convert as often as you like without creating an account.",
        },
        {
          title: "Opens everywhere",
          body: "JPG works in every browser, editor, messaging app and operating system.",
        },
      ],
      tips: [
        "Split the PDF first if you only need a few pages. It saves time and download size.",
        "JPG is best for photos and full pages. For crisp line art or screenshots with sharp edges, PNG often looks cleaner.",
        "Keep the PDF if text needs to stay searchable. Images can't be searched or selected.",
        "Rename files with the page number to keep long documents in order.",
      ],
    },
    faqs: [
      {
        q: "What resolution are the images?",
        a: "Pages are rendered at a high resolution suitable for screens and general printing.",
      },
      {
        q: "Do I get one image per page?",
        a: "Yes. A 10-page PDF produces 10 JPG files, which you can download separately or as a ZIP.",
      },
      {
        q: "Can I convert only some pages?",
        a: "Use the Split PDF tool first to extract the pages you want, then convert that smaller file.",
      },
      {
        q: "Will the text still be selectable?",
        a: "No. Images don't contain selectable text. Keep your original PDF if you need that.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, with no account and no watermark.",
      },
    ],
    relatedTools: ["split-pdf", "pdf-to-word", "merge-pdf"],
  },
];

// PDF to Word stays implemented for a future converter deployment, but is not
// published until the required LibreOffice service is available.
export const tools = allTools.filter((tool) => tool.slug !== "pdf-to-word");

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedTools
    .map((slug) => getTool(slug))
    .filter((t): t is Tool => Boolean(t));
}
