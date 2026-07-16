import { Redirect, useLocalSearchParams } from 'expo-router';

import { CollaboratorDetailPage } from '@/components/pages/CollaboratorDetailPage';

export default function CollaboratorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href={{ pathname: '/(tabs)/team' }} />;
  }

  return <CollaboratorDetailPage />;
}
