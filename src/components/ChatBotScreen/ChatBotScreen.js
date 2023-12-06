import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../../styles/homescreen.css';
import Sidebar from '../Sidebar';
import ChatContainer from '../ChatContainer';
import { sendMessage } from '../../services/api';
import { scrollToBottom, capitalizeFirstLetter } from '../../utils/helpers';

const ChatBotScreen = () => {
    const documentTypes = ["Purchase Agreement"];
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedUseCase, setSelectedUseCase] = useState('Financial Analysis');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedLLMModel, setSelectedLLMModel] = useState('GPT-4');
    const [isLLMDropdownVisible, setIsLLMDropdownVisible] = useState(false);
    const [isUploadPromptVisible, setIsUploadPromptVisible] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const messagesContainer = document.querySelector('.messages');
        scrollToBottom(messagesContainer);
    }, [workspaces]);

    const toggleDocumentTypeDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDocumentTypeSelect = (type) => {
        setSelectedDocumentType(type);
        setIsDropdownOpen(false);
    };

    const DocumentTypeDropdown = () => {
        return (
            <div className="document-type-selector">
                <div className="document-type-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {selectedDocumentType || 'Select document type'}
                </div>
                {isDropdownOpen && (
                    <div className="document-type-menu">
                        {documentTypes.map((type, index) => (
                            <div 
                                key={index} 
                                className="document-type-item" 
                                onClick={() => handleDocumentTypeSelect(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleAddDocument = () => {
        const newDocument = { id: Date.now(), name: `Document ${documents.length + 1}` };
        setDocuments([...documents, newDocument]);
    };

    const handleFileUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
          const newDocument = {
            id: Date.now(),
            name: file.name,
            file: file,
            type: type
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
        scrollToBottom();
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

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedWorkspaceId) return;

        const newMessage = { text: inputMessage, sender: 'user' };
        addMessageToWorkspace(selectedWorkspaceId, newMessage);
        setInputMessage('');

        const loadingMessage = { html: '<div class="loading-message">Generating response...</div>', sender: 'bot', isTemporary: true };
        addMessageToWorkspace(selectedWorkspaceId, loadingMessage);

        try {
            const botResponseData = await sendMessage(inputMessage, documents);

            removeSpecificTemporaryMessage(selectedWorkspaceId, loadingMessage);
            const formattedResponse = formatResponse(botResponseData.data);
            addMessageToWorkspace(selectedWorkspaceId, { html: formattedResponse, sender: 'bot' });
        } catch (error) {
            updateTemporaryMessage(selectedWorkspaceId, '<div class="error-message">Failed to generate response.</div>', loadingMessage);
        }
    };

    const formatResponse = (data) => {
        let formattedResponse = '';
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
    

    return (
        <div className="chatbot-container">
            <Sidebar
                workspaces={workspaces}
                selectedWorkspaceId={selectedWorkspaceId}
                handleWorkspaceSelect={handleWorkspaceSelect}
                handleDeleteWorkspace={handleDeleteWorkspace}
                handleAddWorkspace={handleAddWorkspace}
                documents={documents}
                documentTypes={documentTypes}
                handleDeleteDocument={handleDeleteDocument}
                DocumentTypeDropdown={DocumentTypeDropdown}
                handleFileUpload={handleFileUpload}
                selectedDocumentType={selectedDocumentType}
            />
            <ChatContainer
                selectedWorkspaceId={selectedWorkspaceId}
                workspaces={workspaces}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleKeyPress={handleKeyPress}
                handleSendMessage={handleSendMessage}
                selectedUseCase={selectedUseCase}
                handleUseCaseChange={handleUseCaseChange}
                selectedLLMModel={selectedLLMModel}
                handleLLMModelChange={handleLLMModelChange}
            />
        </div>
    );
};

export default ChatBotScreen;