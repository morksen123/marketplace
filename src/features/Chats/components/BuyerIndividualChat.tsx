import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';

interface Chat {
  chatId: number;
  distributorName: string;
  distributorId: number;
  lastMessage: string;
  administratorId: number
}

interface Message {
  messageId: number;
  chatId: number;
  senderId: number;
  text: string;
  sentAt: string;
  images: string[];
  title?: string;
  senderRole: string;
  isSending?: boolean;
}

interface BuyerIndividualChatProps {
  selectedChat: Chat | null;
  stompClient: any;
  senderId: number;
}

export const BuyerIndividualChat: React.FC<BuyerIndividualChatProps> = ({ selectedChat, stompClient, senderId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSubscriptionRef = useRef<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ type: string; content: string }[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
            setMessages((prevMessages) => {
              const existingMessage = prevMessages.find(msg => msg.messageId === newMessage.messageId);
              if (existingMessage) {
                return prevMessages.map(msg => 
                  msg.messageId === newMessage.messageId ? { ...msg, isSending: false } : msg
                );
              } else {
                return [...prevMessages, newMessage];
              }
            });
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

  const handleSendMessage = async () => {
    if ((message.trim() || images.length > 0) && selectedChat && stompClient?.connected) {
      setIsSending(true);
      const uploadedUrls = await uploadFilesToS3(images);

      const messagePayload = {
        chatId: selectedChat.chatId,
        text: message,
        senderId: senderId,
        images: uploadedUrls,
        senderRole: 'buyer',
      };

      const tempMessage = {
        ...messagePayload,
        messageId: Date.now(),
        sentAt: new Date().toISOString(),
        isSending: true,
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(messagePayload),
      });

      setMessage('');
      setImages([]);
      setImagePreviews([]);
      setIsSending(false);
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

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex items-center p-4 bg-white border-b h-[93px]">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedChat.distributorName ? selectedChat.distributorName : 'Administrator'}
            </h2>
          </div>
          <div className="h-[600px] overflow-y-auto p-4">
            {messages.reduce((acc: JSX.Element[], msg, index, array) => {
              const currentDate = formatDate(msg.sentAt);
              if (index === 0 || currentDate !== formatDate(array[index - 1].sentAt)) {
                acc.push(
                  <div key={`date-${msg.messageId}`} className="flex items-center justify-center my-5">
                    <span className="flex-grow h-px bg-gray-200"></span>
                    <span className="px-2 text-sm text-gray-500 whitespace-nowrap">{currentDate}</span>
                    <span className="flex-grow h-px bg-gray-200"></span>
                  </div>
                );
              }
              
              const isBuyerMessage = msg.senderRole === 'buyer';
              acc.push(
                <div key={msg.messageId} className={`mb-4 flex ${isBuyerMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] flex flex-col ${isBuyerMessage ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-lg shadow-sm ${isBuyerMessage ? 'bg-[#017A37] text-white' : 'bg-gray-200 text-black'}`}>
                      {msg.title && (
                        <div className="font-bold text-center">
                          <span className="text-black">ANNOUNCEMENT: </span>
                          {msg.title}
                        </div>
                      )}
                      {msg.text && <div className="text-sm">{msg.text}</div>}
                      {msg.images && msg.images.length > 0 && (
                        <div className={`mt-2 ${isBuyerMessage ? 'text-right' : 'text-left'}`}>
                          {msg.images.map((image, index) => (
                            <div key={index} className="cursor-pointer" onClick={() => handleFileClick(image)}>
                              {image.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                <img src={image} alt="Message attachment" className="max-w-full rounded border border-gray-300" />
                              ) : (
                                <div className={`flex items-center p-2 mt-1 rounded ${isBuyerMessage ? 'bg-[#017A37]' : 'bg-gray-200'}`}>
                                  {getFileIcon(image)}
                                  <span className="ml-2 text-sm">{getFileName(image)}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.isSending && (
                        <CircularProgress size={16} className="ml-2" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 italic">
                      {formatTime(msg.sentAt)}
                    </div>
                  </div>
                </div>
              );
              return acc;
            }, [])}
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
            <div className="flex items-center bg-white rounded-full shadow-md p-2">
              <input
                type="text"
                className="flex-grow px-4 py-2 focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              />
              <button onClick={handleAttachment} className="p-2 text-[#017A37] hover:text-[#015A27] focus:outline-none">
                <AttachFileIcon className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
              <button 
                onClick={handleSendMessage} 
                className="ml-2 p-2 bg-[#017A37] text-white rounded-full hover:bg-[#015A27] focus:outline-none"
                disabled={isSending}
              >
                {isSending ? <CircularProgress size={24} /> : <SendIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
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
          className: "rounded-xl shadow-lg",
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