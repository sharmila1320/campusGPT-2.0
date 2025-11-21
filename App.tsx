import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ChatInterface from './components/ChatInterface';
import CommunityFeed from './components/CommunityFeed';
import { User, UserRole, Ticket } from './types';
import { MockDb } from './services/mockDb';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'community'>('chat');
  const [pendingTicketQuestion, setPendingTicketQuestion] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Mock Database
    MockDb.initialize();
  }, []);

  const handleLogin = (email: string, role: UserRole) => {
    setUser({
      email,
      name: email.split('@')[0],
      role,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0D8ABC&color=fff`
    });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('chat');
  };

  const handleRaiseTicket = (question: string) => {
    if (!user) return;
    
    // Create ticket immediately
    const newTicket: Ticket = {
      id: Date.now().toString(),
      question: question,
      status: 'open',
      raisedByEmail: user.email,
      answers: [],
      timestamp: Date.now()
    };
    
    MockDb.addTicket(newTicket);
    setActiveTab('community'); // Switch to community view to see the ticket
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' ? (
          <ChatInterface user={user} onRaiseTicket={handleRaiseTicket} />
        ) : (
          <CommunityFeed user={user} />
        )}
      </main>
    </div>
  );
}

export default App;