'use client';

import { useRef, useState } from 'react';
import styles from './PdfExport.module.css';
import { Download, Loader } from 'lucide-react';

export default function PdfExport({ contentRef, videoTitle, onSuccess }) {
  const [generating, setGenerating] = useState(false);

  const handleExport = async () => {
    if (!contentRef?.current || generating) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = contentRef.current;

      // Temporarily add print styles
      element.style.background = '#0a0a1a';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a1a',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      // First page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      const filename = videoTitle
        ? `${videoTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}_notes.pdf`
        : 'video_notes.pdf';

      pdf.save(filename);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      className={`${styles.button} btn-primary`}
      onClick={handleExport}
      disabled={generating}
    >
      {generating ? (
        <>
          <Loader size={18} className={styles.spinner} />
          Generating PDF...
        </>
      ) : (
        <>
          <Download size={18} />
          Download PDF Notes
        </>
      )}
    </button>
  );
}
