import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants';

type ExperienceDetailsRouteProp = RouteProp<RootStackParamList, 'ExperienceDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExperienceDetailsScreen() {
  const route = useRoute<ExperienceDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { experienceId } = route.params;

  const handleBookNow = () => {
    navigation.navigate('Booking', { experienceId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.placeholderText}>
            Experience Details Screen
          </Text>
          <Text style={styles.placeholderSubtext}>
            Experience ID: {experienceId}
          </Text>
          <Text style={styles.placeholderSubtext}>
            This screen will show detailed information about the selected experience including images, description, pricing, and reviews.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  placeholder: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});