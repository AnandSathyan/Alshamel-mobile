import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface DateDisplayProps {
  date?: Date
  style?: any
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ date = new Date(), style }) => {
  const formatTodaysDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.dateText}>Today's Date</Text>
      <Text style={styles.dateValue}>{formatTodaysDate(date)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: dimensions.spacing.lg,
  },
  dateText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: dimensions.spacing.xs,
  },
  dateValue: {
    fontSize: dimensions.fontSize.titleLarge,
    color: colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
})
