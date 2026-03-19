<template>
  <canvas id="polarChart"></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import config from '../config.js';

Chart.register(...registerables);

export default {
  name: 'polarChart',
  props: ['chartData'],
  data() {
    return {
      configdata:config,
      skills: null,
      skillPoints: null,
      chartInstance: null
    };
  },
  watch: {
    chartData: {
      handler(newVal) {
        if (newVal && newVal.labels && newVal.data) {
          this.skills = newVal.labels;
          this.skillPoints = newVal.data;
          this.renderChart();
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.chartData && this.chartData.labels) {
        this.skills = this.chartData.labels;
        this.skillPoints = this.chartData.data;
    } else {
        if(import.meta.env.VITE_CONFIG){
            this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
        }
        this.skills = this.configdata.polarChart.skills;
        this.skillPoints = this.configdata.polarChart.skillPoints;
    }
    this.renderChart();
  },
  methods: {
    generateColors(count) {
      const colors = [];
      for (let i = 0; i < count; i++) {
        // Generate lighter colors for dark background (min 100, max 255)
        const r = Math.floor(100 + Math.random() * 155);
        const g = Math.floor(100 + Math.random() * 155);
        const b = Math.floor(100 + Math.random() * 155);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
      }
      return colors;
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      const ctx = document.getElementById('polarChart').getContext('2d');
      const colors = this.generateColors(this.skills.length);
      
      // Set default font color to white for this chart
      Chart.defaults.color = '#ffffff';
      Chart.defaults.font.family = "'LXGW WenKai Screen', sans-serif";

      this.chartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: this.skills,
          datasets: [{
            label: '文章占比 (%)',
            data: this.skillPoints,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.6', '1')),
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 1,
              padding: 12,
              caretSize: 6,
              cornerRadius: 8,
              boxWidth: 12,
              boxHeight: 12,
              displayColors: true,
              titleFont: {
                family: "'LXGW WenKai Screen', sans-serif",
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                family: "'LXGW WenKai Screen', sans-serif",
                size: 13
              },
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || '';
                  return `${label}: ${value}%`;
                },
                title: function(context) {
                  return `${context[0].label}`;
                },
              },
            },
          },
          scales: {
            r: {
              ticks: {
                display: false,
                backdropColor: 'transparent'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.15)',
                lineWidth: 1,
              },
              angleLines: {
                color: 'rgba(255, 255, 255, 0.25)',
                lineWidth: 1,
              },
              pointLabels: {
                color: '#ffffff',
                font: {
                  family: "'LXGW WenKai Screen', sans-serif",
                  size: 11
                }
              }
            },
          },
          animation: {
            duration: 1800,
            easing: 'easeOutQuad',
            animateRotate: true,
            animateScale: true,
          },
        },
      });
    },
  },
};
</script>

<style scoped>
</style>