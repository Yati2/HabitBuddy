<template>
  <div class="container-fluid" :class="{ 'comments-visible': selectedPostId }" id="forum-container">
    <loading-overlay :is-loading="!forumPosts.length"></loading-overlay>
    <div class="row header">
      <h1 class="forum-title">HabitBuddy Forum</h1>
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
    </div>

    <div class="forum-posts-grid">
      <div
        v-for="post in filteredPosts"
        :key="post._id"
        :class="{ 'post-card': true, expanded: selectedPostId === post._id }"
      >
        <button
          v-if="post.username === this.username"
          @click="deletePost(post._id)"
          class="delete-icon-btn"
        >
          🗑️
        </button>
        <div class="card-body">
          <h5 class="card-title">{{ post.username }}</h5>
          <p class="card-text">{{ post.content }}</p>
          <div class="post-actions">
            <button @click="likePost(post._id)" class="like-btn">👍 {{ post.likes }} Likes</button>
            <button @click="toggleComments(post._id)" class="comment-btn">💬 Comments</button>
          </div>
          <div v-if="selectedPostId == post._id" class="expanded-comments">
            <h5>Comments</h5>
            <div v-for="comment in post.comments" :key="comment._id" class="comment-container">
              <p>
                <strong>{{ comment.username }}:</strong> {{ comment.comment }}
              </p>
            </div>
            <textarea
              v-model="newCommentContent[post._id]"
              class="form-control mt-2"
              rows="2"
              placeholder="Add a comment..."
            ></textarea>
            <button
              @click="submitComment(post._id)"
              class="btn btn-sm btn-primary submitcomment mt-2"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <button @click="showCreatePostModal" class="create-post-btn">+</button>
    <div v-if="showModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <h5>Create a Post</h5>
          <textarea
            v-model="newPostContent"
            class="form-control mt-2"
            rows="3"
            placeholder="What's on your mind?"
          ></textarea>
          <button @click="submitPost" class="btn btn-primary mt-3">Submit</button>
          <button @click="showModal = false" class="btn btn-secondary mt-3">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default {
  components: { LoadingOverlay },
  name: 'ForumComponent',
  data() {
    return {
      forumPosts: [],
      newPostContent: '',
      newCommentContent: {},
      selectedTopic: 'academics',
      username: '',
      isLoading: true,
      selectedPostId: null,
      showModal: false,
      topics: ['academics', 'physical health', 'mental wellness'] // List of topics
    }
  },
  computed: {
    filteredPosts() {
      return this.forumPosts.filter((post) => post.topic === this.selectedTopic)
    }
  },
  methods: {
    async fetchPosts() {
      this.isLoading = true
      console.log('fetching posts')
      console.log(this.username)
      try {
        const response = await axios.get(
          `https://habit-buddy-server.vercel.app/api/posts?topic=${this.selectedTopic}`
        )
        this.forumPosts = response.data.map((post) => ({
          ...post,
          showComments: false
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
          username: this.username,
          likes: 0,
          comments: [],
          topic: this.selectedTopic
        }

        const response = await axios.post(
          'https://habit-buddy-server.vercel.app/api/posts',
          newPost
        )
        this.forumPosts.unshift(response.data.post)
        this.newPostContent = ''
        this.showModal = false
      } catch (error) {
        console.error(
          'Error submitting post:',
          error.response ? error.response.data : error.message
        )
      }
    },
    async deletePost(postId) {
      try {
        console.log(postId)
        await axios.delete(`https://habit-buddy-server.vercel.app/api/posts/${postId}`)

        this.forumPosts = this.forumPosts.filter((post) => post._id !== postId)

        console.log(`Post with ID ${postId} deleted successfully.`)
      } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message)
      }
    },
    async selectTopic(topic) {
      console.log('Selected topic:', topic)
      this.selectedTopic = topic
      try {
        await this.fetchPosts()
      } catch (error) {
        console.error('Error selecting topic:', error)
      } finally {
        this.isLoading = false
      }
    },
    async likePost(postId) {
      const post = this.forumPosts.find((p) => p._id === postId)
      post.likes += 1
      try {
        await axios.post(`https://habit-buddy-server.vercel.app/api/posts/${postId}/like`)
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },
    toggleComments(postId) {
      console.log(postId)
      this.selectedPostId = this.selectedPostId === postId ? null : postId
      console.log('selectedPostId', this.selectedPostId)
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
          await axios.post(
            `https://habit-buddy-server.vercel.app/api/posts/${postId}/comment`,
            newComment
          )
        } catch (error) {
          console.error('Error adding comment:', error)
        }
      }
    },
    showCreatePostModal() {
      this.showModal = true
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  mounted() {
    this.username = localStorage.getItem('username')
    this.isLoading = true
    console.log('Username:', this.username)
    try {
      this.fetchPosts()
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.forum-posts-grid {
  min-height: 100vh;
  column-count: 4;
  column-gap: 20px;
  padding: 20px;
}

.header {
  background-image: url('https://i.pinimg.com/originals/cd/ed/9a/cded9ae306ab48587e45f8ac4a5f70e5.gif');
  background-size: cover;
  padding: 10px;
}
.container-fluid {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#forum-container {
  background-color: #fff3e7;
  flex: 1;
  padding-bottom: 20px;
}
.nav-item:hover {
  color: #daa1a4;
}
.nav-item {
  font-size: large;
}

.forum-title {
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

#new-post-container {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 20px;
  font-family: 'Jersey 25', sans-serif;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.post-container {
  background-color: white;
  padding: 20px;
  margin-top: 10px;
  border: 1px solid var(--color-border);
  font-family: 'Jersey 25', sans-serif;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.create-post-btn {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: rgba(238, 192, 194, 0.7);
  color: black;
  border-radius: 50%;
  z-index: 1020;
  width: 70px;
  height: 70px;
  font-size: 30px;
  display: flex;
  padding: 5px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.create-post-btn:hover {
  background-color: rgba(239, 165, 169, 0.7);
}
.card-body {
  padding: 15px;
}

.card-footer {
  padding: 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.post-container:hover,
#new-post-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(233, 206, 206, 0.15);
}
.expanded-comments {
  position: absolute;
  max-height: 300px;
  overflow-y: auto;
  top: 100%;
  left: 0;
  margin-top: 10px;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  z-index: 100;
}

.post-card.expanded .expanded-comments {
  display: block;
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
.post-card {
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  break-inside: avoid;
  margin-bottom: 20px;
  width: 100%;
  height: fit-content;
  border-radius: 20px;
  position: relative;
  overflow: visible;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.delete-icon-btn {
  position: absolute;
  top: 15px;
  right: 25px;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  color: #ff6b6b; /* Soft red for delete icon */
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.delete-icon-btn:hover {
  color: #ff4b4b; /* Darker red on hover */
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
/* Disable hover effect when comments are visible */
.comments-visible .post-card:hover {
  transform: none;
  box-shadow: none;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.comments-content {
  max-height: 100%;
}

.comment-container {
  margin-bottom: 10px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
textarea {
  width: 100%;
  border-radius: 5px;
  resize: none;
}
.add-comment {
  margin-top: 10px;
}

/* Button Styles */
.btn {
  background-color: #eec0c2;

  color: var(--color-text);
  width: 100%;
  transition:
    background-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
}

.btn:hover {
  background-color: #be9294;
  color: var(--color-heading);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.submitcomment {
  background-color: #eec0c2;
  border: none;
  border-radius: 10px;
  color: black;
}

.submitcomment:hover {
  background-color: #edabae;
}
/* Hover effects specifically for the like, comment, and delete buttons */
.like-btn,
.comment-btn,
.delete-btn {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Slightly enlarge the buttons and add a shadow on hover */
.like-btn:hover,
.comment-btn:hover,
.delete-btn:hover {
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
.like-btn,
.comment-btn {
  background-color: rgba(238, 192, 194, 0.7);
  border-radius: 10px;
  padding: 5px;
  color: #333;
  border: none;
}

.like-btn:hover,
.comment-btn:hover {
  background-color: rgba(242, 174, 177, 0.7); /* Slightly darker on hover */
}

.navbar {
  font-family: 'Jersey 25', sans-serif;
  transition: box-shadow 0.3s ease;
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
  color: #ecacaf;
  border-radius: 5px;
  padding: 5px 10px;
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  padding: 0;
  overflow: hidden;
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
  margin: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  text-align: center;
}

.modal-content h5 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.modal-content textarea {
  width: 100%;
  border-radius: 5px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
}

.modal-content .btn-primary {
  width: 100%;
  padding: 10px;
  background-color: rgba(238, 192, 194, 0.7);
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content .btn-primary:hover {
  background-color: rgba(238, 167, 170, 0.7);
}

.modal-content .btn-secondary {
  width: 100%;
  padding: 10px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content .btn-secondary:hover {
  background-color: #ccc;
}
@media (max-width: 992px) {
  .forum-posts-grid {
    column-count: 2;
  }
}

@media (max-width: 576px) {
  .forum-posts-grid {
    column-count: 1;
  }
  .forum-title {
    font-size: 1.5rem;
  }

  .new-post-container,
  .post-container {
    padding: 15px;
  }
}
</style>
