import * as pdfjs from 'pdfjs-dist';

/**
 * Robustly extracts text from a PDF ArrayBuffer.
 * Handles worker initialization and provides clear error reporting.
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Attempt to load worker via Blob to avoid dynamic import issues in some environments
    const version = pdfjs.version;
    const workerUrl = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    
    try {
      const resp = await fetch(workerUrl);
      if (!resp.ok) throw new Error("Failed to fetch worker");
      const workerCode = await resp.text();
      const blob = new Blob([workerCode], { type: 'text/javascript' });
      pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    } catch (e) {
      console.warn("Failed to create blob worker, falling back to CDN URL", e);
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    }

    const loadingTask = pdfjs.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: true
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract string items from the page's text content
        const pageText = textContent.items
            .filter((item: any) => 'str' in item)
            .map((item: any) => item.str)
            .join(' ');
            
        fullText += pageText + '\n';
    }

    if (!fullText.trim()) {
        throw new Error("PDF yielded no text content. It may be an image-only scan.");
    }

    return fullText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    // Rethrow to be caught by the UI handler
    throw error;
  }
}
