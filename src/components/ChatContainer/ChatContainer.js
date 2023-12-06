import React from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import WorkspaceInfo from './WorkspaceInfo';
import '../../styles/homescreen.css';

const ChatContainer = ({ selectedWorkspaceId, workspaces, inputMessage, setInputMessage, handleKeyPress, handleSendMessage, selectedUseCase, handleUseCaseChange, selectedLLMModel, handleLLMModelChange }) => {
    return (
        <div className="chat-container">
            {selectedWorkspaceId ? (
            <WorkspaceInfo
                selectedWorkspaceId={selectedWorkspaceId}
                workspaces={workspaces}
                selectedUseCase={selectedUseCase}
                handleUseCaseChange={handleUseCaseChange}
                selectedLLMModel={selectedLLMModel}
                handleLLMModelChange={handleLLMModelChange}
            />
            ) : null}
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
    );
};

export default ChatContainer;
