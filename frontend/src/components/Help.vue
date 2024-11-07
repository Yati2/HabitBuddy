<template>
  <body>
    <div class="help-page">
      <section class="help-section">
        <h1 class="help-title">Welcome to HabitBuddy's Help Page</h1>
        <h2 class="help-intro">Here's a quick guide on how to make the most of our app!</h2>
        <br>

        <div
          v-for="(section, index) in helpSections"
          :key="index"
          class="help-content-box"
        >
          <h2 @click="toggleSection(index)" class="help-content-header">
            <span class="arrow" :class="{ 'arrow-down': expandedSections[index] }">
              ▶
            </span>
            {{ section.title }}
          </h2>
          <div v-if="expandedSections[index]" class="help-content-details">
            <p v-for="(paragraph, pIndex) in section.content" :key="pIndex">
              {{ paragraph }}
            </p>
          </div>
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
          title: "Track Long-Term Tasks, Daily To-Dos, and Habits",
          content: [
            "Use our app to easily manage your long-term tasks, daily to-dos, and ongoing habits. Organize your life by setting goals and track your progress every day."
          ]
        },
        {
          title: "Difference Between Long-Term Tasks, Daily To-Dos, and Habits",
          content: [
            "Long-Term Tasks: These are goals or projects that take several days, weeks, or even months to complete. Use this feature to track milestones and make steady progress towards larger objectives.",
            "Daily To-Dos: These are tasks that need to be completed on a daily basis, like a checklist of things to get done each day. Great for items like 'do the dishes' or 'check emails.'",
            "Habits: Habits are routines or behaviors that you want to establish over time. Track things you want to repeat regularly, like drinking water, exercising, or reading."
          ]
        },
        
        {
          title: "Earn Coins by Completing Tasks",
          content: [
            "Each time you complete a task or habit, you earn coins! You can use these coins to make purchases from the shop!",
            "For each habit completed you earn: 5 coins",
            "For each long-term task completed you earn: 10 coins",
            "For each daily to-do completed you earn: 10 coins"
          ]
        },
        {
          title: "The Shop",
          content: [
            "Here, you can use your hard earned coins to purchase food, different pets, or change the background of your pet's home!",
          ]
        },
        {
          title: "Feeding your pet",
          content: [
            "Feeding your pet will boost its happiness! You can only feed your pet when its happiness has fallen below 100%",
            "Regular fish: 10% Happiness boost",
            "Rare fish: 15% Happiness boost",
            "Ultra fish: 20% Happiness boost"
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
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}

.help-container {
  width: 100%;
  margin: 0 auto;
  padding: 50px;
  min-height: 100vh;
  background-color: #fff3e7;
}

h1.help-title {
  text-align: center;
  font-family: 'Jersey 25', sans-serif;
  color: #eec0c2;
}

h2.help-intro {
  text-align: center;
  color: #333;
}

.help-section {
  margin-bottom: 20px;
  font-family: 'Jersey 25', sans-serif;
  font-size: 1.2em;
}

.help-content-box {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.help-content-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.help-content-header {
  color: #f9b8bb;
  cursor: pointer;
  font-size: 1.2em;
  margin: 0;
  padding: 10px 0;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.help-content-header:hover {
  color: #fa8488;
}

.arrow {
  margin-right: 8px;
  display: inline-block;
  transition: transform 0.3s;
}

.arrow-down {
  transform: rotate(90deg);
}

.help-content-details {
  margin-top: 10px;
  transition: max-height 0.3s ease;
}

p {
  color: #181818;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  line-height: 1.5;
}

</style>
