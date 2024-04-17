import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../images/download.jpg";
import { useLocation } from "react-router-dom";

function Home({ loggedIn }) {
  const [players, setPlayers] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");
  const [friendCount, setFriendCount] = useState(0);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showFriendList, setShowFriendList] = useState(true); // Show friend list by default
  const location = useLocation();
  const playerId = location.state && location.state.playerId;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/v1/players/getall");
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        if (loggedIn) {
          const response = await axios.get(`http://localhost:8090/api/v1/players/${playerId}/friends`);
          setFriendList(response.data);
          setFriendCount(response.data.length); // Update friend count
        }
      } catch (error) {
        console.error("Error fetching friend list:", error);
      }
    };
    fetchFriendList();
  }, [loggedIn, playerId]);

  const handleAddFriend = async (friendId) => {
    try {
      if (!loggedIn) {
        return setErrorMessage(
          <p>
            Please <a href="/">login</a> to add a friend.
          </p>
        );
      }
      if (!friendId) {
        return setErrorMessage("Friend ID is required to add a friend.");
      }
      const response = await axios.post(
        `http://localhost:8090/api/v1/players/friends`,
        { playerId: playerId, friendId: friendId }
      );
      if (response && response.data === "Friend added successfully.") {
        setSuccessMessage(response.data);
        setFriendCount((prevCount) => prevCount + 1);
        setFriendId(""); // Clear the input field after adding friend
      } else {
        setErrorMessage("An error occurred while adding a friend.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding a friend.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      if (!loggedIn) {
        setMessage("Please login to remove a friend.");
        return;
      }
      console.log({playerId})
      console.log({friendId})
      console.log("clicked")
      const response = await axios.delete(`http://localhost:8090/api/v1/players/${playerId}/friends/${friendId}/remove`);
      if (response.data === "Friend removed successfully.") {
        // Optionally update the frontend UI or show a success message
      } else {
        // Handle the case where the friend was not removed successfully
      }
    } catch (error) {
      setMessage("An error occurred while removing the friend.");
    }
  };
  

  const handleShowPlayerList = () => {
    setShowPlayerList(!showPlayerList);
  };

  const handleShowFriendList = () => {
    setShowFriendList(!showFriendList);
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh', opacity: 0.9 }}>
      <div className="container" >
        <nav className="text-center">
          <br></br>
          <h2>Connecting Gamers</h2>
          <br></br>
            <a href="/" style={{ color: "red", textDecoration:"none" }}>LogOut</a>
            <br></br>
        </nav>
        <br></br>
        <br></br>
        <div class="container text-center">
          <div class="row align-items-start">
            <div class="col">
              <button onClick={handleShowFriendList}>Show Friend List</button>
              <br></br>
              <br></br>
              {showFriendList && (
                <div className="card" style={{ opacity: 0.8 }}>
                  <div className="card-body">
                      <h5 className="card-title">Number of friends: {friendCount}</h5>
                      <ul style={{ listStyleType: 'none' }}>

                        {friendList.map(friend => (
                          <li key={friend.friendId}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <h4>{friend.userName}</h4>
                              <button className="btn btn-danger" onClick={() => handleRemoveFriend(friend.friendId)}>Unfriend</button>
                            </div>
                            <br></br>
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              )}

            </div>
            <div class="col">
              <button onClick={handleShowPlayerList}>Show Player List</button>
              <br></br>
              <br></br>
              {successMessage && <p className="alert alert-success text-center" role="alert">{successMessage}</p>}
              {errorMessage && <p className="alert alert-danger text-center" role="alert">{errorMessage}</p>}
              {showPlayerList && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">All Players</h5>
                    <ul className="list-unstyled">
                      {players
                        .filter(player => player.id !== playerId) 
                        .map(player => {
                          const isFriend = friendList.some(friend => friend.friendId === player.id);
                          return (
                            <li key={player.id} className="d-flex justify-content-between">
                              <h4 style={{ color: "pink" }}>{player.userName}</h4>
                              {isFriend ? ( 
                                <span>Your Friends</span>
                              ) : (
                                <button className="btn btn-success" onClick={() => handleAddFriend(player.id)}>Add Friend</button>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                    <input
                      type="hidden"
                      value={friendId}
                      onChange={(e) => setFriendId(e.target.value)}
                    />
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
