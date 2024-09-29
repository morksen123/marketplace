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
import { useAtom } from 'jotai';
import { selectedChatAtom } from '@/atoms/chatAtoms';

export const BuyerIndividualChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedChat] = useAtom(selectedChatAtom);
  const { sendMessage } = useGlobalChat();
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
        senderId: selectedChat.buyerId, // Assuming buyerId is the sender
        images: uploadedUrls,
        senderRole: 'buyer',
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
            <h2 className="text-xl font-semibold">{selectedChat.distributorName ? selectedChat.distributorName : 'Administrator'}</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {selectedChat.messages?.map((msg) => {
              const isBuyerMessage = msg.senderRole === 'buyer';
              return (
                <div 
                  key={msg.messageId} 
                  className={`mb-2 ${isBuyerMessage ? 'flex justify-end' : 'flex justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isBuyerMessage ? 'ml-auto' : 'mr-auto'}`}> {/* Adjust max-width */}
                    {msg.text && (
                      <span 
                        className={`px-4 py-2 inline-block rounded text-sm break-words ${
                          isBuyerMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
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
                      <div className={`${isBuyerMessage ? 'text-right' : 'text-left'}`}>
                        {msg.images.map((image, index) => (
                          image.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img 
                              key={index} 
                              src={image} 
                              alt={`Message attachment ${index + 1}`} 
                              className="max-w-xs rounded cursor-pointer border border-gray-300" 
                              onClick={() => handleFileClick(image)}
                            />
                          ) : (
                            <div 
                              key={index}
                              className={`flex items-center rounded p-2 mt-1 cursor-pointer ${isBuyerMessage ? 'bg-green-500 text-white': 'bg-gray-200'}`}
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