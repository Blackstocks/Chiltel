import React, { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import 'pdfjs-dist/web/pdf_viewer.css';

const PdfViewerWindow = ({ pdfPath }) => {
  console.log(pdfPath);
  const pdfPath2 = 'http://localhost:5173' + pdfPath;
  console.log('pdf path: ', pdfPath2);
  useEffect(() => {
    const openPdfWindow = async () => {
      // Open a new blank window
      const newWindow = window.open('', '_blank', 'width=800,height=600');

      if (!newWindow) {
        console.error('Failed to open new window.');
        return;
      }

      // Write a basic HTML structure into the new window
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF Viewer</title>
          <style>
            body { margin: 0; padding: 0; overflow: hidden; }
            canvas { display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div id="pdf-viewer"></div>
        </body>
        </html>
      `);
      newWindow.document.close();

      // Wait for the window to be ready
      const pdfContainer = newWindow.document.getElementById('pdf-viewer');

      if (!pdfContainer) {
        console.error('Failed to create PDF container in new window.');
        return;
      }

      // Set PDF.js worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';


      try {
        // Load the PDF
        const pdf = await pdfjsLib.getDocument(pdfPath2).promise;

        // Render the first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Create a canvas element for rendering
        const canvas = newWindow.document.createElement('canvas');
        pdfContainer.appendChild(canvas);

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Disable right-click to prevent downloading
        newWindow.document.addEventListener('contextmenu', (e) => e.preventDefault());
      } catch (error) {
        console.error('Error rendering PDF:', error);
        newWindow.document.body.innerHTML = `<p style="color: red;">Failed to load PDF.</p>`;
      }
    };

    openPdfWindow();
  }, [pdfPath]);

  return null; // No in-app UI; this component solely handles opening the PDF in a new window.
};

export default PdfViewerWindow;


// import React, { useEffect } from 'react';
// import * as pdfjsLib from 'pdfjs-dist/webpack'; // Import pdf.js from webpack (local build)
// import 'pdfjs-dist/web/pdf_viewer.css';

// const PdfViewerWindow = ({ pdfPath }) => {
//   useEffect(() => {
//     const loadPdfInNewWindow = () => {
//       // Create a new window
//       const viewerWindow = window.open('', '_blank', 'width=800,height=600');

//       if (viewerWindow) {
//         // Set up the content inside the new window
//         viewerWindow.document.write('<html><head><title>PDF Viewer</title></head><body style="margin:0;padding:0;">');
//         viewerWindow.document.write('<div id="pdf-viewer" style="width:100%;height:100%;"></div>');
//         viewerWindow.document.write('</body></html>');

//         const viewerDiv = viewerWindow.document.getElementById('pdf-viewer');

//         // Set up the worker source manually
//         pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'; // CDN URL or path to local worker

//         const loadPdf = async () => {
//           // Load the PDF document
//           const pdf = await pdfjsLib.getDocument(pdfPath).promise;

//           // Get the first page
//           const page = await pdf.getPage(1);
//           const viewport = page.getViewport({ scale: 1.0 });

//           // Create a canvas to render the page into
//           const canvas = document.createElement('canvas');
//           viewerDiv.appendChild(canvas);

//           const context = canvas.getContext('2d');
//           canvas.height = viewport.height;
//           canvas.width = viewport.width;

//           // Render the PDF page into the canvas
//           await page.render({ canvasContext: context, viewport }).promise;

//           // Disable right-click and other download options
//           viewerWindow.document.body.addEventListener('contextmenu', (e) => e.preventDefault());
//         };

//         loadPdf();
//       }
//     };

//     loadPdfInNewWindow();
//   }, [pdfPath]);

//   return null; // The component itself won't render anything, it will handle everything in the new window.
// };

// export default PdfViewerWindow;
