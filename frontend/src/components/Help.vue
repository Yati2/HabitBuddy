<template>
  <body>
    <div class="help-page">
      <section class="help-section">
        <h1 class="help-title">Welcome to HabitBuddy's Help Page</h1>
        <h2 class="help-intro">Here's a quick guide on how to make the most of our app!</h2>

        <div
          v-for="(section, index) in helpSections"
          :key="index"
          class="help-content-box"
        >
          <h2 @click="toggleSection(index)" class="help-content-header">
            <span class="toggle-icon">{{ expandedSections[index] ? '▼' : '▶' }}</span>
            {{ section.title }}
          </h2>
          <transition name="expand">
            <div v-if="expandedSections[index]" class="help-content-details">
              <p v-for="(paragraph, pIndex) in section.content" :key="pIndex">
                {{ paragraph }}
              </p>
            </div>
          </transition>
        </div>
      </section>
    </div>
  </body>
</template>

<script>
export default {
  name: 'HelpPage',
  data() {
    return {
      expandedSections: [],
      helpSections: [
        {
          title: "Difference Between Long-Term Tasks, Daily To-Dos, and Habits",
          content: [
            "Long-Term Tasks: These are goals or projects that take several days, weeks, or even months to complete. Use this feature to track milestones and make steady progress towards larger objectives.",
            "Daily To-Dos: These are tasks that need to be completed on a daily basis, like a checklist of things to get done each day. Great for items like 'do the dishes' or 'check emails.'",
            "Habits: Habits are routines or behaviors that you want to establish over time. Track things you want to repeat regularly, like drinking water, exercising, or reading."
          ]
        },
        {
          title: "Track Long-Term Tasks, Daily To-Dos, and Habits",
          content: [
            "Use our app to easily manage your long-term tasks, daily to-dos, and ongoing habits. Organize your life by setting goals and track your progress every day."
          ]
        },
        {
          title: "Earn Currency by Completing Tasks",
          content: [
            "Each time you complete a task or habit, you earn in-app currency! You can use this currency to take care of your digital pet. Buy food, toys, or change the background color of your pet's home. Keep your pet happy and thriving!"
          ]
        },
        {
          title: "Journal Your Day",
          content: [
            "Reflect on your day by writing in your journal. You can log how you felt and what you accomplished. This helps you keep track of your emotional well-being and see how your habits are affecting your life."
          ]
        },
        {
          title: "Join the Forum",
          content: [
            "Our forum allows you to read and share advice with other users. You can discuss habits, ask for tips, or simply connect with people who are on the same journey."
          ]
        },
        {
          title: "Track Your Progress Over Time",
          content: [
            "Review your past achievements and see how far you've come! Our app lets you view your history, helping you identify patterns in your habits and motivating you to keep going."
          ]
        }
      ]
    };
  },
  mounted() {
    this.expandedSections = Array(this.helpSections.length).fill(false);
  },
  methods: {
    toggleSection(index) {
      this.expandedSections[index] = !this.expandedSections[index];
    }
  }
};
</script>

<style scoped>
/* General Styles */
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}

.help-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px 50px;
  min-height: 100vh;
  background-color: #f7bec1;
}

.help-title {
  font-family: 'Jersey 25', sans-serif;
  font-size: 2.5rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  text-align: center;
  margin-bottom: 1rem;
}

.help-intro {
  font-size: 1.4rem;
  text-align: center;
  color: #4d4d4d;
  margin-bottom: 1.5rem;
}

.help-section {
  margin-bottom: 20px;
  font-family: 'Jersey 25', sans-serif;
  font-size: 1.2rem;
}

.help-content-box {
  background-color:#f7bec1;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f2c5c3;
}

.help-content-header {
  color:#4d4d4d;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 10px 0;
  margin: 0;
  position: relative;
  transition: color 0.3s;
}

.help-content-header:hover {
  color: black;
}

.help-content-details {
  margin-top: 10px;
}

p {
  color: #4d4d4d;
  line-height: 1.6;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 5px;
}

</style>

