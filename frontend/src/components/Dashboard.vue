<template>
  <div v-if="isAuthenticatedUser" class="dashboard-container">
    <h1>Welcome to the Dashboard</h1>
    <p>Here is a summary of your tasks and progress.</p>
    <div id="app">
      <!-- <p>Step Progress Bar</p> -->
      <h1>You are on a {{currentStreak}} day streak! {{encouragement}}</h1>
      <!-- <StepProgressSettings /> -->
      <h3>Progress: {{ currentStreak }}/{{ streakGoal }} days; {{ streakPercent }}%</h3>
      <!-- <div></div>
      <div>//currentStep = {{ currentStep }}</div> -->
      <br>
      <StepProgress :steps="steps" :current-step="currentStep" :streak-percent="streakPercent" /> <!-- contains the bubbles and progress -->
      <!-- :streakPercent="streakPercent" -->
      
      Enter new streak goal (number of days): 
      <input type="text" class="text-input" maxlength="2" size ="2" v-model="streakInput"><br>
      
      <button @click="prevStep" :disabled="streakPercent === 0">Previous</button>
      <button @click="nextStep" :disabled="streakPercent === 100">Next</button>
    </div>
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
    <!-- <div class="task-summary">
      <h2>Your Tasks (placeholder)</h2>
      <ul>
        <li>Task 1: Complete Vue.js project</li>
        <li>Task 2: Update habit tracker</li>
        <li>Task 3: Attend team meeting</li>
      </ul>
    </div> -->
  </div>
</template>
<script>
import { isAuthenticated } from '@/auth'
import { ref, onMounted} from 'vue'
import Chart from 'chart.js/auto'

import StepProgress from './Dashboard-StepProgress.vue';
import StepProgressSettings from './Dashboard-StepProgressSettings.vue';



export default {
  name: 'Dashboard',
  data() {
    return {
      isAuthenticatedUser: false,
      steps: ['Start', '', '', '', 'End'],
      currentStep: -1,
      // streakPercent: this.streakPercent(),
      streakGoal: 7,
      chartDays: 7, 
    }
  },
  props: {
    habitLog: {
      type: Object

    },
    longTermLog: {
      type: Object

    },
    toDoLog: {
      type: Object

    }, //need to turn it into a list(array in js []) (need of len==chartDays?)so that chart can accept that
  }, 
  methods: {
    //check
    
    fetchLogs() {
      const username = localStorage.getItem('HabitLog') || 'anonymous'
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${username}/points`)
        
    },
    increaseHabitLog() {

    },
    increaseLongTermLog(){
      
    },
    increaseToDoLog() {

    },
    nextStep() {
      if (this.streakPercent <= 100) {
        this.currentStep += 1;
      }
    },
    prevStep() {
      if (this.streakPercent > 0) {
        this.currentStep -= 1;
      }
    },
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
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      datasets: [
        {
          label: 'Habits',
          data: [5, 4, 4, 5, 5, 5,3], //shld be a list from DashboardData
          borderColor: '#2563eb',
          tension: 0.1,
          hidden: false
        },
        {
          label: 'Long Term Tasks',
          data: [3, 2, 3, 4, 4, 3,4],
          borderColor: '#16a34a',
          tension: 0.1,
          hidden: false
        },
        {
          label: 'Daily To-dos',
          data: [5, 4, 3, 4, 6, 2,3],
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
  }, /*this is for chart*/

  //methods used to be here
  components: {
    StepProgress, StepProgressSettings
  },
  computed: {
    currentStreak(){
      return this.currentStep + 1;
    },
    streakGoal(){
      // return this.steps.length;
      return 7;
    },
    encouragement(){
      if (this.streakGoal == this.currentStreak) {
        return " Yay!! Streak Completed!"
      } else if (this.currentStreak == 0) {
        return  'Get started today! "A journey of a thousand miles begins with a single step."'
      } else {
        return this.streakGoal - this.currentStreak + " days to go!!";
      }
    },
    
    streakPercent() {
      let percentTimesHundred = (this.currentStreak / this.streakGoal) * 100
      return Math.round(percentTimesHundred)
      // return (this.currentStreak / this.streakGoal) * 100 + "%"
    }
  }
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
  font-family: 'Jersey 25', sans-serif;
  /* height: 100%;
  background-color: antiquewhite;
  padding: 20px;
  border-radius: 8px; */
}

/* #app {
  display: flex;
  justify-content: center;
  align-content: center;
} */

h1 {
  color: #4a2a8d;
}

/* .text-input{
  maxleng
} */

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
  /* max-width: 800px; */
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 120%;
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
