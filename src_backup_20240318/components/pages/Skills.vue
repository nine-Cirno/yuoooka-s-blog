<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start;">
    
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center flex-wrap">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 mr-4 font-weight-bold">技术栈 (Tech Stack)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      
      <v-card-text>
        <div v-if="Object.keys(groupedSkills).length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-code-braces</v-icon>
          <p>暂无技术栈数据</p>
        </div>

        <v-row v-else>
          <v-col v-for="(subSkills, mainSkill) in groupedSkills" :key="mainSkill" cols="12" md="6" lg="4">
            <v-card class="mb-4 skill-card yuoooka-glass-card" hover @click="navigateToSkill(mainSkill)" style="border: 1px solid rgba(255,255,255,0.15) !important;">
              <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between align-center yuoooka-text-shadow">
                {{ mainSkill }}
                <v-btn icon variant="text" size="small" @click.stop="toggleSkill(mainSkill)">
                  <v-icon color="white">{{ expandedSkill === mainSkill ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-title>
              
              <v-expand-transition>
                <div v-show="expandedSkill === mainSkill">
                  <v-divider color="white" class="border-opacity-25"></v-divider>
                  <v-list bg-color="transparent" density="compact">
                    <v-list-item v-for="(posts, subSkill) in subSkills" :key="subSkill" lines="two" class="yuoooka-text-shadow">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-circle-small" size="small" color="white"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ subSkill }}</v-list-item-title>
                        <v-list-item-subtitle class="mt-1">
                            <v-chip
                                v-for="post in posts"
                                :key="post.id"
                                size="x-small"
                                class="mr-1 mb-1 text-white"
                                color="rgba(255,255,255,0.2)"
                                variant="outlined"
                                @click.stop="goToPost(post.id)"
                                link
                            >
                                {{ post.title }}
                            </v-chip>
                        </v-list-item-subtitle>
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
  name: 'SkillsPage',
  emits: ['back', 'navigate-post', 'navigate-skill'],
  data() {
    return {
      posts: posts,
      groupedSkills: {},
      expandedSkill: null
    };
  },
  mounted() {
    this.processSkills();
  },
  methods: {
    processSkills() {
      const groups = {};
      
      this.posts.forEach(post => {
        if (post.skills && Array.isArray(post.skills)) {
          post.skills.forEach(skillString => {
            // Split by the first slash only
            const parts = skillString.split('/');
            const mainSkill = parts[0].trim();
            const subSkill = parts.length > 1 ? parts.slice(1).join('/').trim() : 'General';
            
            if (!groups[mainSkill]) {
              groups[mainSkill] = {};
            }
            
            if (!groups[mainSkill][subSkill]) {
              groups[mainSkill][subSkill] = [];
            }
            
            // Add post reference if not already added
            if (!groups[mainSkill][subSkill].find(p => p.id === post.id)) {
                groups[mainSkill][subSkill].push({
                    id: post.id,
                    title: post.title
                });
            }
          });
        }
      });
      
      this.groupedSkills = groups;
    },
    toggleSkill(skill) {
      if (this.expandedSkill === skill) {
        this.expandedSkill = null;
      } else {
        this.expandedSkill = skill;
      }
    },
    navigateToSkill(skill) {
        this.$emit('navigate-skill', skill);
    },
    goToPost(postId) {
        this.$emit('navigate-post', postId);
    }
  }
}
</script>

<style scoped>
.skill-card {
    transition: all 0.3s ease;
}
.skill-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
