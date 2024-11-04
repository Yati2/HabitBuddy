<template>
  <body>
    <div class="container-fluid">
    <div class="forum-container row">
      <div class="col-lg-8 col-12 mx-auto">
        <h1 class="forum-title">HabitBuddy Forum</h1>

        <!-- Navigation Bar for Topics -->
        <nav class="navbar navbar-expand-lg navbar-dark">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item" v-for="topic in topics" :key="topic">
              <a
                href="#"
                :class="{ 'active-topic': selectedTopic === topic }"
                class="nav-link"
                @click.prevent="selectTopic(topic)"
                >{{ capitalize(topic) }}</a
              >
            </li>
          </ul>
        </nav>

        <!-- Create New Post -->
        <div class="new-post-container shadow-box">
          <h3>Create a New Post</h3>
          <form @submit.prevent="submitPost">
            <div class="mb-3">
              <textarea
                v-model="newPostContent"
                class="form-control"
                rows="3"
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn w-100">Post</button>
          </form>
        </div>

        <!-- List of Forum Posts by Topic -->
        <div v-for="post in filteredPosts" :key="post._id" class="post-container shadow-box">
          <div class="post-header">
            <h4>{{ post.username }}</h4>
            <p class="post-content">{{ post.content }}</p>
          </div>

          <div class="post-actions">
            <button @click="likePost(post._id)" class="like-btn">👍 {{ post.likes }} Likes</button>
            <button @click="toggleComments(post._id)" class="comment-btn">💬 Comments</button>
            <button
              v-if="post.username === username"
              @click="deletePost(post._id)"
              class="delete-btn btn btn-sm btn-danger"
            >
              🗑️
            </button>
          </div>

          <!-- Comments Section -->
          <div v-if="post.showComments" class="comments-section">
            <div v-for="comment in post.comments" :key="comment._id" class="comment-container">
              <p><strong>{{ comment.username }}:</strong> {{ comment.comment }}</p>
            </div>
            <div class="add-comment">
              <textarea
                v-model="newCommentContent[post._id]"
                class="form-control"
                rows="2"
                placeholder="Add a comment..."
              ></textarea>
              <button @click="submitComment(post._id)" class="btn mt-2">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </body>
</template>


<script>
import axios from 'axios'
import { isAuthenticated } from '@/auth'

export default {
  data() {
    return {
      forumPosts: [],
      newPostContent: '',
      newCommentContent: {},
      selectedTopic: 'academics',
      username: '', 
      topics: ['academics', 'physical health', 'mental wellness'] // List of topics
    }
  },
  computed: {
    filteredPosts() {
      // Filter posts based on selected topic
      return this.forumPosts.filter((post) => post.topic === this.selectedTopic)
    }
  },
  methods: {
    async fetchPosts() {
      console.log('fetching posts')
      console.log(this.username)
      try {
        const response = await axios.get(
          `http://localhost:8000/api/posts?topic=${this.selectedTopic}`
        )
        this.forumPosts = response.data.map((post) => ({
          ...post,
          showComments: false
          // Toggle for showing/hiding comments
        }))
        console.log('Fetched posts:', this.forumPosts)
      } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message)
      }
    },
    async submitPost() {
      try {
        console.log('Selected topic during post submission:', this.selectedTopic)
        const newPost = {
          content: this.newPostContent,
          username: this.username, // Use the logged-in username
          likes: 0,
          comments: [],
          topic: this.selectedTopic
        }

        const response = await axios.post('http://localhost:8000/api/posts', newPost)
        this.forumPosts.unshift(response.data.post)
        this.newPostContent = ''
      } catch (error) {
        console.error(
          'Error submitting post:',
          error.response ? error.response.data : error.message
        )
      }
    },
    async deletePost(postId) {
      try {
        // Sending a DELETE request to the server to remove the post
        console.log(postId)
        await axios.delete(`http://localhost:8000/api/posts/${postId}`)

        // Removing the post from forumPosts in the frontend
        this.forumPosts = this.forumPosts.filter((post) => post._id !== postId)

        console.log(`Post with ID ${postId} deleted successfully.`)
      } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message)
      }
    },
    selectTopic(topic) {
      console.log('Selected topic:', topic)
      this.selectedTopic = topic // Change the current topic when user selects one
      this.fetchPosts()
    },
    async likePost(postId) {
      const post = this.forumPosts.find((p) => p._id === postId)
      post.likes += 1 // Update likes on the frontend
      try {
        await axios.post(`http://localhost:8000/api/posts/${postId}/like`)
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },
    toggleComments(postId) {
      const post = this.forumPosts.find((p) => p._id === postId)
      post.showComments = !post.showComments
    },
    async submitComment(postId) {
      const commentContent = this.newCommentContent[postId]
      if (commentContent) {
        const post = this.forumPosts.find((p) => p._id === postId)
        const newComment = {
          comment: commentContent,
          username: this.username // Use the logged-in username
        }
        post.comments.push(newComment)
        this.newCommentContent[postId] = '' // Reset comment input

        try {
          await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, newComment)
        } catch (error) {
          console.error('Error adding comment:', error)
        }
      }
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  mounted() {
    this.username = localStorage.getItem('username')
    console.log('Username:', this.username)
    this.fetchPosts() // Fetch posts when the component is mounted
  }
}
</script>

<style scoped>
/* General Styles */
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}
.forum-title {
  font-family: 'Jersey 25', sans-serif;
  font-size: 2.5rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  text-align: center;
  margin-bottom: 1rem;
}

.post-container,
.new-post-container {
  background: linear-gradient(to right, #f8f1ea, #fde8e2);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #f2c5c3;
  font-family: 'Jersey 25', sans-serif;
}

.post-header {
  display: flex;
  flex-direction: column;
  font-family: 'Jersey 25', sans-serif;
}

.post-content {
  word-break: break-word;
  line-height: 1.6;
  font-size: 1.1rem;
}

.post-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.shadow-box {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
}

/* Comment Section */
.comments-section {
  margin-top: 15px;
  padding: 10px;
  background-color: #fdf7f3;
  border-radius: 8px;
}

.comment-container {
  padding: 8px 0;
  border-top: 1px solid #ece2dc;
}

.add-comment {
  margin-top: 10px;
}

/* Button Styles */
.btn {
  background-color: #f7bec1;
  color: #4d4d4d;
  width: 100%;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #be9294;
  transform: scale(1.05);
  color: #fff;
}

.like-btn,
.comment-btn {
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover,
.comment-btn:hover {
  transform: scale(1.1);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem; /* Reduce padding */
  width: auto; /* Remove fixed width */
  height: auto; /* Adjust height to content */
  font-size: 0.9rem; /* Make font size smaller */
}


/* Navbar Styles */
/* Navbar Styles */
.navbar {
  background-color: #f7bec1;
  border-radius: 8px;
  padding: 15px 0; /* Increase padding for more space */
  font-family: 'Jersey 25', sans-serif;
  display: flex;
  justify-content: center; /* Center the navbar content */
}

.nav-link {
  color: #4d4d4d;
  font-size: 1.4rem; /* Increase font size */
  margin:0 20px;
  position: relative;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #333;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #f7bec1;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.active-topic {
  font-weight: bold;
  color: #333;
}


/* Responsive Styles */
@media (max-width: 576px) {
  .forum-title {
    font-size: 1.8rem;
  }

  .new-post-container,
  .post-container {
    padding: 15px;
  }
}
</style>
