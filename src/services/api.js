import axios from 'axios';

// Set up a base URL for API requests
const BASE_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

// Function to send messages to the backend
export const sendMessage = async (message, documents, useCase) => {
    try {
        if (useCase == 'General Summary') {
            const apiUrl = `${BASE_API_URL}/core-api/generate-summary/`;
            console.log("backend url: ", apiUrl)
            const formData = new FormData();
            formData.append('message', message);
    
            // Append each document to the FormData object
            documents.forEach(document => {
                formData.append('file', document.file);
            });
    
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            return response.data;
        } else {
            const apiUrl = `${BASE_API_URL}/core-api/generate/`;
            console.log("backend url: ", apiUrl)
            const formData = new FormData();
            formData.append('message', message);
    
            // Append each document to the FormData object
            documents.forEach(document => {
                formData.append('file', document.file);
            });
    
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            return response.data;
        }
    } catch (error) {
        console.error('Error in sendMessage API call:', error);
        throw error;
    }
};

// Additional API functions can be added here
