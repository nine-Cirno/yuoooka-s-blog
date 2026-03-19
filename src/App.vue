<template>
  <v-app class="vapp-fullscreen-background" style="overflow: hidden;" :class="{ 'radius-before': !xs }"
  :style="xs?{height: '100%',width: '100%',top: '0',left:'0'}:(sm?{height: '98%',width: '98%',top: '1%',left:' 1%'}:{height: '96.6%',width: '99%',top: '1.7%',left:' 0.5%'})"
  @contextmenu.prevent="showContextMenu" @click="closeContextMenu">
    <transition name="fade">
      <div class="loading" v-show="isloading">
        <loader></loader>
      </div>
    </transition>

    <video autoplay loop muted class="video-bg" id="bg-video" ref="VdPlayer"
    :style="xs?{height: '100%',width: '100%',top: '0',left:'0'}:(sm?{height: '98%',width: '98%',top: '1%',left:' 1%','border-radius': '16px'}:{height: '96.6%',width: '99%',top: '1.7%',left:' 0.5%','border-radius': '16px',})">
        <source :src=videosrc type="video/mp4">
    </video>

    <div class="floating-switch-container">
      <v-switch
        v-model="isClearScreen"
        inset
        :style="xs?{'transform':'scale(0.6) translateX(15%)'}:{}"
        class="floating-switch"
        @mouseover="expandSwitch"
        @mouseleave="collapseSwitch"
      ></v-switch>
    </div>
    
    <div v-show="!isloading && !isClearScreen" :style="xs||sm || currentView !== 'home' ?{'overflow-y': 'auto','overflow-x': 'hidden', 'height': '100%'}:{}">
    <transition name="fade" mode="out-in">
        <v-row v-if="currentView === 'home'" key="home">
            <v-col cols="12" md="4" lg="3" class="leleo-left" align="center">
              <div :style="xs||sm?{'font-size':'2.3rem'}:{'display':'none'}" class="leleo-left-welcome yuoooka-text-shadow">{{ configdata.welcometitle }}</div>  
              <v-avatar class="leleo-left-avatar" :size="xs||sm?120:140" :style="xs||sm?{'margin-top': '0'}:{'margin-top': '2rem'}" @mouseenter="musicplayershow(1)" @mouseleave="musicplayershow(0)">
                  <v-img :class="{'leleo-spin':isPlaying}"
                  alt="Yuoooka"
                  :src=configdata.avatar
                  ></v-img>
                  <!-- 由于当ismusicplayer显示后，fadein无效果，所以需要设置一个过渡动画 -->
                  <transition name="fade">
                  <v-card v-show="ismusicplayer" class="musicplayer yuoooka-glass-card" :class="{'fade-in':ismusicplayer}">
                      <div v-if="audioLoading" class="loading-spinner">
                          <v-progress-circular indeterminate color="white"></v-progress-circular>
                      </div>
                      <span ref="audiotitle" class="musicplayer-text yuoooka-text-shadow"
                        style="top: 1.6rem;font-weight: bolder;"
                      >{{ musicinfo?.[0]?.title }}</span>
                      <span ref="audioauthor" class="musicplayer-text yuoooka-text-shadow"
                        style="bottom: 1.4rem;"
                      >{{ musicinfo?.[0]?.author }}</span>
                      <audio v-show="false" ref="audioPlayer" :src="musicinfo?.[0]?.url"
                      @waiting="onWaiting"
                      @canplay="onCanPlay">
                      </audio>
                      <v-btn :size="xs||sm?22:30" color="rgba(255,255,255,0.2)" icon @click="previousTrack()">
                      <v-icon color="white">mdi-skip-previous</v-icon>
                      </v-btn>
                      <v-btn :size="xs||sm?35:48" color="rgba(255,255,255,0.3)" icon @click="togglePlay()">
                      <v-icon color="white">{{ isPlaying? 'mdi-pause' : 'mdi-play' }}</v-icon>
                      </v-btn>
                      <v-btn :size="xs||sm?22:30" color="rgba(255,255,255,0.2)" icon @click="nextTrack()">
                      <v-icon color="white">mdi-skip-next</v-icon>
                      </v-btn>
                  </v-card>
                  </transition>
                </v-avatar>

                <v-card class="ma-5 pa-2 leleo-left-card yuoooka-glass-card" :max-width="xs?270:300" style="text-align: center;">
                    <template v-slot:title>
                    <span class="yuoooka-text-shadow">Tags</span>
                    </template>
                    <v-chip v-for="item in personalizedtags" density="compact" link class="ma-1" size="small" color="white" variant="outlined" @click="navigate('blog', item)">
                    {{item}}
                    </v-chip>
                </v-card>

                <div class="leleo-left-chart">
                    <polarchart :style="xs||sm?{'height':'210px'}:{'height':'270px'}" :chart-data="polarChartData" />
                </div>

                <v-container class="leleo-left-socialIconsContainer">
                    <v-row align="center" justify="center">
                    <v-col class="pa-1" cols="auto" v-for="item in socialPlatformIcons">
                        <v-btn :size="xs?25:33" variant="text" color="white"
                        class="ma-1 leleo-social-bticon yuoooka-glass-card"
                        icon
                        :href="item.link" target="_blank"
                        >
                    <v-icon :icon=item.icon :size="xs?20:25" class="social-bticon-icon yuoooka-text-shadow"></v-icon></v-btn>
                    </v-col>
                    </v-row>

                    <v-row align="center" justify="center" class="setting">
                    <v-col class="ma-1" cols="auto">
                        <v-speed-dial
                            :location="xs||sm ?'top center':'right center'"
                            transition="slide-y-transition"
                        >
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-fab style="width: 2.5rem;height: 2.5rem;" color="rgba(255,255,255,0.2)"
                            variant="flat"
                            v-bind="activatorProps"
                            icon="mdi-cog"
                            ></v-fab>
                        </template>
                        <v-btn variant="tonal" class="setbtn" key="1" icon="mdi-key-chain" @click="dialog1 = true" size="31" color="white"></v-btn>
                        <v-btn variant="tonal" class="setbtn" key="2" icon="mdi-information" @click="dialog2 = true" size="31" color="white"></v-btn>
                        <v-btn variant="tonal" class="setbtn" key="3" icon="$error" size="31" color="white"></v-btn>
                        </v-speed-dial>
                    </v-col>
                    </v-row>
                </v-container>
            </v-col>

            <v-col cols="12" md="8" lg="9" style="height: 100vh;" :style="xs||sm ?{}:{'overflow': 'auto'}">
                <homeright :configdata=configdata :formattedTime=formattedTime 
                :formattedDate=formattedDate :projectcards=projectcards @navigate="navigate" @search-blog="handleBlogSearch" @navigate-post="handlePostNavigation"></homeright>
            </v-col>
        </v-row>
        
        <blog-page v-else-if="currentView === 'blog'" key="blog" :initial-tag="selectedTag" :initial-skill="selectedSkill" :initial-search="initialSearchQuery" :initial-post-id="selectedPostId" @back="navigate('home')"></blog-page>
        <tags-page v-else-if="currentView === 'tags'" key="tags" @back="navigate('home')" @tag-selected="handleTagSelected"></tags-page>
        <archives-page v-else-if="currentView === 'archives'" key="archives" @back="navigate('home')"></archives-page>
        <links-page v-else-if="currentView === 'links'" key="links" @back="navigate('home')"></links-page>
        <skills-page v-else-if="currentView === 'skills'" key="skills" @back="navigate('home')" @navigate-post="handlePostNavigation" @navigate-skill="handleSkillNavigation"></skills-page>
        <series-page v-else-if="currentView === 'series'" key="series" @back="navigate('home')" @navigate-post="handlePostNavigation"></series-page>
        <daily-page v-else-if="currentView === 'daily'" key="daily" @back="navigate('home')"></daily-page>
        <about-page v-else-if="currentView === 'about'" key="about" @back="navigate('home')"></about-page>
    </transition>
    </div>

    <v-dialog
        v-model="dialog1"
        width="1000"
        height="700"
      >
      <v-card class="yuoooka-glass-card" elevation="10">
        <v-tabs
          v-model="tab"
          :items="tabs"
          align-tabs="center"
          height="60"
          slider-color="white"
          color="white"
        >
          <template v-slot:tab="{ item }">
            <v-tab
              :prepend-icon="item.icon"
              :text="item.text"
              :value="item.value"
              class="text-none yuoooka-text-shadow"
            ></v-tab>
          </template>
          
          <template v-slot:item="{ item }">
            <v-tabs-window-item :value="item.value" class="pa-4">
              <div v-if="item.value=='tab-3' && musicinfoLoading" class="loading-spinner" align="center">
                  <v-progress-circular indeterminate color="white"></v-progress-circular>
              </div>
              <!-- 通过组件绑定不同tab项的组件 -->
              <component v-if="item.value!='tab-3' || (item.value=='tab-3' && !musicinfoLoading)" :is=item.component @cancel="handleCancel" 
              :musicinfo="item.value=='tab-3'?musicinfo:[]"
              :currentIndex="item.value=='tab-3'?playlistIndex:null"
              :isPlaying="item.value=='tab-3'?isPlaying:null"
              :audioPlayer="item.value=='tab-3'?audioPlayer:null"
              :fromLyrics="item.value=='tab-3'?lyrics:null"
              :audioLoading="item.value=='tab-3'?audioLoading:null"
              @update:current-index="updateCurrentIndex"
              @update:is-playing="updateIsPlaying"
              @update:current-lyrics="updateLyrics"
              ></component>
            </v-tabs-window-item>
          </template>
        </v-tabs>
      </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog2"
        width="700"
        height="500"
      >
      <v-card class="ma-3 pa-2 yuoooka-glass-card" hover
          rounded="lg"
          style="text-align: center;"
        >
          <template v-slot:title >
            <span class="leleo-card-title yuoooka-text-shadow">关于</span>
          </template>
          <div style="display: flex;flex-direction: column;align-items: center;">
            <v-card class="ma-3 pa-2 yuoooka-glass-card" hover
              max-width="400"
              rounded="lg"
              style="text-align: center; border: 1px solid rgba(255,255,255,0.3) !important;"
              >
              <template v-slot:subtitle>
                <span class="leleo-card-subtitle yuoooka-text-shadow">本页基于以下技术及服务搭建</span>
              </template>
              <div>
                <v-tooltip  v-for="item in stackicons" v-model="item.model" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props" :color=item.color rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-icon size="25" color="white">{{item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{item.tip}}</span>
                </v-tooltip>
                <!-- 自定义 -->
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/vite.svg" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>vite</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#254B7C">
                      <span style="font-size: 8px;font-weight: bolder;">{less}</span>
                    </v-btn>
                  </template>
                  <span>less</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/mdi.svg" rounded="0" size="35"></v-avatar>
                    </v-btn>
                  </template>
                  <span>mdi</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35">
                      <v-avatar image="/img/stackicon/chartjs.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>chartjs</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#0F1225">
                      <v-avatar image="/img/stackicon/meting.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>meting</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" rounded="lg" class="ma-1 stack-btn" size="35" color="#070707">
                      <v-avatar image="/img/stackicon/uiverse.png" rounded="0" size="23"></v-avatar>
                    </v-btn>
                  </template>
                  <span>uiverse</span>
                </v-tooltip>
              </div>
            </v-card>

            <p class="ma-6">
                <span v-for="item in configdata.statement">
                  {{ item }}<br>
                </span>
            </p>
          </div>
        </v-card>
    </v-dialog>
    <context-menu
      :visible="contextMenuVisible"
      :x="contextMenuX"
      :y="contextMenuY"
      :has-selection="selectedText && selectedText.length > 0"
      @close="closeContextMenu"
      @action="handleContextMenuAction"
    ></context-menu>
  </v-app>
</template>

<script src="./app.js"></script>

<style>
/* --- Yuoooka Global Visual System (Major Forceful Update) --- */

/* 1. 核心玻璃容器 - 极简通透与动态光感 */
.yuoooka-glass-card {
  /* 极低不透明度，最大化展示动态壁纸 */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.01) 100%
  ) !important;
  
  /* 适度模糊，保持背景可见但不过于清晰干扰文字 */
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  
  /* 动态光边：使用双层背景模拟渐变边框 */
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  
  /* 阴影：深邃且扩散，提升层次感 */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
  
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  
  /* 关键：定位用于光效层 */
  position: relative;
  overflow: hidden !important;
  
  color: #ffffff !important;
}

/* 2. 动态光效 (解决"不够动感") */
.yuoooka-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    transparent 100%
  );
  transform: skewX(-25deg);
  transition: none; /* 默认不移动 */
  pointer-events: none;
  z-index: 1;
}

.yuoooka-glass-card:hover::before {
  left: 150%;
  transition: left 0.7s ease-in-out;
}

/* 3. 悬浮状态 */
.yuoooka-glass-card:hover {
  transform: translateY(-5px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  ) !important;
  box-shadow: 0 15px 40px 0 rgba(0, 0, 0, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

/* 4. 字体冲突终极解决方案 - 清晰可读 (无晕染) */
.yuoooka-text-shadow {
  color: #ffffff !important;
  /* 仅保留一层清晰的黑色描边，去除模糊发散的"光晕" */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
  font-weight: 500;
  letter-spacing: 0.5px;
  font-family: 'LXGW WenKai Screen', sans-serif !important; 
}

/* 强制应用到所有 Vuetify 文本元素及自定义类 */
.v-application, .v-card-title, .v-card-subtitle, .v-card-text, .v-btn, .v-icon, .text-h4, .text-h5, .text-h6, .v-list-item-title, .v-list-item-subtitle, .leleo-left-welcome, .clock-font {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95) !important; /* 统一改为清晰阴影 */
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}

/* 输入框特殊处理 */
.v-field__outline {
    --v-field-border-opacity: 0.6;
}
.v-field--variant-outlined .v-field__outline__start,
.v-field--variant-outlined .v-field__outline__end,
.v-field--variant-outlined .v-field__outline__notch {
    border-color: rgba(255,255,255,0.6) !important;
}
.v-field__input {
    color: white !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.9) !important; /* 清晰阴影 */
    font-family: 'LXGW WenKai Screen', sans-serif !important;
}
.v-label {
    color: rgba(255,255,255,0.9) !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.9) !important; /* 清晰阴影 */
    font-family: 'LXGW WenKai Screen', sans-serif !important;
}

/* 极坐标图提升 */
canvas {
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
}

/* Optimize transition speed for smoother navigation */
.vapp-fullscreen-background .fade-enter-active, 
.vapp-fullscreen-background .fade-leave-active { 
    transition: opacity 0.4s !important;
}
</style>

<style scoped>
  @import url(/css/app.less);
  @import url(/css/mobile.less);
</style>