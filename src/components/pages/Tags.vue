<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; overflow: hidden;">
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh; display: flex; flex-direction: column;">
      <v-card-title class="d-flex align-center" style="z-index: 2;">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 font-weight-bold">标签云 (Tag Cloud)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white" style="z-index: 2;"></v-divider>
      
      <v-card-text class="flex-grow-1 d-flex justify-center align-center position-relative" ref="cloudContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <div v-if="tags.length === 0" class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-tag-outline</v-icon>
          <p>暂无标签</p>
        </div>
        
        <div class="tag-cloud-scene" v-else>
          <span
            v-for="(tag, index) in animatedTags"
            :key="tag.name"
            class="tag-item"
            :style="tag.style"
            @click="selectTag(tag.name)"
            @mouseenter="pauseAnimation = true"
            @mouseleave="pauseAnimation = false"
          >
            {{ tag.name }}
          </span>
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
      tags: [],           // Raw tag strings
      animatedTags: [],   // Tag objects with 3D positions
      radius: 300,        // Radius of the sphere
      dtr: Math.PI / 180, // Degrees to radians
      d: 600,             // Distance for perspective
      mcList: [],
      active: false,
      lasta: 1,
      lastb: 1,
      distr: true,
      tspeed: 2,          // Rotation speed
      size: 250,
      mouseX: 0,
      mouseY: 0,
      howElliptical: 1,
      animationFrameId: null,
      pauseAnimation: false,
      containerWidth: 0,
      containerHeight: 0
    };
  },
  mounted() {
    this.initTags();
    // Use nextTick to ensure container dimensions are available
    this.$nextTick(() => {
        this.updateContainerSize();
        window.addEventListener('resize', this.updateContainerSize);
        this.init3D();
        this.animate();
    });
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.updateContainerSize);
  },
  methods: {
    initTags() {
      const tagsSet = new Set();
      this.posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      this.tags = Array.from(tagsSet).sort();
    },
    updateContainerSize() {
        if (this.$refs.cloudContainer) {
            this.containerWidth = this.$refs.cloudContainer.$el.offsetWidth;
            this.containerHeight = this.$refs.cloudContainer.$el.offsetHeight;
            // Adjust radius based on screen size, but keep it reasonable
            this.radius = Math.min(this.containerWidth, this.containerHeight) / 2.5; 
        }
    },
    init3D() {
      this.mcList = [];
      this.animatedTags = this.tags.map((tag, i) => {
        // Distribute points on a sphere (Fibonacci Sphere algorithm for even distribution is better, but simple random is okay for small counts)
        // Using a simple spherical distribution formula
        let phi = Math.acos(-1 + (2 * i + 1) / this.tags.length);
        let theta = Math.sqrt(this.tags.length * Math.PI) * phi;
        
        return {
          name: tag,
          x: this.radius * Math.cos(theta) * Math.sin(phi),
          y: this.radius * Math.sin(theta) * Math.sin(phi),
          z: this.radius * Math.cos(phi),
          style: {}
        };
      });
    },
    handleMouseMove(e) {
      if (!this.$refs.cloudContainer) return;
      const rect = this.$refs.cloudContainer.$el.getBoundingClientRect();
      // Calculate mouse position relative to center of container
      this.mouseX = (e.clientX - (rect.left + rect.width / 2)) / 5;
      this.mouseY = (e.clientY - (rect.top + rect.height / 2)) / 5;
    },
    handleMouseLeave() {
      this.mouseX = 0;
      this.mouseY = 0;
    },
    animate() {
      this.update();
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    update() {
      let a, b;
      
      const maxSpeed = 0.02; // Radian per frame
      
      if (this.active) {
          // Map mouse position to rotation speed
          a = -(Math.min(Math.max(-this.mouseY, -this.size), this.size) / this.radius) * maxSpeed;
          b = (Math.min(Math.max(-this.mouseX, -this.size), this.size) / this.radius) * maxSpeed;
      } else {
          // Auto rotation
          a = -0.002; 
          b = 0.005; 
      }
      
      if (this.pauseAnimation) {
          a = 0;
          b = 0;
      }
      
      const cosa = Math.cos(a);
      const sina = Math.sin(a);
      const cosb = Math.cos(b);
      const sinb = Math.sin(b);
      
      this.animatedTags.forEach(tag => {
        // Update positions
        const rx1 = tag.x;
        const ry1 = tag.y * cosa + tag.z * -sina;
        const rz1 = tag.y * sina + tag.z * cosa;

        const rx2 = rx1 * cosb + rz1 * sinb;
        const ry2 = ry1;
        const rz2 = rx1 * -sinb + rz1 * cosb;
        
        const rx3 = rx2;
        const ry3 = ry2;
        const rz3 = rz2;
        
        tag.x = rx3;
        tag.y = ry3;
        tag.z = rz3;

        const alpha = this.radius * 2;
        const scale = (alpha + tag.z) / (alpha * 1.5);
        // Ensure minimum opacity is higher for better visibility
        const opacity = Math.max(0.4, Math.min(1, (scale - 0.5) * 2));
        
        tag.style = {
          transform: `translate3d(${tag.x}px, ${tag.y}px, 0) scale(${scale})`,
          opacity: opacity,
          zIndex: Math.round(scale * 100),
          // Reduce blur intensity for distant tags to keep them readable
          filter: `blur(${Math.max(0, (1 - scale) * 2)}px)`,
          display: opacity < 0.1 ? 'none' : 'block'
        };
      });

      this.active = (Math.abs(this.mouseX) > 5 || Math.abs(this.mouseY) > 5);
      
      // Decelerate
      if (!this.active && !this.pauseAnimation) {
         this.mouseX *= 0.95;
         this.mouseY *= 0.95;
      }
    },
    selectTag(tag) {
      this.$emit('tag-selected', tag);
    }
  }
}
</script>

<style scoped>
.tag-cloud-scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
  transform-style: preserve-3d;
}

.tag-item {
  position: absolute;
  top: 50%; /* Start from center */
  left: 50%;
  /* Center the element itself so (0,0) is its center */
  margin-left: -50px; /* Approximate half width, will vary */
  margin-top: -15px; /* Approximate half height */
  
  white-space: nowrap;
  cursor: pointer;
  padding: 8px 16px;
  
  /* Artistic Font Styling - Enhanced for Clarity */
  font-family: 'LXGW WenKai Screen', sans-serif;
  font-weight: 900; /* Maximized weight */
  font-size: 2rem; /* Increased size */
  
  /* Solid Color for maximum contrast */
  color: #ffffff;
  
  /* Strong Outline/Shadow to separate from background */
  text-shadow: 
    0 2px 4px rgba(0,0,0,0.8), /* Deep shadow for lift */
    0 0 20px rgba(255,255,255,0.4); /* Soft glow */
  
  transition: transform 0.3s ease, text-shadow 0.3s ease, filter 0.3s ease;
  will-change: transform, opacity, filter;
  
  user-select: none;
}

.tag-item:hover {
  /* Highlight on hover */
  color: #ffffff;
  text-shadow: 
    0 4px 8px rgba(0,0,0,0.9),
    0 0 30px rgba(255,255,255,0.9);
  z-index: 1000 !important; /* Bring to very front */
}
</style>