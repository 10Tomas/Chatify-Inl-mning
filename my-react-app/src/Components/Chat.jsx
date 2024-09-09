import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import styles from './Chat.module.css'; 

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [postMessage, setPostMessage] = useState("");
  const [decodedJwt, setDecodedJwt] = useState(null);
  const token = localStorage.getItem('userToken');

  const fakeChat = [
    { text: "Tjena", avatar: "https://i.pravatar.cc/100?img=3", username: "ChatBot", isBot: true },
    { text: "Vad gör du?", avatar: "https://i.pravatar.cc/100?img=5", username: "ChatBot", isBot: true },
    { text: "Hjälp mig!", avatar: "https://i.pravatar.cc/100?img=33", username: "ChatBot", isBot: true }
  ];

  useEffect(() => {
    if (!token) {
      console.log("JWT token not found.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch('https://chatify-api.up.railway.app/messages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setMessages([...data, ...fakeChat]);
        const payload = JSON.parse(atob(token.split('.')[1]));
        setDecodedJwt(payload);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [token]);

  const handleChat = async () => {
    if (!postMessage.trim()) return;

    const newMessage = { text: postMessage, conversationId: null };

    try {
      const res = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      const data = await res.json();
      setMessages([...messages, data.latestMessage]);
      setPostMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      await fetch(`https://chatify-api.up.railway.app/messages/${msgID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMessages(messages.filter((msg) => msg.id !== msgID));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      <SideNav />
      <div className={styles.chatContainer}>
        <h2>Chat Messages</h2>
        {decodedJwt && (
          <h3>
            Welcome, {decodedJwt.user}! <img src={decodedJwt.avatar} alt="avatar" />
          </h3>
        )}
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className={msg.isBot ? styles.botChat : styles.userChat}>
              <div>
                {msg.text}
                {!msg.isBot && (
                  <button onClick={() => handleDelete(msg.id)} className={styles.btn}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.inputChat}>
          <input
            type="text"
            placeholder="Chat here"
            value={postMessage}
            onChange={(e) => setPostMessage(e.target.value)}
          />
          <button onClick={handleChat} className={styles.btn}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Chat;
