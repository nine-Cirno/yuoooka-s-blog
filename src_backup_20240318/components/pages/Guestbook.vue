<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative; align-items: flex-start;">
    
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center flex-wrap">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 mr-4 font-weight-bold">留言板 (Guestbook)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      
      <v-card-text>
        <v-row>
            <v-col cols="12" md="6">
                <!-- Comment Form -->
                <v-card class="pa-4 mb-4" color="rgba(255,255,255,0.1)" style="border: 1px solid rgba(255,255,255,0.2);">
                    <v-card-title class="text-h6 text-white mb-2">发表评论</v-card-title>
                    <v-form @submit.prevent="submitComment" ref="form">
                        <v-text-field
                            v-model="newComment.nickname"
                            label="昵称 (Nickname)"
                            variant="outlined"
                            density="compact"
                            color="white"
                            bg-color="rgba(0,0,0,0.2)"
                            :rules="[v => !!v || '昵称是必填项']"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="newComment.email"
                            label="邮箱 (Email)"
                            variant="outlined"
                            density="compact"
                            color="white"
                            bg-color="rgba(0,0,0,0.2)"
                            :rules="[v => !!v || '邮箱是必填项', v => /.+@.+\..+/.test(v) || '邮箱格式不正确']"
                            required
                        ></v-text-field>
                        <v-textarea
                            v-model="newComment.content"
                            label="内容 (Content)"
                            variant="outlined"
                            rows="3"
                            color="white"
                            bg-color="rgba(0,0,0,0.2)"
                            :rules="[v => !!v || '内容是必填项']"
                            required
                        ></v-textarea>
                        <v-btn type="submit" color="primary" block :loading="submitting">发送</v-btn>
                    </v-form>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <!-- Comments List -->
                <div v-if="comments.length === 0" class="text-center text-white mt-10 opacity-70">
                    <v-icon size="48" class="mb-2">mdi-comment-outline</v-icon>
                    <p>暂无评论，快来抢沙发吧！</p>
                </div>
                <div v-else class="comments-list" style="max-height: 600px; overflow-y: auto;">
                    <v-card v-for="(comment, index) in comments" :key="index" class="mb-3 pa-3" color="rgba(0,0,0,0.3)" style="border: 1px solid rgba(255,255,255,0.1);">
                        <div class="d-flex align-center mb-2">
                             <v-avatar color="primary" size="32" class="mr-2">
                                <span class="text-white text-caption">{{ comment.nickname.substring(0,2).toUpperCase() }}</span>
                             </v-avatar>
                             <div>
                                 <div class="text-subtitle-2 text-white font-weight-bold">{{ comment.nickname }}</div>
                                 <div class="text-caption text-grey-lighten-1">{{ comment.date }}</div>
                             </div>
                        </div>
                        <div class="text-body-2 text-white pl-10">
                            {{ comment.content }}
                        </div>
                    </v-card>
                </div>
            </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'GuestbookPage',
  emits: ['back'],
  data() {
    return {
      submitting: false,
      newComment: {
        nickname: '',
        email: '',
        content: ''
      },
      // Mock data - in a real app, this would come from a backend/API
      comments: [
        { nickname: 'Yuoooka', email: 'admin@example.com', content: '欢迎来到我的博客！', date: '2024-03-20 12:00' },
        { nickname: 'Visitor', email: 'visitor@example.com', content: '网站做的真不错！', date: '2024-03-21 14:30' }
      ]
    };
  },
  mounted() {
      // Load comments from localStorage for persistence simulation
      const storedComments = localStorage.getItem('yuoooka-comments');
      if (storedComments) {
          this.comments = JSON.parse(storedComments);
      }
  },
  methods: {
    async submitComment() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.submitting = true;
      
      // Simulate network request
      setTimeout(() => {
        const comment = {
            nickname: this.newComment.nickname,
            email: this.newComment.email,
            content: this.newComment.content,
            date: new Date().toLocaleString()
        };
        
        this.comments.unshift(comment);
        localStorage.setItem('yuoooka-comments', JSON.stringify(this.comments));
        
        this.newComment = { nickname: '', email: '', content: '' };
        this.$refs.form.reset();
        this.submitting = false;
      }, 800);
    }
  }
}
</script>

<style scoped>
.comments-list::-webkit-scrollbar {
    width: 6px;
}
.comments-list::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.2);
    border-radius: 3px;
}
</style>
