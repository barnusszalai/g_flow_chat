import React, { useState } from 'react';
import '../../styles/WorkspaceInfo.css';
import { FaTable, FaList } from 'react-icons/fa';

const WorkspaceInfo = ({
  selectedWorkspaceId,
  workspaces,
  selectedUseCase,
  handleUseCaseChange,
  selectedLLMModel,
  handleLLMModelChange,
  isTableView,
  toggleTableView
}) => {
  const [isUseCaseDropdownVisible, setIsUseCaseDropdownVisible] = useState(false);
  const [isLLMDropdownVisible, setIsLLMDropdownVisible] = useState(false);

  const toggleUseCaseDropdown = () => {
    setIsUseCaseDropdownVisible(!isUseCaseDropdownVisible);
  };

  const toggleLLMDropdown = () => {
    setIsLLMDropdownVisible(!isLLMDropdownVisible);
  };

  const workspace = workspaces.find((workspace) => workspace.id === selectedWorkspaceId);

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
                <div
                  onClick={() => {
                    handleUseCaseChange('Financial Analysis');
                    toggleUseCaseDropdown();
                  }}
                >
                  Financial Analysis
                </div>
              </div>
            )}
          </div>
          <div className="llm-model-selector">
            <button onClick={toggleLLMDropdown}>
              LLM Model: {selectedLLMModel}
            </button>
            {isLLMDropdownVisible && (
              <div className="llm-model-dropdown">
                <div
                  onClick={() => {
                    handleLLMModelChange('GPT-4');
                    toggleLLMDropdown();
                  }}
                >
                  GPT-4
                </div>
              </div>
            )}
          </div>
          <div className="view-switch">
            <button onClick={toggleTableView} className={isTableView ? 'active' : ''}>
              <FaTable />
            </button>
            <button onClick={toggleTableView} className={!isTableView ? 'active' : ''}>
              <FaList />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceInfo;
