import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const exportPDF = (element: HTMLElement, title: string) => {
  if (!element) {
    console.error('Element is null or undefined');
    return;
  }

  html2canvas(element, { useCORS: true }).then((canvas) => {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const pageHeight = (contentWidth / 592.28) * 841.89;
    let leftHeight = contentHeight;
    let position = 0;
    const imgWidth = 595.28;
    const imgHeight = (592.28 / contentWidth) * contentHeight;
    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'pt', 'a4');

    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    pdf.save(`${title}.pdf`);
  });
};

export default exportPDF;
