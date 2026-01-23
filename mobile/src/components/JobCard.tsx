import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { Job } from '../services/jobs.service';
import { Ionicons } from '@expo/vector-icons';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const displayPay = job.currentPay || job.originalPay;
  const hasMultiplePay = job.currentPay && job.currentPay !== job.originalPay;
  const requirements = job.requirements || job.tags || [];

  return (
    <View style={styles.card}>
      {/* Header: User Info */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
           <Image 
              source={{ uri: job.seekerId.avatar || 'https://i.pravatar.cc/100' }} 
              style={styles.avatar} 
           />
           <View>
              <Text style={styles.userName}>{job.seekerId.name}</Text>
              <Text style={styles.userMeta}>
                {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {job.seekerId.seekerRating || 'New'} ★
              </Text>
           </View>
        </View>
        <TouchableOpacity>
           <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Job Title & Pay */}
      <View style={styles.titleRow}>
         <TouchableOpacity onPress={onPress} style={{flex: 1}}>
            <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
         </TouchableOpacity>
         
         <View style={styles.payContainer}>
             {hasMultiplePay && (
                 <Text style={styles.oldPay}>${job.originalPay}</Text>
             )}
             <View style={styles.payChip}>
                 <Text style={styles.payText}>${displayPay}</Text>
             </View>
         </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {job.description}
      </Text>

      {/* Requirements */}
      {requirements.length > 0 && (
        <View style={styles.reqContainer}>
            <Text style={styles.reqLabel}>Requires:</Text>
            {requirements.slice(0, 3).map((req, index) => (
                <View key={index} style={styles.reqChip}>
                    <Text style={styles.reqText}>{req}</Text>
                </View>
            ))}
            {requirements.length > 3 && (
                <Text style={styles.moreReq}>+{requirements.length - 3} more</Text>
            )}
        </View>
      )}

      {/* Date & Location */}
      <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.text.muted} />
              <Text style={styles.detailText}>
                 {new Date(job.jobDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
          </View>
          <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.text.muted} />
              <Text style={styles.detailText}>{job.location.general}</Text>
          </View>
      </View>

      <View style={styles.divider} />

      {/* Action Icons */}
      <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="repeat" size={24} color={COLORS.text.main} />
              <Text style={styles.actionLabel}>Negotiate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
               <Ionicons name="location-sharp" size={24} color={COLORS.text.main} />
               <Text style={styles.actionLabel}>Locate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
               <Ionicons name="share-social-outline" size={24} color={COLORS.text.main} />
               <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
               <Ionicons name="bookmark-outline" size={24} color={COLORS.text.main} />
               <Text style={styles.actionLabel}>Save</Text>
          </TouchableOpacity>
      </View>

      {/* Interested Button */}
      <TouchableOpacity style={styles.interestedBtn} onPress={onPress}>
          <Text style={styles.interestedText}>INTERESTED</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userName: {
    ...TYPOGRAPHY.subtitle2,
    fontWeight: '700',
    color: COLORS.text.main,
  },
  userMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.muted,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    color: COLORS.text.main,
    marginRight: SPACING.sm,
  },
  payContainer: {
    alignItems: 'flex-end',
  },
  oldPay: {
    ...TYPOGRAPHY.caption,
    textDecorationLine: 'line-through',
    color: COLORS.text.muted,
    marginBottom: 2,
  },
  payChip: {
    backgroundColor: '#2e7d32', // Green
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payText: {
    ...TYPOGRAPHY.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  description: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.muted,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  reqContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reqLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.text.muted,
    marginRight: SPACING.xs,
  },
  reqChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  reqText: {
    fontSize: 10,
    color: COLORS.text.muted,
  },
  moreReq: {
    fontSize: 10,
    color: COLORS.text.muted,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    color: COLORS.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 10,
    color: COLORS.text.main,
    marginTop: 4,
  },
  interestedBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  interestedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
