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
    // Handle multiple entries for education, experience, and skills
    var populateMultipleEntries = function (id, param) {
        var element = document.getElementById(id);
        if (element) {
            var entries = JSON.parse(urlParams.get(param) || '[]');
            element.innerHTML = entries.map(function (entry) { return "<p>".concat(entry, "</p>"); }).join('');
        }
    };
    populateMultipleEntries('education', 'education');
    populateMultipleEntries('experience', 'experience');
    populateMultipleEntries('skills', 'skills');
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
    setupShareButton();
});
function makeEditable() {
    var editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(function (element) {
        element.addEventListener('click', function () {
            var currentElement = this;
            var isMultiEntry = ['education', 'experience', 'skills'].indexOf(currentElement.id) !== -1;
            if (isMultiEntry && !currentElement.querySelector('input')) {
                convertToEditableMulti(currentElement);
            }
            else if (!isMultiEntry && !currentElement.querySelector('input')) {
                convertToEditableSingle(currentElement);
            }
        });
        if (['education', 'experience', 'skills'].indexOf(element.id) !== -1) {
            element.addEventListener('focusout', function (event) {
                var focusEvent = event;
                var relatedTarget = focusEvent.relatedTarget;
                if (!(relatedTarget && (relatedTarget.tagName === 'INPUT' || relatedTarget.tagName === 'BUTTON'))) {
                    updateMultiEntryField(this);
                }
            });
        }
    });
}
function convertToEditableMulti(element) {
    var entries = Array.prototype.slice.call(element.children)
        .filter(function (child) { return child.tagName === 'P'; })
        .map(function (child) { return child.textContent || ""; });
    element.innerHTML = '';
    if (entries.length === 0) {
        addInputField(element);
    }
    else {
        entries.forEach(function (entry) {
            addInputField(element, entry);
        });
    }
    addAddButton(element);
}
function convertToEditableSingle(element) {
    var currentValue = element.textContent || "";
    var input = createInput(currentValue);
    var updateField = function () {
        element.textContent = input.value;
        input.remove();
    };
    input.addEventListener('blur', updateField);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateField();
        }
    });
    element.textContent = '';
    element.appendChild(input);
    input.focus();
}
function addInputField(element, value) {
    if (value === void 0) { value = ''; }
    var input = createInput(value);
    element.insertBefore(input, element.lastElementChild);
    return input;
}
function createInput(value) {
    var input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.classList.add('editing');
    return input;
}
function addAddButton(element) {
    if (!element.querySelector('button')) {
        var addButton = document.createElement('button');
        addButton.textContent = 'Add Entry';
        addButton.onclick = function (e) {
            e.stopPropagation(); // Prevent triggering the element's click event
            var newInput = addInputField(element);
            newInput.focus();
        };
        element.appendChild(addButton);
    }
}
function updateMultiEntryField(element) {
    var inputs = element.querySelectorAll('input');
    var entries = Array.prototype.slice.call(inputs)
        .map(function (input) { return input.value.trim(); })
        .filter(function (value) { return value !== ''; });
    element.innerHTML = entries
        .map(function (value) { return "<p>".concat(value, "</p>"); })
        .join('');
    if (entries.length === 0) {
        element.innerHTML = '<p></p>'; // Add an empty paragraph to maintain the structure
    }
}
function setupDownloadButton() {
    var downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', printResumeToPDF);
    }
}
function printResumeToPDF() {
    var printWindow = window.open('', '_blank');
    if (printWindow) {
        var resumeContainer = document.getElementById('resume-container');
        var resumeContent = '';
        if (resumeContainer) {
            var clonedResume = resumeContainer.cloneNode(true);
            clonedResume.querySelectorAll('.editable').forEach(function (el) {
                el.classList.remove('editable');
            });
            var downloadButton = clonedResume.querySelector('#downloadButton');
            if (downloadButton) {
                downloadButton.remove();
            }
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
function setupShareButton() {
    var shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', shareResume);
    }
}
function shareResume() {
    var name = document.getElementById('name').textContent || '';
    var email = document.getElementById('email').textContent || '';
    var contactNo = document.getElementById('contactNo').textContent || '';
    var address = document.getElementById('address').textContent || '';
    var education = getMultiEntryContent('education');
    var experience = getMultiEntryContent('experience');
    var skills = getMultiEntryContent('skills');
    var uniqueId = generateUniqueId(name);
    var fileName = "".concat(uniqueId, ".html");
    var resumeContent = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>".concat(name, "'s Resume</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 800px;\n            margin: 0 auto;\n            padding: 20px;\n        }\n        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }\n        h2 { color: #2980b9; }\n        .section { margin-bottom: 20px; }\n    </style>\n</head>\n<body>\n    <h1>").concat(name, "'s Resume</h1>\n    <div class=\"section\">\n        <p><strong>Email:</strong> ").concat(email, "</p>\n        <p><strong>Contact:</strong> ").concat(contactNo, "</p>\n        <p><strong>Address:</strong> ").concat(address, "</p>\n    </div>\n    <div class=\"section\">\n        <h2>Education</h2>\n        ").concat(education.map(function (item) { return "<p>".concat(item, "</p>"); }).join(''), "\n    </div>\n    <div class=\"section\">\n        <h2>Experience</h2>\n        ").concat(experience.map(function (item) { return "<p>".concat(item, "</p>"); }).join(''), "\n    </div>\n    <div class=\"section\">\n        <h2>Skills</h2>\n        ").concat(skills.map(function (item) { return "<p>".concat(item, "</p>"); }).join(''), "\n    </div>\n</body>\n</html>\n    ");
    // Create a Blob with the HTML content
    var blob = new Blob([resumeContent], { type: 'text/html' });
    // Create a link to download the file
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    // Append the link to the body, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // Create a shareable link
    var shareableLink = "".concat(window.location.origin, "/").concat(fileName);
    // Show the shareable link to the user
    alert("Your resume has been saved as ".concat(fileName, ". You can share this link: ").concat(shareableLink));
}
function generateUniqueId(name) {
    var cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    var timestamp = Date.now().toString(36);
    return "".concat(cleanName, "-").concat(timestamp);
}
function getMultiEntryContent(id) {
    var element = document.getElementById(id);
    if (element) {
        return Array.prototype.slice.call(element.children)
            .filter(function (child) { return child.tagName === 'P'; })
            .map(function (p) { return p.textContent || ''; });
    }
    return [];
}
