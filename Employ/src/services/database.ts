import { openDB, DBSchema } from 'idb';
import type { Post, Answer, User } from './types';

interface ForumDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  posts: {
    key: string;
    value: Post;
  };
  answers: {
    key: string;
    value: Answer & { postId: string };
    indexes: { 'by-post': string };
  };
}

const dbPromise = openDB<ForumDB>('forum-db', 1, {
  upgrade(db) {
    const userStore = db.createObjectStore('users', { keyPath: 'id' });
    userStore.createIndex('by-email', 'email', { unique: true });

    db.createObjectStore('posts', { keyPath: 'id' });

    const answerStore = db.createObjectStore('answers', { keyPath: 'id' });
    answerStore.createIndex('by-post', 'postId');
  },
});

export class DatabaseService {
  async createUser(user: User): Promise<void> {
    const db = await dbPromise;
    await db.put('users', user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await dbPromise;
    return db.getFromIndex('users', 'by-email', email);
  }

  async createPost(post: Post): Promise<void> {
    const db = await dbPromise;
    await db.put('posts', post);
  }

  async getPosts(): Promise<Post[]> {
    const db = await dbPromise;
    const posts = await db.getAll('posts');
    const answers = await db.getAll('answers');

    return posts.map(post => ({
      ...post,
      answers: answers
        .filter(answer => answer.postId === post.id)
        .map(({ postId, ...answer }) => answer),
    }));
  }

  async createAnswer(postId: string, answer: Answer): Promise<void> {
    const db = await dbPromise;
    await db.put('answers', { ...answer, postId });
  }

  async updateAnswerAcceptedStatus(answerId: string, isAccepted: boolean): Promise<void> {
    const db = await dbPromise;
    const answer = await db.get('answers', answerId);
    if (answer) {
      await db.put('answers', { ...answer, isAccepted });
    }
  }

  async updatePostVotes(postId: string, increment: number): Promise<void> {
    const db = await dbPromise;
    const post = await db.get('posts', postId);
    if (post) {
      await db.put('posts', { ...post, votes: post.votes + increment });
    }
  }

  async updateAnswerVotes(answerId: string, increment: number): Promise<void> {
    const db = await dbPromise;
    const answer = await db.get('answers', answerId);
    if (answer) {
      await db.put('answers', { ...answer, votes: answer.votes + increment });
    }
  }
}

export const db = new DatabaseService();