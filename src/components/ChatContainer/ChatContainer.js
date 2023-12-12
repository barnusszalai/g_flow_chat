import React from 'react';
import { FaRegPaperPlane, FaDownload } from 'react-icons/fa';
import WorkspaceInfo from './WorkspaceInfo';
import '../../styles/homescreen.css';
import Table from './Table';
import * as XLSX from 'xlsx'

const ChatContainer = ({ selectedWorkspaceId, workspaces, inputMessage, setInputMessage, handleKeyPress, handleSendMessage, selectedUseCase, handleUseCaseChange, selectedLLMModel, handleLLMModelChange, isTableView, toggleTableView }) => {

    const downloadTable = (tableData) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([]);

        var previousName = '';
    
        const processNestedObject = (obj, parentKey = '') => {
            for (const key in obj) {
                const value = obj[key];
                const combinedKey = parentKey ? `${parentKey}.${key}` : key;
    
                if (typeof value === 'object' && value !== null) {
                    // Display the parent key and move to the next cell
                    if(combinedKey.includes('.') == '') {
                        XLSX.utils.sheet_add_aoa(ws, [[combinedKey, '']], { origin: -1 });
                    }
                    previousName = parentKey;
    
                    // Process the nested object
                    processNestedObject(value, combinedKey);
                } else if (Array.isArray(value) && value.length > 0) {
                    combinedKey = parentKey ? `${parentKey}` : key;
                    // Display the parent key and move to the next cell
                    //XLSX.utils.sheet_add_aoa(ws, [[combinedKey, '']], { origin: -1 });
                    previousName = key;
                    // Process each item in the array
                    value.forEach((item, index) => {
                        processNestedObject(item, `${combinedKey}`);
                    });
                } else {
                    const formattedKey = combinedKey;
                    const childKeyCell = key === combinedKey ? '' : key;
    
                    // Display parent key, child key (if different from parent), and the value
                    console.log(previousName + ", " + parentKey.split('.')[0] + " // " + String(previousName == parentKey.split('.')[0]))
                    if((previousName == parentKey.split('.')[0]) && (previousName != '')) {
                        if (childKeyCell != '') {
                            XLSX.utils.sheet_add_aoa(ws, [['', childKeyCell, value]], { origin: -1 });
                        } else {
                            XLSX.utils.sheet_add_aoa(ws, [['', value]], { origin: -1 });
                        }
                    } else {
                        if (childKeyCell != '') {
                            XLSX.utils.sheet_add_aoa(ws, [[formattedKey, childKeyCell, value]], { origin: -1 });
                        } else {
                            XLSX.utils.sheet_add_aoa(ws, [[formattedKey, value]], { origin: -1 });
                        }
                    }
                }
            }
        };
    
        tableData.forEach((row, rowIndex) => {
            previousName = '';
            processNestedObject(row);
    
            if (rowIndex < tableData.length - 1) {
                XLSX.utils.sheet_add_aoa(ws, [[]], { origin: -1 });
            }
        });
    
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Sheet1.xlsx');
    };
    

    
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
                isTableView={isTableView}
                toggleTableView={toggleTableView}
            />
            ) : null}
            <div className="messages">
                {selectedWorkspaceId && workspaces.find(w => w.id === selectedWorkspaceId)?.messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.html ? (
                            <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                        ) : msg.text ? (
                            msg.text
                        ) : (
                            <div className="table-response">
                                <Table data={msg.table} />
                                <button className="download-excel-button" onClick={() => downloadTable(msg.table)}>Download Table</button>
                            </div>
                        )}
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
