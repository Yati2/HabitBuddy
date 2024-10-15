<template>
  <div class="container-fluid">
    <div class="forum-container row">
      <!-- Forum Section -->
      <div class="col-lg-8 col-12 mx-auto">
        <h1 class="forum-title">HabitBuddy Forum</h1>

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

        <!-- List of Forum Posts -->
        <div v-for="post in forumPosts" :key="post._id" class="post-container">
          <div class="post-header">
            <h4>{{ post.username }}</h4>
            <p class="post-content">{{ post.content }}</p>
          </div>

          <div class="post-actions">
            <button @click="likePost(post._id)" class="like-btn">👍 {{ post.likes }} Likes</button>
            <button @click="toggleComments(post._id)" class="comment-btn">💬 Comments</button>
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
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      forumPosts: [], // Holds all forum posts
      newPostContent: '', // For new post input
      newCommentContent: {} // For new comment input
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8000/api/posts')
        this.forumPosts = response.data.map((post) => ({
          ...post,
          showComments: false // Toggle for showing/hiding comments
        }))
      } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message)
      }
    },
    async submitPost() {
      try {
        const newPost = {
          content: this.newPostContent,
          username: 'CurrentUser', // Replace with actual dynamic username
          likes: 0,
          comments: []
        }

        const response = await axios.post('http://localhost:8000/api/posts', newPost)
        this.forumPosts.unshift(response.data.post) // Add the new post to the top of the list
        this.newPostContent = '' // Clear the input field
      } catch (error) {
        console.error(
          'Error submitting post:',
          error.response ? error.response.data : error.message
        )
      }
    },
    async likePost(postId) {
      const post = this.forumPosts.find((p) => p._id === postId)
      post.likes += 1 // Update likes on the frontend
      try {
        await axios.post(`http://localhost:8000/api/posts/${postId}/like`) // Update likes in the backend
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
          comment: commentContent, // Match the schema
          username: 'CurrentUser' // Replace with dynamic username
        }
        post.comments.push(newComment)
        this.newCommentContent[postId] = '' // Reset comment input

        try {
          await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, newComment) // API call to save comment
        } catch (error) {
          console.error('Error adding comment:', error)
        }
      }
    }
  },
  mounted() {
    this.fetchPosts() // Fetch posts when the component is mounted
  }
}
</script>

<style scoped>
.forum-title {
  color: white;
  font-size: 2rem; /* Reduced size for mobile responsiveness */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center; /* Center align for better mobile view */
}

.post-container,
.new-post-container {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
}

.post-header {
  display: flex;
  flex-direction: column; /* Stack elements for better mobile view */
}

.post-content {
  word-break: break-word; /* Prevent overflow on small screens */
}

.post-actions,
.comment-btn,
.like-btn {
  margin-top: 10px;
  display: flex;
  justify-content: space-between; /* Space actions evenly */
}

.comment-container {
  padding-left: 15px;
}

.add-comment {
  margin-top: 10px;
}

.btn {
  background-color: #f7bec1;
  width: 100%; /* Make buttons full-width for mobile */
}

.btn:hover {
  background-color: #be9294;
}

/* Responsive styles */
@media (max-width: 576px) {
  .forum-title {
    font-size: 1.5rem; /* Smaller title font for mobile */
  }

  .new-post-container {
    padding: 15px; /* Reduce padding on mobile */
  }

  .post-container {
    padding: 15px; /* Reduce padding on mobile */
  }
}
</style>
