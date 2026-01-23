import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useJobsStore } from '../../store/jobsStore';
import { JobCard } from '../../components/JobCard';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import { TYPOGRAPHY } from '../../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const FeedScreen = () => {
  const { jobs, isLoading, error, loadJobs } = useJobsStore();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRefresh = () => {
    loadJobs();
  };

  if (isLoading && jobs.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>Tap to retry</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
            <TouchableOpacity>
                <Image 
                    source={{ uri: 'https://i.pravatar.cc/100?img=3' }} // Placeholder profile pic
                    style={styles.profilePic}
                />
            </TouchableOpacity>
            
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.text.muted} style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search jobs..."
                    placeholderTextColor={COLORS.text.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <TouchableOpacity>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color={COLORS.text.main} />
            </TouchableOpacity>
        </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            onPress={() => console.log('Selected job:', item._id)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>No jobs available right now.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    marginHorizontal: SPACING.md,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...TYPOGRAPHY.body2,
    color: COLORS.text.main,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text.main,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  retryText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.muted,
  }
});
