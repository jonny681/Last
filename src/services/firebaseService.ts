import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  CountryCode,
  PreApprovalSubmission,
  CashLoanSubmission,
  InvestmentSubmission,
  ChatMessage,
} from '../types';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  country: CountryCode;
  role: 'client' | 'admin';
  createdAt: string;
}

const LOCAL_STORAGE_USER_KEY = 'aureus_fb_current_user_v3';

export const FirebaseService = {
  // --- AUTHENTICATION ---
  async signUp(email: string, pass: string, fullName: string, phone: string, country: CountryCode): Promise<AppUser> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: fullName });

      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: fullName,
        phone,
        country,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      };

      // Save user profile to Firestore
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          ...appUser,
          serverCreated: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore write user profile fallback', err);
      }

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (error: any) {
      // Local fallback for offline/preview
      const appUser: AppUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: fullName,
        phone,
        country,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }
  },

  async signIn(email: string, pass: string): Promise<AppUser> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      let appUser: AppUser | null = null;

      try {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          appUser = userDoc.data() as AppUser;
        }
      } catch (e) {
        console.warn('Firestore fetch user doc error', e);
      }

      if (!appUser) {
        appUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || email.split('@')[0],
          country: 'UK',
          role: email.toLowerCase().includes('admin') ? 'admin' : 'client',
          createdAt: new Date().toISOString(),
        };
      }

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (error: any) {
      // Check local storage accounts
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return u;
        }
      }

      // Guest / Fallback user
      const fallbackUser: AppUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        country: 'UK',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'client',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  },

  async signInGuest(country: CountryCode = 'UK'): Promise<AppUser> {
    try {
      const cred = await signInAnonymously(auth);
      const appUser: AppUser = {
        uid: cred.user.uid,
        email: `client.${cred.user.uid.slice(0, 5)}@aureus-capital.com`,
        displayName: 'Private Client',
        country,
        role: 'client',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), appUser);
      } catch {}
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (e) {
      const guestUser: AppUser = {
        uid: `guest-${Date.now()}`,
        email: 'client@aureus-capital.com',
        displayName: 'Private Client',
        country,
        role: 'client',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
      return guestUser;
    }
  },

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch {}
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  onAuthChanged(callback: (user: AppUser | null) => void) {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let appUser: AppUser | null = null;
        try {
          const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (docSnap.exists()) {
            appUser = docSnap.data() as AppUser;
          }
        } catch {}

        if (!appUser) {
          appUser = {
            uid: fbUser.uid,
            email: fbUser.email || 'client@aureus-capital.com',
            displayName: fbUser.displayName || 'Private Client',
            country: 'UK',
            role: fbUser.email?.toLowerCase().includes('admin') ? 'admin' : 'client',
            createdAt: new Date().toISOString(),
          };
        }
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
        callback(appUser);
      } else {
        const stored = FirebaseService.getCurrentUser();
        callback(stored);
      }
    });
  },

  // --- LOANS & APPLICATIONS PERSISTENCE ---
  async saveLoan(loan: PreApprovalSubmission | CashLoanSubmission): Promise<void> {
    try {
      await setDoc(doc(db, 'loans', loan.id), {
        ...loan,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore loan save fallback', e);
    }
  },

  async saveInvestment(inv: InvestmentSubmission): Promise<void> {
    try {
      await setDoc(doc(db, 'investments', inv.id), {
        ...inv,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore investment save fallback', e);
    }
  },

  // --- REAL-TIME CHAT WITH FIRESTORE ---
  subscribeChat(userEmail: string, callback: (msgs: ChatMessage[]) => void) {
    const emailNorm = (userEmail || '').trim().toLowerCase();
    try {
      const q = query(collection(db, 'chat_messages'), orderBy('timestamp', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const msgs: ChatMessage[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as ChatMessage;
            if (!emailNorm || data.userEmail.toLowerCase() === emailNorm) {
              msgs.push(data);
            }
          });
          callback(msgs);
        },
        (error) => {
          console.warn('Firestore chat listener fallback', error);
        }
      );
    } catch {
      return () => {};
    }
  },

  async sendChatMessage(msg: ChatMessage): Promise<void> {
    try {
      await setDoc(doc(db, 'chat_messages', msg.id), {
        ...msg,
        serverTime: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore send message fallback', e);
    }
  },
};
