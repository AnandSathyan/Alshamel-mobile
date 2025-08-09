import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../../constants/colors';
import { dimensions } from '../../constants/dimensions';
import { ChartDataPoint } from '../../types/health';

interface HealthChartProps {
  data: ChartDataPoint[];
  metric: 'steps' | 'water' | 'sleep';
}

export const HealthChart: React.FC<HealthChartProps> = ({ data, metric }) => {
  const screenWidth = Dimensions.get('window').width;

  const getChartData = () => {
    const labels = data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    let datasets;
    let suffix = '';

    switch (metric) {
      case 'steps':
        datasets = [{
          data: data.map(item => item.steps),
          color: () => colors.chartSteps,
        }];
        break;
      case 'water':
        datasets = [{
          data: data.map(item => item.water),
          color: () => colors.chartWater,
        }];
        suffix = 'L';
        break;
      case 'sleep':
        datasets = [{
          data: data.map(item => item.sleep),
          color: () => colors.chartSleep,
        }];
        suffix = 'h';
        break;
    }

    return {
      labels,
      datasets,
    };
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: metric === 'steps' ? 0 : 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: dimensions.borderRadius.md,
    },
    propsForLabels: {
      fontSize: dimensions.fontSize.caption,
    },
    propsForVerticalLabels: {
      fontSize: dimensions.fontSize.caption,
    },
    propsForHorizontalLabels: {
      fontSize: dimensions.fontSize.caption,
    },
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={getChartData()}
        width={screenWidth - dimensions.spacing.lg * 2}
        height={dimensions.chartHeight}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        fromZero
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: dimensions.spacing.md,
  },
  chart: {
    borderRadius: dimensions.borderRadius.md,
  },
});
