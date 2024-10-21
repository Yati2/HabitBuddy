<script setup>
import { defineEmits } from 'vue';
import Profile from '../components/Profile.vue';

// Emit the update-avatar event to parent component
const emit = defineEmits(['update-avatar']);
</script>

<template>
  <main>
    <Profile @update-avatar="(newAvatar) => emit('update-avatar', newAvatar)" />
  </main>
</template>
