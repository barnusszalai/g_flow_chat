import React, { useState, useEffect } from 'react';
import { FaRegPaperPlane, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/homescreen.css';
import axios from 'axios';

const ChatBotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [selectedUseCase, setSelectedUseCase] = useState('Financial Analysis');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [selectedLLMModel, setSelectedLLMModel] = useState('GPT-4');
    const [isLLMDropdownVisible, setIsLLMDropdownVisible] = useState(false);

    useEffect(() => {
        scrollToBottom();
    }, [workspaces]); // Dependency array includes the workspaces, which updates when messages change

    const handleAddDocument = () => {
        const newDocument = { id: Date.now(), name: `Document ${documents.length + 1}` };
        setDocuments([...documents, newDocument]);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newDocument = {
                id: Date.now(),
                name: file.name,
                file: file // Storing the actual file object
            };
            setDocuments([...documents, newDocument]);
        }
    };

    const handleDeleteDocument = (documentId) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
    };

    const handleAddWorkspace = () => {
        const newWorkspace = {
            id: Date.now(),
            name: `Workspace ${workspaces.length + 1}`,
            messages: [],
            llmModel: 'GPT-4',
            useCase: 'Financial Analysis'
        };
        setWorkspaces([...workspaces, newWorkspace]);
        setSelectedWorkspaceId(newWorkspace.id);
    };

    const handleWorkspaceSelect = (workspaceId) => {
        const selectedWorkspace = workspaces.find(workspace => workspace.id === workspaceId);
        if (selectedWorkspace) {
            setSelectedWorkspaceId(workspaceId);
            setSelectedLLMModel(selectedWorkspace.llmModel);
            setSelectedUseCase(selectedWorkspace.useCase);
            setInputMessage('');
        }
    };

    const handleDeleteWorkspace = (workspaceId) => {
        setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== workspaceId));
        if (selectedWorkspaceId === workspaceId) {
            setSelectedWorkspaceId(null);
        }
    };

    const handleLLMModelChange = (newModel) => {
        setSelectedLLMModel(newModel);
        setWorkspaces(workspaces.map(workspace =>
            workspace.id === selectedWorkspaceId ? { ...workspace, llmModel: newModel } : workspace
        ));
    };

    const handleUseCaseChange = (newUseCase) => {
        setSelectedUseCase(newUseCase);
        setWorkspaces(workspaces.map(workspace =>
            workspace.id === selectedWorkspaceId ? { ...workspace, useCase: newUseCase } : workspace
        ));
    };

    const addMessageToWorkspace = (workspaceId, message) => {
        setWorkspaces(prevWorkspaces => prevWorkspaces.map(workspace => {
            if (workspace.id === workspaceId) {
                return { ...workspace, messages: [...workspace.messages, message] };
            }
            return workspace;
        }));
    
        // Scroll to bottom after state update
        scrollToBottom();
    };
    

    const scrollToBottom = () => {
        const messages = document.querySelectorAll('.message'); // Select all message elements
        const lastMessage = messages[messages.length - 1]; // Get the last message
    
        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };
    

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedWorkspaceId) return;
    
        // Add user message to chat immediately
        const newMessage = { text: inputMessage, sender: 'user' };
        addMessageToWorkspace(selectedWorkspaceId, newMessage);
    
        // Reset input field
        setInputMessage('');
    
        const apiUrl = 'https://8aeb-94-8-160-40.ngrok-free.app/core-api/generate/'; // API endpoint
        const formData = new FormData();
        formData.append('message', inputMessage); // Append the user's message
    
        // Append each document to the FormData object
        documents.forEach(document => {
            formData.append('file', document.file);
        });
    
        // Add loading message
        const loadingMessage = { html: '<div class="loading-message">Generating response...</div>', sender: 'bot', isTemporary: true };
        addMessageToWorkspace(selectedWorkspaceId, loadingMessage);
    
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            const botResponseData = response.data;
            console.log(botResponseData);
    
            // Remove only the loading message
            removeSpecificTemporaryMessage(selectedWorkspaceId, loadingMessage);
    
            // Process and display the bot's response
            const formattedResponse = formatResponse(botResponseData.data);
            addMessageToWorkspace(selectedWorkspaceId, { html: formattedResponse, sender: 'bot' });
    
        } catch (error) {
            console.error('Error sending message:', error);
    
            // Convert loading message to error message instead of adding a new one
            updateTemporaryMessage(selectedWorkspaceId, '<div class="error-message">Failed to generate response.</div>', loadingMessage);
        }
    };

    const formatResponse = (data) => {
        let formattedResponse = '';

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    
        const formatItem = (item) => {
            if (typeof item === 'string') {
                return `<li>${item}</li>`;
            } else if (Array.isArray(item)) {
                return `<ul>${item.map(subItem => formatItem(subItem)).join('')}</ul>`;
            } else if (typeof item === 'object' && item !== null) {
                return formatObject(item);
            }
            return '';
        };
    
        const formatObject = (obj) => {
            return `<ul>${Object.entries(obj).map(([key, value]) => {
                const capitalizedKey = capitalizeFirstLetter(key);
                return `<li><strong>${capitalizedKey}:</strong> ${formatItem(value)}</li>`;
            }).join('')}</ul>`;
        };
    
        data.forEach(item => {
            formattedResponse += formatItem(item);
        });
    
        return formattedResponse;
    };
    
    const removeSpecificTemporaryMessage = (workspaceId, messageToRemove) => {
        setWorkspaces(prevWorkspaces => prevWorkspaces.map(workspace => {
            if (workspace.id === workspaceId) {
                return { ...workspace, messages: workspace.messages.filter(msg => msg !== messageToRemove) };
            }
            return workspace;
        }));
    };
    
    const updateTemporaryMessage = (workspaceId, newHtml, oldMessage) => {
        setWorkspaces(prevWorkspaces => prevWorkspaces.map(workspace => {
            if (workspace.id === workspaceId) {
                return {
                    ...workspace,
                    messages: workspace.messages.map(msg => 
                        msg === oldMessage ? { ...msg, html: newHtml, isTemporary: false } : msg
                    )
                };
            }
            return workspace;
        }));
    };
    
    
    const removeMessageFromWorkspace = (workspaceId, message) => {
        setWorkspaces(prevWorkspaces => prevWorkspaces.map(workspace => {
            if (workspace.id === workspaceId) {
                return { ...workspace, messages: workspace.messages.filter(msg => msg !== message) };
            }
            return workspace;
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="sidebar">
                <div className="sidebar-logo">G-Flow</div>
                <div className="submenu-heading">Workspaces</div>
                {workspaces.map(workspace => (
                    <div key={workspace.id} className={`workspace-item ${selectedWorkspaceId === workspace.id ? 'selected' : ''}`} onClick={() => handleWorkspaceSelect(workspace.id)}>
                        {workspace.name}
                        <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }}>
                            <FaTrash className="delete-icon" />
                        </button>
                    </div>
                ))}
                <button className="sidebar-button new-workspace" onClick={handleAddWorkspace}>
                    <FaPlus className="icon" /> New Workspace
                </button>
                
                <div className="submenu-heading">Uploaded Documents</div>
                {documents.map(doc => (
                    <div key={doc.id} className="document-item">
                        <span className="document-item-name">{doc.name}</span>
                        <button className="delete-button" onClick={() => handleDeleteDocument(doc.id)}>
                            <FaTrash className="delete-icon" />
                        </button>
                    </div>
                ))}
                <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileUpload} />
                <button className="sidebar-button add-document" onClick={() => document.getElementById('file-upload').click()}>
                    <FaPlus className="icon" /> Add Document
                </button>
            </div>
            <div className="chat-container">
                {selectedWorkspaceId && (
                    <div className="workspace-info">
                        <div className="current-workspace">
                            {workspaces.find(w => w.id === selectedWorkspaceId)?.name}
                        </div>
                        <div className="use-case-selector">
                            <button className={`use-case-button ${isDropdownVisible ? 'selected' : ''}`} onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                                {selectedUseCase}
                            </button>
                            {isDropdownVisible && (
                                <div className="use-case-dropdown">
                                    <div onClick={() => { handleUseCaseChange('Financial Analysis'); setIsDropdownVisible(false); }}>Financial Analysis</div>
                                    <div onClick={() => { handleUseCaseChange('Report Writing'); setIsDropdownVisible(false); }}>Report Writing</div>
                                </div>
                            )}
                        </div>
                        <div className="llm-model-selector">
                            <button className={`llm-model-button ${isLLMDropdownVisible ? 'selected' : ''}`} onClick={() => setIsLLMDropdownVisible(!isLLMDropdownVisible)}>
                                {selectedLLMModel}
                            </button>
                            {isLLMDropdownVisible && (
                                <div className="llm-model-dropdown">
                                    <div onClick={() => { handleLLMModelChange('GPT-4'); setIsLLMDropdownVisible(false); }}>GPT-4</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="messages">
                    {selectedWorkspaceId && workspaces.find(w => w.id === selectedWorkspaceId)?.messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.html ? <div dangerouslySetInnerHTML={{ __html: msg.html }} /> : msg.text}
                        </div>
                    ))}
                </div>
                {selectedWorkspaceId && (
                    <div className="input-container">
                        <input type="text" placeholder="Type your message here..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} />
                        <FaRegPaperPlane className="send-icon" onClick={handleSendMessage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBotScreen;
