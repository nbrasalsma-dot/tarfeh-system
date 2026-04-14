import { jsPDF } from "jspdf";

// هذا هو الخط العربي Cairo بصيغة Base64
export const cairoBase64 =
  "AAEAAAAKAIAAAwAgT1M... (هنا راح تحط النص من الموقع)";

export const addArabicFont = (doc) => {
  doc.addFileToVFS("Cairo-Regular.ttf", cairoBase64);
  doc.addFont("Cairo-Regular.ttf", "Cairo", "normal");
  return doc;
};
