import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Chat {
  chatId: number;
  distributorName: string;  
  distributorId: string;
  lastMessage: string;
}

interface Message {
  messageId: number;
  chatId: number;
  senderId: number;
  text: string;
  sentAt: string;
}

interface BuyerIndividualChatProps {
  selectedChat: Chat | null;
  stompClient: any;
  senderId: number;
}

export const BuyerIndividualChat: React.FC<BuyerIndividualChatProps> = ({ selectedChat, stompClient, senderId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // Store messages here
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubscriptionRef = useRef<any>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages/${selectedChat?.chatId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data); // Set the fetched messages to the state
        } else {
          console.error('Failed to fetch chat messages');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    if (selectedChat?.chatId) {
      fetchChatMessages();

      // Subscribe to real-time updates for this chat
      if (stompClient?.connected) {
        // Unsubscribe from the previous chat if applicable
        if (currentSubscriptionRef.current) {
          currentSubscriptionRef.current.unsubscribe();
        }

        // Subscribe to the current chat's topic
        currentSubscriptionRef.current = stompClient.subscribe(
          `/topic/chat/${selectedChat.chatId}`,
          (messageOutput: any) => {
            const newMessage = JSON.parse(messageOutput.body);
            // Add the received message to the chat
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        );
      }

      const intervalId = setInterval(fetchChatMessages, 1000);

      // Cleanup subscription when the component is unmounted or chat changes
      return () => {
        clearInterval(intervalId);
        if (currentSubscriptionRef.current) {
          currentSubscriptionRef.current.unsubscribe();
        }
      };
    }
  }, [selectedChat, stompClient]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat && stompClient?.connected) {
      const messagePayload = {
        chatId: selectedChat.chatId,
        text: message,
        senderId: senderId,
      };

      // Use publish instead of send
      stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(messagePayload),
      });
      // Add the sent message to the local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messagePayload,
          messageId: Date.now(), // Temporary ID for the new message
          sentAt: new Date().toISOString(), // Temporary timestamp for the new message
        },
      ]);

      setMessage(''); // Clear the input after sending
    } else {
      console.error("STOMP client is not connected");
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File attached:', file.name);
      // Handle file sending logic here if necessary
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="p-4 border-b flex items-center">
            <h2 className="text-xl font-semibold">{selectedChat.distributorName}</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {/* Render the messages */}
            {messages.map((msg) => (
              <div key={msg.messageId} className={`mb-2 ${msg.senderId === senderId ? 'text-right' : 'text-left'}`}>
                <span className="px-4 py-2 inline-block bg-gray-200 rounded">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleAttachment} className="ml-2 p-2 text-green-500 hover:text-green-600 focus:outline-none">
                <AttachFileIcon className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <button onClick={handleSendMessage} className="ml-2 p-2 button button-green rounded-full">
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </>
  );
};
