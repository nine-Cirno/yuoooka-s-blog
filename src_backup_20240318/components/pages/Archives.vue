<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative;">
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 font-weight-bold">归档 (Archives)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      <v-card-text>
        <div v-if="Object.keys(groupedPosts).length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-archive-outline</v-icon>
          <p>暂无文章</p>
        </div>
        <v-timeline v-else align="start" density="compact" side="end">
          <v-timeline-item
            v-for="(posts, year) in groupedPosts"
            :key="year"
            dot-color="white"
            size="small"
            fill-dot
          >
            <template v-slot:opposite>
              <div class="pt-1 headline font-weight-bold text-white" v-text="year"></div>
            </template>
            <div>
              <h2 class="text-h6 font-weight-light mb-4 text-white">{{ year }}</h2>
              <div v-for="post in posts" :key="post.id" class="mb-2">
                <v-card class="yuoooka-glass-card pa-2" hover @click="goToPost(post)" style="border: 1px solid rgba(255,255,255,0.2) !important;">
                   <div class="text-subtitle-1 yuoooka-text-shadow">{{ post.title }}</div>
                   <div class="text-caption text-white text-opacity-70 yuoooka-text-shadow">{{ post.date }}</div>
                </v-card>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { posts } from '../../data/posts.js';

export default {
  name: 'ArchivesPage',
  emits: ['back', 'post-selected'],
  data() {
    return {
      posts: posts,
      groupedPosts: {}
    };
  },
  created() {
    const groups = {};
    // Sort posts by date descending
    const sortedPosts = [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedPosts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(post);
    });
    this.groupedPosts = groups;
  },
  methods: {
    goToPost(post) {
      this.$emit('post-selected', post);
    }
  }
}
</script>
