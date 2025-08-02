import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth';
import { COLORS, SIZES } from '../constants';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => {
        // Navigate to edit profile screen
        Alert.alert('Coming Soon', 'Profile editing will be available soon');
      },
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => {
        Alert.alert('Coming Soon', 'Settings will be available soon');
      },
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => {
        Alert.alert('Coming Soon', 'Help & Support will be available soon');
      },
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Conditions',
      onPress: () => {
        Alert.alert('Coming Soon', 'Terms & Conditions will be available soon');
      },
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy Policy',
      onPress: () => {
        Alert.alert('Coming Soon', 'Privacy Policy will be available soon');
      },
    },
  ];

  if (user?.user_type === 'guide') {
    menuItems.unshift({
      icon: 'business-outline',
      title: 'My Experiences',
      onPress: () => {
        Alert.alert('Coming Soon', 'Experience management will be available soon');
      },
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.userTypeBadge}>
          <Text style={styles.userTypeText}>
            {user?.user_type === 'guide' ? 'Guide' : 'Tourist'}
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={COLORS.textSecondary} 
              />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  userTypeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menu: {
    padding: SIZES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 20,
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});