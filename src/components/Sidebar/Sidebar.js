import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../../styles/homescreen.css';

const Sidebar = ({ workspaces, selectedWorkspaceId, handleWorkspaceSelect, handleDeleteWorkspace, handleAddWorkspace, documents, documentTypes, DocumentTypeDropdown, setDocuments, selectedDocumentType }) => {
    
    const handleFileUpload = (event, type) => {
        const files = event.target.files;
        const newDocuments = [];

        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const newDocument = {
                    id: Date.now() + i,
                    name: file.name,
                    file: file,
                    type: type
                };
                newDocuments.push(newDocument);
            }
            setDocuments([...documents, ...newDocuments]);
        }
    };

    const handleDeleteDocument = (documentId) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
    };

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
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e, selectedDocumentType)}
                    multiple  // Allow selecting multiple files
                    directory=""  // Allow selecting directories (folders)
                    webkitdirectory=""  // For WebKit browsers
                />
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
