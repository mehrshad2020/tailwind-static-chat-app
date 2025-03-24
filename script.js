
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const mainChat = document.getElementById('mainChat');
const contentSections = document.querySelectorAll('.content-section');
let isOpen = false;

function toggleSidebar() {
    isOpen = !isOpen;
    if (isOpen) {
        sidebar.classList.remove('sidebar-closed');
        sidebar.classList.add('sidebar-open');
        mainChat.classList.add('main-chat-hidden');
        contentSections.forEach(section => {
            section.classList.remove('content-hidden');
        });
    } else {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-closed');
        mainChat.classList.remove('main-chat-hidden');
        contentSections.forEach(section => {
            section.classList.add('content-hidden');
        });
    }
}

// Initialize mobile state
if (window.innerWidth < 640) {
    contentSections.forEach(section => {
        section.classList.add('content-hidden');
    });
}

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth < 640 && isOpen && !sidebar.contains(e.target) && e.target !== menuBtn) {
        toggleSidebar();
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) {
        sidebar.classList.remove('sidebar-closed');
        sidebar.classList.add('sidebar-open');
        mainChat.classList.remove('main-chat-hidden');
        contentSections.forEach(section => {
            section.classList.remove('content-hidden');
        });
    } else if (!isOpen) {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-closed');
        mainChat.classList.remove('main-chat-hidden');
        contentSections.forEach(section => {
            section.classList.add('content-hidden');
        });
    }
});

// Message Modal Functionality
const messageContainers = document.querySelectorAll('.message-container');
let activeModal = null;

messageContainers.forEach(container => {
    container.addEventListener('click', (e) => {
        const modal = container.querySelector('.message-modal');
        
        // Close any other open modal
        if (activeModal && activeModal !== modal) {
            activeModal.classList.remove('show');
        }

        // Toggle current modal
        modal.classList.toggle('show');
        activeModal = modal.classList.contains('show') ? modal : null;
        
        e.stopPropagation();
    });
});

// Close modal when clicking outside
document.addEventListener('click', () => {
    if (activeModal) {
        activeModal.classList.remove('show');
        activeModal = null;
    }
});

// Prevent modal from closing when clicking inside it
document.querySelectorAll('.message-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Toast notification functionality
const toast = document.getElementById('toastNotification');
let toastTimeout;

function showToast() {
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Handle modal option clicks
document.querySelectorAll('.modal-option').forEach(option => {
    option.addEventListener('click', async (e) => {
        const action = e.currentTarget.querySelector('span').textContent;
        const messageContainer = option.closest('.message-container');
        const messageText = messageContainer.querySelector('p').textContent;
        const editButtons = messageContainer.querySelector('.edit-buttons');

        if (action === 'Copy') {
            try {
                await navigator.clipboard.writeText(messageText);
                showToast();
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        } else if (action === 'Edit') {
            const paragraph = messageContainer.querySelector('p');
            const text = paragraph.textContent;
            
            // Create and setup input
            const input = document.createElement('input');
            input.type = 'text';
            input.value = text;
            input.className = 'edit-input text-sm';
            
            // Replace paragraph with input
            paragraph.replaceWith(input);
            input.focus();
            
            // Show edit buttons
            editButtons.classList.add('show');
            messageContainer.classList.add('editing');
            
            // Setup save button
            const saveBtn = editButtons.querySelector('.save-edit');
            const cancelBtn = editButtons.querySelector('.cancel-edit');
            
            function saveEdit() {
                const newText = input.value.trim();
                if (newText) {
                    const newParagraph = document.createElement('p');
                    newParagraph.className = 'text-sm';
                    newParagraph.textContent = newText;
                    input.replaceWith(newParagraph);
                }
                editButtons.classList.remove('show');
                messageContainer.classList.remove('editing');
            }
            
            function cancelEdit() {
                const newParagraph = document.createElement('p');
                newParagraph.className = 'text-sm';
                newParagraph.textContent = text;
                input.replaceWith(newParagraph);
                editButtons.classList.remove('show');
                messageContainer.classList.remove('editing');
            }
            
            saveBtn.onclick = saveEdit;
            cancelBtn.onclick = cancelEdit;
            
            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });
            
            // Handle Escape key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    cancelEdit();
                }
            });
        }
        
        if (activeModal) {
            activeModal.classList.remove('show');
            activeModal = null;
        }
    });
});
