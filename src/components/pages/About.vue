<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start;">
    
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center flex-wrap">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 mr-4 font-weight-bold">关于 (About)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      
      <v-card-text>
        <v-row>
            <v-col cols="12" md="6" class="text-center text-white">
                <v-avatar size="180" class="mb-4 mt-6">
                    <v-img :src="config.avatar" cover></v-img>
                </v-avatar>
                <div class="text-h5 font-weight-bold mb-2">Yuoooka</div>
                <div class="text-subtitle-1 opacity-70 mb-4">全栈开发者 | 游戏爱好者 | CTFer</div>
                
                <div class="d-flex justify-center flex-wrap gap-2 mb-6">
                    <v-chip v-for="tag in config.tags" :key="tag" class="ma-1" color="white" variant="outlined">{{ tag }}</v-chip>
                </div>
            </v-col>
            
            <v-col cols="12" md="6" class="text-white">
                <div class="text-h6 font-weight-bold mb-3">自我介绍</div>
                <p class="text-body-1 mb-4 opacity-80" style="line-height: 1.8;">
                    你好！我是 Yuoooka，一名热爱技术与创新的开发者。
                    这个博客记录了我的学习历程、技术分享以及生活随笔。
                    我对 Web 开发、网络安全（特别是 CTF Reverse 方向）以及游戏开发有着浓厚的兴趣。
                </p>
                <p class="text-body-1 mb-6 opacity-80" style="line-height: 1.8;">
                    闲暇之余，我喜欢听音乐、打游戏，或者折腾一些有趣的小项目。
                    欢迎通过下方的社交方式联系我！
                </p>

                <div class="text-h6 font-weight-bold mb-3">联系方式</div>
                <div class="d-flex flex-column gap-2">
                    <div v-for="social in config.socialPlatformIcons" :key="social.icon" class="d-flex align-center mb-2">
                         <v-icon :icon="social.icon" class="mr-3" color="white"></v-icon>
                         <a :href="social.link" target="_blank" class="text-white text-decoration-none hover-underline">
                            {{ social.link.replace('mailto:', '').replace('https://', '') }}
                         </a>
                    </div>
                </div>
            </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import config from '../../config.js';

export default {
  name: 'AboutPage',
  emits: ['back'],
  data() {
    return {
      config: config
    };
  }
}
</script>

<style scoped>
.hover-underline:hover {
    text-decoration: underline !important;
}
</style>
