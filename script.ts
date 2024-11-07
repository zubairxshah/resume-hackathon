document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm') as HTMLFormElement;
    
    form?.addEventListener('submit', function(event) {
        event.preventDefault();

        // Type assertions
        const nameElement = document.getElementById('name') as HTMLInputElement;
        const emailElement = document.getElementById('email') as HTMLInputElement;
        const contactnoElement = document.getElementById('contactno') as HTMLInputElement;
        const addressElement = document.getElementById('address') as HTMLInputElement;
        const educationElement = document.getElementById('education') as HTMLTextAreaElement;
        const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;
        const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
        const profilePictureInput = document.getElementById('profilepicture') as HTMLInputElement;

        if (nameElement && emailElement && contactnoElement && addressElement && educationElement && experienceElement && skillsElement) {
            const formData = new URLSearchParams();
            formData.append('name', nameElement.value);
            formData.append('email', emailElement.value);
            formData.append('contactno', contactnoElement.value);
            formData.append('address', addressElement.value);
            formData.append('education', educationElement.value);
            formData.append('experience', experienceElement.value);
            formData.append('skills', skillsElement.value);

            // Handle profile picture
            const profilePictureFile = profilePictureInput.files?.[0];
            if (profilePictureFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const result = e.target?.result;
                    if (typeof result === 'string') {
                        sessionStorage.setItem('profilePicture', result);
                    }
                    redirectToResumePage(formData);
                };
                reader.readAsDataURL(profilePictureFile);
            } else {
                redirectToResumePage(formData);
            }
        } else {
            console.error('One or more elements are missing');
        }
    });
});

function redirectToResumePage(formData: URLSearchParams) {
    const queryString = formData.toString();
    window.location.href = `resume.html?${queryString}`;
}
