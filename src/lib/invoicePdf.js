import { jsPDF } from "jspdf";
//this file is no longer usable in this project as we switched to html2pdf over jspdf for marathi support
const FONT_NAME = "NotoSansDevanagari";
const FONT_FILE = "NotoSansDevanagari-Regular.ttf";
const FONT_URL = "/fonts/candidate.ttf";
const LOGO_URL = "/invoicelogo.jpeg";

const OWNER_LINES = [
  "प्रो. सोन्याबापु शिवाजी वाकचौरे",
  "+91 9822397846",
  "+91 8010072112",
];

const BUSINESS_LINES = [
  "पत्ता: कोल्हार बुद्रुक, तालुका : राहाता",
  "जिल्हा : अहिल्यानगर - 413710",
];

const TABLE_HEADERS = ["No.", "Product", "Size", "Qty", "Price", "Total"];
const COLUMN_WIDTHS = [12, 58, 25, 16, 30, 30];

let fontLoadPromise = null;
let logoLoadPromise = null;
let canvasFontLoadPromise = null;

const PT_TO_MM = 0.352777778;
const PT_TO_PX = 96 / 72;
const PX_TO_MM = 25.4 / 96;
const MM_TO_PX = 96 / 25.4;

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const ensureMarathiFont = async (doc) => {
  if (!fontLoadPromise) {
    fontLoadPromise = fetch(FONT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Marathi font file.");
        }
        return response.arrayBuffer();
      })
      .then(arrayBufferToBase64);
  }

  const fontBase64 = await fontLoadPromise;
  doc.addFileToVFS(FONT_FILE, fontBase64);
  doc.addFont(FONT_FILE, FONT_NAME, "normal");
  doc.setFont(FONT_NAME, "normal");
};

const ensureLogoDataUrl = async () => {
  if (!logoLoadPromise) {
    logoLoadPromise = fetch(LOGO_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load invoice logo.");
        }
        return response.blob();
      })
      .then(blobToDataUrl);
  }

  return logoLoadPromise;
};

const ensureCanvasFont = async () => {
  if (!canvasFontLoadPromise) {
    canvasFontLoadPromise = (async () => {
      const fontFace = new FontFace(FONT_NAME, `url(${FONT_URL})`);
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
      await document.fonts.load(`16px "${FONT_NAME}"`);
    })();
  }

  return canvasFontLoadPromise;
};

const wrapTextByWidth = (ctx, text, maxWidthPx) => {
  if (!Number.isFinite(maxWidthPx) || maxWidthPx <= 0) return [text];

  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidthPx) {
      current = candidate;
      return;
    }

    if (current) lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  return lines.length ? lines : [String(text)];
};

const drawShapedDevanagariText = async (
  doc,
  { text, x, y, fontSize = 12, color = [0, 0, 0], align = "left", maxWidthMm },
) => {
  await ensureCanvasFont();

  const fontPx = Math.max(12, Math.round(fontSize * PT_TO_PX));
  const lineHeightPx = Math.round(fontPx * 1.25);
  const maxWidthPx = Number.isFinite(maxWidthMm) ? maxWidthMm * MM_TO_PX : Number.POSITIVE_INFINITY;

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  measureCtx.font = `${fontPx}px "${FONT_NAME}"`;
  const lines = wrapTextByWidth(measureCtx, String(text), maxWidthPx);
  const widestPx = Math.max(...lines.map((line) => measureCtx.measureText(line).width), 1);

  const padPx = 4;
  const widthPx = Math.ceil(widestPx + padPx * 2);
  const heightPx = Math.ceil(lines.length * lineHeightPx + padPx * 2);

  const scale = Math.max(2, Math.ceil(window.devicePixelRatio || 1));
  const canvas = document.createElement("canvas");
  canvas.width = widthPx * scale;
  canvas.height = heightPx * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.font = `${fontPx}px "${FONT_NAME}"`;
  ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
  ctx.textBaseline = "top";
  ctx.textAlign = align;

  const drawX = align === "right" ? widthPx - padPx : align === "center" ? widthPx / 2 : padPx;
  lines.forEach((line, i) => {
    ctx.fillText(line, drawX, padPx + i * lineHeightPx);
  });

  const imageWidthMm = widthPx * PX_TO_MM;
  const imageHeightMm = heightPx * PX_TO_MM;
  const imageX = align === "right" ? x - imageWidthMm : align === "center" ? x - imageWidthMm / 2 : x;
  const imageY = y - fontSize * PT_TO_MM * 0.82;

  doc.addImage(canvas.toDataURL("image/png"), "PNG", imageX, imageY, imageWidthMm, imageHeightMm);
};

const rupees = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const filenameSafe = (name) =>
  String(name || "order")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-");

const drawHeader = async (doc, logoDataUrl) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftX = 10;
  const rightX = pageWidth - 10;

  await drawShapedDevanagariText(doc, {
    text: "|| श्री गणेशाय नम: ||",
    x: pageWidth / 2,
    y: 14,
    fontSize: 12,
    color: [0, 0, 0],
    align: "center",
  });

  doc.addImage(logoDataUrl, "JPEG", leftX, 18, 20, 20);
  await drawShapedDevanagariText(doc, {
    text: "ओम आर्ट्स व कलाकेंद्र",
    x: leftX + 25,
    y: 25,
    fontSize: 22,
    color: [217, 119, 6],
    align: "left",
  });

  await drawShapedDevanagariText(doc, {
    text: BUSINESS_LINES[0],
    x: leftX + 25,
    y: 32,
    fontSize: 11,
    color: [48, 47, 46],
    align: "left",
  });
  await drawShapedDevanagariText(doc, {
    text: BUSINESS_LINES[1],
    x: leftX + 25,
    y: 37,
    fontSize: 11,
    color: [48, 47, 46],
    align: "left",
  });

  await drawShapedDevanagariText(doc, {
    text: OWNER_LINES[0],
    x: rightX,
    y: 24,
    fontSize: 11,
    color: [0, 0, 0],
    align: "right",
  });
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(OWNER_LINES[1], rightX, 29, { align: "right" });
  doc.text(OWNER_LINES[2], rightX, 34, { align: "right" });

  doc.setDrawColor(214, 211, 209);
  doc.line(leftX, 42, rightX, 42);

  doc.setFontSize(18);
  doc.text("Order Summary /", pageWidth / 2 - 12, 50, { align: "right" });
  await drawShapedDevanagariText(doc, {
    text: "ऑर्डर सारांश",
    x: pageWidth / 2 - 11,
    y: 50,
    fontSize: 18,
    color: [0, 0, 0],
    align: "left",
  });

  return 56;
};

const drawCustomerDetails = (doc, orderDetails, startY) => {
  const boxX = 10;
  const boxY = startY;
  const boxWidth = 190;
  const boxHeight = 34;

  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(231, 229, 228);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, "FD");

  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("Customer Details", boxX + 4, boxY + 7);

  doc.setDrawColor(231, 229, 228);
  doc.line(boxX + 4, boxY + 9, boxX + boxWidth - 4, boxY + 9);

  const orderDate = new Date().toLocaleDateString("en-IN");
  const rows = [
    ["Name:", orderDetails?.name || "-"],
    ["Phone:", orderDetails?.phone || "-"],
    ["Address:", orderDetails?.address || "-"],
    ["Order Date:", orderDate],
  ];

  let y = boxY + 14;
  doc.setFontSize(10.5);
  rows.forEach(([label, value]) => {
    doc.text(label, boxX + 4, y);
    const wrapped = doc.splitTextToSize(String(value), 130);
    doc.text(wrapped, boxX + 35, y);
    y += wrapped.length > 1 ? wrapped.length * 4 : 5;
  });

  return boxY + boxHeight + 8;
};

const drawTableHeader = (doc, y) => {
  let x = 10;
  doc.setFontSize(10.5);
  doc.setFillColor(254, 243, 199);
  doc.setTextColor(146, 64, 14);
  doc.rect(10, y, 190, 8, "F");

  TABLE_HEADERS.forEach((header, index) => {
    const width = COLUMN_WIDTHS[index];
    doc.rect(x, y, width, 8);
    const align = index >= 3 ? "right" : "left";
    const textX = align === "right" ? x + width - 2 : x + 2;
    doc.text(header, textX, y + 5.5, { align });
    x += width;
  });
};

const drawItemsTable = (doc, cart, total, startY) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomLimit = pageHeight - 24;
  let y = startY;

  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("Your Order", 10, y);
  y += 4;

  drawTableHeader(doc, y);
  y += 8;

  cart.forEach((item, index) => {
    if (y + 8 > bottomLimit) {
      doc.addPage();
      y = 16;
      drawTableHeader(doc, y);
      y += 8;
    }

    let x = 10;
    const rowValues = [
      String(item.id ?? index + 1),
      String(item.name ?? ""),
      String(item.size || "Standard"),
      String(item.qty ?? 0),
      rupees(item.price),
      rupees((item.price || 0) * (item.qty || 0)),
    ];

    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);

    rowValues.forEach((value, columnIndex) => {
      const width = COLUMN_WIDTHS[columnIndex];
      doc.rect(x, y, width, 8);
      const align = columnIndex >= 3 ? "right" : "left";
      const textX = align === "right" ? x + width - 2 : x + 2;
      const clipped = doc.splitTextToSize(value, width - 3)[0] || "";
      doc.text(clipped, textX, y + 5.5, { align });
      x += width;
    });

    y += 8;
  });

  if (y + 9 > bottomLimit) {
    doc.addPage();
    y = 16;
  }

  doc.setFillColor(250, 250, 249);
  doc.setFontSize(11.5);
  doc.setTextColor(180, 83, 9);
  doc.rect(10, y, 190, 9, "F");
  doc.rect(10, y, 190, 9);
  doc.text("Total Amount:", 160, y + 6, { align: "right" });
  doc.text(rupees(total), 198, y + 6, { align: "right" });

  return y + 15;
};

const drawFooter = async (doc, y) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let footerY = y;

  if (footerY > pageHeight - 18) {
    doc.addPage();
    footerY = 18;
  }

  doc.setFontSize(10.5);
  doc.setTextColor(120, 113, 108);
  doc.text(
    "Thank you for your order! Please contact us for payment and delivery.",
    pageWidth / 2,
    footerY,
    { align: "center" },
  );
  await drawShapedDevanagariText(doc, {
    text: "तुमच्या ऑर्डरबद्दल धन्यवाद! कृपया पेमेंट आणि वितरणासाठी आमच्याशी संपर्क साधा.",
    x: pageWidth / 2,
    y: footerY + 5,
    fontSize: 10.5,
    color: [120, 113, 108],
    align: "center",
    maxWidthMm: 190,
  });
};

export const generateOrderInvoicePdf = async ({ cart, orderDetails, total }) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  await ensureMarathiFont(doc);
  const logoDataUrl = await ensureLogoDataUrl();

  let y = await drawHeader(doc, logoDataUrl);
  y = drawCustomerDetails(doc, orderDetails, y);
  y = drawItemsTable(doc, cart, total, y);
  await drawFooter(doc, y);

  const filename = `${filenameSafe(orderDetails?.name)}-Order.pdf`;
  doc.save(filename);
  return true;
};
