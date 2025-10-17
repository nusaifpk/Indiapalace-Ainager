import pdf2pic from "pdf2pic";
import fs from "fs";
import path from "path";

// Define the PDF file path and output directory
const PDF_PATH = path.join(process.cwd(), "attached_assets", "Menu_1757233486689.pdf");
const OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "pdf-images");

export interface ExtractedImage {
  path: string;
  filename: string;
  pageNumber: number;
}

class PDFImageExtractor {
  private extractedImages: ExtractedImage[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure output directory exists
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      // Check if PDF exists
      if (!fs.existsSync(PDF_PATH)) {
        console.warn("PDF file not found at:", PDF_PATH);
        this.initialized = true;
        return;
      }

      // Configure pdf2pic options for maximum quality and original dimensions
      const convert = pdf2pic.fromPath(PDF_PATH, {
        density: 300,           // High resolution DPI for maximum clarity
        saveFilename: "menu-pdf",
        savePath: OUTPUT_DIR,
        format: "png",
        // Remove width and height constraints to preserve original dimensions
        quality: 100            // Maximum quality
      });

      // Extract images from all pages
      console.log("Extracting images from PDF...");
      const results = await convert.bulk(-1); // -1 means all pages

      // Process results
      this.extractedImages = results.map((result, index) => {
        const filename = result.name || `menu-pdf.${index + 1}.png`;
        return {
          path: `/assets/pdf-images/${filename}`,
          filename: filename,
          pageNumber: index + 1
        };
      });

      console.log(`Successfully extracted ${this.extractedImages.length} images from PDF`);
      this.initialized = true;

    } catch (error) {
      console.error("Error extracting images from PDF:", error);
      this.initialized = true; // Mark as initialized even on error to prevent retries
    }
  }

  async getExtractedImages(): Promise<ExtractedImage[]> {
    await this.initialize();
    return this.extractedImages;
  }

  async getRandomPDFImage(): Promise<string | null> {
    await this.initialize();
    
    if (this.extractedImages.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.extractedImages.length);
    return this.extractedImages[randomIndex].path;
  }

  async getMainDishImage(): Promise<string | null> {
    await this.initialize();
    
    if (this.extractedImages.length === 0) {
      return null;
    }

    // Return a featured dish image - try page 2 first (often has featured items)
    const page2Index = 1;
    if (this.extractedImages.length > page2Index) {
      return this.extractedImages[page2Index].path;
    }
    
    // Fallback to first image if page 2 doesn't exist
    return this.extractedImages[0].path;
  }

  async getRandomDishImage(): Promise<string | null> {
    await this.initialize();
    
    if (this.extractedImages.length === 0) {
      return null;
    }

    // Filter out first and last few images which might contain text/promotional content
    // Focus on middle pages which typically have actual dish images
    const dishImages = this.extractedImages.slice(2, -3); // Skip first 2 and last 3 pages
    
    if (dishImages.length === 0) {
      // Fallback to any image if filtering resulted in empty array
      const randomIndex = Math.floor(Math.random() * this.extractedImages.length);
      return this.extractedImages[randomIndex].path;
    }

    const randomIndex = Math.floor(Math.random() * dishImages.length);
    return dishImages[randomIndex].path;
  }

  // For backward compatibility
  async getMainBuildingImage(): Promise<string | null> {
    return this.getMainDishImage();
  }

  async getPDFImageByPage(pageNumber: number): Promise<string | null> {
    await this.initialize();
    
    const image = this.extractedImages.find(img => img.pageNumber === pageNumber);
    return image ? image.path : null;
  }

  async getAllPDFImages(): Promise<string[]> {
    await this.initialize();
    return this.extractedImages.map(img => img.path);
  }
}

// Export a singleton instance
export const pdfImageExtractor = new PDFImageExtractor();