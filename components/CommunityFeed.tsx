import React, { useEffect, useState } from 'react';
import { Post, Ticket, User, UserRole, PostVisibility } from '../types';
import { MockDb } from '../services/mockDb';
import { Plus, MessageCircle, Tag, CheckCircle2, Globe, Lock, Send } from 'lucide-react';

interface CommunityFeedProps {
  user: User;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [view, setView] = useState<'all' | 'tickets'>('all');
  
  // Create Post State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostVisibility, setNewPostVisibility] = useState<PostVisibility>(PostVisibility.INTERNAL);

  // Reply State
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    setPosts(MockDb.getPosts(user.role));
    setTickets(MockDb.getTickets());
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      authorEmail: user.email,
      authorName: user.name,
      content: newPostContent,
      tags: newPostTags.split(',').map(t => t.trim()).filter(t => t),
      visibility: newPostVisibility,
      timestamp: Date.now(),
      likes: 0
    };

    MockDb.addPost(post);
    setNewPostContent('');
    setNewPostTags('');
    setIsCreatingPost(false);
    refreshData();
  };

  const handleResolveTicket = (ticketId: string) => {
    const answer = replyText[ticketId];
    if (!answer?.trim()) return;

    MockDb.resolveTicket(ticketId, answer, user.email);
    setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    refreshData();
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Community Board</h2>
            <p className="text-slate-500 text-sm">Announcements, events, and help desk.</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Feed
            </button>
            <button
              onClick={() => setView('tickets')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'tickets' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              Open Tickets ({tickets.filter(t => t.status === 'open').length})
            </button>
            {user.role !== UserRole.GUEST && (
              <button
                onClick={() => setIsCreatingPost(!isCreatingPost)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white flex items-center gap-2 hover:bg-slate-800"
              >
                <Plus size={16} /> New Post
              </button>
            )}
          </div>
        </div>

        {/* Create Post Modal / Area */}
        {isCreatingPost && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 mb-8 animate-fade-in">
            <h3 className="font-semibold text-slate-800 mb-4">Create a new announcement</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none mb-4"
              rows={4}
              placeholder="What's happening on campus?"
            />
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-4 w-full md:w-auto">
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="border border-slate-200 rounded-lg p-2 text-sm w-full md:w-64"
                />
                <select
                  value={newPostVisibility}
                  onChange={(e) => setNewPostVisibility(e.target.value as PostVisibility)}
                  className="border border-slate-200 rounded-lg p-2 text-sm bg-white"
                >
                  <option value={PostVisibility.INTERNAL}>Institute Only</option>
                  <option value={PostVisibility.PUBLIC}>Public</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Feed */}
        <div className="space-y-6">
          {view === 'all' && posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-hover hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{post.authorName}</h4>
                    <p className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()} • {post.authorEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {post.visibility === PostVisibility.PUBLIC ? (
                     <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1"><Globe size={10} /> Public</span>
                   ) : (
                     <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><Lock size={10} /> Institute</span>
                   )}
                </div>
              </div>
              
              <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>
              
              <div className="flex gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {(view === 'tickets' || view === 'all') && tickets.map(ticket => (
            // Only show tickets in 'all' view if they are open? No, maybe separate. 
            // If view is 'all', show posts. If view is 'tickets', show tickets.
            // Let's adhere to the toggle above.
            (view === 'tickets' || (view === 'all' && ticket.status === 'open')) ? (
              <div key={ticket.id} className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${ticket.status === 'open' ? 'border-l-red-500' : 'border-l-green-500'} border-y border-r border-slate-200`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500">#{ticket.id.substring(0,6)}</span>
                    Question from {ticket.raisedByEmail.split('@')[0]}
                  </h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${ticket.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {ticket.status}
                  </span>
                </div>
                
                <p className="text-lg text-slate-800 font-medium mb-4">{ticket.question}</p>

                {ticket.answers.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3">
                    {ticket.answers.map((ans, idx) => (
                      <div key={idx} className="border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                         <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={14} className="text-green-600" />
                            <span className="text-xs font-semibold text-slate-700">{ans.authorEmail}</span>
                            <span className="text-[10px] text-slate-400">{new Date(ans.timestamp).toLocaleDateString()}</span>
                         </div>
                         <p className="text-sm text-slate-600 pl-6">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {ticket.status === 'open' && user.role !== UserRole.GUEST && (
                   <div className="mt-4 flex gap-2">
                     <input
                       type="text"
                       placeholder="Know the answer? Contribute..."
                       className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                       value={replyText[ticket.id] || ''}
                       onChange={(e) => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                     />
                     <button
                       onClick={() => handleResolveTicket(ticket.id)}
                       disabled={!replyText[ticket.id]}
                       className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                     >
                       <Send size={16} />
                     </button>
                   </div>
                )}
                {ticket.status === 'open' && user.role === UserRole.GUEST && (
                   <p className="text-xs text-slate-400 italic mt-2">Only institute members can reply to tickets.</p>
                )}
              </div>
            ) : null
          ))}
          
          {view === 'tickets' && tickets.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No open tickets found. Great job community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;