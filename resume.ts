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

    // entries for education, experience, and skills
    const populateMultipleEntries = (id: string, param: string) => {
        const element = document.getElementById(id);
        if (element) {
            const entries = JSON.parse(urlParams.get(param) || '[]');
            element.innerHTML = entries.map((entry: string) => `<p>${entry}</p>`).join('');
        }
    };

    populateMultipleEntries('education', 'education');
    populateMultipleEntries('experience', 'experience');
    populateMultipleEntries('skills', 'skills');

    // profile picture
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
    setupShareButton();
});

function makeEditable() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', function(this: HTMLElement) {
            const currentElement = this;
            const isMultiEntry = ['education', 'experience', 'skills'].indexOf(currentElement.id) !== -1;

            if (isMultiEntry && !currentElement.querySelector('input')) {
                convertToEditableMulti(currentElement);
            } else if (!isMultiEntry && !currentElement.querySelector('input')) {
                convertToEditableSingle(currentElement);
            }
        });

        if (['education', 'experience', 'skills'].indexOf(element.id) !== -1) {
            element.addEventListener('focusout', function(this: HTMLElement, event: Event) {
                const focusEvent = event as FocusEvent;
                const relatedTarget = focusEvent.relatedTarget as HTMLElement | null;
                if (!(relatedTarget && (relatedTarget.tagName === 'INPUT' || relatedTarget.tagName === 'BUTTON'))) {
                    updateMultiEntryField(this);
                }
            });
        }
    });
}

function convertToEditableMulti(element: HTMLElement) {
    const entries = Array.prototype.slice.call(element.children)
        .filter(function(child: HTMLElement) { return child.tagName === 'P'; })
        .map(function(child: HTMLElement) { return child.textContent || ""; });
    
    element.innerHTML = '';
    if (entries.length === 0) {
        addInputField(element);
    } else {
        entries.forEach(function(entry: string) {
            addInputField(element, entry);
        });
    }
    addAddButton(element);
}

function convertToEditableSingle(element: HTMLElement) {
    const currentValue = element.textContent || "";
    const input = createInput(currentValue);
    
    const updateField = function() {
        element.textContent = input.value;
        input.remove();
    };

    input.addEventListener('blur', updateField);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateField();
        }
    });

    element.textContent = '';
    element.appendChild(input);
    input.focus();
}

function addInputField(element: HTMLElement, value: string = '') {
    const input = createInput(value);
    element.insertBefore(input, element.lastElementChild);
    return input;
}

function createInput(value: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.classList.add('editing');
    return input;
}

function addAddButton(element: HTMLElement) {
    if (!element.querySelector('button')) {
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Entry';
        addButton.onclick = function(e) {
            e.stopPropagation();
            const newInput = addInputField(element);
            newInput.focus();
        };
        element.appendChild(addButton);
    }
}

function updateMultiEntryField(element: HTMLElement) {
    const inputs = element.querySelectorAll('input');
    const entries = Array.prototype.slice.call(inputs)
        .map(function(input: HTMLInputElement) { return input.value.trim(); })
        .filter(function(value: string) { return value !== ''; });

    element.innerHTML = entries
        .map(function(value: string) { return `<p>${value}</p>`; })
        .join('');

    if (entries.length === 0) {
        element.innerHTML = '<p></p>'; 
    }
}

function setupDownloadButton() {
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', printResumeToPDF);
    }
}

// Get PDF Version
function printResumeToPDF() {
    
    const originalBody = document.body.innerHTML;
    
    
    const resumeContainer = document.getElementById('resume-container');
    
    if (resumeContainer) {
        const printContent = document.createElement('div');
        printContent.className = 'print-wrapper';
        
        const resumeClone = resumeContainer.cloneNode(true);
        printContent.appendChild(resumeClone);

        document.body.innerHTML = '';
        document.body.appendChild(printContent);

        // print styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                @page {
                    size: A4;
                    margin: 0;
                }
                
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                
                .print-wrapper {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 20mm;
                    margin: 0 auto;
                    background: white;
                }
                
                #resume-container {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                
                .section {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    break-after: avoid;
                    page-break-after: avoid;
                }
                
                img, svg {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                
                .profilePicture {
                    max-width: 150px !important;
                }
                
                #downloadButton, #shareButton, 
                .edit-button, .add-button,
                .navbar, .footer {
                    display: none !important;
                }
                
                .editable {
                    border: none !important;
                }
                
                /* Preserve all colors and backgrounds */
                * {
                    color-adjust: exact !important;
                    -webkit-print-color-adjust: exact !important;
                }
                
                /* Preserve flex layouts */
                .content-wrapper {
                    display: flex !important;
                    gap: 2rem !important;
                }
                
                .left-column, .right-column {
                    flex: 1 !important;
                }
                
                /* Preserve text styles */
                p, span, div {
                    orphans: 3;
                    widows: 3;
                }
                
                /* Force background colors and images to print */
                div {
                    background-color: inherit !important;
                }
                
                /* Ensure proper margin collapse */
                * {
                    margin-top: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // image loader Promise
        const images = document.querySelectorAll('img');
        Promise.all(Array.from(images).map(img => {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })).then(() => {
            
            setTimeout(() => {
                window.print();
                
                document.body.innerHTML = originalBody;
                
                style.remove();
                
                setupDownloadButton();
                setupShareButton();
            }, 200);
        });
    }
}



function setupShareButton() {
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', shareResume);
    }
}

function shareResume() {
    const name = (document.getElementById('name') as HTMLElement).textContent || '';
    const email = (document.getElementById('email') as HTMLElement).textContent || '';
    const contactNo = (document.getElementById('contactNo') as HTMLElement).textContent || '';
    const address = (document.getElementById('address') as HTMLElement).textContent || '';
    
    const education = getMultiEntryContent('education');
    const experience = getMultiEntryContent('experience');
    const skills = getMultiEntryContent('skills');

    
    const profilePictureElement = document.getElementById('profilePicture') as HTMLImageElement;
    const profilePicture = profilePictureElement.src;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contactNo', contactNo);
    formData.append('address', address);
    formData.append('education', JSON.stringify(education));
    formData.append('experience', JSON.stringify(experience));
    formData.append('skills', JSON.stringify(skills));

    // save image
    if (profilePicture.startsWith('data:image')) {
        const byteString = atob(profilePicture.split(',')[1]);
        const mimeString = profilePicture.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {type: mimeString});
        formData.append('profilePicture', blob, 'profile.jpg');
    }

    // node.js setting
    fetch('/api/share-resume', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Your resume has been shared. You can share this link: ${data.shareableLink}`);
        } else {
            alert(`There was an error sharing your resume: ${data.error}`);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error sharing your resume. Please try again.');
    });
}




function getMultiEntryContent(id: string): string[] {
    const element = document.getElementById(id);
    if (element) {
        return Array.prototype.slice.call(element.children)
            .filter(function(child: HTMLElement) { return child.tagName === 'P'; })
            .map(function(p: HTMLElement) { return p.textContent || ''; });
    }
    return [];
}
