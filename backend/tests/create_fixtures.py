"""
Creates synthetic edge-case test PDF fixtures using PyMuPDF:
1. empty_doc.pdf: 0 pages or blank page with 0 text
2. scanned_image_doc.pdf: page with embedded image/drawing but 0 readable text
"""
import os
try:
    import pymupdf as fitz
except ImportError:
    import fitz


def create_test_fixtures(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    # 1. Blank PDF (1 page with 0 text)
    doc_blank = fitz.open()
    doc_blank.new_page(width=300, height=300)
    blank_path = os.path.join(output_dir, "blank_page.pdf")
    doc_blank.save(blank_path)
    doc_blank.close()

    # 2. Scanned Image PDF (page with an image / drawing but no text)
    doc_scanned = fitz.open()
    page = doc_scanned.new_page(width=400, height=400)
    # Draw a simulated document page using rect and drawings
    page.draw_rect(fitz.Rect(50, 50, 350, 350), color=(0.2, 0.2, 0.2), fill=(0.95, 0.95, 0.95))
    page.draw_line(fitz.Point(70, 90), fitz.Point(330, 90), color=(0.4, 0.4, 0.4), width=2)
    page.draw_line(fitz.Point(70, 120), fitz.Point(300, 120), color=(0.7, 0.7, 0.7), width=1)
    page.draw_line(fitz.Point(70, 140), fitz.Point(310, 140), color=(0.7, 0.7, 0.7), width=1)
    
    # Insert a tiny dummy pixmap image
    pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 100, 100), 1)
    pix.clear_with(200)
    page.insert_image(fitz.Rect(100, 180, 250, 300), pixmap=pix)

    scanned_path = os.path.join(output_dir, "scanned_simulated.pdf")
    doc_scanned.save(scanned_path)
    doc_scanned.close()

    print(f"Test fixtures created in {output_dir}")


if __name__ == "__main__":
    fixtures_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")
    create_test_fixtures(fixtures_dir)
