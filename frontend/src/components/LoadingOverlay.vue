<!-- LoadingOverlay.vue -->
<template>
  <div class="loading-overlay" v-if="isLoading">
    <img src="/assets/loadingcat.gif" alt="Loading" class="loading-gif" />
    <h3 class="loading-text">Loading...</h3>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7dfdc;
  z-index: 1000;
}

.loading-gif {
  width: 200px;
  height: 150px;
}

.loading-text {
  color: #ff9e80;
  font-family: 'Jersey 25', sans-serif;
  font-size: 1.5rem;
  animation: pulseText 1.5s infinite;
}

@keyframes pulseText {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>
