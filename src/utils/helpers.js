// This file contains helper functions that can be used across the application.

// Capitalizes the first letter of a string
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Formats a date to a more readable string
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Scrolls to the bottom of a given element
export const scrollToBottom = (element) => {
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
};

// Any additional helper functions can be added here
