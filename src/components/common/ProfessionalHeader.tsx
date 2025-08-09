import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from "./Icon"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface ProfessionalHeaderProps {
  title: string
  subtitle?: string
  showProfile?: boolean
  showNotifications?: boolean
  notificationCount?: number
  onProfilePress?: () => void
  onNotificationPress?: () => void
  gradient?: string[]
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  title,
  subtitle,
  showProfile = true,
  showNotifications = true,
  notificationCount = 0,
  onProfilePress,
  onNotificationPress,
  gradient = colors.gradientDark,
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={gradient[0]} translucent />
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.actionsContainer}>
              {showNotifications && (
                <TouchableOpacity style={styles.actionButton} onPress={onNotificationPress}>
                  <Icon name="notifications" size={20} color={colors.textPrimary} />
                  {notificationCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationText}>
                        {notificationCount > 99 ? "99+" : notificationCount.toString()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {showProfile && (
                <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
                  <LinearGradient colors={colors.gradientPrimary} style={styles.profileGradient}>
                    <Icon name="person" size={20} color={colors.textPrimary} />
                  </LinearGradient>
                  <View style={styles.profileGlow} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeElement1} />
        <View style={styles.decorativeElement2} />
        <View style={styles.decorativeElement3} />
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: dimensions.layout.headerPaddingTop,
    paddingBottom: dimensions.layout.headerPaddingBottom,
    position: "relative",
    overflow: "hidden",
    minHeight: dimensions.layout.headerHeight,
  },
  content: {
    paddingHorizontal: dimensions.layout.containerPadding,
    paddingTop: dimensions.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: dimensions.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    paddingRight: dimensions.spacing.lg,
  },
  title: {
    fontSize: dimensions.fontSize.headlineLarge,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textSecondary,
    fontWeight: "500",
    opacity: 0.9,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.spacing.md,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glassStrong,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  notificationText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: "relative",
  },
  profileGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.glassBorder,
  },
  profileGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    backgroundColor: colors.primaryGlow,
    zIndex: -1,
  },
  decorativeElement1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.glass,
    opacity: 0.1,
  },
  decorativeElement2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glass,
    opacity: 0.15,
  },
  decorativeElement3: {
    position: "absolute",
    top: "50%",
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.glass,
    opacity: 0.2,
  },
})
