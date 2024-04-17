// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayerRegistration from "./components/PlayerRegistration";
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";
import AddFriend from "./components/AddFriend";
import PlayerProfile from "./components/PlayerProfile";
import PlayerDetails from "./components/PlayerDetails";
import PlayerEdit from "./components/PlayerEdit";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/friendlist" element={<Friends />} />
          <Route path="/home" element={<Home loggedIn={loggedIn} />} /> {/* Pass loggedIn as a prop */}
          <Route path="/playerRegistration" element={<PlayerRegistration />} />
          <Route
            path="/"
            element={<Login setLoggedIn={setLoggedIn} />}
          />
          <Route path="/addfriend" element={<AddFriend />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/playerEdit" element={<PlayerEdit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
