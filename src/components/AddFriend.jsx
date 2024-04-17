import React, { useState } from 'react';
import axios from 'axios';

const AddFriend = () => {
    const [username, setUserName] = useState(" ");
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8090/api/v1/players/friends", { username });
            setUserName("");
            
             alert('Friend added successfully!');
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add Friend</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={username} onChange={(e) => setUserName(e.target.value)} required />
               <button type="submit">Add Friend</button>
            </form>
        </div>
    );
};

export default AddFriend;
