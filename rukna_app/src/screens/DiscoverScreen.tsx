import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { dbService } from '../services/supabase';
import { Experience, RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoverScreen() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [searchQuery, experiences]);

  const loadExperiences = async () => {
    try {
      const { data, error } = await dbService.getExperiences();
      
      if (error) {
        Alert.alert('Error', 'Failed to load experiences');
        return;
      }

      if (data) {
        setExperiences(data);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const filtered = experiences.filter((experience) =>
      experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredExperiences(filtered);
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
        <Text style={styles.experienceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.experienceDetails}>
          <Text style={styles.experienceCategory}>{item.category}</Text>
          <Text style={styles.experiencePrice}>
            ${item.price_per_person}/person
          </Text>
        </View>
        <View style={styles.experienceFooter}>
          <Text style={styles.experienceDuration}>
            {item.duration_hours}h
          </Text>
          <Text style={styles.experienceLocation}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading experiences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search experiences..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredExperiences}
        renderItem={renderExperience}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No experiences match your search' : 'No experiences available'}
            </Text>
          </View>
        }
      />
    </View>
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
  searchContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  list: {
    padding: SIZES.padding,
  },
  experienceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    marginBottom: SIZES.margin,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  experienceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceCategory: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  experiencePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  experienceLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginTop: 50,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});