<template>
  <body>
    <div class="container-fluid">
    <div class="forum-container row">
      <!-- Forum Section with Nav Bar -->
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
        <div class="new-post-container">
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
        <div v-for="post in filteredPosts" :key="post._id" class="post-container">
          <div class="post-header">
            <h4>{{ post.username }}</h4>
            <p class="post-content">{{ post.content }}</p>
          </div>

          <div class="post-actions">
            <button @click="likePost(post._id)" class="like-btn">👍 {{ post.likes }} Likes</button>
            <button @click="toggleComments(post._id)" class="comment-btn">💬 Comments</button>
            <!-- Delete Button -->
            <button
              v-if="post.username === username"
              @click="deletePost(post._id)"
              class="delete-btn btn btn-sm btn-danger d-inline"
              style="width: auto; padding: 0.2rem 0.5rem"
            >
              🗑️ Delete
            </button>
          </div>

          <!-- Comments Section -->
          <div v-if="post.showComments">
            <div v-for="comment in post.comments" :key="comment._id" class="comment-container">
              <p>
                <strong>{{ comment.username }}:</strong> {{ comment.comment }}
              </p>
            </div>
            <div class="add-comment">
              <textarea
                v-model="newCommentContent[post._id]"
                class="form-control"
                rows="2"
                placeholder="Add a comment..."
              ></textarea>
              <button @click="submitComment(post._id)" class="btn mt-2">Submit</button>
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
          `https://habit-buddy-server.vercel.app/api/posts?topic=${this.selectedTopic}`
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

        const response = await axios.post('https://habit-buddy-server.vercel.app/api/posts', newPost)
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
        await axios.delete(`https://habit-buddy-server.vercel.app/api/posts/${postId}`)

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
        await axios.post(`https://habit-buddy-server.vercel.app/api/posts/${postId}/like`)
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
          await axios.post(`https://habit-buddy-server.vercel.app/api/posts/${postId}/comment`, newComment)
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
/* General Styles */
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}

.forum-title {
  font-family: 'Jersey 25', sans-serif;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.post-container,
.new-post-container {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  font-family: 'Jersey 25', sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Add hover effect to the post and new post containers */
.post-container:hover,
.new-post-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.post-header {
  display: flex;
  flex-direction: column;
  font-family: 'Jersey 25', sans-serif;
}

.post-content {
  word-break: break-word;
  font-family: 'Jersey 25', sans-serif;
}

.post-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

/* Comment Section */
.comment-container {
  padding-left: 15px;
}

.add-comment {
  margin-top: 10px;
}

/* Button Styles */
.btn {
  background-color: #f7bec1;
  color: var(--color-text);
  width: 100%;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: #be9294;
  color: var(--color-heading);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Hover effects specifically for the like, comment, and delete buttons */
.like-btn, .comment-btn, .delete-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Slightly enlarge the buttons and add a shadow on hover */
.like-btn:hover, .comment-btn:hover, .delete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

/* Delete Button Specific Styling */
.delete-btn {
  background-color: #ff6b6b; /* Soft red for delete */
  color: white;
}

.delete-btn:hover {
  background-color: #ff4b4b; /* Darker red on hover */
}

/* Like and Comment Buttons Specific Styling */
.like-btn, .comment-btn {
  background-color: #f0f0f0;
  color: #333;
}

.like-btn:hover, .comment-btn:hover {
  background-color: #e0e0e0; /* Slightly darker on hover */
}

/* Navbar Styles */
.navbar {
  background-color: #f7bec1;
  border-radius: 8px;
  padding: 10px 0;
  font-family: 'Jersey 25', sans-serif;
  transition: box-shadow 0.3s ease;
}

/* Navbar hover shadow effect */
.navbar:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.nav-link {
  color: var(--color-heading);
  margin: 0 15px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--color-text);
  transform: translateY(-2px);
}

.active-topic {
  font-weight: bold;
  color: var(--color-heading);
}

/* Responsive Styles */
@media (max-width: 576px) {
  .forum-title {
    font-size: 1.5rem;
  }

  .new-post-container,
  .post-container {
    padding: 15px;
  }
}

</style>
