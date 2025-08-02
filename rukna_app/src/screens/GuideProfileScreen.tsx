import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants';

type GuideProfileRouteProp = RouteProp<RootStackParamList, 'GuideProfile'>;

export default function GuideProfileScreen() {
  const route = useRoute<GuideProfileRouteProp>();
  const { guideId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Ionicons name="person-circle-outline" size={80} color={COLORS.textSecondary} />
        <Text style={styles.placeholderText}>
          Guide Profile Screen
        </Text>
        <Text style={styles.placeholderSubtext}>
          Guide ID: {guideId}
        </Text>
        <Text style={styles.placeholderSubtext}>
          This screen will show detailed information about the guide including bio, specialties, reviews, and their experiences.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
});