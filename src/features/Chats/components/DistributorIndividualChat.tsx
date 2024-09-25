import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';

interface Chat {
  chatId: number;
  firstName: string,
  lastName: string,
  buyerId: number,
  lastMessage: string;
}

interface Message {
  messageId: number;
  chatId: number;
  senderId: number;
  text: string;
  sentAt: string;
  images: string[];
}

interface DistributorIndividualChatProps {
  selectedChat: Chat | null;
  stompClient: any;
  senderId: number;
}

export const DistributorIndividualChat: React.FC<DistributorIndividualChatProps> = ({ selectedChat, stompClient, senderId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSubscriptionRef = useRef<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ type: string; content: string }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages/${selectedChat?.chatId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch chat messages');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    if (selectedChat?.chatId) {
      fetchChatMessages();
      if (stompClient?.connected) {
        if (currentSubscriptionRef.current) {
          currentSubscriptionRef.current.unsubscribe();
        }

        currentSubscriptionRef.current = stompClient.subscribe(
          `/topic/chat/${selectedChat.chatId}`,
          (messageOutput: any) => {
            const newMessage = JSON.parse(messageOutput.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        );
      }

      const intervalId = setInterval(fetchChatMessages, 1000);

      return () => {
        clearInterval(intervalId);
        if (currentSubscriptionRef.current) {
          currentSubscriptionRef.current.unsubscribe();
        }
      };
    }
  }, [selectedChat, stompClient]);

  const handleNewMessage = (message: any) => {
    // Handle the new message and create a notification
    const notificationPayload = {
      userId: message.recipientId,
      chatId: message.chatId,
      messageContent: message.text,
    };
    
    // Send to backend to persist
    fetch('/api/notifications/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationPayload),
    });
  };

  const handleSendMessage = async () => {
    if ((message.trim() || images.length > 0) && selectedChat && stompClient?.connected) {
      const uploadedUrls = await uploadFilesToS3(images);

      const messagePayload = {
        chatId: selectedChat.chatId,
        text: message,
        senderId: senderId,
        images: uploadedUrls,
      };

      stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(messagePayload),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messagePayload,
          messageId: Date.now(),
          sentAt: new Date().toISOString(),
        },
      ]);

      setMessage('');
      setImages([]);
      setImagePreviews([]);
    } else {
      console.error("STOMP client is not connected");
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
    setSelectedFile(file);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = selectedFile;
      link.download = selectedFile.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <>
          <div className="p-4 border-b flex items-center">
            <h2 className="text-xl font-semibold">{selectedChat.distributorName}</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((msg) => (
              <div key={msg.messageId} className={`mb-2 ${msg.senderId === senderId ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className={`max-w-xs ${msg.senderId !== senderId ? 'ml-0' : 'ml-auto'}`}>
                  {msg.images && msg.images.length > 0 ? (
                    <div className={`flex flex-col ${msg.senderId === senderId ? 'items-end' : 'items-start'}`}>
                      {msg.images.map((image, index) => (
                        <div key={index} className="mt-2 cursor-pointer" onClick={() => handleFileClick(image)}>
                          {image.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <div className="inline-block border rounded-lg p-2">
                              <img src={image} alt="Message attachment" className="max-w-full rounded" />
                            </div>
                          ) : (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                              {getFileIcon(image)}
                              <span className="ml-2">{getFileName(image)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {msg.text && (
                        <div className="mt-2">
                          <span className={`px-4 py-2 inline-block rounded ${msg.senderId === senderId ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{msg.text}</span>
                        </div>
                      )}
                    </div>
                  ) : msg.text ? (
                    <span className={`px-4 py-2 inline-block rounded ${msg.senderId === senderId ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{msg.text}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap mb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    {preview.type === 'image' ? (
                      <img src={preview.content} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-48 h-16 flex items-center justify-start bg-gray-200 rounded p-2 overflow-hidden">
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          {selectedFile && (
            <div className="flex justify-center">
              {selectedFile.toLowerCase().endsWith('.pdf') ? (
                <div>PDF file preview not available. Click download to save the file.</div>
              ) : selectedFile.toLowerCase().endsWith('.xlsx') || selectedFile.toLowerCase().endsWith('.xls') ? (
                <div>Excel file preview not available. Click download to save the file.</div>
              ) : selectedFile.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img src={selectedFile} alt="Full size" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
              ) : (
                <div>File preview not available. Click download to save the file.</div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button onClick={handleSaveFile} color="primary" startIcon={<SaveIcon />}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
