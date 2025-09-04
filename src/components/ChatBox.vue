<template>
  <v-card class="chat-card">
    <div class="chat-header d-flex align-center justify-space-between px-6 py-4">
      <div class="d-flex align-center text-white text-h6">
        <v-icon icon="mdi-robot" start class="mr-2" />
        AI 总结助手
      </div>
    </div>

    <v-divider />

    <v-sheet class="chat-window" height="530" rounded>
      <div
          v-for="(msg, index) in messages"
          :key="index"
          class="d-flex pa-2"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
      >
        <v-avatar v-if="msg.from === 'ai'" size="32" class="mr-2">
          <v-icon icon="mdi-robot" />
        </v-avatar>

        <v-card
            :color="msg.from === 'user' ? 'primary-lighten-4' : 'blue-lighten-4'"
            elevation="2"
            class="pa-3 rounded-lg"
            style="max-width: 75%; white-space: pre-wrap; word-break: break-word; font-size: 14px;"
        >
          {{ msg.text }}
        </v-card>

        <v-avatar v-if="msg.from === 'user'" size="32" class="ml-2">
          <v-icon icon="mdi-account" />
        </v-avatar>
      </div>
    </v-sheet>

    <v-divider />

    <div class="d-flex align-center px-4 py-2 chat-input-area">
      <v-text-field
          v-model="input"
          placeholder="请输入消息"
          variant="outlined"
          density="compact"
          hide-details
          class="flex-grow-1 mr-3"
          @keyup.enter="sendMessage"
      />

      <v-btn color="primary" @click="sendMessage" icon>
        <v-icon icon="mdi-send" />
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { BaseURL } from '@/api/request'

const props = defineProps<{
  id: number
}>()

const input = ref('')
const sno = ref('')
const snoConfirmed = ref(false)
const messages = ref<{ from: 'user' | 'ai'; text: string }[]>([
  { from: 'ai', text: '请输入学号' }
])

function sendMessage() {
  const userMessage = input.value.trim()
  if (!userMessage) return

  messages.value.push({ from: 'user', text: userMessage })
  input.value = ''

  if (!snoConfirmed.value) {
    sno.value = userMessage
    snoConfirmed.value = true
    messages.value.push({ from: 'ai', text: `学号已记录：${sno.value}，你可以开始提问了。` })
    return
  }

  const aiMessage = { from: 'ai' as const, text: '' }
  messages.value.push(aiMessage)

  const params = new URLSearchParams({
    sno: sno.value,
    gameId: String(props.id),
    message: userMessage,
    type: '1',
  })

  const es = new EventSource(BaseURL + '/log/stream?' + params.toString())

  es.onmessage = (event) => {
    messages.value[messages.value.length - 1].text += event.data
  }

  es.onerror = () => {
    es.close()
  }
}
</script>

<style scoped>
.chat-card {
  width: 500px;
  height: 660px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chat-header {
  font-size: 20px;
  font-weight: bold;
  padding: 16px 24px;
  background: linear-gradient(to right, #42a5f5, #64b5f6);
  color: white;
  display: flex;
  align-items: center;
}

.chat-window {
  background-color: #f9f9f9;
  overflow-y: auto;
}

.chat-input-area {
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}
</style>

