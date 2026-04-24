'use client';

import { useEffect, useState, useRef } from 'react';
import { chatApi } from '@/lib/api/chat';
import { Conversation, ChatMessage } from '@/types';
import { MessageCircle, Send, Menu, X, ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // #region agent log - chat page responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024;
      fetch('http://127.0.0.1:7242/ingest/e6f7a139-55a2-4e8f-b5ba-99cc8d71a77f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/(dashboard)/dashboard/chat/page.tsx:18',message:'chat page loaded, checking responsiveness',data:{isMobile, screenWidth: window.innerWidth, conversationsCount: conversations.length},timestamp:Date.now(),sessionId:'debug-session',runId:'debug-run-4',hypothesisId:'CHAT-RESPONSIVENESS'})}).catch(()=>{});
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [conversations.length]);
  // #endregion

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatApi.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();

    // Initialize Socket.IO connection
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(wsUrl, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const response = await chatApi.getMessages(selectedConversation.id);
        setMessages(response.data);
        await chatApi.markAsRead(selectedConversation.id);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !socket) return;

    try {
      const message = await chatApi.sendMessage(selectedConversation.id, messageInput);
      setMessages((prev) => [...prev, message]);
      setMessageInput('');
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex relative">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Conversations Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 xl:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your conversations</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No conversations yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start chatting with healthcare providers</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {conversations.map((conversation) => {
                const otherParticipant =
                  conversation.participant1Role === 'patient'
                    ? conversation.participant2Name
                    : conversation.participant1Name;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{otherParticipant}</p>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-3 bg-primary-500 text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Conversations Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No conversations yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start chatting with healthcare providers</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {conversations.map((conversation) => {
                    const otherParticipant =
                      conversation.participant1Role === 'patient'
                        ? conversation.participant2Name
                        : conversation.participant1Name;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{otherParticipant}</p>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-3 bg-primary-500 text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        {selectedConversation ? (
          <>
            {/* Chat Header - Mobile & Desktop */}
            <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                      {selectedConversation.participant1Role === 'patient'
                        ? selectedConversation.participant2Name
                        : selectedConversation.participant1Name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedConversation.participant1Role === 'patient'
                        ? selectedConversation.participant2Role
                        : selectedConversation.participant1Role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-4">
                      <MessageCircle className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No messages yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === selectedConversation.participant1Id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                          isOwnMessage
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/20'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            isOwnMessage ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {formatDateTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-end space-x-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="input resize-none min-h-[44px] max-h-32 py-3 pr-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    style={{ height: 'auto', minHeight: '44px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                    }}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="h-11 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full mb-6">
                <MessageCircle className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Messages</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Select a conversation from the sidebar to start chatting with healthcare providers, or start a new conversation.
              </p>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mt-6 btn btn-primary"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
