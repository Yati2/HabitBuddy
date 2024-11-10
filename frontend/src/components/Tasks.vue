<template>
  <div>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
    <link
      href="https://unpkg.com/gijgo@1.9.14/css/gijgo.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <LoadingOverlay :isLoading="isLoading" />
    <div v-if="!isLoading" class="tasks-container">
      <div class="container-fluid">
        <div class="row header">
          <div class="col-2">
            <div class="d-flex align-items-center">
              <img
                v-bind:src="selectedCat"
                alt="cat"
                class="cat-img"
                @click="goToPetPage"
                style="height: 150px; width: auto; position: absolute"
              />
            </div>
          </div>
          <div class="col-3 ms-auto d-flex justify-content-end">
            <div class="d-flex align-items-center">
              <h4 class="m-0 text-white">{{ userPoints }} &nbsp;</h4>
              <img width="18px" class="coin" src="/assets/shop/coin.gif" alt="coins icon" />
            </div>
          </div>
        </div>

        <div class="row main-content">
          <div class="col-12 col-lg-3 card-section">
            <h4>Habits <i class="fas fa-plus plus-icon" @click="showHabitForm = true"></i></h4>

            <div v-if="showHabitForm" class="form-container cardform">
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
                  <button type="submit" class="btn btn-custom">Confirm</button>
                  <button type="button" class="btn btn-custom" @click="cancelHabitForm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div class="card brown-card">
              <div v-for="h in habits" :key="h.title" class="card2 p-3" style="overflow: hidden">
                <div class="habit-controls d-flex align-items-center justify-content-between">
                  <!-- Minus Button -->
                  <button
                    class="btn btn-outline-danger btn-circle"
                    @click="decreaseCount(h)"
                    :disabled="h.count <= 0"
                    style="min-width: 40px; max-width: 50px; flex-shrink: 0"
                  >
                    <i>-</i>
                  </button>

                  <!-- Habit Content -->
                  <div
                    class="habit-content mx-3"
                    style="flex-grow: 1; word-wrap: break-word; text-align: center"
                  >
                    <h5 class="cardtext">{{ h.title }}</h5>
                    <p class="cardtext">{{ h.description }}</p>
                    <small class="cardtext"
                      ><strong class="cardtext">Tag:</strong> {{ h.tags }}</small
                    >
                    <div style="color: black">
                      <strong class="cardtext">Count:</strong> {{ h.count }}
                    </div>
                  </div>
                  <!-- Plus Button -->
                  <button
                    class="btn btn-outline-success btn-circle"
                    @click="increaseCount(h)"
                    style="min-width: 40px; max-width: 50px; flex-shrink: 0"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>

                <!-- Delete Habit Button -->
                <button class="btn btn-custom btn-sm mt-3 w-100" @click="markAsDoneh(h)">
                  Delete Habit
                </button>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-3 card-section">
            <h4>
              Long Term Tasks <i class="fas fa-plus plus-icon" @click="showLTForm = true"></i>
            </h4>

            <div v-if="showLTForm" class="form-container cardform">
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
                  <button type="submit" class="btn btn-custom">Confirm</button>
                  <button type="button" class="btn btn-custom" @click="cancelLTForm">Cancel</button>
                </div>
              </form>
            </div>

            <div class="card brown-card">
              <div v-for="lt in longTermTasks" :key="lt.title" class="card2">
                <h5 class="cardtext">{{ lt.title }}</h5>
                <p class="cardtext">{{ lt.description }}</p>
                <small class="cardtext"><strong class="cardtext">Tag:</strong> {{ lt.tags }}</small>
                <div>
                  <small class="cardtext">
                    <strong class="cardtext">Due:</strong>
                    {{ new Date(lt.duedate).toLocaleDateString('en-GB') }}
                  </small>
                </div>
                <div>
                  <button class="btn btn-custom btn-sm" @click="markAsDonelt(lt)">
                    Mark as Done
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-3 card-section">
            <h4>
              Daily To-Dos
              <i class="fas fa-plus plus-icon" @click="showToDoForm = true"></i>
            </h4>

            <div v-if="showToDoForm" class="form-container cardform">
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
                  <button type="submit" class="btn btn-custom">Confirm</button>
                  <button type="button" class="btn btn-custom" @click="cancelForm">Cancel</button>
                </div>
              </form>
            </div>
            <div class="card brown-card">
              <div v-for="todo in todos" :key="todo.title" class="card2">
                <h5 class="cardtext">{{ todo.title }}</h5>
                <p class="cardtext">{{ todo.description }}</p>
                <small class="cardtext"
                  ><strong class="cardtext">Tag:</strong> {{ todo.tags }}</small
                >
                <div>
                  <button class="btn btn-custom btn-sm" @click="markAsDone(todo)">
                    Mark as Done
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-3 card-section">
            <Shop :userPoints="userPoints" @points-updated="updateUserPoints" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAuthenticated } from '../auth'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import LoadingOverlay from './LoadingOverlay.vue'
import 'vue3-toastify/dist/index.css'
import Shop from './Shop.vue'

export default {
  name: 'Tasks',
  components: {
    Shop,
    LoadingOverlay
  },
  data() {
    return {
      isLoading: true,
      selectedCat: 'assets/pet_related/orange/orange.gif',
      userPoints: 0,
      habits: [],
      longTermTasks: [],
      todos: [],
      showToDoForm: false,
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
    goToPetPage() {
      this.$router.push('/pet')
    },
    fetchUserPoints() {
      const username = localStorage.getItem('username') || 'anonymous'

      // Fetch the user's current points from the backend
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${username}/points`)
        .then((response) => {
          this.userPoints = response.data.points
        })
        .catch((error) => {
          console.error('Error fetching points:', error)
        })
    },
    updateUserPoints(pointsChange) {
      this.userPoints += pointsChange
    },
    buyItem() {
      const username = localStorage.getItem('username') || 'anonymous'

      const totalCost = this.selectedItem.itemcost * this.itemqty

      axios
        .put(`https://habit-buddy-server.vercel.app/api/users/${username}/deduct-points`, {
          pointsToDeduct: totalCost
        })
        .then((response) => {
          console.log('Points deducted successfully')
          this.userPoints -= totalCost
          this.updateInventory(username)

          if (this.selectedItem.itemname === 'Regular Fish') {
            this.regularFishQty += this.itemqty
          }

          // Check if the itemname doesn't include the word "Fish" (items other than fish can only be bought once...)
          if (!this.selectedItem.itemname.includes('Fish')) {
            // Remove the item from the shopitems array
            this.shopitems = this.shopitems.filter(
              (item) => item.itemname !== this.selectedItem.itemname
            )
          }
          this.closeModal()

          toast(`${this.itemqty} x ${this.selectedItem.itemname} was added to your Inventory!`, {
            icon: '🚀',
            autoClose: 1000
          })
        })
        .catch((error) => {
          console.error('Error deducting points:', error)
        })
    },

    updateInventory(username) {
      axios
        .post('https://habit-buddy-server.vercel.app/api/inventory/add', {
          username: username,
          itemname: this.selectedItem.itemname,
          itemdesc: this.selectedItem.itemdesc,
          itemqty: this.itemqty,
          imgpath: this.selectedItem.imgpath
        })
        .then((response) => {
          console.log('Inventory updated successfully:', response.data)
        })
        .catch((error) => {
          console.error('Error updating inventory:', error)
        })
    },
    increaseQty() {
      this.itemqty++
    },
    decreaseQty() {
      if (this.itemqty > 0) {
        this.itemqty--
      }
    },
    openModal(item) {
      this.selectedItem = item
      this.isModalOpen = true
      this.itemqty = 1
    },
    closeModal() {
      this.isModalOpen = false
    },
    increaseCount(h) {
      // Display toast notification
      toast('You gained 5 coins!', {
        icon: '🚀',
        autoClose: 1000
      })

      h.count++ // Increase count locally

      // axios to update habit count
      axios
        .put('https://habit-buddy-server.vercel.app/api/habits/' + h._id, {
          count: h.count
        })
        .then((response) => {
          console.log('Count increased:', response.data)

          const username = localStorage.getItem('username') || 'anonymous'

          axios
            .put('https://habit-buddy-server.vercel.app/api/users/' + username + '/points', {
              pointsToAdd: 5
            })
            .then((res) => {
              console.log('Points added:', res.data)
              this.userPoints += 5

              // axios to increment habitCompleted in the user schema
              axios
                .put(
                  'https://habit-buddy-server.vercel.app/api/users/' + username + '/habitCompleted',
                  {
                    incrementBy: 1 // Increment the habitCompleted by 1
                  }
                )
                .then((res) => {
                  console.log('Habit completed count incremented:', res.data)
                })
                .catch((err) => {
                  console.error('Error incrementing habitCompleted:', err)
                })
            })
            .catch((err) => {
              console.error('Error adding points:', err)
            })
        })
        .catch((error) => {
          console.error('Error increasing count:', error)
          h.count-- // Revert the count if the request fails
        })
    },
    decreaseCount(h) {
      if (h.count > 0) {
        h.count-- // Decrease count locally

        // Send Axios request to update the count
        axios
          .put('https://habit-buddy-server.vercel.app/api/habits/' + h._id, {
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
      this.isLoading = true
      try {
        const username = localStorage.getItem('username') || 'anonymous'

        // Axios request to fetch todos for the current user
        axios
          .get(`https://habit-buddy-server.vercel.app/api/user_habits`, {
            params: {
              username: username
            }
          })
          .then((response) => {
            this.habits = response.data
          })
          .catch((error) => {
            console.error('Error fetching habits:', error)
          })
      } catch (error) {
        console.error('Error fetching habits:', error)
      }
    },
    cancelHabitForm() {
      this.showHabitForm = false
      this.HabitForm = { title: '', description: '', tags: 'Work', count: 0 }
    },
    submitHabit() {
      if (!this.HabitForm.title || !this.HabitForm.description) {
        alert('Please fill out all fields')
        return
      }

      // Add the new task to the local list
      this.habits.push({ ...this.LTForm })

      axios
        .post('https://habit-buddy-server.vercel.app/api/habits', {
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
          this.cancelHabitForm()
        })
        .catch((error) => {
          console.error('Error saving Habit:', error)
        })
      this.cancelHabitForm()
    },
    markAsDoneh(h) {
      const username = localStorage.getItem('username') || 'anonymous'

      // Delete the todo from the database
      axios
        .delete('https://habit-buddy-server.vercel.app/api/user_habits', {
          params: {
            username: username,
            title: h.title,
            id: h._id
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
      this.isLoading = true
      try {
        const username = localStorage.getItem('username') || 'anonymous'

        axios
          .get(`https://habit-buddy-server.vercel.app/api/user_lts`, {
            params: {
              username: username
            }
          })
          .then((response) => {
            this.longTermTasks = response.data
          })
          .catch((error) => {
            console.error('Error fetching long terms:', error)
          })
      } catch (error) {
        console.log('Error fetching long terms:', error)
      }
    },
    cancelLTForm() {
      this.showLTForm = false
      this.LTForm = { title: '', description: '', tags: 'Work' }
    },
    submitLT() {
      if (!this.LTForm.title || !this.LTForm.description) {
        alert('Please fill out all fields')
        return
      }

      // Add the new task to the local list
      this.longTermTasks.push({ ...this.LTForm })

      axios
        .post('https://habit-buddy-server.vercel.app/api/lts', {
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
          this.cancelLTForm()
        })
        .catch((error) => {
          console.error('Error saving Long Term:', error)
        })
      this.cancelLTForm()
    },
    markAsDonelt(lt) {
      const username = localStorage.getItem('username') || 'anonymous'
      toast('You gained 10 coins!', {
        icon: '🚀',
        autoClose: 1000
      })
      axios
        .put('https://habit-buddy-server.vercel.app/api/users/' + username + '/points', {
          pointsToAdd: 10
        })
        .then((res) => {
          console.log('Points added:', res.data)
          this.userPoints += 10
        })
        .catch((err) => {
          console.error('Error adding points:', err)
        })

      //Axios request to increment longtermcompleted
      axios
        .put('https://habit-buddy-server.vercel.app/api/users/' + username + '/longtermcompleted', {
          incrementBy: 1
        })
        .then((res) => {
          console.log('Habit completed count incremented:', res.data)
        })
        .catch((err) => {
          console.error('Error incrementing habitCompleted:', err)
        })

      // delete the todo from the database
      axios
        .delete('https://habit-buddy-server.vercel.app/api/user_lts', {
          params: {
            username: username,
            title: lt.title,
            id: lt._id
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

    //fetch points from user

    //todos methods

    fetchTodos() {
      this.isLoading = true
      const username = localStorage.getItem('username') || 'anonymous'

      // Axios request to fetch todos for the current user
      axios
        .get(`https://habit-buddy-server.vercel.app/api/user_todos`, {
          params: {
            username: username
          }
        })
        .then((response) => {
          this.todos = response.data
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

      // post request axios for todo
      axios
        .post('https://habit-buddy-server.vercel.app/api/todos', {
          title: this.todoForm.title,
          description: this.todoForm.description,
          tags: this.todoForm.tags,
          username: localStorage.getItem('username') || 'anonymous'
        })
        .then((response) => {
          console.log('To-Do saved to database:', response.data)
          console.log(this.todos)
          window.location.reload()
          this.cancelForm()
        })
        .catch((error) => {
          console.error('Error saving To-Do:', error)
        })

      this.cancelForm()
    },
    markAsDone(todo) {
      const username = localStorage.getItem('username') || 'anonymous'
      toast('You gained 10 coins!', {
        icon: '🚀',
        autoClose: 1000
      })
      //Axios request to increment todocompleted
      axios
        .put('https://habit-buddy-server.vercel.app/api/users/' + username + '/todocompleted', {
          incrementBy: 1 // Increment the longtermcompleted by 1
        })
        .then((res) => {
          console.log('todo completed count incremented:', res.data)
        })
        .catch((err) => {
          console.error('Error incrementing todocompleted:', err)
        })
      axios
        .put('https://habit-buddy-server.vercel.app/api/users/' + username + '/points', {
          pointsToAdd: 10
        })
        .then((res) => {
          console.log('Points added:', res.data)
          this.userPoints += 10
        })
        .catch((err) => {
          console.error('Error adding points:', err)
        })

      // delete todo
      axios
        .delete('https://habit-buddy-server.vercel.app/api/user_todos', {
          params: {
            username: username,
            title: todo.title,
            id: todo._id
          }
        })
        .then((response) => {
          console.log('To-Do deleted from database:', response.data)
          // remove the todo from the local array
          this.todos = this.todos.filter((t) => t !== todo)
        })
        .catch((error) => {
          console.error('Error deleting todo:', error)
        })
    }
  },
  mounted() {
    this.isLoading = true
    try {
      const username = localStorage.getItem('username') || 'anonymous'

      axios
        .get(`https://habit-buddy-server.vercel.app/api/userinventory/${username}/selected-cat`)
        .then((response) => {
          this.selectedCat = response.data.imgpath || 'assets/pet_related/orange/orange.gif'
        })
        .catch((error) => {
          console.error('Error fetching selected cat image:', error)
        })
      this.fetchTodos() // Fetch todos when the component is mounted
      this.fetchLTs()
      this.fetchHabits()
      this.fetchUserPoints()
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      this.isLoading = false
    }
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
html,
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}

.tasks-container {
  font-family: 'Jersey 25', sans-serif;
  background-color: #fff3e7;
}
.header {
  background-image: url('https://i.pinimg.com/originals/80/ec/77/80ec77932091113c4970a88f69b9bb4f.gif');
  background-size: cover auto 100%;
  background-position: center bottom;
  background-repeat: repeat;
  padding: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
.header .d-flex {
  display: flex;
  align-items: center;
}

.header h4 {
  margin: 0;
}

.header img[alt='coins icon'] {
  margin-left: 5px;
  display: inline-block;
  vertical-align: middle;
}
.cat-img {
  width: 100px;
  height: auto;
  margin-right: 10px;
}

.main-content {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.card {
  width: 100%;
  background-color: #eec0c2;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  color: white;
}

.cardform {
  width: 100%;
  background-color: white;
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card2:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
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

.habit-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-buttons {
  display: flex;
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

.btn-custom {
  background-color: #eec0c2; /* Initial button color */
}

.btn-custom:hover {
  background-color: #e07e83; /* Hover button color */
}

.habit-content {
  flex-grow: 1;
}

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

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 5px;
  width: 100px;
  justify-content: space-between;
  background-color: wheat;
}

.quantity-selector button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  outline: none;
}

.quantity-selector input {
  width: 30px;
  text-align: center;
  border: none;
  font-size: 1.2rem;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

/* Responsive styling */
@media (max-width: 576px) {
  .main-content {
    flex-direction: column;
  }
}
@media (max-width: 586px) {
  .coin {
    padding-bottom: 25px;
  }
}
</style>
