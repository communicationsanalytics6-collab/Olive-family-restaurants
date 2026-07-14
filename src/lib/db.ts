import { 
  collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, getDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import { MenuItem, Promo, BlogPost, Feedback, Order, TableReservation, User, VisitorAgreement } from '../types';

// Helper to seed initial data if collections are empty
export async function seedDatabase(initialData: {
  menuItems: MenuItem[];
  promos: Promo[];
  blogs: BlogPost[];
  feedback: Feedback[];
  orders: Order[];
}) {
  try {
    const menuSnap = await getDocs(collection(db, 'menuItems'));
    if (menuSnap.empty) {
      console.log('Seeding menuItems...');
      for (const item of initialData.menuItems) {
        await setDoc(doc(db, 'menuItems', item.id), item);
      }
    }

    const promosSnap = await getDocs(collection(db, 'promos'));
    if (promosSnap.empty) {
      console.log('Seeding promos...');
      for (const p of initialData.promos) {
        await setDoc(doc(db, 'promos', p.id), p);
      }
    }

    const blogsSnap = await getDocs(collection(db, 'blogs'));
    if (blogsSnap.empty) {
      console.log('Seeding blogs...');
      for (const b of initialData.blogs) {
        await setDoc(doc(db, 'blogs', b.id), b);
      }
    }

    const feedbackSnap = await getDocs(collection(db, 'feedback'));
    if (feedbackSnap.empty) {
      console.log('Seeding feedback...');
      for (const f of initialData.feedback) {
        await setDoc(doc(db, 'feedback', f.id), f);
      }
    }

    const ordersSnap = await getDocs(collection(db, 'orders'));
    if (ordersSnap.empty) {
      console.log('Seeding orders...');
      for (const o of initialData.orders) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}

// User Profile functions
export async function getUserProfile(uid: string): Promise<User | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
}

export async function createUserProfile(uid: string, profile: User): Promise<void> {
  await setDoc(doc(db, 'users', uid), profile);
}

export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), updates);
}

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  const querySnapshot = await getDocs(collection(db, 'menuItems'));
  const items: MenuItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push(doc.data() as MenuItem);
  });
  return items;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  await setDoc(doc(db, 'menuItems', item.id), item);
}

export async function removeMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menuItems', id));
}

// Promos
export async function getPromos(): Promise<Promo[]> {
  const snap = await getDocs(collection(db, 'promos'));
  const promos: Promo[] = [];
  snap.forEach((doc) => promos.push(doc.data() as Promo));
  return promos;
}

export async function savePromo(promo: Promo): Promise<void> {
  await setDoc(doc(db, 'promos', promo.id), promo);
}

export async function removePromo(id: string): Promise<void> {
  await deleteDoc(doc(db, 'promos', id));
}

// Blogs
export async function getBlogs(): Promise<BlogPost[]> {
  const snap = await getDocs(collection(db, 'blogs'));
  const blogs: BlogPost[] = [];
  snap.forEach((doc) => blogs.push(doc.data() as BlogPost));
  return blogs;
}

export async function saveBlog(blog: BlogPost): Promise<void> {
  await setDoc(doc(db, 'blogs', blog.id), blog);
}

export async function removeBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, 'blogs', id));
}

// Feedback
export async function getFeedback(): Promise<Feedback[]> {
  const snap = await getDocs(collection(db, 'feedback'));
  const feedback: Feedback[] = [];
  snap.forEach((doc) => feedback.push(doc.data() as Feedback));
  return feedback;
}

export async function saveFeedback(fb: Feedback): Promise<void> {
  await setDoc(doc(db, 'feedback', fb.id), fb);
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(db, 'orders'));
  const orders: Order[] = [];
  snap.forEach((doc) => orders.push(doc.data() as Order));
  return orders;
}

export async function saveOrder(order: Order): Promise<void> {
  await setDoc(doc(db, 'orders', order.id), order);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status });
}

// Table Reservations
export async function getReservations(): Promise<TableReservation[]> {
  const snap = await getDocs(collection(db, 'tableReservations'));
  const list: TableReservation[] = [];
  snap.forEach((doc) => list.push(doc.data() as TableReservation));
  return list;
}

export async function saveReservation(res: TableReservation): Promise<void> {
  await setDoc(doc(db, 'tableReservations', res.id), res);
}

// Visitor Agreement
export async function saveVisitorAgreement(agreement: VisitorAgreement): Promise<void> {
  await setDoc(doc(db, 'visitorAgreements', agreement.id), agreement);
}
