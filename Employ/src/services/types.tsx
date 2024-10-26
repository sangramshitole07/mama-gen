export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    company: string;
    role: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    category: string;
    votes: number;
    answers: Answer[];
  }
  
  export interface Answer {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
    votes: number;
    isAccepted: boolean;
  }