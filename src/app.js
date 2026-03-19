import { defineAsyncComponent } from 'vue';
import { posts } from '../src/data/posts.js';
import homeright from '../src/components/hoemright.vue';
import typewriter from './components/typewriter.vue';
import tab1 from './components/tabs/tab1.vue';
import tab2 from './components/tabs/tab2.vue';
import tab3 from './components/tabs/tab3.vue';
import loader from './components/loader.vue';
import polarchart from './components/polarchart.vue';
import ContextMenu from './components/ContextMenu.vue';

// Dynamic Import for Route-Level Code Splitting (Performance Optimization)
const BlogPage = defineAsyncComponent(() => import('./components/pages/Blog.vue'));
const TagsPage = defineAsyncComponent(() => import('./components/pages/Tags.vue'));
const ArchivesPage = defineAsyncComponent(() => import('./components/pages/Archives.vue'));
const LinksPage = defineAsyncComponent(() => import('./components/pages/Links.vue'));
const SkillsPage = defineAsyncComponent(() => import('./components/pages/Skills.vue'));
const SeriesPage = defineAsyncComponent(() => import('./components/pages/Series.vue'));
const GuestbookPage = defineAsyncComponent(() => import('./components/pages/Guestbook.vue'));
const AboutPage = defineAsyncComponent(() => import('./components/pages/About.vue'));

import config from './config.js';
import { getCookie } from './utils/cookieUtils.js';
import { setMeta,getFormattedTime,getFormattedDate,dataConsole } from './utils/common.js';
import { useDisplay } from 'vuetify'

export default {
  components: {
    tab1,tab2,tab3,loader,homeright,typewriter,polarchart,ContextMenu,
    BlogPage, TagsPage, ArchivesPage, LinksPage, SkillsPage, SeriesPage, GuestbookPage, AboutPage
  },
  setup() {
    const { xs,sm,md } = useDisplay();
    return { xs,sm,md };
  },
  data() {
    return {
      currentView: 'home',
      isloading:false,
      isClearScreen: false,
      formattedTime:"",
      formattedDate:"",
      configdata: config,
      dialog1: false,
      dialog2: false,
      contextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      selectedText: '',
      personalizedtags: null,
      videosrc: '',
      ismusicplayer: false,
      isPlaying:false,
      playlistIndex: 0,
      audioLoading: false,
      musicinfo: null,
      musicinfoLoading:false,
      lyrics:{},
      socialPlatformIcons: null,
      polarChartData: null,
      selectedTag: null,
      selectedSkill: null,
      selectedPostId: null,
      initialSearchQuery: '',
      isExpanded: false,
      stackicons:[
        {icon:"mdi-vuejs",color:"green", model: false,tip: 'vue'},
        {icon:"mdi-language-javascript",color:"#CAD300", model: false,tip: 'javascript'},
        {icon:"mdi-language-css3",color:"blue", model: false,tip: 'css'},
        {icon:"mdi-language-html5",color:"red", model: false,tip: 'html'},
        {icon:"$vuetify",color:"#1697F6", model: false,tip: 'vuetify'},
      ],
      projectcards:null,
      tab: null,
      tabs: [
        {
          icon: 'mdi-pencil-plus',
          text: '样式预览',
          value: 'tab-1',
          component: "tab1",
        },
        {
          icon: 'mdi-wallpaper',
          text: '背景预览',
          value: 'tab-2',
          component: "tab2",
        },
        {
          icon: 'mdi-music-circle-outline',
          text: '音乐播放',
          value: 'tab-3',
          component: "tab3",
        },
      ],

    };
  },
  async mounted() {
    if(import.meta.env.VITE_CONFIG){
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.projectcards = this.configdata.projectcards;this.socialPlatformIcons = this.configdata.socialPlatformIcons;
    
    // Calculate Tags and Tech Stack Distribution
    const tagCounts = {};
    const skillCounts = {};

    posts.forEach(post => {
      // Tags
      if (post.tags) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }

      // Skills (Main skill only)
      if (post.skills && Array.isArray(post.skills)) {
          post.skills.forEach(skillString => {
              const mainSkill = skillString.split('/')[0].trim();
              skillCounts[mainSkill] = (skillCounts[mainSkill] || 0) + 1;
          });
      }
    });

    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const sortedSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);
    
    // Top 8 tags for sidebar
    this.personalizedtags = sortedTags.slice(0, 8).map(entry => entry[0]);

    // Polar Chart Data (Tech Stack Distribution) - NOW USING SKILLS
    const totalSkillCount = sortedSkills.reduce((sum, entry) => sum + entry[1], 0);
    this.polarChartData = {
      labels: sortedSkills.slice(0, 8).map(entry => entry[0]),
      data: sortedSkills.slice(0, 8).map(entry => Math.round((entry[1] / totalSkillCount) * 100))
    };

    this.isloading = true;
    let imageurl = "";
    this.dataConsole();
    this.setMeta(this.configdata.metaData.title,this.configdata.metaData.description,this.configdata.metaData.keywords,this.configdata.metaData.icon);
    
    imageurl = this.setMainProperty(imageurl);

    //异步等待背景壁纸包括视频壁纸加载完成后再显示页面
    const loadImage = () => {
        // Optimization: Only wait for CRITICAL assets (Avatar + current background)
        // Let project cards and other images lazy load naturally.
        const imageUrls = [
          config.avatar,
          // Only add the main background image if it exists and isn't a video
          ...(imageurl ? [imageurl] : [])
        ];

        return new Promise((resolve, reject) => {
          const imagePromises = imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
                const imgs = new Image();
                imgs.src = url;
                imgs.onload = () => resolve();
                imgs.onerror = (err) => {
                    // console.warn(`Failed to load critical asset: ${url}`, err);
                    resolve(); // Resolve anyway to not block the UI
                };
            });
          })

          // 设置超时机制：2.5秒
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2500);
          });
          
          // 等待所有图片加载完成或超时
          Promise.race([Promise.all(imagePromises), timeoutPromise]).then(()=>{
            if(imageurl){
               // Background is an image, handled by the promise above
               resolve();
            }else{
              // Background is a video
              const video = this.$refs.VdPlayer;
              if (video) {
                  video.onloadedmetadata = () => {
                    resolve();
                  };
                  video.onerror = (err) => {resolve();};
                  // Fallback if metadata doesn't load quickly
                  setTimeout(resolve, 1000); 
              } else {
                  resolve();
              }
            }
          })
        });
     };

    loadImage().then(() => {
        this.formattedTime =  this.getFormattedTime(new Date());
        this.formattedDate =  this.getFormattedDate(new Date());
        setTimeout(() => {
          this.isloading = false;
        }, "500");          
      }).catch((err) => {
        console.error('壁纸加载失败:', err);
        setTimeout(() => {
          this.isloading = false;
        }, "100");  
      });
 
      setInterval(() => {
        this.formattedTime =  this.getFormattedTime(new Date()) ;
      }, 1000);

      await this.getMusicInfo();  //获取音乐数据
      this.setupAudioListener();  //设置 ended 事件监听器，当歌曲播放结束时自动调用 nextTrack 方法。
  },

  beforeDestroy() {     //在组件销毁前移除事件监听器，防止内存泄漏。
    this.$refs.audioPlayer.removeEventListener('ended',  this.nextTrack);
  },

  watch:{
    isClearScreen(val){
      if(!this.videosrc){
        return
      }
      if(val){
        this.$refs.VdPlayer.style.zIndex = 0; 
        this.$refs.VdPlayer.controls = true;
      }else{
        this.$refs.VdPlayer.style.zIndex = -100; 
        this.$refs.VdPlayer.controls = false;
      }
    },
    audioLoading(val){
      this.isPlaying = !val;
    }

  //若弹出框使得页面播放卡顿，可以先停止背景播放
  //   dialog1(val){
  //     if(val){
  //       this.$refs.VdPlayer.pause();
  //     }else{
  //       this.$refs.VdPlayer.play();
  //     }
  //  }
  },

  computed: {
    currentSong() {
      return this.musicinfo[this.playlistIndex];
    },
    audioPlayer() {
      return this.$refs.audioPlayer;
    }
  },
  
  methods: {
    getCookie,setMeta,getFormattedTime,getFormattedDate,dataConsole,

    setMainProperty(imageurl){
      const root = document.documentElement;
      let leleodata = this.getCookie("leleodata");
      if(leleodata){
        root.style.setProperty('--leleo-welcomtitle-color', `${leleodata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${leleodata.color.themecolor}`);
        root.style.setProperty('--leleo-brightness', `${leleodata.brightness}%`);
        root.style.setProperty('--leleo-blur', `${leleodata.blur}px`); 
        if (leleodata.fontSizeScale) {
             root.style.fontSize = `${leleodata.fontSizeScale}%`;
        } else {
             root.style.fontSize = '100%';
        }
      }else{
        root.style.setProperty('--leleo-welcomtitle-color', `${this.configdata.color.welcometitlecolor}`);
        root.style.setProperty('--leleo-vcard-color', `${this.configdata.color.themecolor}`);  
        root.style.setProperty('--leleo-brightness', `${this.configdata.brightness}%`);  
        root.style.setProperty('--leleo-blur', `${this.configdata.blur}px`);
        root.style.fontSize = '100%';
      }
  
      let leleodatabackground = this.getCookie("leleodatabackground");
      const { xs } = useDisplay();
      if(leleodatabackground){
        if(xs.value){
          if(leleodatabackground.mobile.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.mobile.datainfo.url}')`);
            imageurl = leleodatabackground.mobile.datainfo.url;
            return imageurl;
          }else{
            this.videosrc = leleodatabackground.mobile.datainfo.url;
          }
        }else{
          if(leleodatabackground.pc.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${leleodatabackground.pc.datainfo.url}')`);
            imageurl = leleodatabackground.pc.datainfo.url;
            return imageurl;
          }else{
            this.videosrc = leleodatabackground.pc.datainfo.url;
          }
        }
          
      }else{
        if(xs.value){
          if(this.configdata.background.mobile.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.mobile.datainfo.url}')`);
            imageurl = this.configdata.background.mobile.datainfo.url;
            return imageurl;
          }else{
            this.videosrc = this.configdata.background.mobile.datainfo.url;
          }
        }else{
          if(this.configdata.background.pc.type == "pic"){
            root.style.setProperty('--leleo-background-image-url', `url('${this.configdata.background.pc.datainfo.url}')`);
            imageurl = this.configdata.background.pc.datainfo.url;
            return imageurl;
          }else{
            this.videosrc = this.configdata.background.pc.datainfo.url;
          }
          
        }
      }
    },

    projectcardsShow(key){
      this.projectcards.forEach((item,index)=>{
        if(index!= key){
          item.show = false;
        }
      })
    },
    handleCancel(){
      this.dialog1 = false;
    },
    jump(url){
      window.open(url, '_blank').focus();
    },
    
    async getMusicInfo(){
      this.musicinfoLoading = true;
      try {
        const response = await fetch(`https://api.i-meto.com/meting/api?server=${this.configdata.musicPlayer.server}&type=${this.configdata.musicPlayer.type}&id=${this.configdata.musicPlayer.id}`
        );
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        this.musicinfo = await response.json();
        this.musicinfoLoading = false;
      } catch (error) {
        console.error('请求失败:', error);
      }
      
    },
    musicplayershow(val) {
        this.ismusicplayer = val;
    },

    setupAudioListener() {
      this.$refs.audioPlayer.addEventListener('ended', this.nextTrack);
    },

    togglePlay() {
      if (!this.isPlaying) {
        this.audioPlayer.play();
        this.isVdMuted = true;
      } else {
        this.audioPlayer.pause();
        this.isVdMuted = false;
      }
      this.isPlaying = !this.musicinfoLoading && !this.isPlaying;
    },
    previousTrack() {
      this.playlistIndex = this.playlistIndex > 0 ? this.playlistIndex - 1 : this.musicinfo.length - 1;
      this.updateAudio();
    },
    nextTrack() {
      this.playlistIndex = this.playlistIndex < this.musicinfo.length - 1 ? this.playlistIndex + 1 : 0;
      this.updateAudio();
    },
    updateAudio() {
      this.audioPlayer.src = this.currentSong.url;
      this.$refs.audiotitle.innerText = this.currentSong.title;
      this.$refs.audioauthor.innerText = this.currentSong.author;
      this.isPlaying = true;
      this.audioPlayer.play();
    },
    updateCurrentIndex(index) {
      this.playlistIndex = index;
      this.updateAudio();
    },
    updateIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },
    updateLyrics(lyrics){
      this.lyrics = lyrics;
    },
    // 监听等待事件（缓冲不足）
    onWaiting() {
      this.audioLoading = true;
    },
    // 监听可以播放事件（缓冲足够）
    onCanPlay() {
      this.audioLoading = false;
    },
    expandSwitch() {
      this.isExpanded = true;
    },
    collapseSwitch() {
      this.isExpanded = false;
    },
    navigate(viewName, tag = null, skill = null, postId = null, searchQuery = '') {
      this.currentView = viewName;
      this.selectedTag = tag;
      this.selectedSkill = skill;
      this.selectedPostId = postId;
      this.initialSearchQuery = searchQuery;
    },
    handleTagSelected(tag) {
      this.navigate('blog', tag);
    },
    handleSkillNavigation(skill) {
      this.navigate('blog', null, skill);
    },
    handleBlogSearch(query) {
      this.navigate('blog', null, null, null, query);
    },
    handlePostNavigation(postId) {
      this.navigate('blog', null, null, postId);
    },
    showContextMenu(e) {
      e.preventDefault();
      
      // Capture selection immediately
      const selection = window.getSelection();
      this.selectedText = selection ? selection.toString() : '';

      this.contextMenuVisible = false; // Close first to reset transition if needed
      this.$nextTick(() => {
        this.contextMenuX = e.clientX;
        this.contextMenuY = e.clientY;
        this.contextMenuVisible = true;
      });
    },
    closeContextMenu() {
      this.contextMenuVisible = false;
    },
    handleContextMenuAction(action) {
      if (action === 'copy') {
        if (this.selectedText && this.selectedText.length > 0) {
            navigator.clipboard.writeText(this.selectedText).then(() => {
                // Could show a snackbar here
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
      } else if (action === 'home') {
        this.navigate('home');
      } else if (action === 'settings') {
        this.dialog1 = true;
      }
    }
  }
};