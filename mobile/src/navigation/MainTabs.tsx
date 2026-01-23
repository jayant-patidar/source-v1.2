import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { RouteProp } from '@react-navigation/native';

// Ensure these paths are absolutely correct relative to src/navigation/MainTabs.tsx
import { FeedScreen } from '../screens/feed/FeedScreen';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { PostJobScreen } from '../screens/post/PostJobScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { JobsScreen } from '../screens/jobs/JobsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }: { route: RouteProp<MainTabParamList, keyof MainTabParamList> }) => ({
            tabBarActiveTintColor: COLORS.text.main,
            tabBarInactiveTintColor: COLORS.text.muted,
            headerShown: false,
            tabBarStyle: {
                height: 90, // Increased height to add space below
                paddingBottom: 30, // Pull content up
                paddingTop: 1,
                backgroundColor: COLORS.surface,
                borderTopColor: COLORS.border,
                elevation: 8, // Add some shadow
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            tabBarLabelStyle: {
                ...TYPOGRAPHY.caption,
                fontSize: 9, // Smaller font to fit "Notifications"
                fontWeight: '600',
                marginBottom: 0,
            },
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'home';

                if (route.name === 'Feed') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Post') {
                    return <Ionicons name="add-circle" size={30} color={COLORS.text.muted} />;
                } else if (route.name === 'Notifications') {
                    iconName = focused ? 'notifications' : 'notifications-outline';
                }else if (route.name === 'Jobs') {
                    iconName = focused ? 'briefcase' : 'briefcase-outline';
                }else if (route.name === 'Activity') {
                    iconName = focused ? 'briefcase' : 'briefcase-outline';
                }

                return <Ionicons name={iconName} size={24} color={color} />;
            },
        })}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen} 
        options={{ 
            title: 'Jobs', 
            tabBarBadge: 3,
            tabBarBadgeStyle: { backgroundColor: COLORS.error, fontSize: 10, lineHeight: 12, color: COLORS.text.light }
        }}
      />
      <Tab.Screen 
        name="Post" 
        component={PostJobScreen} 
        options={{ title: 'Post' ,
            tabBarBadgeStyle: { backgroundColor: COLORS.error, fontSize: 10, lineHeight: 12, color: COLORS.text.light }
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ 
            title: 'Notifications',
            tabBarBadge: 1,
            tabBarBadgeStyle: { backgroundColor: COLORS.error, fontSize: 10, lineHeight: 12, color: COLORS.text.light }
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={{ 
             title: 'Activity', 
             tabBarBadge: 3,
             tabBarBadgeStyle: { backgroundColor: COLORS.error, fontSize: 10, lineHeight: 12, color: COLORS.text.light }
        }}
      />
    </Tab.Navigator>
  );
};
