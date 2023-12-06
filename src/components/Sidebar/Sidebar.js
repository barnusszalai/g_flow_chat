import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../../styles/homescreen.css';

const Sidebar = ({ workspaces, selectedWorkspaceId, handleWorkspaceSelect, handleDeleteWorkspace, handleAddWorkspace, documents, documentTypes, handleDeleteDocument, DocumentTypeDropdown, handleFileUpload, selectedDocumentType }) => {
    return (
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
            <button className="sidebar-button" onClick={handleAddWorkspace}>
                <FaPlus className="icon" /> New Workspace
            </button>
            
            {documents.length > 0 && (
                <div>
                    <div className="submenu-heading">Uploaded Documents</div>
                    {documentTypes.map((type) => {
                        const filteredDocs = documents.filter(doc => doc.type === type);
                        return filteredDocs.length > 0 && (
                            <div key={type}>
                                <div className="document-type-heading">{type}</div>
                                {filteredDocs.map(doc => (
                                    <div key={doc.id} className="document-item">
                                        <span className="document-item-name">{doc.name}</span>
                                        <button className="delete-button" onClick={() => handleDeleteDocument(doc.id)}>
                                            <FaTrash className="delete-icon" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}

            <div>
                <DocumentTypeDropdown />
                <input type="file" id="file-upload" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, selectedDocumentType)} />
            </div>
            <button 
                className="sidebar-button add-document" 
                onClick={() => document.getElementById('file-upload').click()}
                disabled={!selectedDocumentType}
            >
                <FaPlus className="icon" /> Add Document
            </button>
        </div>
    );
};

export default Sidebar;
