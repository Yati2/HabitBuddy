<template>
  <div class="dashboard-container">
    <h1>Welcome to the Dashboard</h1>
    <p>Here is a summary of your tasks and progress.</p>

    <!-- Example content -->
    <div class="task-summary">
      <h2>Your Tasks</h2>
      <ul>
        <li>Task 1: Complete Vue.js project</li>
        <li>Task 2: Update habit tracker</li>
        <li>Task 3: Attend team meeting</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  height: 100%;
  background-color: antiquewhite;
  padding: 20px;
  border-radius: 8px;
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
</style>
