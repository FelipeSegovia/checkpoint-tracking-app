import { Redirect, useLocalSearchParams } from 'expo-router';

import { EstablishmentDetailPage } from '@/components/pages/EstablishmentDetailPage';

export default function EstablishmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href={{ pathname: '/(tabs)/establishments' }} />;
  }

  return <EstablishmentDetailPage />;
}
