import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  
  // Spacing scale (8px base unit)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  // Typography
  fontSize: {
    small: 11,
    caption: 13,
    body: 17,
    title: 22,
    headline: 28,
  },
  
  // Component dimensions
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
  chartHeight: 200,
} as const;
