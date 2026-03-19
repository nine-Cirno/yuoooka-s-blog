<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start;">
    
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center flex-wrap">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 mr-4 font-weight-bold">系列 (Series)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      
      <v-card-text>
        <div v-if="Object.keys(groupedSeries).length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-bookshelf</v-icon>
          <p>暂无系列文章</p>
        </div>

        <v-row v-else>
          <v-col v-for="(posts, seriesName) in groupedSeries" :key="seriesName" cols="12" md="6" lg="4">
            <v-card class="mb-4 series-card yuoooka-glass-card" hover @click="toggleSeries(seriesName)" style="border: 1px solid rgba(255,255,255,0.15) !important;">
              <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between align-center yuoooka-text-shadow">
                {{ seriesName }}
                <v-icon color="white">{{ expandedSeries === seriesName ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-card-title>
              
              <v-card-subtitle class="text-white pb-2 pl-4">
                  {{ posts.length }} 篇文章
              </v-card-subtitle>

              <v-expand-transition>
                <div v-show="expandedSeries === seriesName">
                  <v-divider color="white" class="border-opacity-25"></v-divider>
                  <v-list bg-color="transparent" density="compact">
                    <v-list-item v-for="post in posts" :key="post.id" lines="one" class="yuoooka-text-shadow" @click.stop="goToPost(post.id)" link>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-file-document-outline" size="small" color="white" class="mr-2"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ post.title }}</v-list-item-title>
                        <template v-slot:append>
                             <span class="text-caption text-white opacity-70">{{ post.date.split(' ')[0] }}</span>
                        </template>
                    </v-list-item>
                  </v-list>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { posts } from '../../data/posts.js';

export default {
  name: 'SeriesPage',
  emits: ['back', 'navigate-post'],
  data() {
    return {
      posts: posts,
      groupedSeries: {},
      expandedSeries: null
    };
  },
  mounted() {
    this.processSeries();
  },
  methods: {
    processSeries() {
      const groups = {};
      
      this.posts.forEach(post => {
        if (post.series && typeof post.series === 'string' && post.series.trim() !== '') {
            const seriesName = post.series.trim();
            if (!groups[seriesName]) {
                groups[seriesName] = [];
            }
            groups[seriesName].push(post);
        }
      });

      // Sort posts within each series by date (oldest to newest or newest to oldest depending on preference)
      // Usually series are read in order, so maybe by date ascending? Let's do descending for now (newest first).
      for (const series in groups) {
          groups[series].sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      
      this.groupedSeries = groups;
    },
    toggleSeries(series) {
      if (this.expandedSeries === series) {
        this.expandedSeries = null;
      } else {
        this.expandedSeries = series;
      }
    },
    goToPost(postId) {
        this.$emit('navigate-post', postId);
    }
  }
}
</script>

<style scoped>
.series-card {
    transition: all 0.3s ease;
}
.series-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
