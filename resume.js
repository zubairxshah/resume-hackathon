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
// Get PDF Version
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
    // Get the profile picture
    var profilePictureElement = document.getElementById('profilePicture');
    var profilePicture = profilePictureElement.src;
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contactNo', contactNo);
    formData.append('address', address);
    formData.append('education', JSON.stringify(education));
    formData.append('experience', JSON.stringify(experience));
    formData.append('skills', JSON.stringify(skills));
    // Convert base64 image to file
    if (profilePicture.startsWith('data:image')) {
        var byteString = atob(profilePicture.split(',')[1]);
        var mimeString = profilePicture.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: mimeString });
        formData.append('profilePicture', blob, 'profile.jpg');
    }
    // Send data to server
    fetch('/api/share-resume', {
        method: 'POST',
        body: formData,
    })
        .then(function (response) { return response.json(); })
        .then(function (data) {
        if (data.success) {
            alert("Your resume has been shared. You can share this link: ".concat(data.shareableLink));
        }
        else {
            alert("There was an error sharing your resume: ".concat(data.error));
        }
    })
        .catch(function (error) {
        console.error('Error:', error);
        alert('There was an error sharing your resume. Please try again.');
    });
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
