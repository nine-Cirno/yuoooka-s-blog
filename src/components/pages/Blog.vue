<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start;">
    
    <!-- Blog Post List View -->
    <v-card v-if="!selectedPost" class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center flex-wrap">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 mr-4 font-weight-bold">博客 (Blog)</span>
        
        <v-spacer></v-spacer>
        
        <!-- Search Input -->
        <v-text-field
          v-model="localSearchQuery"
          label="搜索文章..."
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          class="mr-4 search-field"
          style="max-width: 250px;"
          bg-color="rgba(255,255,255,0.1)"
          color="white"
          base-color="white"
          clearable
        ></v-text-field>

        <v-chip v-if="activeTag" closable @click:close="clearTagFilter" color="white" variant="flat" class="mr-2 text-black">
          Tag: {{ activeTag }}
        </v-chip>
        <v-chip v-if="activeSkill" closable @click:close="clearSkillFilter" color="white" variant="flat" class="mr-2 text-black">
          Skill: {{ activeSkill }}
        </v-chip>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      
      <v-card-text>
        <div v-if="filteredPosts.length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-post-outline</v-icon>
          <p>没有找到相关文章</p>
        </div>

        <v-row v-else>
          <v-col v-for="post in filteredPosts" :key="post.id" cols="12" sm="6" md="4" lg="3">
            <div class="blog-grid-card yuoooka-glass-card" @click="openPost(post)">
              <!-- Media Area with Slide-Up Effect -->
              <div class="media-area">
                <!-- Image Layer -->
                <img :src="post.img || '/img/default-cover.png'" class="post-bg-img" alt="cover" loading="lazy" />
                
                <!-- Overlay Content Layer -->
                <div class="post-content-overlay">
                   <p class="post-desc yuoooka-text-shadow">{{ post.description }}</p>
                   <v-btn variant="text" size="small" color="white" class="read-more-btn">
                      阅读全文 <v-icon size="small" end>mdi-arrow-right</v-icon>
                   </v-btn>
                </div>
              </div>
              
              <!-- Bottom: Title & Meta -->
              <div class="blog-card-footer">
                <div class="post-title yuoooka-text-shadow" :title="post.title">{{ post.title }}</div>
                <div class="post-meta yuoooka-text-shadow">
                  <span class="mr-2"><v-icon size="x-small">mdi-calendar</v-icon> {{ post.date.split(' ')[0] }}</span>
                  <span><v-icon size="x-small">mdi-eye</v-icon> {{ Math.floor(Math.random() * 1000) + 50 }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Blog Post Detail View -->
    <v-row v-else class="mx-auto my-4" style="width: 100%; max-width: 1400px;">
      
      <!-- Article Content Column -->
      <v-col cols="12" md="9">
        <v-card class="yuoooka-glass-card yuoooka-text-shadow pa-4" style="min-height: 80vh;">
          <v-card-title class="d-flex align-center flex-wrap">
            <v-btn icon="mdi-arrow-left" variant="text" @click="closePost" class="mr-4 text-white"></v-btn>
            <span class="text-h4 text-wrap font-weight-bold" style="line-height: 1.2;">{{ selectedPost.title }}</span>
          </v-card-title>
          
          <v-card-subtitle class="mt-2 d-flex align-center flex-wrap text-white">
            <v-icon size="small" class="mr-1" color="white">mdi-calendar</v-icon> {{ selectedPost.date }}
            <span class="mx-2">|</span>
            <v-icon size="small" class="mr-1" color="white">mdi-folder</v-icon> {{ selectedPost.categories.join(', ') }}
          </v-card-subtitle>

          <div class="mt-2 px-4">
            <v-chip v-for="tag in selectedPost.tags" :key="tag" size="small" class="mr-2 mb-2" color="white" variant="outlined" @click="filterByTag(tag)">
              {{ tag }}
            </v-chip>
          </div>

          <v-divider class="my-4 border-opacity-50" color="white"></v-divider>
          
          <v-card-text class="blog-content text-white">
            <!-- Render processed content with IDs injected for TOC -->
            <div v-html="processedContent"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- TOC Column (Desktop Only or Bottom Sheet on Mobile could be added later) -->
      <v-col cols="12" md="3" v-if="tocItems.length > 0">
        <v-card class="yuoooka-glass-card yuoooka-text-shadow pa-4 sticky-toc" style="position: sticky; top: 20px; max-height: 80vh; overflow-y: auto;">
            <v-card-title class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center text-white" @click="isTocCollapsed = !isTocCollapsed" style="cursor: pointer;">
                目录
                <v-icon color="white">{{ isTocCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
            </v-card-title>
            <v-expand-transition>
                <v-list density="compact" bg-color="transparent" v-show="!isTocCollapsed" class="toc-list">
                    <v-list-item
                        v-for="item in tocItems"
                        :key="item.id"
                        @click="scrollToSection(item.id)"
                        :class="`pl-${(item.level === 'h3' ? 6 : 2)}`"
                        link
                        min-height="32"
                        rounded
                        class="mb-1 text-white"
                    >
                        <v-list-item-title class="text-caption text-wrap">{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-expand-transition>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
import { posts } from '../../data/posts.js';

export default {
  name: 'BlogPage',
  props: {
    initialTag: {
      type: String,
      default: null
    },
    initialSkill: {
      type: String,
      default: null
    },
    initialSearch: {
      type: String,
      default: ''
    },
    initialPostId: {
      type: String,
      default: null
    }
  },
  emits: ['back'],
  data() {
    return {
      posts: posts,
      selectedPost: null,
      activeTag: this.initialTag,
      activeSkill: this.initialSkill,
      localSearchQuery: this.initialSearch,
      tocItems: [],
      processedContent: '',
      isTocCollapsed: false
    };
  },
  computed: {
    filteredPosts() {
      let result = this.posts;

      // Filter by Tag
      if (this.activeTag) {
        result = result.filter(post => post.tags && post.tags.includes(this.activeTag));
      }

      // Filter by Skill
      if (this.activeSkill) {
        result = result.filter(post => 
          post.skills && post.skills.some(skill => skill.split('/')[0].trim() === this.activeSkill)
        );
      }

      // Filter by Search Query
      if (this.localSearchQuery) {
        const query = this.localSearchQuery.toLowerCase().trim();
        result = result.filter(post => 
          post.title.toLowerCase().includes(query) || 
          post.description.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
        );
      }

      return result;
    }
  },
  watch: {
    initialTag(newVal) {
      this.activeTag = newVal;
    },
    initialSkill(newVal) {
      this.activeSkill = newVal;
    },
    initialSearch(newVal) {
      this.localSearchQuery = newVal;
    },
    initialPostId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const post = this.posts.find(p => p.id === newVal);
          if (post) {
            this.openPost(post);
          }
        }
      }
    },
    selectedPost(newPost) {
        if (newPost) {
            this.generateTOC(newPost.content);
        }
    }
  },
  methods: {
    openPost(post) {
      this.selectedPost = post;
      // Scroll to top
      window.scrollTo(0, 0);
    },
    closePost() {
      this.selectedPost = null;
      this.tocItems = [];
      window.scrollTo(0, 0);
    },
    filterByTag(tag) {
      this.activeTag = tag;
      this.selectedPost = null;
      window.scrollTo(0, 0);
    },
    clearTagFilter() {
      this.activeTag = null;
    },
    clearSkillFilter() {
      this.activeSkill = null;
    },
    generateTOC(htmlContent) {
        const toc = [];
        let idCounter = 0;
        
        // 1. Generate TOC and inject IDs
        let processed = htmlContent.replace(/<(h[2-3])>(.*?)<\/\1>/gi, (match, tag, text) => {
            const id = `section-${idCounter++}`;
            toc.push({
                id: id,
                text: text.replace(/<[^>]*>?/gm, ''),
                level: tag.toLowerCase()
            });
            return `<${tag} id="${id}">${text}</${tag}>`;
        });

        // 2. Process Code Blocks
        processed = processed.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
             return `
                <div class="code-block-container collapsed">
                  <div class="code-header">
                    <span class="code-title">Code</span>
                    <div class="code-actions">
                        <button class="code-btn code-copy-btn">复制</button>
                        <button class="code-btn code-toggle-btn">展开</button>
                    </div>
                  </div>
                  <div class="code-content" style="display: none;">
                    <pre><code>${code}</code></pre>
                  </div>
                </div>
             `;
        });

        this.processedContent = processed;
        this.tocItems = toc;
        
        this.$nextTick(() => {
            this.attachCodeBlockListeners();
        });
    },
    attachCodeBlockListeners() {
        const containers = document.querySelectorAll('.code-block-container');
        
        containers.forEach(container => {
            if (container.dataset.listenersAttached) return;
            
            const toggleBtn = container.querySelector('.code-toggle-btn');
            const copyBtn = container.querySelector('.code-copy-btn');
            const content = container.querySelector('.code-content');
            const codeElement = container.querySelector('code');

            if (toggleBtn && content) {
                toggleBtn.addEventListener('click', () => {
                    const isHidden = content.style.display === 'none';
                    content.style.display = isHidden ? 'block' : 'none';
                    toggleBtn.textContent = isHidden ? '收起' : '展开';
                    if (isHidden) {
                        container.classList.remove('collapsed');
                    } else {
                        container.classList.add('collapsed');
                    }
                });
            }

            if (copyBtn && codeElement) {
                copyBtn.addEventListener('click', async () => {
                    try {
                        const text = codeElement.innerText;
                        await navigator.clipboard.writeText(text);
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = '已复制!';
                        setTimeout(() => {
                            copyBtn.textContent = originalText;
                        }, 2000);
                    } catch (err) {
                        console.error('Copy failed', err);
                    }
                });
            }
            
            container.dataset.listenersAttached = 'true';
        });
    },
    scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
  }
}
</script>

<style>
.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.blog-content pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: monospace;
}
.blog-content h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  color: white !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.95);
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}
.blog-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.95);
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}
.blog-content p {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.95);
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}
.text-truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Code Block Styles - Dark Theme Adaptation */
.code-block-container {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
  background-color: rgba(20, 20, 20, 0.85) !important; /* Deep dark background for code */
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255,255,255,0.1) !important; /* Semi-transparent header */
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.code-title {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 500;
  color: #e0e0e0 !important;
  font-size: 0.9rem;
  text-shadow: none !important; /* Remove global ghosting */
}

.code-actions {
  display: flex;
  gap: 0.5rem;
}

.code-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #e0e0e0 !important;
  transition: all 0.2s;
  text-shadow: none !important;
  font-family: 'JetBrains Mono', monospace !important;
}

.code-btn:hover {
  background-color: rgba(255,255,255,0.2);
  color: #ffffff !important;
}

.code-content {
  padding: 0;
}

.code-content pre {
  margin: 0 !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  padding: 1rem !important;
  overflow-x: auto;
  color: #d4d4d4 !important; /* VS Code default light text */
  text-shadow: none !important; /* CRITICAL: Remove blur/ghosting */
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace !important;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Ensure code text inside is clean */
.code-content code {
  color: inherit !important;
  text-shadow: none !important;
  font-family: inherit !important;
  background: transparent !important;
}

/* Reset for any simple pre tags outside the container */
.blog-content pre {
  background-color: rgba(20, 20, 20, 0.85);
  color: #d4d4d4 !important;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  text-shadow: none !important;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace !important;
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.95rem;
  line-height: 1.6;
}

.blog-content code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  text-shadow: none !important;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

/* --- New Grid Layout Styles (Slide Up Version) --- */
.blog-grid-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* border-radius: 12px;  -- Handled by yuoooka-glass-card */
  /* overflow: hidden; -- Handled by yuoooka-glass-card */
  transition: transform 0.3s ease;
  cursor: pointer;
  
  /* Additional tweak for glass "inlaid" feel: 
     Ensure padding if needed, but for "neat grid" let image flush 
     against top/sides looks best, with glass framing the whole card.
  */
  background-color: transparent !important; /* Override explicit bg if any, rely on glass */
}

.blog-grid-card:hover {
  transform: translateY(-5px);
}

.media-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  /* border-radius: 12px; -- Let parent handle corners */
  overflow: hidden;
  /* box-shadow: 0 4px 15px rgba(0,0,0,0.2); -- Parent has shadow */
  background-color: transparent; /* Remove black bg, let glass show through */
}

/* Image styling */
.post-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Ensure image is on bottom layer */
  z-index: 1;
  position: relative;
  
  /* Make image slightly transparent by default to blend with glass? 
     No, usually solid image looks better unless hovered. 
     User said "transparent texture" for the BOX, not necessarily image always.
  */
}

/* Overlay Content styling - initially hidden */
.post-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Vertically center */
  align-items: center;
  padding: 30px; /* Add padding to prevent text from hitting edges */
  z-index: 2;
  
  /* Start transparent and slightly below center */
  opacity: 0;
  transform: translateY(20px); 
  transition: all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1); /* Ease out back for smooth stop */
}

/* --- Hover Effects --- */
/* 1. Image serves as background: Blur & Darken */
.blog-grid-card:hover .post-bg-img {
  transform: scale(1.1); /* Slight zoom */
  filter: blur(5px) brightness(0.4); /* Blur and darken to contrast with white text */
  opacity: 1; /* Keep opaque so it acts as background */
}

/* 2. Text appears in center */
.blog-grid-card:hover .post-content-overlay {
  opacity: 1;
  transform: translateY(0); /* Settle at center */
}

/* Text styles inside overlay */
.post-desc {
  font-size: 0.95rem; /* Slightly larger for readability */
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  font-weight: 500;
}

.read-more-btn {
  margin-top: auto;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Footer (Title & Meta) */
.blog-card-footer {
  padding: 12px 4px;
  text-align: center; 
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.post-meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
</style>
