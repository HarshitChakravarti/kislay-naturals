import qrcode
from qrcode.image.svg import SvgPathImage
import xml.etree.ElementTree as ET

# The lab report URL
url = "https://www.kislaynaturals.com/lab-report"

# Create QR code instance with high quality settings
qr = qrcode.QRCode(
    version=1,  # Controls the size of the QR code (1-40, higher = more data capacity)
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for better reliability
    box_size=20,  # Size of each box in pixels (larger = higher quality)
    border=4,  # Border around the QR code (4 is the minimum recommended)
)

# Add the URL data
qr.add_data(url)
qr.make(fit=True)

# Create SVG image with path-based rendering (cleaner for designers)
img = qr.make_image(image_factory=SvgPathImage)

# Save to a temporary file first
import tempfile
import os
temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.svg', delete=False)
temp_file.close()
img.save(temp_file.name)

# Read the SVG content
with open(temp_file.name, 'r') as f:
    svg_content = f.read()

# Clean up temp file
os.unlink(temp_file.name)

# Parse the SVG and add white background
root = ET.fromstring(svg_content)
# Get the viewBox dimensions
viewbox = root.get('viewBox', '0 0 90 90')
width = root.get('width', '90mm')
height = root.get('height', '90mm')

# Extract dimensions from viewBox if width/height are in mm
if 'viewBox' in root.attrib:
    _, _, vb_width, vb_height = viewbox.split()
    vb_width = float(vb_width)
    vb_height = float(vb_height)
else:
    vb_width = 90
    vb_height = 90

# Create white background rectangle
bg_rect = ET.Element('rect', {
    'x': '0',
    'y': '0',
    'width': str(vb_width),
    'height': str(vb_height),
    'fill': '#FFFFFF'
})

# Insert background as first element
root.insert(0, bg_rect)

# Convert back to string
ET.register_namespace('', 'http://www.w3.org/2000/svg')
svg_with_bg = ET.tostring(root, encoding='unicode', method='xml')

# Save the modified SVG
with open("lab_report_qr.svg", "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write(svg_with_bg)

print("High-quality SVG QR code with white background generated: lab_report_qr.svg")

