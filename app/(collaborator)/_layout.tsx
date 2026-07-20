import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/quarks';

export default function CollaboratorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.surfaceBorder,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="map.fill" size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="qrcode.viewfinder" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="gearshape.fill" size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
