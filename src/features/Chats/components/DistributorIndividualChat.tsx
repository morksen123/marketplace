import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Remove';
import CircularProgress from '@mui/material/CircularProgress';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useGlobalChat } from '@/contexts/GlobalChatContext';
import { Message } from '@/types/chat';

export const DistributorIndividualChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const { selectedChat, sendMessage } = useGlobalChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ type: string; content: string }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Add this ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add this useEffect
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Add this function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if ((message.trim() || images.length > 0) && selectedChat) {
      setIsSending(true);
      const uploadedUrls = await uploadFilesToS3(images);

      const messagePayload: Omit<Message, 'messageId' | 'sentAt'> = {
        chatId: selectedChat.chatId,
        text: message,
        senderId: selectedChat.distributorId,
        images: uploadedUrls,
        senderRole: 'distributor',
      };

      sendMessage(messagePayload);

      setMessage('');
      setImages([]);
      setImagePreviews([]);
      setIsSending(false);
    }
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const s3Client = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
      accessKeyId: 'AKIAS2VS4QJVRXLKSVXV',
      secretAccessKey: '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',
    },
  });

  const handleFileSelection = (files: FileList) => {
    const newFiles = Array.from(files);
    setImages((prevImages) => [...prevImages, ...newFiles]);

    newFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prevPreviews) => [...prevPreviews, { type: 'image', content: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreviews((prevPreviews) => [...prevPreviews, { type: 'file', content: file.name }]);
      }
    });
  };

  const uploadFilesToS3 = async (files: File[]) => {
    const uploadedPictureUrls = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: 'gudfood-photos',
          Key: fileName,
          Body: file,
        },
      });

      try {
        const result = await upload.done();
        const url = `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
        uploadedPictureUrls.push(url);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    return uploadedPictureUrls;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileSelection(files);
    }
  };

  const handleFileClick = (file: string) => {
    if (file.match(/\.(jpeg|jpg|gif|png)$/i)) {
      setEnlargedImage(file);
    } else {
      setSelectedFile(file);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setEnlargedImage(null);
  };

  const handleSaveFile = () => {
    if (selectedFile || enlargedImage) {
      const fileUrl = selectedFile || enlargedImage;
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    handleCloseDialog();
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'xlsx':
      case 'xls':
        return <TableChartIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const getFileName = (fileUrl: string) => {
    const fileName = fileUrl.split('/').pop() || 'File';
    if (fileName.length <= 60) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.slice(0, -(extension?.length || 0) - 1);
    const truncatedName = nameWithoutExtension.slice(0, 56 - (extension?.length || 0));
    
    return `${truncatedName}...${extension}`;
  };

  const handleRemoveFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full"> {/* Add this wrapper */}
          <div className="p-4 border-b flex items-center">
            <h2 className="text-xl font-semibold">
              {selectedChat.firstName || selectedChat.lastName
                ? `${selectedChat.firstName || ''} ${selectedChat.lastName || ''}`
                : 'Administrator'}
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {selectedChat.messages?.map((msg) => {
              const isDistributorMessage = msg.senderRole === 'distributor';
              return (
                <div 
                  key={msg.messageId} 
                  className={`mb-2 ${isDistributorMessage ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isDistributorMessage ? 'ml-auto' : 'mr-auto'}`}> {/* Adjust max-width */}
                    {msg.text && (
                      <span 
                        className={`px-4 py-2 inline-block rounded text-sm break-words ${
                          isDistributorMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
                        }`}
                      >
                        {msg.title && (
                          <>
                            <strong>ANNOUNCEMENT: {msg.title}</strong>
                            <br />
                          </>
                        )}
                        {msg.text}
                      </span>
                    )}
                    {msg.images && msg.images.length > 0 && (
                      <div className={`${isDistributorMessage ? 'text-right' : 'text-left'}`}>
                        {msg.images.map((image, index) => (
                          image.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img 
                              key={index} 
                              src={image} 
                              alt={`Message attachment ${index + 1}`} 
                              className="max-w-full h-auto rounded cursor-pointer border border-gray-300 mt-2" 
                              onClick={() => handleFileClick(image)}
                            />
                          ) : (
                            <div 
                              key={index}
                              className={`flex items-center rounded p-2 mt-2 cursor-pointer ${isDistributorMessage ? 'bg-green-500 text-white': 'bg-gray-200'}`}
                              onClick={() => handleFileClick(image)}
                            >
                              {getFileIcon(image)}
                              <span className="ml-2 text-sm">{getFileName(image)}</span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} /> {/* Add this empty div */}
          </div>
          <div className="border-t p-4">
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap mb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    {preview.type === 'image' ? (
                      <img src={preview.content} alt="Preview" className="w-16 h-16 object-cover rounded border border-gray-300" />
                    ) : (
                      <div className="w-48 h-16 flex items-center justify-start bg-green-100 rounded p-2 overflow-hidden">
                        {getFileIcon(preview.content)}
                        <span className="ml-2 text-sm truncate">{getFileName(preview.content)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleAttachment} className="ml-2 p-2 focus:outline-none button button-green">
                <AttachFileIcon className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
              <button 
                onClick={handleSendMessage} 
                className="ml-2 p-2 button button-green rounded-full"
                disabled={isSending}
              >
                {isSending ? <CircularProgress size={24} /> : <SendIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a chat to start messaging
        </div>
      )}
      <Dialog
        open={openDialog || !!enlargedImage}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogContent style={{ padding: '24px' }}>
          {enlargedImage ? (
            <img src={enlargedImage} alt="Enlarged" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          ) : selectedFile ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              File preview not available. Click download to save the file.
            </div>
          ) : null}
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button
            onClick={handleCloseDialog}
            style={{
              backgroundColor: '#017A37',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              textTransform: 'none',
            }}
          >
            Close
          </Button>
          {(selectedFile || enlargedImage) && (
            <Button
              onClick={handleSaveFile}              
              startIcon={<SaveIcon />}
              style={{
                backgroundColor: '#017A37',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                marginLeft: '12px',
                textTransform: 'none',
              }}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

// import React, { useState, useEffect } from 'react';
// import SearchIcon from '@mui/icons-material/Search';
// import { DistributorIndividualChat } from './DistributorIndividualChat';
// import { useLocation } from 'react-router-dom';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';

// interface Chat {
//   chatId: number;
//   firstName: string;
//   lastName: string;
//   buyerId: string;
//   buyerEmail: string; // Added buyerEmail
//   lastMessage: string;
//   administratorId: string | null;
// }

// export const DistributorChats: React.FC = () => {
//   const location = useLocation();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);  // Use chatId initially
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);  // Full chat details will be stored here
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [messages, setMessages] = useState([]); // Messages for the selected chat
//   const [stompClient, setStompClient] = useState<any>(null);
//   const [senderId, setSenderId] = useState<any>(null);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await fetch('/api/chat/distributor');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setChats(data);
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       }
//     };

//     const fetchDistributorId = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/distributor/profile`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setSenderId(data.distributorId);
//         } else {
//           console.error('Failed to fetch distributor ID');
//         }
//       } catch (error) {
//         console.error('Error fetching distributor ID:', error);
//       }
//     };

//     fetchChats();
//     const chatIntervalId = setInterval(fetchChats, 1000);
//     fetchDistributorId();

//     // Check if chatId is passed via location state
//     if (location.state?.chatId) {
//       setSelectedChatId(location.state.chatId); // Set the selectedChatId from the state
//       fetchChatDetails(location.state.chatId);  // Fetch the chat details based on chatId
//     }

//     return () => {
//       clearInterval(chatIntervalId);
//     };
//   }, [location.state]);

//   // Function to fetch full chat details based on chatId
//   const fetchChatDetails = async (chatId: number) => {
//     try {
//       const response = await fetch(`/api/chat/${chatId}`); // Fetch chat details by chatId
//       if (response.ok) {
//         const chat = await response.json();
//         setSelectedChat(chat); // Set the full chat details to selectedChat
//         connectToWebSocket(chat.chatId.toString());
//       } else {
//         console.error('Failed to fetch chat details');
//       }
//     } catch (error) {
//       console.error('Error fetching chat details:', error);
//     }
//   };

//   const filteredChats = chats.filter((chat) =>
//     (chat.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      chat.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      chat.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//      chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
//   );

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSelectChat = (chat: Chat) => {
//     setSelectedChat(chat); // Store the selected chat object
//     connectToWebSocket(chat.chatId.toString());
//   };

//   const connectToWebSocket = (chatId: string) => {
//     const socket = new SockJS('http://localhost:8080/chat-websocket');

//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//     });

//     stompClient.onConnect = (frame: any) => {
//       console.log('Connected to WebSocket:', frame);

//       stompClient.subscribe(`/topic/chat/${chatId}`, (messageOutput: any) => {
//         const message = JSON.parse(messageOutput.body);
//         setMessages((prevMessages) => [...prevMessages, message]);
//       });
//     };

//     stompClient.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };

//     stompClient.activate();

//     setStompClient(stompClient);
//   };

//   // Sort chats to display administrator chat at the top
//   const sortedChats = [...filteredChats].sort((a, b) => {
//     if (a.administratorId && !b.administratorId) return -1;
//     if (!a.administratorId && b.administratorId) return 1;
//     return 0;
//   });

//   return (
//     <div className="flex h-[80vh] bg-gray-100">
//       {/* Left side - Chat list */}
//       <div className="w-1/3 border-r flex flex-col bg-white shadow-md">
//         <div className="p-5 bg-white border-b border-gray-200">
//           <div className="relative">
//             <input
//               type="text"
//               className="w-full px-4 py-2 pl-10 pr-4 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Search chats"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//             <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           </div>
//         </div>
//         <ul className="overflow-y-auto flex-grow">
//           {sortedChats.map((chat) => (
//             <li
//               key={chat.chatId}
//               className={`p-4 cursor-pointer transition-colors duration-300 ${
//                 selectedChat?.chatId === chat.chatId
//                   ? 'bg-[#e8f5fe] border-l-4 border-[#017A37]'
//                   : 'hover:bg-gray-50'
//               }`}
//               onClick={() => handleSelectChat(chat)}
//             >
//               <div className="flex flex-col items-start w-full">
//                 <h3 className="font-semibold text-gray-800">
//                   {chat.administratorId ? 'Administrator' : `${chat.firstName} ${chat.lastName}`}
//                 </h3>
//                 <p className="text-xs italic text-[#017A37]">{chat.buyerEmail}</p>
//                 <p className="text-sm text-gray-600 mt-1 w-full truncate text-left">
//                   {chat.lastMessage?.slice(0, 60)}
//                   {chat.lastMessage && chat.lastMessage.length > 60 ? '...' : ''}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Right side - Individual chat */}
//       <div className="w-2/3 flex flex-col bg-white">
//         <DistributorIndividualChat
//           selectedChat={selectedChat}
//           stompClient={stompClient}
//           senderId={senderId}
//         />
//       </div>
//     </div>
//   );
// };
