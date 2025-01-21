# Auto Scroll to PDF Generation with jsPDF

This script automates the process of scrolling through a webpage and generating a PDF document containing all the images on the page.

## How to Use

1. **Include the Script**: Copy and paste the entire JavaScript code into your HTML file within a `<script>` tag or link to it externally.

2. **Load the Page**: Once the page is loaded, the script will automatically check if there is a scrollable element with content. If so, it will scroll through the element, capturing images as it goes.

3. **PDF Download**: After scrolling is complete, the script will automatically generate and download a PDF file with all the images. The PDF will be named `Document.pdf`.

## Customization

- **Change PDF Name**: To customize the name of the generated PDF, modify the `pdfDocumentName` variable in the script.


## Requirements

- A modern web browser (Chrome, Firefox, etc.).
- Internet connection to load the jsPDF library from the CDN.

