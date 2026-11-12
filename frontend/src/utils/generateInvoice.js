import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/image/shopLogo.png";
import { siteConfig } from "../config/siteConfig";

// Helper for iOS Base64 compatibility
const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

export const generateInvoice = async (order) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const brandPink = [194, 109, 67]; // #C26D43 Fintrick Warm Terracotta

    // --- 1. PRE-LOAD LOGO (iOS Fix) ---
    let logoData = null;
    try {
      logoData = await getBase64Image(logo);
    } catch (e) {
      console.warn("Logo failed to load for PDF", e);
    }

    // --- 2. TOP BAR ---
    doc.setFillColor(...brandPink);
    doc.rect(0, 0, pageWidth, 10, "F");

    // --- 3. LOGO & INVOICE TITLE ---
    if (logoData) {
      doc.addImage(logoData, "PNG", 15, 18, 30, 32);
    } else {
      doc.setFontSize(18);
      doc.setTextColor(...brandPink);
      doc.text(siteConfig.name, 15, 25);
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40);
    doc.text("INVOICE", pageWidth / 2, 25, { align: "center" });

    // --- 4. DETAILS ---
    const detailsX = pageWidth - 60;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(["INV NO:", "ORDER NO:", "DATE:"], detailsX, 35, { lineHeightFactor: 1.5 });

    doc.setTextColor(50);
    doc.setFont("helvetica", "normal");
    const invoiceDate = order.UpdatedDtTm ? new Date(order.UpdatedDtTm).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
    doc.text([`#${order.InvoiceNo || "N/A"}`, `${order.OrderNo}`, `${invoiceDate}`], pageWidth - 15, 35, { align: "right", lineHeightFactor: 1.5 });

    // --- 5. ADDRESS SECTION ---
    doc.setDrawColor(240);
    doc.line(15, 48, pageWidth - 15, 48);

    doc.setFontSize(8.5);
    doc.setTextColor(...brandPink);
    doc.setFont("helvetica", "bold");
    doc.text("SOLD BY:", 15, 55);
    doc.text("BILL TO:", pageWidth - 15, 55, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text([siteConfig.name, siteConfig.address, `GST: ${siteConfig.gst}`], 15, 60);

    const customerAddressRaw = `${order.flat_address}`;
    const addressLines = doc.splitTextToSize(customerAddressRaw, 80);
    doc.text([
      `${order.customer_name}`,
      ...addressLines,
      `${order.City}, ${order.State} - ${order.Pincode}`,
      `Phone: +91 ${order.customer_phone}`
    ], pageWidth - 15, 60, { align: "right" });

    // --- 6. THE TABLE ---
    const tableColumn = ["SR", "PRODUCT DESCRIPTION", "QTY", "MRP", "DISC", "GST", "TOTAL"];
    const activeItems = (order.items || []).filter(item =>
      ![22, 51, 23].includes(Number(item.ItemStatus)) &&
      ![56].includes(Number(item.return_status_id))
    );

    const tableRows = activeItems.map((item, index) => {
      const unitPrice = Math.round(parseFloat(item.UnitPrice || 0));
      const discAmt = Math.round(parseFloat(item.DiscountAmt || 0));
      const totalAmt = Math.round(parseFloat(item.TotalAmount || 0));
      const gstAmt = parseFloat(item.Gst || 0);
      return [index + 1, item.ProductTitle, item.Quantity, unitPrice, `-${discAmt}`, `+${Math.round(gstAmt)}`, totalAmt];
    });

    // --- WATERMARK ---
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandPink);
    doc.text("THANK YOU", pageWidth / 2, pageHeight / 2 + 20, { align: "center", angle: 45 });
    doc.restoreGraphicsState();

    autoTable(doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7.5, cellPadding: 3, valign: "middle" },
      headStyles: { fillColor: brandPink, halign: "center", fontStyle: "bold" },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left", cellWidth: 65 },
        6: { halign: "right", fontStyle: "bold" },
      },
    });

    // --- 7. SUMMARY ---
    const finalY = doc.lastAutoTable.finalY + 8;
    const summaryX = pageWidth - 15;
    const drawRow = (label, value, y, isBold = false) => {
      doc.setFontSize(isBold ? 11 : 8.5);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(isBold ? 0 : 80);
      doc.text(label, pageWidth - 85, y);
      doc.text(value, summaryX, y, { align: "right" });
    };

    const summary = activeItems.reduce((acc, item) => {
      acc.mrp += parseFloat(item.UnitPrice || 0) * parseFloat(item.Quantity || 1);
      acc.discount += parseFloat(item.DiscountAmt || 0);
      acc.tax += parseFloat(item.Gst || 0);
      acc.subtotal += parseFloat(item.TotalAmount || 0);
      acc.totalCouponShare += parseFloat(item.coupon_share || 0);
      return acc;
    }, { mrp: 0, discount: 0, tax: 0, subtotal: 0, totalCouponShare: 0 });

    const shipping = Math.round(parseFloat(order.ShippingFee || 0));
    const handling = Math.round(parseFloat(order.PlatformFee || 0));
    const grandTotal = Math.round(summary.subtotal + shipping + handling);

    let currentY = finalY;
    drawRow("Total MRP (Base):", `Rs. ${Math.round(summary.mrp)}`, currentY);
    currentY += 6;
    drawRow("Product Discount:", `- Rs. ${Math.round(summary.discount)}`, currentY);
    if (summary.totalCouponShare > 0) {
      currentY += 6;
      drawRow(`Coupon (${order.CouponCode}):`, `- Rs. ${Math.round(summary.totalCouponShare)}`, currentY);
    }
    currentY += 6;
    drawRow("Shipping Fee:", `Rs. ${shipping}`, currentY);
    currentY += 6;
    drawRow("Handling Fee:", `Rs. ${handling}`, currentY);
    currentY += 6;
    drawRow("Total Tax (GST):", `Rs. ${Math.round(summary.tax)}`, currentY);

    doc.setDrawColor(...brandPink);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 85, currentY + 4, summaryX, currentY + 4);

    currentY += 12;
    drawRow("GRAND TOTAL:", `Rs. ${grandTotal}`, currentY, true);

    // --- 8. FOOTER SECTION (Digitally Signed & Legal) ---
    const footerTopY = 270;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(15, footerTopY - 5, pageWidth - 15, footerTopY - 5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text("CUSTOMER SUPPORT", 15, footerTopY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text([`Email: ${siteConfig.email}`, `Web: www.${siteConfig.name.toLowerCase()}.in`, `Helpline: ${siteConfig.phone}`], 15, footerTopY + 5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(`For ${siteConfig.name.toUpperCase()} PVT LTD`, pageWidth - 15, footerTopY, { align: "right" });

    doc.setDrawColor(...brandPink);
    doc.rect(pageWidth - 55, footerTopY + 2, 40, 12);
    doc.setFontSize(6);
    doc.setTextColor(...brandPink);
    doc.text("DIGITALLY SIGNED", pageWidth - 35, footerTopY + 7, { align: "center" });
    doc.text("VERIFIED", pageWidth - 35, footerTopY + 11, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(50);
    doc.text("Authorized Signatory", pageWidth - 35, footerTopY + 18, { align: "center" });

    const lastY = 290;
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text("TERMS & CONDITIONS", pageWidth / 2, lastY - 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(
      "1. Goods once sold will only be replaced as per policy. 2. This is a computer-generated invoice and does not require a physical signature.",
      pageWidth / 2,
      lastY - 4,
      { align: "center", maxWidth: 160 },
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandPink);
    doc.text(`Happy Shopping with ${siteConfig.name}!`, pageWidth / 2, lastY + 2, { align: "center" });

    // --- 9. FINAL SAVE ---
    const filename = `Invoice_${order.OrderNo}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }
};
