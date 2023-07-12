import React, { useState } from "react";
import axios from "axios";

// Create a new component for the collection item
const CollectionItem = ({ collection, handleBulkDelete, setUpdateCollection, updateCollection, setCollapsedGroups }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');
  
    const handleRename = async () => {
      try {
        const response = await axios.put(`http://localhost:8000/questions/${collection}/${newName}`);
        console.log(response.data); // Assuming the backend returns a success message
  
        // After renaming is complete, reset the renaming state
        setIsRenaming(false);
        setNewName('');
        setUpdateCollection(!updateCollection)
      } catch (error) {
        console.error(error); // Handle error case
      }
    };
  
    const toggleRenaming = () => {
      setIsRenaming(!isRenaming);
      setNewName('');
    };
  
    const handleCancelRename = () => {
      setIsRenaming(false);
      setNewName('');
    };
  
    const toggleGroupCollapse = (collection) => {
      setCollapsedGroups((prevState) => ({
        ...prevState,
        [collection]: !prevState[collection],
      }));
    };
  
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2
            onClick={() => toggleGroupCollapse(collection)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            {collection}
          </h2>
          {isRenaming ? (
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleRename}>Save</button>
              <button onClick={handleCancelRename}>Cancel</button> {/* Add Cancel button */}
            </div>
          ) : (
            <div>
              <button onClick={toggleRenaming}>Rename</button>
              <button onClick={() => handleBulkDelete(collection)}>Delete</button>
            </div>
          )}
        </div>
        
      </div>
    );
  };
  
  export default CollectionItem;
  