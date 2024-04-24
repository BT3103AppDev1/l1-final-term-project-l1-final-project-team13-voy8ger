<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="localChartData" />
</template>

<script>
import { Bar } from "vue-chartjs";
import { computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    chartDataExternal: {
      type: Object,
      default: () => ({
        lastMonth: 0,
        thisMonth: 0,
        nextMonth: 0,
      }),
    },
  },
  setup(props) {
    // Compute the local chart data based on external prop changes
    const localChartData = computed(() => {
      console.log(
        "Using updated external chart data:",
        props.chartDataExternal
      );
      return {
        labels: ["Last Month", "This Month", "Next Month"],
        datasets: [
          {
            label: "Spending",
            data: [
              props.chartDataExternal.lastMonth,
              props.chartDataExternal.thisMonth,
              props.chartDataExternal.nextMonth,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
    });

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            // Format ticks to show a dollar sign and round the value
            callback: function (value, index, values) {
              return "$" + value.toFixed(2); // Rounds to two decimal places and adds dollar sign
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            // Custom tooltip to display values with dollar sign
            label: function (tooltipItem) {
              return "$" + tooltipItem.raw.toFixed(2);
            },
          },
        },
      },
    };

    return { localChartData, chartOptions };
  },
};
</script>