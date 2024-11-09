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
    // entries for education, experience, and skills
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
    // profile picture
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
            e.stopPropagation();
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
        element.innerHTML = '<p></p>';
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
    var originalBody = document.body.innerHTML;
    var resumeContainer = document.getElementById('resume-container');
    if (resumeContainer) {
        var printContent = document.createElement('div');
        printContent.className = 'print-wrapper';
        var resumeClone = resumeContainer.cloneNode(true);
        printContent.appendChild(resumeClone);
        document.body.innerHTML = '';
        document.body.appendChild(printContent);
        // print styles
        var style_1 = document.createElement('style');
        style_1.textContent = "\n            @media print {\n                @page {\n                    size: A4;\n                    margin: 0;\n                }\n                \n                * {\n                    -webkit-print-color-adjust: exact !important;\n                    print-color-adjust: exact !important;\n                }\n                \n                body {\n                    margin: 0;\n                    padding: 0;\n                    background: white;\n                }\n                \n                .print-wrapper {\n                    width: 210mm;\n                    min-height: 297mm;\n                    padding: 20mm;\n                    margin: 0 auto;\n                    background: white;\n                }\n                \n                #resume-container {\n                    width: 100% !important;\n                    margin: 0 !important;\n                    padding: 0 !important;\n                    box-shadow: none !important;\n                }\n                \n                .section {\n                    break-inside: avoid;\n                    page-break-inside: avoid;\n                }\n                \n                h1, h2, h3, h4, h5, h6 {\n                    break-after: avoid;\n                    page-break-after: avoid;\n                }\n                \n                img, svg {\n                    break-inside: avoid;\n                    page-break-inside: avoid;\n                }\n                \n                .profilePicture {\n                    max-width: 150px !important;\n                }\n                \n                #downloadButton, #shareButton, \n                .edit-button, .add-button,\n                .navbar, .footer {\n                    display: none !important;\n                }\n                \n                .editable {\n                    border: none !important;\n                }\n                \n                /* Preserve all colors and backgrounds */\n                * {\n                    color-adjust: exact !important;\n                    -webkit-print-color-adjust: exact !important;\n                }\n                \n                /* Preserve flex layouts */\n                .content-wrapper {\n                    display: flex !important;\n                    gap: 2rem !important;\n                }\n                \n                .left-column, .right-column {\n                    flex: 1 !important;\n                }\n                \n                /* Preserve text styles */\n                p, span, div {\n                    orphans: 3;\n                    widows: 3;\n                }\n                \n                /* Force background colors and images to print */\n                div {\n                    background-color: inherit !important;\n                }\n                \n                /* Ensure proper margin collapse */\n                * {\n                    margin-top: 0;\n                }\n            }\n        ";
        document.head.appendChild(style_1);
        // image loader Promise
        var images = document.querySelectorAll('img');
        Promise.all(Array.from(images).map(function (img) {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise(function (resolve) {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })).then(function () {
            setTimeout(function () {
                window.print();
                document.body.innerHTML = originalBody;
                style_1.remove();
                setupDownloadButton();
                setupShareButton();
            }, 200);
        });
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
    // save image
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
    // node.js setting
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
