<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative;">
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 font-weight-bold">标签 (Tags)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      <v-card-text>
        <div v-if="allTags.length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-tag-outline</v-icon>
          <p>暂无标签</p>
        </div>
        <div v-else class="text-center">
          <v-chip
            v-for="tag in allTags"
            :key="tag"
            class="ma-2 yuoooka-text-shadow"
            color="white"
            variant="outlined"
            @click="selectTag(tag)"
            :style="{ fontSize: (1 + Math.random() * 0.5) + 'rem', borderColor: 'rgba(255,255,255,0.6)' }"
          >
            {{ tag }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { posts } from '../../data/posts.js';

export default {
  name: 'TagsPage',
  emits: ['back', 'tag-selected'],
  data() {
    return {
      posts: posts,
      allTags: []
    };
  },
  created() {
    const tags = new Set();
    this.posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    this.allTags = Array.from(tags).sort();
  },
  methods: {
    selectTag(tag) {
      this.$emit('tag-selected', tag);
    }
  }
}
</script>
