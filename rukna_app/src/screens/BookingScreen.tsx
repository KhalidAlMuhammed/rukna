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

import { RootStackParamList } from '../types';
import { COLORS, SIZES } from '../constants';

type BookingRouteProp = RouteProp<RootStackParamList, 'Booking'>;

export default function BookingScreen() {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation();
  const { experienceId } = route.params;

  const handleConfirmBooking = () => {
    Alert.alert(
      'Booking Confirmed',
      'Your booking has been submitted and is pending confirmation from the guide.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Ionicons name="calendar-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.placeholderText}>
            Booking Screen
          </Text>
          <Text style={styles.placeholderSubtext}>
            Experience ID: {experienceId}
          </Text>
          <Text style={styles.placeholderSubtext}>
            This screen will allow users to select dates, number of participants, add special requests, and confirm their booking.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});