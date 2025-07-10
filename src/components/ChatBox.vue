  <template>
  <v-card height="660" width="500">
    <div class="text-h6 pa-4 pl-8 bg-blue-lighten-1">AI 总结</div>

    <div class="chat-banner d-flex pb-3 px-10 bg-yellow-lighten-4">
      <div class="mt-2" style="font-size: 18px">您可以输入学生的学号：</div>
      <v-text-field
          max-width="150"
          v-model="sno"
          variant="underlined"
          density="compact"
          hide-details
          class="ml-6"
      ></v-text-field>
    </div>

    <v-divider />

    <v-sheet color="#f4f4f4" class="chat-window" height="480" rounded>
      <div
          v-for="(msg, index) in messages"
          :key="index"
          class="pa-2 d-flex"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
      >
        <v-card
            :color="msg.from === 'user' ? 'blue-lighten-4' : 'green-lighten-4'"
            class="pa-3"
            style="max-width: 80%; white-space: pre-wrap; word-break: break-word; font-size: 14px;"
        >
          {{ msg.text }}
        </v-card>
      </div>
    </v-sheet>
    <v-divider />

    <div class="d-flex mt-2 mx-2">
      <v-text-field
          v-model="input"
          variant="outlined"
          density="compact"
          placeholder="请输入消息"
          class="flex-grow-1 mr-2"
          @keyup.enter="sendMessage"
          hide-details
      ></v-text-field>
      <v-btn color="primary" @click="sendMessage">发送</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {BaseURL} from "@/api/request";

const input = ref('')
const sno = ref('')
const messages = ref<{ from: 'user' | 'ai'; text: string }[]>([])

function sendMessage() {
  messages.value.push({ from: 'user', text: input.value.trim() })
  const userMessage = input.value.trim()
  input.value = ''

  const aiMessage = { from: 'ai' as const, text: '' }
  messages.value.push(aiMessage)

  const params = new URLSearchParams({
    sno: sno.value,
    gameId: String(82),
    message: userMessage,
    type: sno.value === '' ? '0' : '1',
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
.chat-window {
  overflow-y: auto;
}
</style>
