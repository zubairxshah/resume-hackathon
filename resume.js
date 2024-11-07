document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var populateElement = function (id, param) {
        var element = document.getElementById(id);
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
    var profilePicture = document.getElementById('profilePicture');
    if (profilePicture) {
        var storedPicture = sessionStorage.getItem('profilePicture');
        if (storedPicture) {
            profilePicture.src = storedPicture;
        }
        else {
            profilePicture.style.display = 'none';
        }
    }
    makeEditable();
    setupDownloadButton();
});
function makeEditable() {
    var editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(function (element) {
        element.addEventListener('click', function () {
            var currentElement = element;
            var currentValue = currentElement.textContent || "";
            var input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.classList.add('editing');
            var updateField = function () {
                currentElement.textContent = input.value;
                currentElement.style.display = 'inline';
                input.remove();
            };
            input.addEventListener('blur', updateField);
            input.addEventListener('keypress', function (e) {
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
    var downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', printResumeToPDF);
    }
}
function printResumeToPDF() {
    var _a;
    var printWindow = window.open('', '_blank');
    if (printWindow) {
        var resumeContainer = document.getElementById('resume-container');
        var resumeContent = '';
        if (resumeContainer) {
            var clonedResume = resumeContainer.cloneNode(true);
            clonedResume.querySelectorAll('.editable').forEach(function (el) {
                el.classList.remove('editable');
            });
            (_a = clonedResume.querySelector('#downloadButton')) === null || _a === void 0 ? void 0 : _a.remove();
            resumeContent = clonedResume.innerHTML;
        }
        printWindow.document.write("\n            <html>\n                <head>\n                    <title>Resume</title>\n                    <style>\n                        body {\n                            font-family: Arial, sans-serif;\n                            line-height: 1.6;\n                            color: #333;\n                            max-width: 800px;\n                            margin: 0 auto;\n                            padding: 20px;\n                        }\n                        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }\n                        h3 { color: #2980b9; }\n                        .profilePicture {\n                            max-width: 150px;\n                            border-radius: 50%;\n                            float: right;\n                            margin-left: 20px;\n                        }\n                    </style>\n                </head>\n                <body>\n                    ".concat(resumeContent, "\n                </body>\n            </html>\n        "));
        printWindow.document.close();
        printWindow.onload = function () {
            setTimeout(function () {
                printWindow.print();
                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            }, 1000);
        };
    }
    else {
        alert('Please allow popups for this website to download the resume as PDF.');
    }
}
