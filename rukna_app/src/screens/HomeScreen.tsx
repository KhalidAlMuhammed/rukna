import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth';
import { dbService } from '../services/supabase';
import { Experience, RootStackParamList, MainTabParamList } from '../types';
import { COLORS, SIZES } from '../constants';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const { data, error } = await dbService.getExperiences();
      
      if (error) {
        Alert.alert('Error', 'Failed to load experiences');
        return;
      }

      if (data) {
        setExperiences(data.slice(0, 5)); // Show only first 5 for home screen
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderExperience = ({ item }: { item: Experience }) => (
    <TouchableOpacity
      style={styles.experienceCard}
      onPress={() => navigation.navigate('ExperienceDetails', { experienceId: item.id })}
    >
      <View style={styles.experienceImage}>
        <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
      </View>
      <View style={styles.experienceInfo}>
        <Text style={styles.experienceTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.experienceCategory}>{item.category}</Text>
        <View style={styles.experienceDetails}>
          <Text style={styles.experiencePrice}>
            ${item.price_per_person}/person
          </Text>
          <Text style={styles.experienceDuration}>
            {item.duration_hours}h
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.full_name}!
        </Text>
        <Text style={styles.subtitle}>
          Discover authentic experiences in Asir
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Discover')}
        >
          <Ionicons name="search" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Bookings')}
        >
          <Ionicons name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.actionText}>My Bookings</Text>
        </TouchableOpacity>

        {user?.user_type === 'guide' && (
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="business" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>My Experiences</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {experiences.length > 0 ? (
          <FlatList
            data={experiences}
            renderItem={renderExperience}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.experiencesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="compass-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>
              No experiences available yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  experiencesList: {
    paddingRight: SIZES.padding,
  },
  experienceCard: {
    width: 250,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.margin,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  experienceImage: {
    height: 150,
    backgroundColor: COLORS.border,
    borderTopLeftRadius: SIZES.borderRadius,
    borderTopRightRadius: SIZES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceInfo: {
    padding: SIZES.padding,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  experienceCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  experienceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experiencePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  experienceDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});