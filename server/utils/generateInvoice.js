import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const generateInvoice = (order) => {
  const invoicesDir = path.join(process.cwd(), "server", "invoices");
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  // ===== HEADER =====
  doc
    .fillColor("#1f7a4d")
    .fontSize(22)
    .text("GreenCart Invoice", { align: "center" });

  doc.moveDown(1.5);

  // ===== ORDER INFO =====
  doc.fillColor("#000").fontSize(11);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toDateString()}`);
  doc.text(`Customer: ${order.userId.email}`);

  doc.moveDown(1.5);

  // ===== TABLE HEADER =====
  doc
    .fontSize(12)
    .fillColor("#ffffff")
    .rect(40, doc.y, 520, 25)
    .fill("#1f7a4d");

  doc
    .fillColor("#ffffff")
    .text("Item", 50, doc.y + 7)
    .text("Qty", 300, doc.y + 7)
    .text("Price", 380, doc.y + 7)
    .text("Total", 470, doc.y + 7);

  doc.moveDown(1);

  // ===== TABLE ROWS =====
  doc.fillColor("#000");
  order.items.forEach((item) => {
    const y = doc.y;

    doc
      .fontSize(11)
      .text(item.product.name, 50, y)
      .text(item.quantity, 300, y)
      .text(formatINR(item.product.offerPrice), 380, y)
      .text(
        formatINR(item.product.offerPrice * item.quantity),
        470,
        y
      );

    doc.moveDown(1);
  });

  doc.moveDown(1);

  // ===== TOTAL =====
  doc
    .fontSize(14)
    .fillColor("#1f7a4d")
    .text(
      `Grand Total: ${formatINR(order.amount)}`,
      { align: "right" }
    );

  doc.moveDown(2);

  // ===== FOOTER =====
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "Thank you for shopping with GreenCart 🌱",
      { align: "center" }
    );

  doc.end();
  return filePath;
};

export default generateInvoice;
