<template>
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
              >{{ capitalize(topic) }}</a>
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
            <button @click="likePost(post._id)" class="like-btn">
              👍 {{ post.likes }} Likes
            </button>
            <button @click="toggleComments(post._id)" class="comment-btn">
              💬 Comments
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
</template>

<script>
import axios from 'axios';
import { isAuthenticated } from '@/auth';

export default {
  data() {
    return {
      forumPosts: [],
      newPostContent: '',
      newCommentContent: {},
      selectedTopic: 'academics',
      username: '', // To store the logged-in username
      topics: ['academics', 'physical', 'mental'], // List of topics
    };
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
  computed: {
    filteredPosts() {
      // Filter posts based on selected topic
      return this.forumPosts.filter(post => post.topic === this.selectedTopic);
    },
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8000/api/posts');
        this.forumPosts = response.data.map(post => ({
          ...post,
          showComments: false, // Toggle for showing/hiding comments
        }));
      } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
      }
    },
    async submitPost() {
      try {
        const newPost = {
          content: this.newPostContent,
          username: this.username, // Use the logged-in username
          likes: 0,
          comments: [],
          topic: this.selectedTopic,
        };

        const response = await axios.post('http://localhost:8000/api/posts', newPost);
        this.forumPosts.unshift(response.data.post);
        this.newPostContent = '';
      } catch (error) {
        console.error('Error submitting post:', error.response ? error.response.data : error.message);
      }
    },
    selectTopic(topic) {
      this.selectedTopic = topic; // Change the current topic when user selects one
    },
    async likePost(postId) {
      const post = this.forumPosts.find(p => p._id === postId);
      post.likes += 1; // Update likes on the frontend
      try {
        await axios.post(`http://localhost:8000/api/posts/${postId}/like`);
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    toggleComments(postId) {
      const post = this.forumPosts.find(p => p._id === postId);
      post.showComments = !post.showComments;
    },
    async submitComment(postId) {
      const commentContent = this.newCommentContent[postId];
      if (commentContent) {
        const post = this.forumPosts.find(p => p._id === postId);
        const newComment = {
          comment: commentContent,
          username: this.username, // Use the logged-in username
        };
        post.comments.push(newComment);
        this.newCommentContent[postId] = ''; // Reset comment input

        try {
          await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, newComment);
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      }
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  mounted() {
    this.username = localStorage.getItem('username') || 'Guest'; // Retrieve username from localStorage
    this.fetchPosts(); // Fetch posts when the component is mounted
  },
};
</script>

<style scoped>
/* General Styles */
.forum-title {
  color: white;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
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
  flex-direction: column;
}

.post-content {
  word-break: break-word;
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
  width: 100%;
}

.btn:hover {
  background-color: #be9294;
}

/* Navbar Styles */
.navbar {
  background-color: #f7bec1;
  border-radius: 8px;
  padding: 10px 0;
}

.nav-link {
  color: white;
  margin: 0 15px;
}

.nav-link:hover {
  color: #333;
}

.active-topic {
  font-weight: bold;
  color: #333;
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
