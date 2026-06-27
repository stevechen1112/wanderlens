import React, { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native'
import { useColors, AppColors, radius, spacing } from '@/theme'

interface SkeletonProps {
  width?: DimensionValue
  height?: number
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ width = '100%', height = 16, borderRadius = radius.sm, style }: SkeletonProps) {
  const colors = useColors()
  const opacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: colors.border, opacity }, style]}
    />
  )
}

// 卡片型骨架，用於列表載入佔位
export function SkeletonCard() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={48} height={48} borderRadius={radius.full} />
        <View style={styles.col}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} style={{ marginTop: spacing.xs }} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{ marginTop: spacing.md }} />
      <Skeleton width="80%" height={12} style={{ marginTop: spacing.xs }} />
    </View>
  )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  col: { flex: 1 },
})
