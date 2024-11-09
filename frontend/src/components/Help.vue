<template>
  <div class="help-container">
    <div class="header">
      <h1 class="help-title">Welcome to HabitBuddy's Help Page</h1>
      <h2 class="help-intro">Here's a quick guide on how to make the most of our app!</h2>
    </div>
    <section class="help-section">
      <div v-for="(section, index) in helpSections" :key="index" class="help-content-box">
        <h2 @click="toggleSection(index)" class="help-content-header">
          <span class="arrow" :class="{ 'arrow-down': expandedSections[index] }"> ▶ </span>
          {{ section.title }}
        </h2>
        <transition name="fade">
          <div v-if="expandedSections[index]" class="help-content-details">
            <p v-for="(paragraph, pIndex) in section.content" :key="pIndex">
              {{ paragraph }}
            </p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HelpPage',
  data() {
    return {
      expandedSections: [],
      helpSections: [
        {
          title: 'Track Long-Term Tasks, Daily To-Dos, and Habits',
          content: [
            'Use our app to easily manage your long-term tasks, daily to-dos, and ongoing habits. Organize your life by setting goals and track your progress every day.'
          ]
        },
        {
          title: 'Difference Between Long-Term Tasks, Daily To-Dos, and Habits',
          content: [
            'Long-Term Tasks: These are goals or projects that take several days, weeks, or even months to complete. Use this feature to track milestones and make steady progress towards larger objectives.',
            "Daily To-Dos: These are tasks that need to be completed on a daily basis, like a checklist of things to get done each day. Great for items like 'do the dishes' or 'check emails.'",
            'Habits: Habits are routines or behaviors that you want to establish over time. Track things you want to repeat regularly, like drinking water, exercising, or reading.'
          ]
        },

        {
          title: 'Earn Coins by Completing Tasks',
          content: [
            'Each time you complete a task or habit, you earn coins! You can use these coins to make purchases from the shop!',
            'For each habit completed you earn: 5 coins',
            'For each long-term task completed you earn: 10 coins',
            'For each daily to-do completed you earn: 10 coins'
          ]
        },
        {
          title: 'The Shop',
          content: [
            "Here, you can use your hard earned coins to purchase food, different pets, or change the background of your pet's home!"
          ]
        },
        {
          title: 'Feeding your pet',
          content: [
            'Feeding your pet will boost its happiness! You can only feed your pet when its happiness has fallen below 100%',
            'Regular fish: 10% Happiness boost',
            'Rare fish: 15% Happiness boost',
            'Ultra fish: 20% Happiness boost'
          ]
        },
        {
          title: 'Journal Your Day',
          content: [
            'Reflect on your day by writing in your journal. You can log how you felt and what you accomplished. This helps you keep track of your emotional well-being and see how your habits are affecting your life.'
          ]
        },
        {
          title: 'Join the Forum',
          content: [
            'Our forum allows you to read and share advice with other users. You can discuss habits, ask for tips, or simply connect with people who are on the same journey.'
          ]
        },
        {
          title: 'Track Your Progress Over Time',
          content: [
            "Review your past achievements and see how far you've come! Our app lets you view your history, helping you identify patterns in your habits and motivating you to keep going."
          ]
        }
      ]
    }
  },
  mounted() {
    this.expandedSections = Array(this.helpSections.length).fill(false)
  },
  methods: {
    toggleSection(index) {
      this.expandedSections[index] = !this.expandedSections[index]
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  background-size: cover;
  padding: 30px;
}
.help-container {
  background-image: url('https://i.pinimg.com/originals/49/1e/82/491e8249887be2a4550b47b2a6c7de10.gif');
  background-color: #fff3e7;
  background-size: cover;
  width: 100%;
  margin: 0 auto;
}

h1.help-title {
  text-align: center;
  font-family: 'Pixelify Sans', sans-serif;
  color: black;
  font-size: 2rem;
  padding-bottom: 5px;
}

h2.help-intro {
  text-align: center;
  color: rgba(241, 134, 140, 0.7);
  font-size: 1.2rem;
  font-family: 'Jersey 25', sans-serif;
}

.help-section {
  font-family: 'Jersey 25', sans-serif;
  width: 60%;
  margin: auto;
  padding-bottom: 20px;
}

.help-content-box {
  background-color: #fffffff7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.help-content-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.help-content-header {
  color: black;
  cursor: pointer;
  font-size: 1.2em;
  margin: 0;
  padding: 10px 0;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.help-content-header:hover {
  color: rgba(234, 126, 131, 0.7);
}

.arrow {
  margin-right: 10px;
  display: inline-block;
  transition: transform 0.3s;
}

.arrow-down {
  transform: rotate(90deg);
}

.help-content-details {
  margin-top: 10px;
  line-height: 1.6;
  color: #444;
  background-color: rgba(241, 187, 190, 0.7);
  border-radius: 5px;
  padding: 15px;
  transition: max-height 0.3s ease;
}

p {
  color: #333;
  padding: 8px;
  border-radius: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
