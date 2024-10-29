<template>
  <div class="step-progress">
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: streakPercent + '%' }"></div>
    </div>
    <div class="steps-container">
      <div
        class="step"
        v-for="(step, index) in steps"
        :key="index"
        :class="{ active: streakCheckpoint[index] <= streakPercent }"
      >
        <div class="step-number">{{ streakCheckpoint[index] }}</div>
        <div class="step-label">{{ step }}</div>
        <!-- <div>TESTING STUFF LOLOLOL</div> -->
      </div>
    </div>
  </div>
</template>
    
<script>


  export default {
    data() {
      return {
        streakCheckpoint: [0, 25,50,75,100],
      }
    },
    props: {
      steps: {
        type: Array,
        required: true,
      },
      currentStep: {
        type: Number,
        required: true,
        default: 0,
      },
      streakPercent: {
        type: Number,
        
      }
    },
    computed: {
      progressWidth() {
        return ((this.currentStep + 1) / (this.steps.length-1)) * 100 - 25;
        //return currentStep / streakGoal;
      },
      // streakCheckpointCurrent() {
      //   for (cp in this.streakCheckpoint()) {
      //     if (currentStep > cp) {

      //     }
      //   }
      // }
    },
  };
</script>
    
<style scoped>
  .step-progress {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    /* transition-delay: 10s;
    transition: 10s; */
  }
  
  /**/
  
  .progress-bar {
    height: 100%;
    background-color: #42b983;
    transition: width 0.3s ease;
  }
  
  .steps-container {
    display: flex;
    justify-content: space-between;
    /* align-items: flex-start; */
    z-index: 1;
    
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  /*~key changes i made: change height and margin-bottom of .progress-bar-container*/
  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #333;
    z-index: 2;
  }
  
  .step-label {
    margin-top: 0.5rem;
  }
  .progress-bar-container {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    background-color: #ddd;
    /* height: 10px; */
    height: 0.6rem; /*~change height to half of .step-number font size*/
    margin-bottom: -1.5rem;  /*~change height to half of .step-number font size*/
    /* Shift the progress bar up (originally: margin-bottom: )*/
  }
  .step.active .step-number {
    background-color: #42b983;
    color: #fff;
    transition: 0.3s ease;
  }
  
  /* Media Queries for Responsive Design */
  @media (max-width: 768px) {
    .step-number {
      width: 30px;
      height: 30px;
      font-size: 1rem;
    }
  
    .step-label {
      font-size: 0.9rem;
    }
  
    .progress-bar-container {
      height: 8px;
      margin-bottom: -1.2rem; /*added this */
    }
  }
  
  @media (max-width: 480px) {
    .step-number {
      width: 25px;
      height: 25px;
      font-size: 0.9rem;
    }
  
    .step-label {
      font-size: 0.8rem;
    }
  
    .progress-bar-container {
      height: 6px;
      margin-bottom: -1rem;
    }
  }
</style>