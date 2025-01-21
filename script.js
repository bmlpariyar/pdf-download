// First, inject jsPDF
(function injectJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
})().then(() => {
    // Your original script here
    const pdfDocumentName = "Document";
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    function generatePDF_DataFile() {
        console.log("Processing images...");

        const imgTags = document.getElementsByTagName("img");
        const checkURLString = "blob:https://drive.google.com/";
        let yPosition = 10;
        const promises = [];

        for (let i = 0; i < imgTags.length; i++) {
            if (imgTags[i].src.substring(0, checkURLString.length) === checkURLString) {
                const img = imgTags[i];
                promises.push(
                    new Promise((resolve) => {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        
                        if (img.complete) {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                            const imgDataURL = canvas.toDataURL("image/jpeg");
                            resolve({ imgDataURL, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
                        } else {
                            img.onload = function() {
                                canvas.width = img.naturalWidth;
                                canvas.height = img.naturalHeight;
                                context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                                const imgDataURL = canvas.toDataURL("image/jpeg");
                                resolve({ imgDataURL, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
                            };
                            img.onerror = () => resolve(null);
                        }
                    })
                );
            }
        }

        Promise.all(promises)
            .then((images) => {
                console.log("Image processing completed.");
                images = images.filter(img => img !== null);

                images.forEach(({ imgDataURL, naturalWidth, naturalHeight }) => {
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imageWidth = pageWidth - 20;
                    const imageHeight = (naturalHeight / naturalWidth) * imageWidth;

                    if (yPosition + imageHeight > pdf.internal.pageSize.getHeight() - 10) {
                        pdf.addPage();
                        yPosition = 10;
                    }

                    try {
                        pdf.addImage(imgDataURL, "JPEG", 10, yPosition, imageWidth, imageHeight);
                        yPosition += imageHeight + 10;
                    } catch (error) {
                        console.error('Error adding image to PDF:', error);
                    }
                });

                console.log("Downloading PDF...");
                pdf.save(`${pdfDocumentName}.pdf`);
            })
            .catch(error => console.error('Error processing images:', error));
    }

    const allElements = document.querySelectorAll("*");
    let chosenElement;
    let heightOfScrollableElement = 0;

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].scrollHeight > allElements[i].clientHeight) {
            if (heightOfScrollableElement < allElements[i].scrollHeight) {
                heightOfScrollableElement = allElements[i].scrollHeight;
                chosenElement = allElements[i];
            }
        }
    }

    if (chosenElement && chosenElement.scrollHeight > chosenElement.clientHeight) {
        console.log("Auto Scroll Started");
        const scrollDistance = Math.round(chosenElement.clientHeight);

        function myLoop(remainingHeightToScroll, scrollToLocation) {
            setTimeout(function () {
                if (remainingHeightToScroll === 0) {
                    scrollToLocation = scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = chosenElement.scrollHeight - scrollDistance;
                } else {
                    scrollToLocation += scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll -= scrollDistance;
                }

                if (remainingHeightToScroll >= chosenElement.clientHeight) {
                    myLoop(remainingHeightToScroll, scrollToLocation);
                } else {
                    console.log("Auto Scroll Finished");
                    setTimeout(generatePDF_DataFile, 500);
                }
            }, 150);
        }

        myLoop(0, 0);
    } else {
        console.log("No Scroll Needed");
        setTimeout(generatePDF_DataFile, 500);
    }
}).catch(error => console.error('Failed to load jsPDF:', error));
