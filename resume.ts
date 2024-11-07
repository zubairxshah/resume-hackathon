document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    const populateElement = (id: string, param: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = urlParams.get(param) || '';
        }
    };

    populateElement('name', 'name');
    populateElement('email', 'email');
    populateElement('contactNo', 'contactno');
    populateElement('address', 'address');
    populateElement('education', 'education');
    populateElement('experience', 'experience');
    populateElement('skills', 'skills');

    // Handle profile picture
    const profilePicture = document.getElementById('profilePicture') as HTMLImageElement;
    if (profilePicture) {
        const storedPicture = sessionStorage.getItem('profilePicture');
        if (storedPicture) {
            profilePicture.src = storedPicture;
        } else {
            profilePicture.style.display = 'none';
        }
    }

    makeEditable();
    setupDownloadButton();
});

function makeEditable() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', function() {
            const currentElement = element as HTMLElement;
            const currentValue = currentElement.textContent || "";

            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.classList.add('editing');
            
            const updateField = () => {
                currentElement.textContent = input.value;
                currentElement.style.display = 'inline';
                input.remove();
            };

            input.addEventListener('blur', updateField);
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    updateField();
                }
            });

            currentElement.textContent = '';
            currentElement.appendChild(input);
            input.focus();
        });
    });
}

function setupDownloadButton() {
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', printResumeToPDF);
    }
}

function printResumeToPDF() {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
        const resumeContainer = document.getElementById('resume-container');
        let resumeContent = '';
        
        if (resumeContainer) {
            const clonedResume = resumeContainer.cloneNode(true) as HTMLElement;
            clonedResume.querySelectorAll('.editable').forEach(el => {
                el.classList.remove('editable');
            });
            clonedResume.querySelector('#downloadButton')?.remove();
            resumeContent = clonedResume.innerHTML;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Resume</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                        h3 { color: #2980b9; }
                        .profilePicture {
                            max-width: 150px;
                            border-radius: 50%;
                            float: right;
                            margin-left: 20px;
                        }
                    </style>
                </head>
                <body>
                    ${resumeContent}
                </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.onafterprint = function() {
                    printWindow.close();
                };
            }, 1000);
        };
    } else {
        alert('Please allow popups for this website to download the resume as PDF.');
    }
}
