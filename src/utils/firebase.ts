import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  Firestore,
  writeBatch,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';
import { MemoryPhoto } from '../types.ts';

// Read Firebase configuration from environment variables or optional config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    !firebaseConfig.apiKey.includes('YOUR_')
  );
}

// Initialize Firebase safely
try {
  if (isFirebaseConfigured()) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase] Successfully initialized with project:', firebaseConfig.projectId);
  } else {
    console.log('[Firebase] Credentials not provided or incomplete. Running with integrated persistent backend.');
  }
} catch (error) {
  console.warn('[Firebase] Initialization error:', error);
}

/**
 * Uploads an image file to Firebase Storage if configured, or falls back to backend storage.
 * Calls onProgress with 0-100 percentage.
 */
export async function uploadImageFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  // Option 1: Firebase Storage
  if (storage && isFirebaseConfigured()) {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `memories/${timestamp}_${sanitizedName}`);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || 'image/jpeg',
      });

      return await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            console.error('[Firebase Storage] Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    } catch (fbErr) {
      console.warn('[Firebase Storage] Failed, falling back to server storage:', fbErr);
      // Fall through to server upload
    }
  }

  // Option 2: Fallback to server-side persistent upload (/api/upload)
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (onProgress) onProgress(40);
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            filename: file.name,
          }),
        });
        if (onProgress) onProgress(80);
        const data = await res.json();
        if (data.success && data.url) {
          if (onProgress) onProgress(100);
          resolve(data.url);
        } else {
          reject(new Error(data.error || 'Server upload failed'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Fetches all memories from Firestore or backend server storage.
 */
export async function fetchAllMemories(): Promise<MemoryPhoto[] | null> {
  // Try Firestore first
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, 'memories');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const photos: MemoryPhoto[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          photos.push({
            id: docSnap.id,
            url: d.url,
            caption: d.caption,
            date: d.date,
            rotation: d.rotation,
            order: typeof d.order === 'number' ? d.order : 0,
          });
        });
        // Sort by order ascending
        photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return photos;
      }
    } catch (err) {
      console.warn('[Firestore] Error fetching memories:', err);
    }
  }

  // Fallback to backend /api/memories
  try {
    const res = await fetch('/api/memories');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.memories) && data.memories.length > 0) {
        return data.memories;
      }
    }
  } catch (err) {
    console.warn('[Backend] Error fetching memories:', err);
  }

  return null;
}

/**
 * Persists all memories to Firestore and backend storage.
 */
export async function persistAllMemories(memories: MemoryPhoto[]): Promise<void> {
  // 1. Sync to backend API
  try {
    await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories }),
    });
  } catch (err) {
    console.error('[Backend] Failed to sync memories:', err);
  }

  // 2. Sync to Firestore if configured
  if (db && isFirebaseConfigured()) {
    try {
      const batch = writeBatch(db);
      memories.forEach((photo, index) => {
        const docRef = doc(db!, 'memories', photo.id);
        batch.set(docRef, {
          id: photo.id,
          url: photo.url,
          caption: photo.caption,
          date: photo.date || 'Sweet Memory',
          rotation: photo.rotation ?? 0,
          order: index,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      console.log('[Firestore] Successfully synchronized', memories.length, 'photos');
    } catch (err) {
      console.error('[Firestore] Batch save error:', err);
    }
  }
}

/**
 * Deletes a single memory from Firestore and backend.
 */
export async function deleteMemoryRecord(id: string): Promise<void> {
  if (db && isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (err) {
      console.warn('[Firestore] Delete error:', err);
    }
  }

  try {
    await fetch(`/api/memories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('[Backend] Delete error:', err);
  }
}
