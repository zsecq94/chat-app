import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("chat-app-user")) || null
  );
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastChat, setLastChat] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getLoggedInUser = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    if (!user) {
      navigate("/login");
    } else if (!user.isAvatarImageSet) {
      navigate("/setAvatar");
    } else {
      setCurrentUser(user);
      setIsLoaded(true);
      getAllusers();
    }
  };

  const getAllusers = async () => {
    if (currentUser && currentUser.isAvatarImageSet) {
      const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data);
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && !currentChat && <Welcome currentUser={currentUser} />}
        {currentChat && (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
