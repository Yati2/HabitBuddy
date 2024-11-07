<template>
    <div class="dashboard-data-main" 
      :habitLog="increaseHabitLog()" :longTermLog="increaseLongTermLog()" :toDoLog="increaseToDoLog()">
    </div>
</template>

<script>
import axios from 'axios'
import Dashboard from './Dashboard.vue';

export default {
  name: 'DashboardData',
  components: {Dashboard},
  props: {
    habitLog: {
      type: Object

    },
    longTermLog: {
      type: Object

    },
    toDoLog: {
      type: Object

    },
  },
  methods: {
    increaseHabitLog() {
      const username = localStorage.getItem('HabitLog') || 'anonymous'
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${username}/points`)
        
    },
    increaseLongTermLog(){
      
    },
    increaseToDoLog() {

    }
  }
  // data() {
  //   return {
  //     streakCheckpoint: [0, 25,50,75,100],
  //   }
  // },
  // props: {
  //   steps: {
  //     type: Array,
  //     required: true,
  //   },
  //   currentStep: {
  //     type: Number,
  //     required: true,
  //     default: 0,
  //   },
  //   streakPercent: {
  //     type: Number,
      
  //   }
  // },
  // computed: {
  //   progressWidth() {
  //     return ((this.currentStep + 1) / (this.steps.length-1)) * 100 - 25;
  //     //return currentStep / streakGoal;
  //   },
  //   // streakCheckpointCurrent() {
  //   //   for (cp in this.streakCheckpoint()) {
  //   //     if (currentStep > cp) {

  //   //     }
  //   //   }
  //   // }
  // },
};
</script>

<style scoped>
    .dashboard-data-main{
        /* display: none; */
    }

</style>