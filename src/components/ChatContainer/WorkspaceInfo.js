import React, { useState } from 'react';
import '../../styles/WorkspaceInfo.css';

const WorkspaceInfo = ({ 
    selectedWorkspaceId, 
    workspaces, 
    selectedUseCase, 
    handleUseCaseChange, 
    selectedLLMModel, 
    handleLLMModelChange 
}) => {
    const [isUseCaseDropdownVisible, setIsUseCaseDropdownVisible] = useState(false);
    const [isLLMDropdownVisible, setIsLLMDropdownVisible] = useState(false);

    const toggleUseCaseDropdown = () => {
        setIsUseCaseDropdownVisible(!isUseCaseDropdownVisible);
    };

    const toggleLLMDropdown = () => {
        setIsLLMDropdownVisible(!isLLMDropdownVisible);
    };

    const workspace = workspaces.find(workspace => workspace.id === selectedWorkspaceId);

    return (
        <div className="workspace-info">
            {workspace && (
                <div className="workspace-details">
                    <div className="current-workspace">
                        Workspace: {workspace.name}
                    </div>
                    <div className="use-case-selector">
                        <button onClick={toggleUseCaseDropdown}>
                            Use Case: {selectedUseCase}
                        </button>
                        {isUseCaseDropdownVisible && (
                            <div className="use-case-dropdown">
                                <div onClick={() => {handleUseCaseChange('Financial Analysis'); toggleUseCaseDropdown();}}>Financial Analysis</div>
                                {/* <div onClick={() => {handleUseCaseChange('Data Analysis'); toggleUseCaseDropdown();}}>Data Analysis</div> */}
                                {/* Add more use cases as needed */}
                            </div>
                        )}
                    </div>
                    <div className="llm-model-selector">
                        <button onClick={toggleLLMDropdown}>
                            LLM Model: {selectedLLMModel}
                        </button>
                        {isLLMDropdownVisible && (
                            <div className="llm-model-dropdown">
                                <div onClick={() => {handleLLMModelChange('GPT-4'); toggleLLMDropdown();}}>GPT-4</div>
                                {/* <div onClick={() => {handleLLMModelChange('GPT-4'); toggleLLMDropdown();}}>GPT-4</div> */}
                                {/* Add more models as needed */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceInfo;
