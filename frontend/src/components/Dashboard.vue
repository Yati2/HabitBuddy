<template>
  <div v-if="isAuthenticatedUser" class="dashboard-container">
    <h1>Welcome to the Dashboard</h1>
    <p>Here is a summary of your tasks and progress.</p>
    <div class="chart-container">
      <div class="controls">
        <label 
          v-for="(color, metric) in metrics" 
          :key="metric" 
          class="control-item"
        >
          <input
            type="checkbox"
            v-model="visibleLines[metric]"
            @change="toggleLine(metric)"
          >
          <span :style="{ color }">{{ metric }}</span>
        </label>
      </div>
      <canvas ref="chartRef"></canvas>
    </div>
    <div class="task-summary">
      <h2>Your Tasks (placeholder)</h2>
      <ul>
        <li>Task 1: Complete Vue.js project</li>
        <li>Task 2: Update habit tracker</li>
        <li>Task 3: Attend team meeting</li>
      </ul>
    </div>
</div>
</template>
<script>
import { isAuthenticated } from '@/auth'
import { ref, onMounted} from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'Dashboard',
  data() {
    return {
      isAuthenticatedUser: false
    }
  },
  created() {
    // Check if the user is authenticated on creation
    if (isAuthenticated()) {
      this.isAuthenticatedUser = true
    } else {
      this.isAuthenticatedUser = false
      this.$router.push('/login') // Redirect to login page if not authenticated
    }
  },
  setup() {
    const chartRef = ref(null)
    let chart = null

    const metrics = ref({
      'Habits': '#2563eb',
      'Long Term Tasks': '#16a34a',
      'Daily To-dos': '#9333ea'
    })

    const visibleLines = ref({
      'Habits': true,
      'Long Term Tasks': true,
      'Daily To-dos': true
    })

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Habits',
          data: [4000, 3000, 2000, 2780, 1890, 2390],
          borderColor: '#2563eb',
          tension: 0.1,
          hidden: false
        },
        {
          label: 'Long Term Tasks',
          data: [2400, 1398, 9800, 3908, 4800, 3800],
          borderColor: '#16a34a',
          tension: 0.1,
          hidden: false
        },
        {
          label: 'Daily To-dos',
          data: [1800, 900, 2800, 1500, 2100, 1700],
          borderColor: '#9333ea',
          tension: 0.1,
          hidden: false
        }
      ]
    }

    const initChart = () => {
      const ctx = chartRef.value.getContext('2d')
      chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [3, 3]
              }
            },
            x: {
              grid: {
                borderDash: [3, 3]
              }
            }
          }
        }
      })
    }

    const toggleLine = (metric) => {
      const datasetIndex = data.datasets.findIndex(ds => ds.label === metric)
      chart.data.datasets[datasetIndex].hidden = !visibleLines.value[metric]
      chart.update()
    }

    onMounted(() => {
      initChart()
    })

    return {
      chartRef,
      metrics,
      visibleLines,
      toggleLine
    }
  }

  // methods: {
  // }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  margin: 0 auto;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 10px;
  min-height: 100vh;
  background-color: #fff3e7;
  overflow: hidden;
  /* height: 100%;
  background-color: antiquewhite;
  padding: 20px;
  border-radius: 8px; */
}

h1 {
  color: #4a2a8d;
}

.task-summary {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin: 5px 0;
  font-weight: bold;
}

.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

canvas {
  height: 400px !important;
}
</style>
