
'use client';

import {
  onSnapshot,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useDoc = <T,>(
  docRef: DocumentReference | null,
  {
    onData,
    onError,
  }: {
    onData?: (data: T) => void;
    onError?: (error: FirestoreError) => void;
  } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          const data = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as unknown as T;
          setData(data);
          onData?.(data);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error: FirestoreError) => {
        setError(error);
        onError?.(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [docRef, onData, onError]);
  return { data, loading, error };
};
