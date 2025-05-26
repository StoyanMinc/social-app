import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    height: 40,
                    borderTopWidth: 0,
                    paddingBottom: 8,
                    position: 'absolute',
                    elevation: 0
                }
            }}>
            <Tabs.Screen
                name='index'
                options={{ tabBarIcon: ({ size, color }) => <Ionicons name='home' size={size} color={color} /> }}
            />
            <Tabs.Screen
                name='bookmarks'
                options={{ tabBarIcon: ({ size, color }) => <Ionicons name='bookmark' size={size} color={color} /> }}
            />
            <Tabs.Screen
                name='create'
                options={{ tabBarIcon: ({ size }) => <Ionicons name='add-circle' size={size} color={COLORS.primary} /> }}
            />
            <Tabs.Screen
                name='notifications'
                options={{ tabBarIcon: ({ size, color }) => <Ionicons name='notifications' size={size} color={color} />}}
            />
            <Tabs.Screen
                name='profile'
                options={{ tabBarIcon: ({ size, color }) => <Ionicons name='person-circle' size={size} color={color} /> }}
            />
        </Tabs>
    );
}