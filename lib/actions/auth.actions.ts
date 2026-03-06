// lib/auth.actions.ts  
'use server';

import { getFirestore } from 'firebase-admin/firestore';

export async function getUserProfile(uid: string) {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      return { 
        success: true, 
        data: userDoc.data() 
      };
    } else {
      return { 
        success: false, 
        error: 'User profile not found' 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

