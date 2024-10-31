<template>
  <div>
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
        <div class="col-3 ms-auto d-flex justify-content-end">
          <div class="d-flex align-items-center">
  <h4 class="m-0 text-white">{{ userPoints }} &nbsp;</h4>
  <img width="18px" src="../assets/shop/coin.gif" alt="coins icon" />
</div>
  </div>
      </div>

      <div class="row main-content">
        <div class="col-12 col-lg-3 card-section">
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
  <div v-for="h in habits" :key="h.title" class="card2 p-3" style="overflow:hidden;">
    <div class="habit-controls d-flex align-items-center justify-content-between">
      <!-- Minus Button -->
      <button
        class="btn btn-outline-danger btn-circle"
        @click="decreaseCount(h)"
        :disabled="h.count <= 0"
        style="min-width: 40px; max-width: 50px; flex-shrink: 0;"
      >
        <i>-</i>
      </button>

      <!-- Habit Content -->
      <div class="habit-content mx-3" style="flex-grow: 1; word-wrap: break-word; text-align: center;">
        <h5 class="cardtext">{{ h.title }}</h5>
        <p class="cardtext">{{ h.description }}</p>
        <small class="cardtext"><strong class="cardtext">Tag:</strong> {{ h.tags }}</small>
        <div style="color: black">
          <strong class="cardtext">Count:</strong> {{ h.count }}
        </div>
      </div>

      <!-- Plus Button (positioned on the right side) -->
      <button
        class="btn btn-outline-success btn-circle"
        @click="increaseCount(h)"
        style="min-width: 40px; max-width: 50px; flex-shrink: 0;"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Delete Habit Button -->
    <button class="btn btn-danger btn-sm mt-3 w-100" @click="markAsDoneh(h)">
      Delete Habit
    </button>
  </div>
</div>


        </div>

        <div class="col-12 col-lg-3 card-section">
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
              <small class="cardtext">
                <strong class="cardtext">Due:</strong> 
                {{ new Date(lt.duedate).toLocaleDateString('en-GB') }}
              </small>
              </div>
              <div>
                <button class="btn btn-success btn-sm" @click="markAsDonelt(lt)">
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

        <div class="col-12 col-lg-3 card-section">
          <Shop
              :userPoints="userPoints"
              @points-updated="updateUserPoints"
            />
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
import Shop from './Shop.vue'

export default {
  name: 'Tasks',
  components: {
    Shop
  },
  data() {
    return {
      userPoints: 0,
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
    fetchUserPoints() {
      const username = localStorage.getItem('username') || 'anonymous';
      
      // Fetch the user's current points from the backend
      axios.get(`http://localhost:8000/api/users/${username}/points`)
        .then(response => {
          this.userPoints = response.data.points; 
        })
        .catch(error => {
          console.error('Error fetching points:', error);
        });
    },
    updateUserPoints(pointsChange) {
      this.userPoints += pointsChange;
    },
    buyItem() {
    const username = localStorage.getItem('username') || 'anonymous';

    const totalCost = this.selectedItem.itemcost * this.itemqty;
    

    axios.put(`http://localhost:8000/api/users/${username}/deduct-points`, {
      pointsToDeduct: totalCost 
    })
    .then(response => {
      console.log('Points deducted successfully');
      this.userPoints -= totalCost; 
      this.updateInventory(username);

      if (this.selectedItem.itemname === "Regular Fish"){
        this.regularFishQty += this.itemqty;
      }

      // Check if the itemname doesn't include the word "Fish" (items other than fish can only be bought once...)
      if (!this.selectedItem.itemname.includes('Fish')) {
        // Remove the item from the shopitems array
        this.shopitems = this.shopitems.filter(item => item.itemname !== this.selectedItem.itemname);
      }
      this.closeModal(); 
      
      toast(`${this.itemqty} x ${this.selectedItem.itemname} was added to your Inventory!`, {
        icon: '🚀',
        autoClose: 1000
      });
    })
    .catch(error => {
      console.error('Error deducting points:', error);
    });
  },
  
  updateInventory(username) {
    axios.post('http://localhost:8000/api/inventory/add', {
      username: username,
      itemname: this.selectedItem.itemname,
      itemdesc: this.selectedItem.itemdesc,
      itemqty: this.itemqty,
      imgpath: this.selectedItem.imgpath
    })
    .then(response => {
      console.log('Inventory updated successfully:', response.data);
    })
    .catch(error => {
      console.error('Error updating inventory:', error);
    });
  },
    increaseQty() {
          this.itemqty++;
        },
        decreaseQty() {
          if (this.itemqty > 0) {
            this.itemqty--;
          }},
    openModal(item) {
      this.selectedItem=item;
      this.isModalOpen = true;
      this.itemqty = 1;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    increaseCount(h) {
  // Display toast notification
  toast('You gained 5 coins!', {
    icon: '🚀',
    autoClose: 1000
  });

  h.count++; // Increase count locally

  // Send Axios request to update the habit count in the backend
  axios
    .put('http://localhost:8000/api/habits/' + h._id, {
      count: h.count
    })
    .then((response) => {
      console.log('Count increased:', response.data);

      const username = localStorage.getItem('username') || 'anonymous'; // Get current user's username

      // Send Axios request to add 5 points to the user's account
      axios
        .put('http://localhost:8000/api/users/' + username + '/points', {
          pointsToAdd: 5 // Add 5 points
        })
        .then((res) => {
          console.log('Points added:', res.data);
          this.userPoints +=5;


          // Now send another Axios request to increment habitCompleted in the user schema
          axios
            .put('http://localhost:8000/api/users/' + username + '/habitCompleted', {
              incrementBy: 1 // Increment the habitCompleted by 1
            })
            .then((res) => {
              console.log('Habit completed count incremented:', res.data);
            })
            .catch((err) => {
              console.error('Error incrementing habitCompleted:', err);
            });
        })
        .catch((err) => {
          console.error('Error adding points:', err);
        });
    })
    .catch((error) => {
      console.error('Error increasing count:', error);
      h.count--; // Revert the count if the request fails
    });
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
      toast('You gained 10 coins!', {
        icon: '🚀',
        autoClose: 1000
      })
      axios
        .put('http://localhost:8000/api/users/' + username + '/points', {
          pointsToAdd: 10 // Add 5 points
        })
        .then((res) => {
          console.log('Points added:', res.data)
          this.userPoints +=10;
        })
        .catch((err) => {
          console.error('Error adding points:', err)
        })

        // Now send another Axios request to increment longtermcompleted
        axios
            .put('http://localhost:8000/api/users/' + username + '/longtermcompleted', {
              incrementBy: 1 // Increment the longtermcompleted by 1
            })
            .then((res) => {
              console.log('Habit completed count incremented:', res.data);
            })
            .catch((err) => {
              console.error('Error incrementing habitCompleted:', err);
            });

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

    //fetch points from user

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
      toast('You gained 10 coins!', {
        icon: '🚀',
        autoClose: 1000
      })
        // Now send another Axios request to increment todocompleted
        axios
            .put('http://localhost:8000/api/users/' + username + '/todocompleted', {
              incrementBy: 1 // Increment the longtermcompleted by 1
            })
            .then((res) => {
              console.log('todo completed count incremented:', res.data);
            })
            .catch((err) => {
              console.error('Error incrementing todocompleted:', err);
            });
      axios
        .put('http://localhost:8000/api/users/' + username + '/points', {
          pointsToAdd: 10 // Add 5 points
        })
        .then((res) => {
          console.log('Points added:', res.data)
          this.userPoints +=10;
        })
        .catch((err) => {
          console.error('Error adding points:', err)
        })

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
    const username = localStorage.getItem('username') || 'anonymous';
    
    // Fetch the user's inventory when the component is mounted
    axios.get(`http://localhost:8000/api/userinventory/${username}`)
      .then(response => {
        const inventory = response.data;

        // Check if the user has any of the room items in their inventory
        const roomItems = ["TempRoom1", "TempRoom2", "TempRoom3"];
        inventory.forEach(item => {
          if (roomItems.includes(item.itemname)) {
            // Remove the room items from the shopitems list
            this.shopitems = this.shopitems.filter(shopItem => shopItem.itemname !== item.itemname);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching user inventory:', error);
      });
    this.fetchTodos() // Fetch todos when the component is mounted
    this.fetchLTs()
    this.fetchHabits()
    this.fetchUserPoints();
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

.coins-container {
  background-color: white;
  border-radius: 10px;
  padding: 5px 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.coins-container p {
  margin: 0;
  color: #333;
  font-weight: bold;
  margin-left: 8px;
}

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
  background-color:  #fff3e7;
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

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }


/* Responsive styling */
@media (max-width: 576px) {
  .main-content {
    flex-direction: column;
  }
}
</style>
