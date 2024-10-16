<template>
  <div v-if="isAuthenticatedUser" class="journal-container">
    <h1 class="text-center">Mood Tracker Journal</h1>

    <div class="calendar">
      <!-- month -->
      <div class="month-header" colspan="7">{{ currentMonth }}</div>

      <!-- days -->
      <div class="day day-header">Sun</div>
      <div class="day day-header">Mon</div>
      <div class="day day-header">Tue</div>
      <div class="day day-header">Wed</div>
      <div class="day day-header">Thu</div>
      <div class="day day-header">Fri</div>
      <div class="day day-header">Sat</div>

      <!-- each day -->
      <div
        v-for="(day, index) in days"
        :key="index"
        class="calendar-day"
        :class="getMoodClass(day)"
        @click="selectDay(day)"
      >
        <div class="day-number">{{ day }}</div>
      </div>
    </div>

    <!-- form -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ selectedDay }} {{ currentMonth }}</h3>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <form @submit.prevent="saveJournalEntry">
          <div class="form-group">
            <label for="journalEntry">Journal Entry</label>
            <textarea
              id="journalEntry"
              class="form-control"
              v-model="entry"
              placeholder="Write your journal entry..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Mood</label>
            <div class="mood-picker">
              <div
                class="mood-option"
                :class="{ selected: mood === 'mood-excellent' }"
                @click="mood = 'mood-excellent'"
              >
                <img src="../assets/emotions/excellent.png" alt="Excellent" />
                <span>Excellent</span>
              </div>
              <div
                class="mood-option"
                :class="{ selected: mood === 'mood-good' }"
                @click="mood = 'mood-good'"
              >
                <img src="../assets/emotions/good.png" alt="Good" />
                <span>Good</span>
              </div>
              <div
                class="mood-option"
                :class="{ selected: mood === 'mood-neutral' }"
                @click="mood = 'mood-neutral'"
              >
                <img src="../assets/emotions/neutral.png" alt="Neutral" />
                <span>Neutral</span>
              </div>
              <div
                class="mood-option"
                :class="{ selected: mood === 'mood-bad' }"
                @click="mood = 'mood-bad'"
              >
                <img src="../assets/emotions/bad.png" alt="Bad" />
                <span>Bad</span>
              </div>
              <div
                class="mood-option"
                :class="{ selected: mood === 'mood-terrible' }"
                @click="mood = 'mood-terrible'"
              >
                <img src="../assets/emotions/terrible.png" alt="Terrible" />
                <span>Terrible</span>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Save Entry</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteJournalEntry"
            v-if="moodTracker[selectedDay]"
          >
            Delete Entry
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { isAuthenticated } from '@/auth'

export default {
  name: 'CalendarWithJournal',
  data() {
    return {
      currentMonth: this.getCurrentMonth(),
      days: this.getDaysInMonth(new Date().getMonth(), new Date().getFullYear()),
      selectedDay: null,
      entry: '',
      mood: 'mood-neutral',
      moodTracker: {},
      isModalOpen: false,
      errorMessage: '',
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
  methods: {
    getCurrentMonth() {
      const date = new Date()
      return date.toLocaleString('default', { month: 'long', year: 'numeric' })
    },
    getFirstDayOfMonth(month, year) {
      const firstDay = new Date(year, month, 1).getDay() // This gives you the weekday of the 1st day (0 for Sunday, 1 for Monday, etc.)
      return firstDay
    },
    getDaysInMonth(month, year) {
      const numDays = new Date(year, month + 1, 0).getDate()
      const firstDay = new Date(year, month, 1).getDay()

      return [
        ...Array(firstDay).fill(''), // Fill with empty strings for previous month's days
        ...Array.from({ length: numDays }, (_, i) => i + 1)
      ]
    },
    selectDay(day) {
      this.selectedDay = day
      const existingEntry = this.moodTracker[day] || { entry: '', mood: 'mood-neutral' }
      this.entry = existingEntry.entry
      this.mood = existingEntry.mood
      this.isModalOpen = true
    },

    getMoodClass(day) {
      switch (this.moodTracker[day]?.mood) {
        case 'mood-excellent':
          return 'mood-excellent'
        case 'mood-good':
          return 'mood-good'
        case 'mood-neutral':
          return 'mood-neutral'
        case 'mood-bad':
          return 'mood-bad'
        case 'mood-terrible':
          return 'mood-terrible'
        default:
          return ''
      }
    },
    saveJournalEntry() {
      if (this.selectedDay && this.entry.trim()) {
        const currentMonth = new Date().getMonth() + 1 // getMonth is 0-indexed
        const currentYear = new Date().getFullYear()

        const fullDate = new Date(`${currentYear}-${currentMonth}-${this.selectedDay}`)

        const user = localStorage.getItem('username')

        axios
          .post('http://localhost:8000/api/journals', {
            username: user,
            date: fullDate, // Send proper date format
            entry: this.entry,
            mood: this.mood
          })
          .then((response) => {
            this.moodTracker[this.selectedDay] = response.data.journal
            this.closeModal()
            this.errorMessage = '' // clear error message
          })
          .catch((error) => {
            console.error('Error saving journal entry:', error)
            this.errorMessage = 'An error occurred while saving your entry.'
          })
      } else {
        this.errorMessage = 'Please enter a journal entry before saving.'
      }
    },
    deleteJournalEntry() {
      const journalId = this.moodTracker[this.selectedDay]?._id // Use the stored _id from the moodTracker

      if (!journalId) {
        console.error('No journal entry found to delete.')
        return
      }

      axios
        .delete(`http://localhost:8000/api/journals/${journalId}`)
        .then(() => {
          delete this.moodTracker[this.selectedDay]
          this.closeModal()
        })
        .catch((error) => {
          console.error('Error deleting journal entry:', error)
        })
    },
    closeModal() {
      this.isModalOpen = false
      this.entry = ''
      this.mood = 'mood-neutral'
    }
  },

  mounted() {
    const user = localStorage.getItem('username')

    axios
      .get(`http://localhost:8000/api/journals/${user}`)
      .then((response) => {
        this.moodTracker = response.data.reduce((acc, entry) => {
          acc[new Date(entry.date).getDate()] = entry // Store by day
          return acc
        }, {})
      })
      .catch((error) => {
        console.error('Error fetching journal entries:', error)
      })
  }
}
</script>

<style scoped>
html,
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}

h1 {
  font-family: 'Jersey 25', sans-serif;
}

button {
  margin: 10px;
}

.journal-container {
  width: 100%;
  margin: 0 auto;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 10px;
  min-height: 100vh;
  background-color: #fff3e7;
  overflow: hidden;
}

.month-header {
  grid-column: span 7;
  text-align: center;
  font-size: 1.5em;
  background-color: #eec0c2;
  padding: 10px;
  font-family: 'Jersey 25', sans-serif;
}

.day {
  text-align: center;
  font-family: 'Jersey 25', sans-serif;
}

.day-header {
  text-align: center;
  height: 40px;
  line-height: 40px;
  background-color: #f8d1d3;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px; /* Increase gap between days slightly */
  width: 100%;
  margin: 0 auto;
}

.calendar-day {
  position: relative;
  width: 100%;
  padding-bottom: 60%; /* Increase padding-bottom for a slightly larger aspect ratio */
  border: 1px solid #ccc;
  text-align: left;
  cursor: pointer;
  background-color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
  min-width: 30px; /* Increase minimum width for days */
}

.day-number {
  position: absolute;
  top: 4px; /* Adjust position of day number slightly lower */
  left: 4px; /* Adjust position of day number slightly to the right */
  font-family: 'Jersey 25', sans-serif;
  font-size: 10px; /* Increase font size */
}

.error-message {
  color: red;
}

/* mood */
.mood-excellent {
  background-color: green;
}

.mood-good {
  background-color: greenyellow;
}

.mood-neutral {
  background-color: yellow;
}

.mood-bad {
  background-color: orange;
}

.mood-terrible {
  background-color: orangered;
}

.mood-picker {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.mood-option.selected {
  border: 2px solid #000; /* Highlight selected mood */
  border-radius: 5px; /* Rounded corners for selection */
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 1px solid transparent;
  transition: border-color 0.3s;
}

.mood-option img {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

/* modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #eec0c2;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  font-family: 'Jersey 25', sans-serif;
}

/* Responsive Design */

@media (max-width: 768px) {
  .journal-container {
    margin: 0 auto;
    padding: 10px;
  }
  h1 {
    font-size: 24px; /* Smaller title font size */
  }

  h2 {
    font-size: 20px; /* Smaller month font size */
  }

  .day,
  .day-header {
    font-size: 12px; /* Smaller font size for day names */
  }

  .calendar-day {
    padding-bottom: 50%; /* Slightly decrease for tablets */
  }

  .day-number {
    font-size: 9px; /* Slightly larger font size for day numbers */
  }

  .modal-content {
    width: 90%; /* Make modal wider on smaller screens */
  }

  .mood-option img {
    width: 40px; /* Smaller image size for mobile */
    height: 40px; /* Smaller image size for mobile */
  }
}

@media (max-width: 480px) {
  .journal-container {
    /* Full width on small screens */
    margin: 0 auto; /* Minimal padding */
    padding: 10px;
  }

  h1 {
    font-size: 20px; /* Even smaller title font size */
  }

  h2 {
    font-size: 18px; /* Even smaller month font size */
  }

  .day,
  .day-header {
    font-size: 10px; /* Smaller font size for day names */
  }
  .calendar-day {
    padding-bottom: 40%; /* Slightly decrease for phones */
    min-width: 25px; /* Allow for slightly larger days on mobile */
  }

  .day-number {
    font-size: 8px; /* Slightly larger font size for day numbers */
  }

  .mood-option img {
    width: 30px; /* Even smaller image size for mobile */
    height: 30px; /* Even smaller image size for mobile */
  }
}
</style>
