import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/quarks';

export default function TabLayout() {
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
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="square.grid.2x2.fill" size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="establishments"
        options={{
          title: 'Establecimientos',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="building.2.fill" size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: 'Equipo',
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="person.2.fill" size={22} />
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
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
