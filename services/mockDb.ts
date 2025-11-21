import { Post, Ticket, KnowledgeItem, PostVisibility, UserRole } from '../types';

// Initial seed data
const SEED_POSTS: Post[] = [
  {
    id: 'p1',
    authorEmail: 'admin@nits.ac.in',
    authorName: 'Registrar Office',
    content: 'The mid-semester examinations for Spring 2024 will commence from March 15th. Detailed schedule is available on the notice board.',
    tags: ['Exam', 'Schedule'],
    visibility: PostVisibility.INTERNAL,
    timestamp: Date.now() - 10000000,
    likes: 12
  },
  {
    id: 'p2',
    authorEmail: 'fest_team@nits.ac.in',
    authorName: 'Incandescence Team',
    content: 'Incandescence 2024, our annual cultural fest, is open to the public! Join us on April 5th for the pro-night.',
    tags: ['Event', 'Fest'],
    visibility: PostVisibility.PUBLIC,
    timestamp: Date.now() - 5000000,
    likes: 45
  }
];

const SEED_KNOWLEDGE: KnowledgeItem[] = SEED_POSTS.map(p => ({
  id: `k_${p.id}`,
  content: p.content,
  keywords: p.tags,
  source: 'post',
  visibility: p.visibility
}));

export class MockDb {
  private static STORAGE_KEY_POSTS = 'campusgpt_posts';
  private static STORAGE_KEY_TICKETS = 'campusgpt_tickets';
  private static STORAGE_KEY_KNOWLEDGE = 'campusgpt_knowledge';

  static initialize() {
    if (!localStorage.getItem(this.STORAGE_KEY_POSTS)) {
      localStorage.setItem(this.STORAGE_KEY_POSTS, JSON.stringify(SEED_POSTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEY_KNOWLEDGE)) {
      localStorage.setItem(this.STORAGE_KEY_KNOWLEDGE, JSON.stringify(SEED_KNOWLEDGE));
    }
    if (!localStorage.getItem(this.STORAGE_KEY_TICKETS)) {
      localStorage.setItem(this.STORAGE_KEY_TICKETS, JSON.stringify([]));
    }
  }

  static getPosts(role: UserRole): Post[] {
    const posts: Post[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY_POSTS) || '[]');
    if (role === UserRole.MEMBER || role === UserRole.ADMIN) {
      return posts.sort((a, b) => b.timestamp - a.timestamp);
    }
    return posts.filter(p => p.visibility === PostVisibility.PUBLIC).sort((a, b) => b.timestamp - a.timestamp);
  }

  static addPost(post: Post): void {
    const posts = this.getPosts(UserRole.ADMIN); // Get all
    posts.unshift(post);
    localStorage.setItem(this.STORAGE_KEY_POSTS, JSON.stringify(posts));

    // Also learn from it immediately
    this.addKnowledge({
      id: `k_${post.id}`,
      content: post.content,
      keywords: post.tags,
      source: 'post',
      visibility: post.visibility
    });
  }

  static getTickets(): Ticket[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_TICKETS) || '[]').sort((a: Ticket, b: Ticket) => b.timestamp - a.timestamp);
  }

  static addTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    tickets.unshift(ticket);
    localStorage.setItem(this.STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  }

  static resolveTicket(ticketId: string, answer: string, authorEmail: string): void {
    const tickets = this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.answers.push({
        authorEmail,
        content: answer,
        timestamp: Date.now()
      });
      localStorage.setItem(this.STORAGE_KEY_TICKETS, JSON.stringify(tickets));

      // Learn from the resolution
      this.addKnowledge({
        id: `k_ticket_${ticket.id}`,
        content: `Q: ${ticket.question} A: ${answer}`,
        keywords: ['Q&A'],
        source: 'ticket_resolution',
        visibility: PostVisibility.INTERNAL // Assume ticket resolutions are internal by default unless marked otherwise
      });
    }
  }

  static addKnowledge(item: KnowledgeItem): void {
    const knowledge: KnowledgeItem[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY_KNOWLEDGE) || '[]');
    knowledge.push(item);
    localStorage.setItem(this.STORAGE_KEY_KNOWLEDGE, JSON.stringify(knowledge));
  }

  // Simple keyword matching "RAG"
  static searchKnowledge(query: string, role: UserRole): string {
    const knowledge: KnowledgeItem[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY_KNOWLEDGE) || '[]');
    const terms = query.toLowerCase().split(' ').filter(t => t.length > 3);
    
    const results = knowledge.filter(item => {
      // Filter by visibility
      if (item.visibility === PostVisibility.INTERNAL && role === UserRole.GUEST) return false;

      // Filter by keywords
      const contentLower = item.content.toLowerCase();
      return terms.some(term => contentLower.includes(term));
    });

    if (results.length === 0) return '';
    
    return results.map(r => `- ${r.content}`).join('\n');
  }
}