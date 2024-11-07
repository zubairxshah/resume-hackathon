document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm') as HTMLFormElement;
    
    // Add event listeners for the new "Add More" buttons
    const addEducationBtn = document.getElementById('addEducation') as HTMLButtonElement;
    const addExperienceBtn = document.getElementById('addExperience') as HTMLButtonElement;
    const addSkillsBtn = document.getElementById('addSkills') as HTMLButtonElement;

    addEducationBtn?.addEventListener('click', () => addNewEntry('educationEntries', 'education'));
    addExperienceBtn?.addEventListener('click', () => addNewEntry('experienceEntries', 'experience'));
    addSkillsBtn?.addEventListener('click', () => addNewEntry('skillsEntries', 'skills'));

    form?.addEventListener('submit', function(event) {
        event.preventDefault();

        // Type assertions
        const nameElement = document.getElementById('name') as HTMLInputElement;
        const emailElement = document.getElementById('email') as HTMLInputElement;
        const contactnoElement = document.getElementById('contactno') as HTMLInputElement;
        const addressElement = document.getElementById('address') as HTMLInputElement;
        const profilePictureInput = document.getElementById('profilepicture') as HTMLInputElement;

        if (nameElement && emailElement && contactnoElement && addressElement) {
            const formData = new URLSearchParams();
            formData.append('name', nameElement.value);
            formData.append('email', emailElement.value);
            formData.append('contactno', contactnoElement.value);
            formData.append('address', addressElement.value);

            // Handle multiple entries for education, experience, and skills
            formData.append('education', JSON.stringify(getInputValues('educationEntries')));
            formData.append('experience', JSON.stringify(getInputValues('experienceEntries')));
            formData.append('skills', JSON.stringify(getInputValues('skillsEntries')));

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

function addNewEntry(containerId: string, inputName: string) {
    const container = document.getElementById(containerId);
    if (container) {
        const newEntry = document.createElement('div');
        newEntry.className = `${inputName}-entry`;
        newEntry.innerHTML = `
            <label for="${inputName}">${inputName.charAt(0).toUpperCase() + inputName.slice(1)}</label>
            <input name="${inputName}" type="text" required>
        `;
        container.appendChild(newEntry);
    }
}

function getInputValues(containerId: string): string[] {
    const container = document.getElementById(containerId);
    if (container) {
        const inputs = container.querySelectorAll('input');
        return Array.prototype.slice.call(inputs).map((input: HTMLInputElement) => input.value);
    }
    return [];
}

function redirectToResumePage(formData: URLSearchParams) {
    const queryString = formData.toString();
    window.location.href = `resume.html?${queryString}`;
}
