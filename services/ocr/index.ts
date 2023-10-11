import Tesseract from 'tesseract.js';
import { getDocument } from 'pdfjs-dist';
import pkg from 'pdfjs-dist';
import { TypedArray } from 'pdfjs-dist/types/src/display/api';
const { GlobalWorkerOptions } = pkg;

GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const ocrService = async (pdfFile: File | Blob) => {
    try {
        async function pdfToCanvas(pdfFile: Blob) {
            const reader = new FileReader();
            const promise = new Promise<TypedArray>((resolve, reject) => {
              reader.onload = function(event) {
                if (event.target) {
                  resolve(new Uint8Array(event.target.result as ArrayBuffer));
                } else {
                  reject(new Error("Could not read file: event.target is null"));
                }
              };
              reader.onerror = function(event) {
                reject(new Error("Could not read file: " + event));
              };
            });
            reader.readAsArrayBuffer(pdfFile);

            const typedArray = await promise;
            const loadingTask = getDocument({ data: typedArray });
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 3 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              await page.render({ canvasContext: ctx, viewport }).promise;
            }

            return canvas;
        }

        async function runOCR(canvas: Tesseract.ImageLike) {
            const result = await Tesseract.recognize(
              canvas,
              'eng',
              {
                logger: m => console.log(m)
              }
            );
            return result.data.text;
        }

        const canvas = await pdfToCanvas(pdfFile);
        const ocrText = await runOCR(canvas);

        return ocrText;

    } catch (err) {
        console.error('OCR failed:', err);
        return null;
    }
};

export default ocrService;
