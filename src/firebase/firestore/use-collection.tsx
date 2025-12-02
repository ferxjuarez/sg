
'use client';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useCollection = <T,>(
  query: Query | null,
  {
    onData,
    onError,
  }: {
    onData?: (data: T[]) => void;
    onError?: (error: FirestoreError) => void;
  } = {}
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot: QuerySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as unknown as T);
        });
        setData(data);
        onData?.(data);
        setLoading(false);
      },
      (error: FirestoreError) => {
        setError(error);
        onError?.(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [query, onData, onError]);
  return { data, loading, error };
};
