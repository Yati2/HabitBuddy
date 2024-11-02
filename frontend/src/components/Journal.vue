<template>
  <div v-if="isAuthenticatedUser" class="journal-container">
    <h1 class="text-center">Mood Tracker Journal</h1>

    <div class="controls">
      <button @click="previousMonth">←</button>
      <span>{{ currentMonthName }} {{ selectedYear }}</span>
      <button @click="nextMonth">→</button>
    </div>

    <div class="calendar">
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
        <h3>{{ selectedDay }} {{ currentMonthName }} {{ selectedYear }}</h3>

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
    const now = new Date()
    return {
      currentMonth: now.getMonth(),
      days: [],
      selectedDay: null,
      entry: '',
      mood: 'mood-neutral',
      moodTracker: {},
      isModalOpen: false,
      errorMessage: '',
      isAuthenticatedUser: false,
      selectedYear: now.getFullYear(),
      selectedMonth: now.getMonth() + 1,
      years: this.getYears(),
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },
  created() {
    // Check if the user is authenticated on creation
    if (isAuthenticated()) {
      this.isAuthenticatedUser = true
    } else {
      this.isAuthenticatedUser = false
      this.$router.push('/login')
    }
  },
  computed: {
    currentMonthName() {
      return this.monthNames[this.currentMonth]; 
    },
  },
  methods: {
    getFirstDayOfMonth(month, year) {
      const firstDay = new Date(year, month, 1).getDay() 
      return firstDay
    },
    getDaysInMonth(month, year) {
      const numDays = new Date(year, month + 1, 0).getDate()
      const firstDay = new Date(year, month, 1).getDay()

      return [
        ...Array(firstDay).fill(''), 
        ...Array.from({ length: numDays }, (_, i) => i + 1)
      ]
    },
    updateCalendar() {
      this.days = this.getDaysInMonth(this.selectedMonth - 1, this.selectedYear)
      this.currentMonth = this.selectedMonth - 1;
    },
    previousMonth() {
      if (this.selectedMonth === 1) {
        this.selectedMonth = 12
        this.selectedYear--
      } else {
        this.selectedMonth--
      }
      this.updateCalendar()
      this.fetchJournalEntries()
    },

    nextMonth() {
      if (this.selectedMonth === 12) {
        this.selectedMonth = 1
        this.selectedYear++
      } else {
        this.selectedMonth++
      }
      this.updateCalendar()
      this.fetchJournalEntries()
    },
    selectDay(day) {
      this.selectedDay = day
      const existingEntry = this.moodTracker[day] || { entry: '', mood: 'mood-neutral' }
      this.entry = existingEntry.entry
      this.mood = existingEntry.mood
      this.isModalOpen = true
    },

    getMoodClass(day) {
      return this.moodTracker[day]?.mood || ''
    },
    saveJournalEntry() {
      if (this.selectedDay && this.entry.trim()) {
        const fullDate = new Date(`${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`)

        const user = localStorage.getItem('username')

        axios
          .post('https://habit-buddy-server.vercel.app/api/journals', {
            username: user,
            date: fullDate, 
            entry: this.entry,
            mood: this.mood
          })
          .then((response) => {
            this.moodTracker[this.selectedDay] = response.data.journal
            this.closeModal()
            this.errorMessage = ''
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
      const journalId = this.moodTracker[this.selectedDay]?._id 

      if (!journalId) {
        console.error('No journal entry found to delete.')
        return
      }

      axios
        .delete(`https://habit-buddy-server.vercel.app/api/journals/${journalId}`)
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
    },
    fetchJournalEntries() {
      const username = localStorage.getItem('username')
      const year = this.selectedYear 
      const month = this.selectedMonth 

      axios
        .get(`https://habit-buddy-server.vercel.app/api/journals/${username}/${year}/${month}`)
        .then((response) => {
          this.moodTracker = response.data.reduce((acc, entry) => {
            acc[new Date(entry.date).getDate()] = entry 
            return acc
          }, {})
          this.updateCalendar() 
        })
        .catch((error) => {
          console.error('Error fetching journal entries:', error)
          this.errorMessage = 'Could not fetch journal entries. Please try again later.' 
        })
    },
    getYears() {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 10 }, (_, i) => currentYear - i) 
    }
  },

  mounted() {
    this.updateCalendar()
    this.fetchJournalEntries()
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
  border: none;
  background: transparent;
}

button:hover{
  transform: scale(1.5);
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

.controls {
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
  gap: 2px; 
  width: 100%;
  margin: 0 auto;
}

.calendar-day {
  position: relative;
  width: 100%;
  padding-bottom: 60%; 
  border: 1px solid #ccc;
  text-align: left;
  cursor: pointer;
  background-color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
  min-width: 30px; 
}

.day-number {
  position: absolute;
  top: 4px; 
  left: 4px; 
  font-family: 'Jersey 25', sans-serif;
  font-size: 10px; 
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
  border: 2px solid #000; 
  border-radius: 5px; 
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


@media (max-width: 768px) {
  .journal-container {
    margin: 0 auto;
    padding: 10px;
  }
  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px; 
  }

  .controls{
    font-size: 1em;
  }

  .day,
  .day-header {
    font-size: 12px;
  }

  .calendar-day {
    padding-bottom: 50%; 
  }

  .day-number {
    font-size: 9px; 
  }

  .modal-content {
    width: 90%;
  }

  .mood-option img {
    width: 40px; 
    height: 40px; 
  }
}

@media (max-width: 480px) {
  .journal-container {
    margin: 0 auto; 
    padding: 10px;
  }

  h1 {
    font-size: 20px; 
  }

  h2 {
    font-size: 18px;
  }

  button{
    font-size: 0.5em;
  }

  .day,
  .day-header {
    font-size: 10px; 
  }
  .calendar-day {
    padding-bottom: 40%; 
    min-width: 25px; 
  }

  .day-number {
    font-size: 8px; 
  }

  .mood-option img {
    width: 30px;
    height: 30px; 
  }
}
</style>
