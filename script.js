document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('resumeForm');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (event) {
        var _a;
        event.preventDefault();
        // Type assertions
        var nameElement = document.getElementById('name');
        var emailElement = document.getElementById('email');
        var contactnoElement = document.getElementById('contactno');
        var addressElement = document.getElementById('address');
        var educationElement = document.getElementById('education');
        var experienceElement = document.getElementById('experience');
        var skillsElement = document.getElementById('skills');
        var profilePictureInput = document.getElementById('profilepicture');
        if (nameElement && emailElement && contactnoElement && addressElement && educationElement && experienceElement && skillsElement) {
            var formData_1 = new URLSearchParams();
            formData_1.append('name', nameElement.value);
            formData_1.append('email', emailElement.value);
            formData_1.append('contactno', contactnoElement.value);
            formData_1.append('address', addressElement.value);
            formData_1.append('education', educationElement.value);
            formData_1.append('experience', experienceElement.value);
            formData_1.append('skills', skillsElement.value);
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
function redirectToResumePage(formData) {
    var queryString = formData.toString();
    window.location.href = "resume.html?".concat(queryString);
}
