import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import './App.css';

const BACKEND_URL = 'https://chatback-wt79.onrender.com';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/messages`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    axios
      .post(`${BACKEND_URL}/messages`, { content: newMessage }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        setMessages(prevMessages => [...prevMessages, response.data]);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  const handleDeleteMessage = (id) => {
    axios
      .delete(`${BACKEND_URL}/messages/${id}`)
      .then(() => {
        setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
      })
      .catch(error => {
        console.error('Error deleting message:', error);
      });
  };

  const handleEditMessage = (id, content) => {
    setEditMessageId(id);
    setEditMessageContent(content);
  };

  const handleUpdateMessage = (e) => {
    e.preventDefault();
    axios
      .put(`${BACKEND_URL}/messages/${editMessageId}`, { content: editMessageContent }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message.id === editMessageId ? response.data : message
          )
        );
        setEditMessageId(null);
        setEditMessageContent('');
      })
      .catch(error => {
        console.error('Error updating message:', error);
      });
  };

  return (
    <div className="app-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            {editMessageId === message.id ? (
              <form onSubmit={handleUpdateMessage} className="edit-form">
                <input
                  type="text"
                  value={editMessageContent}
                  onChange={(e) => setEditMessageContent(e.target.value)}
                  className="edit-input"
                />
                <button type="submit" className="update-button">Update</button>
              </form>
            ) : (
              <>
                <span>{message.content}</span>
                <div className="icon-buttons">
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => handleEditMessage(message.id, message.content)}
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => handleDeleteMessage(message.id)}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
