<template>
    <div class="help-page">
      <section class="help-section">
        <h1 class="help-title">Welcome to HabitBuddys Help Page</h1>
        <h2 class="help-intro">Here's a quick guide on how to make the most of our app!</h2>
        <br>
        <div class="help-content">
          <h2>Track Long-Term Tasks, Daily To-Dos, and Habits</h2>
          <p>
            Use our app to easily manage your long-term tasks, daily to-dos, and ongoing habits. 
            Organize your life by setting goals and track your progress every day.
          </p>
        </div>
  
        <div class="help-content">
          <h2>Earn Currency by Completing Tasks</h2>
          <p>
            Each time you complete a task or habit, you earn in-app currency! You can use this currency to take care of your digital pet. 
            Buy food, toys, or change the background color of your pet's home. Keep your pet happy and thriving!
          </p>
        </div>
  
        <div class="help-content">
          <h2>Journal Your Day</h2>
          <p>
            Reflect on your day by writing in your journal. You can log how you felt and what you accomplished. 
            This helps you keep track of your emotional well-being and see how your habits are affecting your life.
          </p>
        </div>
  
        <div class="help-content">
          <h2>Join the Forum</h2>
          <p>
            Our forum allows you to read and share advice with other users. You can discuss habits, ask for tips, or simply connect with people who are on the same journey.
          </p>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HelpPage',
  };
  </script>
  
  <style scoped>
.help-container {
  width: 100%;
  margin: 0 auto;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 10px;
  min-height: 100vh;
  background-color: #fff3e7;
}

h1.help-title {
  text-align: center;
  font-family: 'Jersey 25', sans-serif;
  color: #eec0c2;
}

h2.help-intro{
    text-align: center;
}

.help-section {
  margin-bottom: 20px;
  font-family: 'Jersey 25', sans-serif;
  font-size: 1.2em;
}

h2 {
  color: #f8d1d3;
}

p {
  color: #181818;
  padding: 10px;
  border-radius: 5px;
}

button {
  margin: 10px;
  border: none;
  background: transparent;
}

button:hover {
  transform: scale(1.5);
}

@media (prefers-color-scheme: dark) {
  .help-container {
    background-color: #181818;
  }

  p {
    color: #fff;
    background-color: #444;
  }

  h1.help-title {
    color: #eec0c2;
  }
}
</style>