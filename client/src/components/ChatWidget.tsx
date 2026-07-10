import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, IconButton, Typography, Paper, TextField, InputAdornment, 
  CircularProgress, Avatar, Button, Chip, Fade 
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  jobs?: any[];
  searchUrl?: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi! I am the Source AI. Tell me what kind of jobs you are looking for (e.g., "plumbing jobs in my area paying over $30/hr").' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { 
        message: userMessage.text,
        location: 'Not provided' // Could integrate HTML5 geolocation here if permitted
      });

      const data = response.data;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.replyMessage,
        jobs: data.jobs,
        searchUrl: data.searchUrl
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessageText = error.response?.data?.error || 'Sorry, I encountered an error trying to process your request. Please try again.';
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: errorMessageText
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            bgcolor: '#6366f1',
            color: 'white',
            width: 60,
            height: 60,
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s',
            zIndex: 9999,
            '&:hover': {
              bgcolor: '#4f46e5',
              transform: 'scale(1.05)'
            }
          }}
        >
          <AutoAwesomeIcon fontSize="large" />
        </IconButton>
      )}

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 30 },
            right: { xs: 0, sm: 30 },
            width: { xs: '100%', sm: 400 },
            height: { xs: '100%', sm: 600 },
            maxHeight: '100vh',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: { xs: 0, sm: 4 },
            border: { xs: 'none', sm: '1px solid rgba(0,0,0,0.1)' },
            boxShadow: { xs: 'none', sm: '0 15px 40px rgba(0,0,0,0.15)' },
            zIndex: 9999,
            overflow: 'hidden',
            bgcolor: '#ffffff'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2.5, 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AutoAwesomeIcon />
              <Typography variant="h6" fontWeight="800">Source AI</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            bgcolor: '#f8fafc'
          }}>
            {messages.map((msg) => (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, maxWidth: '85%', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                  <Avatar sx={{ 
                    bgcolor: msg.sender === 'user' ? '#1e293b' : '#6366f1', 
                    width: 32, 
                    height: 32 
                  }}>
                    {msg.sender === 'user' ? 'U' : <AutoAwesomeIcon fontSize="small" />}
                  </Avatar>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      bgcolor: msg.sender === 'user' ? '#1e293b' : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                      border: msg.sender === 'ai' ? '1px solid rgba(0,0,0,0.05)' : 'none'
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
                    </Paper>

                    {/* Rich Job Cards Rendered by AI */}
                    {msg.jobs && msg.jobs.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                        {msg.jobs.map((job: any) => (
                          <Paper key={job._id} elevation={0} onClick={() => navigate(`/jobs/${job._id}`)} sx={{ 
                            p: 2, 
                            borderRadius: 3, 
                            border: '1px solid rgba(99,102,241,0.2)',
                            bgcolor: '#eef2ff',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(99,102,241,0.1)' }
                          }}>
                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#4338ca', mb: 0.5 }}>{job.title}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                              <Chip label={job.category} size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                              <Chip label={`$${job.originalPay}`} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                            </Box>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <WorkIcon sx={{ fontSize: '0.9rem' }} /> {job.location?.general || 'Location unspecified'}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    )}

                    {/* View All Link */}
                    {msg.searchUrl && (
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => navigate(msg.searchUrl!)}
                        sx={{ mt: 1, borderRadius: 2, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, fontWeight: 800, textTransform: 'none' }}
                      >
                        View all matching results
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', gap: 1, maxWidth: '85%' }}>
                <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                   <AutoAwesomeIcon fontSize="small" />
                </Avatar>
                <Paper elevation={0} sx={{ p: 2, borderRadius: '20px 20px 20px 4px', bgcolor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ color: '#6366f1' }} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="E.g., plumbing jobs in my area"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              InputProps={{
                sx: { borderRadius: 3, bgcolor: '#f8fafc' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend} disabled={!inputValue.trim() || isLoading} sx={{ color: '#6366f1' }}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default ChatWidget;
