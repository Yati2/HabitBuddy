<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />
  <link href="https://unpkg.com/gijgo@1.9.14/css/gijgo.min.css" rel="stylesheet" type="text/css" />

  <div class="tasks-container">
    <div class="container-fluid">
      <div class="row header">
        <div class="col-2">
          <h2 class="m-0 text-white">bluey</h2>
          <div class="d-flex align-items-center">
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/74b4662c-5fd8-4737-8ff7-ce90016eb473/dbjugzj-5b7a2bc5-f38d-484d-b99c-0bd2e1f57201.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc0YjQ2NjJjLTVmZDgtNDczNy04ZmY3LWNlOTAwMTZlYjQ3M1wvZGJqdWd6ai01YjdhMmJjNS1mMzhkLTQ4NGQtYjk5Yy0wYmQyZTFmNTcyMDEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sjyJkNZoHjHR34uyNDLh-e_AFeGQfoRxzFPUfPSViH0"
              alt="cat"
              class="cat-img"
              style="height: 50px; width: auto"
            />
          </div>
        </div>
        <div class="col-10 dashboard-container">
          <div class="dashboard-title">
            <h3>Dashboard</h3>
          </div>
          <div class="row">
            <div class="col m-3">
              <div class="progress">
                <div class="progress-bar bg-purple" role="progressbar" style="width: 50%"></div>
              </div>
              <div class="progress-labels">
                <span>3</span>
                <span>6</span>
                <span>9</span>
                <span>12</span>
              </div>
            </div>
            <div class="col">
              <h1 class="mb-0">You're on a <strong>8 Day</strong> Streak!</h1>
            </div>
          </div>
        </div>
      </div>

      <div class="row main-content">
        <div class="col-12 col-sm-6 col-md-3 card-section">
          <h4>Habits <i class="fas fa-plus plus-icon" @click="showHabitForm = true"></i></h4>

          <div v-if="showHabitForm" class="form-container card2">
            <form @submit.prevent="submitHabit">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Title</span>
                <input
                  type="text"
                  class="form-control"
                  v-model="HabitForm.title"
                  placeholder="Enter title"
                  aria-label="Title"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div class="form-floating">
                <textarea
                  v-model="HabitForm.description"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style="height: 100px"
                  required
                ></textarea>
                <label for="floatingTextarea2">Enter Description</label>
              </div>
              <div>&nbsp;</div>

              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupSelect01">Category</label>
                <select class="form-select" id="inputGroupSelect01" v-model="HabitForm.tags">
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="School">School</option>
                  <option value="Home">Home</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>&nbsp;</div>

              <div class="form-buttons">
                <button type="submit" class="btn btn-primary">Confirm</button>
                <button type="button" class="btn btn-danger" @click="cancelHabitForm">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div class="card brown-card">
            <div
              v-for="h in habits"
              :key="h.title"
              class="card2 d-flex align-items-center justify-content-between"
            >
              <div class="habit-controls d-flex align-items-center">
                <!-- Minus Button -->
                <button
                  class="btn btn-outline-danger btn-circle"
                  @click="decreaseCount(h)"
                  :disabled="h.count <= 0"
                >
                  <i>-</i>
                </button>

                <!-- Habit Content -->
                <div class="habit-content mx-3">
                  <h5 class="cardtext">{{ h.title }}</h5>
                  <p class="cardtext">{{ h.description }}</p>
                  <small class="cardtext"
                    ><strong class="cardtext">Tag:</strong> {{ h.tags }}</small
                  >
                  <div style="color: black">
                    <strong class="cardtext">Count:</strong>{{ h.count }}
                  </div>
                </div>

                <!-- Plus Button -->
                <button class="btn btn-outline-success btn-circle" @click="increaseCount(h)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <!-- Delete Habit Button -->
              <button class="btn btn-danger btn-sm" @click="markAsDoneh(h)">Delete Habit</button>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3 card-section">
          <h4>Long Term Tasks <i class="fas fa-plus plus-icon" @click="showLTForm = true"></i></h4>

          <div v-if="showLTForm" class="form-container card2">
            <form @submit.prevent="submitLT">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Title</span>
                <input
                  type="text"
                  class="form-control"
                  v-model="LTForm.title"
                  placeholder="Enter title"
                  aria-label="Title"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div class="form-floating">
                <textarea
                  v-model="LTForm.description"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style="height: 100px"
                  required
                ></textarea>
                <label for="floatingTextarea2">Enter Description</label>
              </div>
              <div>&nbsp;</div>

              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupSelect01">Category</label>
                <select class="form-select" id="inputGroupSelect01" v-model="LTForm.tags">
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="School">School</option>
                  <option value="Home">Home</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <input v-model="LTForm.duedate" type="date" id="duedate" name="duedate" />

              <div>&nbsp;</div>

              <div class="form-buttons">
                <button type="submit" class="btn btn-primary">Confirm</button>
                <button type="button" class="btn btn-danger" @click="cancelLTForm">Cancel</button>
              </div>
            </form>
          </div>

          <div class="card brown-card">
            <div v-for="lt in longTermTasks" :key="lt.title" class="card2">
              <h5 class="cardtext">{{ lt.title }}</h5>
              <p class="cardtext">{{ lt.description }}</p>
              <small class="cardtext"><strong class="cardtext">Tag:</strong> {{ lt.tags }}</small>
              <div>
                <small class="cardtext"
                  ><strong class="cardtext">Due:</strong> {{ lt.duedate }}</small
                >
              </div>
              <div>
                <button class="btn btn-success btn-sm" @click="markAsDonelt(lt)">
                  Mark as Done
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3 card-section">
          <h4>
            Daily To-Dos
            <i class="fas fa-plus plus-icon" @click="showToDoForm = true"></i>
          </h4>

          <div v-if="showToDoForm" class="form-container card2">
            <form @submit.prevent="submitToDo">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Title</span>
                <input
                  type="text"
                  class="form-control"
                  v-model="todoForm.title"
                  placeholder="Enter title"
                  aria-label="Title"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div class="form-floating">
                <textarea
                  v-model="todoForm.description"
                  class="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style="height: 100px"
                  required
                ></textarea>
                <label for="floatingTextarea2">Enter Description</label>
              </div>
              <div>&nbsp;</div>

              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupSelect01">Category</label>
                <select class="form-select" id="inputGroupSelect01" v-model="todoForm.tags">
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="School">School</option>
                  <option value="Home">Home</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div class="form-buttons">
                <button type="submit" class="btn btn-primary">Confirm</button>
                <button type="button" class="btn btn-danger" @click="cancelForm">Cancel</button>
              </div>
            </form>
          </div>
          <div class="card brown-card">
            <div v-for="todo in todos" :key="todo.title" class="card2">
              <h5 class="cardtext">{{ todo.title }}</h5>
              <p class="cardtext">{{ todo.description }}</p>
              <small class="cardtext"><strong class="cardtext">Tag:</strong> {{ todo.tags }}</small>
              <div>
                <button class="btn btn-success btn-sm" @click="markAsDone(todo)">
                  Mark as Done
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-md-3 card-section">
          <h4>Calendar</h4>
          <div class="calendar">
            <div class="week-row">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span
              ><span>S</span>
            </div>
            <div class="week-row">
              <span class="circle"></span><span class="circle"></span><span class="circle"></span>
              <span class="circle"></span><span class="circle"></span><span class="circle"></span
              ><span class="circle"></span>
            </div>
            <div class="week-row">
              <span class="circle"></span><span class="circle"></span><span class="circle"></span>
              <span class="circle"></span><span class="circle"></span><span class="circle"></span
              ><span class="circle"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAuthenticated } from '../auth' // Adjust the path as needed
import { useRouter } from 'vue-router' // Import the useRouter function from Vue Router
import axios from 'axios'
import { toast } from 'vue3-toastify'
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue3-toastify/dist/index.css'

export default {
  name: 'Tasks',
  data() {
    return {
      habits: [],
      longTermTasks: [],
      todos: [],
      showToDoForm: false, // Track form visibility
      showLTForm: false,
      showHabitForm: false,
      HabitForm: {
        title: '',
        description: '',
        count: 0,
        tags: 'Work'
      },
      LTForm: {
        title: '',
        description: '',
        duedate: Date(),
        tags: 'Work'
      },
      todoForm: {
        title: '',
        description: '',
        tags: 'Work'
      }
    }
  },
  methods: {
    increaseCount(h) {
      toast('testing', {
        autoClose: 1000
      })
      h.count++ // Increase count locally

      // Send Axios request to update the count in the backend
      axios
        .put('http://localhost:8000/api/habits/' + h._id, {
          count: h.count
        })
        .then((response) => {
          console.log('Count increased:', response.data)
        })
        .catch((error) => {
          console.error('Error increasing count:', error)
          h.count-- // Revert the count if the request fails
        })
    },
    decreaseCount(h) {
      if (h.count > 0) {
        h.count-- // Decrease count locally

        // Send Axios request to update the count in the backend
        axios
          .put('http://localhost:8000/api/habits/' + h._id, {
            count: h.count
          })
          .then((response) => {
            console.log('Count decreased:', response.data)
          })
          .catch((error) => {
            console.error('Error decreasing count:', error)
            h.count++ // Revert the count if the request fails
          })
      }
    },

    //methods for habits

    fetchHabits() {
      const username = localStorage.getItem('username') || 'anonymous' // Get the current user's username from localStorage

      // Axios request to fetch todos for the current user
      axios
        .get(`http://localhost:8000/api/user_habits`, {
          params: {
            username: username
          }
        })
        .then((response) => {
          this.habits = response.data // Assign the response data (todos) to this.todos
        })
        .catch((error) => {
          console.error('Error fetching habits:', error)
        })
    },
    cancelHabitForm() {
      this.showHabitForm = false
      this.HabitForm = { title: '', description: '', tags: 'Work', count: 0 } // Reset form
    },
    submitHabit() {
      if (!this.HabitForm.title || !this.HabitForm.description) {
        alert('Please fill out all fields')
        return
      }

      // Add the new task to the list
      this.habits.push({ ...this.LTForm })

      axios
        .post('http://localhost:8000/api/habits', {
          title: this.HabitForm.title,
          description: this.HabitForm.description,
          tags: this.HabitForm.tags,
          count: this.HabitForm.count,
          username: localStorage.getItem('username') || 'anonymous'
        })
        .then((response) => {
          console.log('habit saved to database:', response.data)
          console.log(this.habits)
          window.location.reload()
          // Add the new to-do to the list
          // this.todos.push({
          //   title: this.todoForm.title,
          //   description: this.todoForm.description,
          //   tags: this.todoForm.tags
          // });

          // Reset and hide the form after successful submission
          this.cancelHabitForm()
        })
        .catch((error) => {
          console.error('Error saving Habit:', error)
        })

      // Hide the form and reset
      this.cancelHabitForm()
    },
    markAsDoneh(h) {
      const username = localStorage.getItem('username') || 'anonymous'

      // Send a DELETE request to the server to remove the todo from the database
      axios
        .delete('http://localhost:8000/api/user_habits', {
          params: {
            username: username,
            title: h.title,
            id: h._id // Pass the unique id for the todo
          }
        })
        .then((response) => {
          console.log('habit deleted from database:', response.data)
          // Remove the todo from the local array
          this.habits = this.habits.filter((t) => t !== h)
        })
        .catch((error) => {
          console.error('Error deleting habit', error)
        })
    },

    //methods for longterm tasks

    fetchLTs() {
      const username = localStorage.getItem('username') || 'anonymous' // Get the current user's username from localStorage

      // Axios request to fetch todos for the current user
      axios
        .get(`http://localhost:8000/api/user_lts`, {
          params: {
            username: username
          }
        })
        .then((response) => {
          this.longTermTasks = response.data // Assign the response data (todos) to this.todos
        })
        .catch((error) => {
          console.error('Error fetching long terms:', error)
        })
    },
    cancelLTForm() {
      this.showLTForm = false
      this.LTForm = { title: '', description: '', tags: 'Work' } // Reset form
    },
    submitLT() {
      if (!this.LTForm.title || !this.LTForm.description) {
        alert('Please fill out all fields')
        return
      }

      // Add the new task to the list
      this.longTermTasks.push({ ...this.LTForm })

      axios
        .post('http://localhost:8000/api/lts', {
          title: this.LTForm.title,
          description: this.LTForm.description,
          tags: this.LTForm.tags,
          duedate: this.LTForm.duedate,
          username: localStorage.getItem('username') || 'anonymous'
        })
        .then((response) => {
          console.log('Long Term saved to database:', response.data)
          console.log(this.longTermTasks)
          window.location.reload()
          // Add the new to-do to the list
          // this.todos.push({
          //   title: this.todoForm.title,
          //   description: this.todoForm.description,
          //   tags: this.todoForm.tags
          // });

          // Reset and hide the form after successful submission
          this.cancelLTForm()
        })
        .catch((error) => {
          console.error('Error saving Long Term:', error)
        })

      // Hide the form and reset
      this.cancelLTForm()
    },
    markAsDonelt(lt) {
      const username = localStorage.getItem('username') || 'anonymous'

      // Send a DELETE request to the server to remove the todo from the database
      axios
        .delete('http://localhost:8000/api/user_lts', {
          params: {
            username: username,
            title: lt.title,
            id: lt._id // Pass the unique id for the todo
          }
        })
        .then((response) => {
          console.log('Long Term deleted from database:', response.data)
          // Remove the todo from the local array
          this.longTermTasks = this.longTermTasks.filter((t) => t !== lt)
        })
        .catch((error) => {
          console.error('Error deleting LongTerm:', error)
        })
    },

    //todos methods

    fetchTodos() {
      const username = localStorage.getItem('username') || 'anonymous' // Get the current user's username from localStorage

      // Axios request to fetch todos for the current user
      axios
        .get(`http://localhost:8000/api/user_todos`, {
          params: {
            username: username
          }
        })
        .then((response) => {
          this.todos = response.data // Assign the response data (todos) to this.todos
        })
        .catch((error) => {
          console.error('Error fetching todos:', error)
        })
    },
    cancelForm() {
      this.showToDoForm = false
      this.todoForm = { title: '', description: '', tags: 'Work' } // Reset form
    },
    submitToDo() {
      if (!this.todoForm.title || !this.todoForm.description) {
        alert('Please fill out all fields')
        return
      }

      // Add the new task to the list
      this.todos.push({ ...this.todoForm })

      // Optionally, you can send the data to your API via Axios here
      axios
        .post('http://localhost:8000/api/todos', {
          title: this.todoForm.title,
          description: this.todoForm.description,
          tags: this.todoForm.tags,
          username: localStorage.getItem('username') || 'anonymous'
        })
        .then((response) => {
          console.log('To-Do saved to database:', response.data)
          console.log(this.todos)
          window.location.reload()
          // Add the new to-do to the list
          // this.todos.push({
          //   title: this.todoForm.title,
          //   description: this.todoForm.description,
          //   tags: this.todoForm.tags
          // });

          // Reset and hide the form after successful submission
          this.cancelForm()
        })
        .catch((error) => {
          console.error('Error saving To-Do:', error)
        })

      // Hide the form and reset
      this.cancelForm()
    },
    markAsDone(todo) {
      const username = localStorage.getItem('username') || 'anonymous'

      // Send a DELETE request to the server to remove the todo from the database
      axios
        .delete('http://localhost:8000/api/user_todos', {
          params: {
            username: username,
            title: todo.title,
            id: todo._id // Pass the unique id for the todo
          }
        })
        .then((response) => {
          console.log('To-Do deleted from database:', response.data)
          // Remove the todo from the local array
          this.todos = this.todos.filter((t) => t !== todo)
        })
        .catch((error) => {
          console.error('Error deleting todo:', error)
        })
    }
  },
  mounted() {
    this.fetchTodos() // Fetch todos when the component is mounted
    this.fetchLTs()
    this.fetchHabits()
  },
  setup() {
    const router = useRouter()
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      console.log('Logged in user:', localStorage.getItem('username')) // Log the username
    }
  }
}
</script>

<style scoped>
/* Add your scoped styles here */
.tasks-container {
  font-family: 'Jersey 25', sans-serif;
}
.header {
  background-image: url('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHRnampnZGl0eDNybjJmNmU4MWUyY3BnMGhkMzFsaW5oMndsZ3czeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zgzISaYrnMAYRJJEr/giphy.gif');
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-img {
  width: 100px;
  height: auto;
  margin-right: 10px;
}

.dashboard-container {
  background-color: white;
  height: 200px;
  border-radius: 25px;
}

.dashboard-title h3 {
  font-weight: bold;
  margin: 20px;
}

.progress {
  width: 200px;
  height: 10px;
  background-color: #d3d3d3;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  background-color: #6a0dad;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-top: 5px;
}

.streak-info strong {
  font-size: 24px;
}

.main-content {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.card {
  width: 100%;
  background-color: #d2691e;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  color: white;
}

.card2 {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  color: white;
}

.cardtext {
  color: black;
}

.card-section h4 {
  text-align: left;
  margin-bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plus-icon {
  font-size: 20px;
  color: black;
  cursor: pointer;
}

.plus-icon:hover {
  color: grey;
}

.calendar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.week-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.week-row span {
  font-size: 18px;
}

.circle {
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
}

.bg-purple {
  background-color: #6a0dad !important;
}

.habit-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.habit-content {
  flex-grow: 1;
}

/* Responsive styling */
@media (max-width: 576px) {
  .main-content {
    flex-direction: column;
  }
}
</style>
