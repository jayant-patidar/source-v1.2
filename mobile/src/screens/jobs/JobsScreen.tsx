import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

export const JobsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Jobs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.muted,
  },
});
