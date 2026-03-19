<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start; overflow-x: hidden;">
    
    <!-- Daily List View -->
    <div v-if="!selectedDaily" class="daily-container mx-auto" style="width: 100%; max-width: 1400px; min-height: 80vh; position: relative;">
      <v-card-title class="d-flex align-center" style="position: relative; z-index: 10;">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white yuoooka-text-shadow"></v-btn>
        <span class="text-h4 font-weight-bold text-white yuoooka-text-shadow">我的日常 (Daily Life)</span>
      </v-card-title>
      
      <!-- Scattered Gallery Container -->
      <div class="gallery-board mt-10">
            <div 
                v-for="(daily, index) in dailiesWithStyle" 
                :key="daily.id" 
                class="polaroid-card"
                :style="{
                    ...daily.style,
                    zIndex: daily.hover ? 100 : daily.style.zIndex // Ensure active hover is top
                }"
                @click="openDaily(daily)"
                @mouseenter="daily.hover = true"
                @mouseleave="daily.hover = false"
            >
            <div class="polaroid-image-wrapper">
                <img :src="daily.img || '/img/default-cover.png'" alt="cover" loading="lazy" />
            </div>
            <div class="polaroid-caption">
                <div class="daily-title">{{ daily.title }}</div>
                <div class="daily-meta">
                    <span v-if="daily.date">{{ daily.date.split(' ')[0] }}</span>
                    <span v-if="daily.location"> @ {{ daily.location }}</span>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Daily Detail View -->
    <v-row v-else class="mx-auto my-4" style="width: 100%; max-width: 1000px;">
      <v-col cols="12">
        <v-card class="yuoooka-glass-card yuoooka-text-shadow pa-4" style="min-height: 80vh;">
          <v-card-title class="d-flex align-center flex-wrap">
            <v-btn icon="mdi-arrow-left" variant="text" @click="closeDaily" class="mr-4 text-white"></v-btn>
            <span class="text-h4 text-wrap font-weight-bold" style="line-height: 1.2;">{{ selectedDaily.title }}</span>
          </v-card-title>
          
          <v-card-subtitle class="mt-2 d-flex align-center flex-wrap text-white">
            <v-icon size="small" class="mr-1" color="white">mdi-calendar</v-icon> {{ selectedDaily.date }}
            <span class="mx-2" v-if="selectedDaily.location">|</span>
            <v-icon size="small" class="mr-1" color="white" v-if="selectedDaily.location">mdi-map-marker</v-icon> {{ selectedDaily.location }}
          </v-card-subtitle>

          <v-divider class="my-4 border-opacity-50" color="white"></v-divider>
          
          <v-card-text class="blog-content text-white">
            <div v-html="selectedDaily.content"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { dailies } from '../../data/dailies.js';

export default {
  name: 'DailyPage',
  emits: ['back'],
  data() {
    return {
      dailies: dailies,
      selectedDaily: null,
      dailiesWithStyle: []
    };
  },
  mounted() {
      this.calculateLayout();
      window.addEventListener('resize', this.calculateLayout);
  },
  beforeUnmount() {
      window.removeEventListener('resize', this.calculateLayout);
  },
  methods: {
    calculateLayout() {
        const containerWidth = this.$el ? this.$el.clientWidth : window.innerWidth;
        const isMobile = containerWidth < 600;

        // 1. Random Selection (Pick 10)
        // Only shuffle if we haven't selected them yet to avoid re-shuffling on resize
        let targetDailies = this.dailiesWithStyle.length > 0 
            ? this.dailiesWithStyle.map(d => d.originalData) 
            : [...this.dailies];
            
        if (this.dailiesWithStyle.length === 0) {
            // Fisher-Yates shuffle
            for (let i = targetDailies.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [targetDailies[i], targetDailies[j]] = [targetDailies[j], targetDailies[i]];
            }
            // Take top 10
            targetDailies = targetDailies.slice(0, 10);
        }

        this.dailiesWithStyle = targetDailies.map((daily, index) => {
            // If styles already exist (from previous calc), we might want to preserve them 
            // to avoid jumping on resize, but recalculating is safer for responsiveness.
            
            if (isMobile) {
                return {
                    ...daily,
                    originalData: daily.originalData || daily,
                    hover: false,
                    style: {
                        position: 'relative',
                        margin: '15px auto',
                        transform: `rotate(${(Math.random() * 4 - 2)}deg)`, // Slight rotation
                        width: '90%',
                        zIndex: 1
                    }
                };
            }

            // Desktop "Flex Scatter" logic
            // Use Flexbox for layout (centered), but use transform for scatter effect.
            
            // Random rotation (-8 to 8 deg) - clear and readable
            const rotate = (Math.random() - 0.5) * 16; 
            
            // Random translation (-20px to 20px) to break the grid
            const tx = (Math.random() - 0.5) * 40;
            const ty = (Math.random() - 0.5) * 40;

            // Z-index random base to allow some natural layering
            // Hover will force z-index 100
            
            return {
                ...daily,
                originalData: daily.originalData || daily,
                hover: false,
                style: {
                    position: 'relative', // Flex item
                    margin: '-15px', // Negative margin for "Light Overlap"
                    transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`,
                    zIndex: Math.floor(Math.random() * 5) + 1,
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease', // Removed z-index transition
                }
            };
        });
    },
    openDaily(daily) {
      this.selectedDaily = daily;
      window.scrollTo(0, 0);
    },
    closeDaily() {
      this.selectedDaily = null;
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style scoped>
.gallery-board {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center; /* Center the entire grid vertically */
    padding: 60px 40px;
    perspective: 1200px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    gap: 30px;
}

.polaroid-card {
    background-color: white;
    padding: 10px 10px 40px 10px; /* More bottom padding for polaroid look */
    box-shadow: 2px 5px 15px rgba(0,0,0,0.2);
    cursor: pointer;
    width: 260px; /* Slightly smaller width */
    height: auto;
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    background-image: linear-gradient(to bottom right, #ffffff, #fcfcfc);
    
    /* Ensure transform-origin is center for rotation */
    transform-origin: center center;
}

.polaroid-card:hover {
    /* Scale up slightly, remove rotation to "pick up" the photo, ensure it's on top */
    transform: scale(1.05) rotate(0deg) translate(0, -10px) !important;
    z-index: 100 !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.polaroid-image-wrapper {
    width: 100%;
    height: 220px; /* Square-ish photo area */
    background-color: #333;
    overflow: hidden;
    margin-bottom: 10px;
    border: 1px solid #ddd;
}

.polaroid-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.polaroid-caption {
    text-align: center;
    font-family: 'LXGW WenKai Screen', cursive, sans-serif; /* Handwriting style if available */
    color: #333;
}

.daily-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
    line-height: 1.2;
}

.daily-meta {
    font-size: 0.8rem;
    color: #666;
}

/* Reuse blog content styles */
:deep(.blog-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
:deep(.blog-content p) {
  margin-bottom: 1rem;
  line-height: 1.8;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.95);
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}
</style>