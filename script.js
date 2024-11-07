document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('resumeForm');
    // Add event listeners for the new "Add More" buttons
    var addEducationBtn = document.getElementById('addEducation');
    var addExperienceBtn = document.getElementById('addExperience');
    var addSkillsBtn = document.getElementById('addSkills');
    addEducationBtn === null || addEducationBtn === void 0 ? void 0 : addEducationBtn.addEventListener('click', function () { return addNewEntry('educationEntries', 'education'); });
    addExperienceBtn === null || addExperienceBtn === void 0 ? void 0 : addExperienceBtn.addEventListener('click', function () { return addNewEntry('experienceEntries', 'experience'); });
    addSkillsBtn === null || addSkillsBtn === void 0 ? void 0 : addSkillsBtn.addEventListener('click', function () { return addNewEntry('skillsEntries', 'skills'); });
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (event) {
        var _a;
        event.preventDefault();
        // Type assertions
        var nameElement = document.getElementById('name');
        var emailElement = document.getElementById('email');
        var contactnoElement = document.getElementById('contactno');
        var addressElement = document.getElementById('address');
        var profilePictureInput = document.getElementById('profilepicture');
        if (nameElement && emailElement && contactnoElement && addressElement) {
            var formData_1 = new URLSearchParams();
            formData_1.append('name', nameElement.value);
            formData_1.append('email', emailElement.value);
            formData_1.append('contactno', contactnoElement.value);
            formData_1.append('address', addressElement.value);
            // Handle multiple entries for education, experience, and skills
            formData_1.append('education', JSON.stringify(getInputValues('educationEntries')));
            formData_1.append('experience', JSON.stringify(getInputValues('experienceEntries')));
            formData_1.append('skills', JSON.stringify(getInputValues('skillsEntries')));
            // Handle profile picture
            var profilePictureFile = (_a = profilePictureInput.files) === null || _a === void 0 ? void 0 : _a[0];
            if (profilePictureFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    var result = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (typeof result === 'string') {
                        sessionStorage.setItem('profilePicture', result);
                    }
                    redirectToResumePage(formData_1);
                };
                reader.readAsDataURL(profilePictureFile);
            }
            else {
                redirectToResumePage(formData_1);
            }
        }
        else {
            console.error('One or more elements are missing');
        }
    });
});
function addNewEntry(containerId, inputName) {
    var container = document.getElementById(containerId);
    if (container) {
        var newEntry = document.createElement('div');
        newEntry.className = "".concat(inputName, "-entry");
        newEntry.innerHTML = "\n            <label for=\"".concat(inputName, "\">").concat(inputName.charAt(0).toUpperCase() + inputName.slice(1), "</label>\n            <input name=\"").concat(inputName, "\" type=\"text\" required>\n        ");
        container.appendChild(newEntry);
    }
}
function getInputValues(containerId) {
    var container = document.getElementById(containerId);
    if (container) {
        var inputs = container.querySelectorAll('input');
        return Array.prototype.slice.call(inputs).map(function (input) { return input.value; });
    }
    return [];
}
function redirectToResumePage(formData) {
    var queryString = formData.toString();
    window.location.href = "resume.html?".concat(queryString);
}
