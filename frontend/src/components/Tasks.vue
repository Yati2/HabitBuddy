<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

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
          style="height: 50px; width: auto;"
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
      <h4>Habits <i class="fas fa-plus plus-icon"></i></h4>
      <div class="card"></div>
    </div>
    <div class="col-12 col-sm-6 col-md-3 card-section">
      <h4>Long Term Tasks <i class="fas fa-plus plus-icon"></i></h4>
      <div class="card"></div>
    </div>
    <div class="col-12 col-sm-6 col-md-3 card-section">
      <h4>Daily To-Dos <i class="fas fa-plus plus-icon"></i></h4>
      <div class="card brown-card"></div>
    </div>

    <div class="col-12 col-sm-6 col-md-3 card-section">
      <h4>Calendar</h4>
      <div class="calendar">
        <div class="week-row">
          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
        </div>
        <div class="week-row">
          <span class="circle"></span><span class="circle"></span><span class="circle"></span>
          <span class="circle"></span><span class="circle"></span><span class="circle"></span><span class="circle"></span>
        </div>
        <div class="week-row">
          <span class="circle"></span><span class="circle"></span><span class="circle"></span>
          <span class="circle"></span><span class="circle"></span><span class="circle"></span><span class="circle"></span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { isAuthenticated } from '../auth'; // Adjust the path as needed
import { useRouter } from 'vue-router'; // Import the useRouter function from Vue Router
import axios from 'axios';

export default {
name: 'Tasks',
data() {
return {
  habits: [],
  longTermTasks: [],
  todos: []
};
},
setup() {
const router = useRouter();

if (!isAuthenticated()) {
  router.push('/login');
} else {
  console.log("Logged in user:", localStorage.getItem('username')); // Log the username
}
},

};



</script>

<style scoped>
/* Add any additional styles here if needed */
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
background-color: #6A0DAD;
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
background-color: #D2691E;
border-radius: 10px;
padding: 15px;
margin-bottom: 10px;
color: white;
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
background-color: #6A0DAD !important;
}

/* Responsive styling */
@media (max-width: 576px) {
.main-content {
flex-direction: column;
}
}
</style>

