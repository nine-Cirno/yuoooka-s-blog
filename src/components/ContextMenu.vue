<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="custom-context-menu"
      :style="{ top: y + 'px', left: x + 'px' }"
      @click.stop
      @contextmenu.prevent
    >
      <v-list density="compact" bg-color="transparent" class="pa-0">
        <v-list-item link @click="handleAction('copy')" :disabled="!hasSelection">
          <template v-slot:prepend>
            <v-icon size="small" color="white">mdi-content-copy</v-icon>
          </template>
          <v-list-item-title class="text-white">复制</v-list-item-title>
        </v-list-item>

        <v-divider class="my-1 border-opacity-25" color="white"></v-divider>

        <v-list-item link @click="handleAction('home')">
          <template v-slot:prepend>
            <v-icon size="small" color="white">mdi-home</v-icon>
          </template>
          <v-list-item-title class="text-white">返回主页</v-list-item-title>
        </v-list-item>

        <v-list-item link @click="handleAction('settings')">
          <template v-slot:prepend>
            <v-icon size="small" color="white">mdi-cog</v-icon>
          </template>
          <v-list-item-title class="text-white">设置</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    hasSelection: {
      type: Boolean,
      default: false
    }
  },
  emits: ['action', 'close'],
  methods: {
    handleAction(action) {
      this.$emit('action', action);
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.custom-context-menu {
  position: fixed !important;
  z-index: 9999 !important;
  min-width: 150px;
  overflow: hidden;
  border-radius: 12px !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  background: rgba(30, 30, 30, 0.85) !important; /* Slightly darker for menu contrast */
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
  
  /* Additional glass styles to match theme but for fixed menu */
  border-top: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  transition: opacity 0.2s ease;
}

.v-list-item {
  min-height: 36px !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.v-list-item-title {
  font-size: 0.9rem !important;
  font-weight: 500;
  font-family: 'LXGW WenKai Screen', sans-serif !important;
}
</style>