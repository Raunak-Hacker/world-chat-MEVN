<template>
  <AskDialog v-if="!name" @nameSubmitted="saveName" />
  <BaseDialog
    v-else-if="alert"
    :show="!!alert"
    title="An error occured"
    @close="handleAlert"
  >
    <p>{{ msg }}</p>
  </BaseDialog>
  <TheSidebar v-else>
    <div class="chat-container">
      <div class="chat">
        <div
          class="chat-message"
          :class="{ user: message.name === name }"
          v-for="message in messages"
          :key="message.id"
        >
          <div class="message-sender" v-if="message.name !== name">
            {{ message.name }}
          </div>
          <div class="message-text">{{ message.message }}</div>
        </div>
      </div>
      <form class="chat-input" @submit.prevent="sendMessage">
        <input type="text" placeholder="Type your message..." v-model="msg" />
        <button type="submit">Send</button>
      </form>
    </div>
  </TheSidebar>
</template>
<script>
import AskDialog from "../components/AskDialog.vue";
import BaseDialog from "../components/BaseDialog.vue";
import TheSidebar from "../components/TheSidebar.vue";

export default {
  components: {
    AskDialog,
    BaseDialog,
    TheSidebar,
  },
  data() {
    return {
      drawer: true,
      socket: {},
      msg: "",
      status: "Connecting...",
      messages: [],
      socket: null,
      name: localStorage.getItem("name"),
      alert: null,
      url: "localhost:3000",
      continent: this.$route.params.id,
    };
  },
  watch: {
    $route(to) {
      this.continent = to.params.id;
      this.getMessages();
    },
  },
  beforeUnmount() {
    this.socket.close();
  },
  created() {
    // query params
    // console.log(this.$route.query.q);
    const continents = ["africa", "asia", "europe", "america", "australia", "about"];
    if (!continents.includes(this.continent)) {
      this.$router.replace({ name: "not-found" });
    }
  },
  mounted() {
    this.socket = new WebSocket("ws://" + this.url);
    this.socket.addEventListener("error", (event) => {
      event.preventDefault();
      this.msg = "Connection error";
      this.alert = true;
    });
    this.socket.addEventListener("open", (event) => {
      this.status = "Connected";
      this.getMessages();
    });
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.messages) {
        if (message.messages.length > 0) {
          this.messages = message.messages;
        } else {
          this.messages = [];
        }
      } else if (message.type === "alert") {
        this.alert = message.message;
        this.msg = message.message;
      } else {
        console.log(message);
        this.messages.push(message);
      }
      const chat = document.querySelector(".chat");
      chat.scrollTop = chat.scrollHeight;
    };
  },
  methods: {
    getMessages() {
      var msg = {
        get: true,
        continent: this.continent,
      };
      this.socket.send(JSON.stringify(msg));
    },
    async sendMessage() {
      var msg = {
        message: this.msg,
        continent: this.continent,
        name: this.name,
      };
      this.socket.send(JSON.stringify(msg));
      this.msg = "";
    },
    saveName(name) {
      this.name = name;
      localStorage.setItem("name", name);
    },
    handleAlert() {
      window.location.replace("https://www.google.com");
    },
  },
};
</script>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
/* .name {
  color: papayawhip;
} */
.chat {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(135deg, #6b73ff 10%, #000dff 100%);
  background-image: linear-gradient(135deg, #97abff 10%, #123597 100%);
  background-image: linear-gradient(to right, #5d5d5d 50%, black 100%);
  /* background-image: url("../assets/hexa.jpg"); */
  background-size: contain;
}

.chat-message {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}

.chat-message.user .message-text {
  background: linear-gradient(180deg, #d2977d 10%, #b3315f 100%);

  color: rgb(228, 228, 228);
  border-radius: 15px 15px 0 15px;
  align-self: flex-end;
}
.message-text {
  max-width: 80%;
  padding: 15px;
  border-radius: 15px 15px 15px 0;
  background: linear-gradient(to bottom, #ffffff, #cbc9c9);
  box-shadow: 10px 10px 10px 0 rgba(0, 0, 0, 0.1);
  color: #000000;
  margin-bottom: 1rem;
}

@media (min-width: 576px) {
  .message-text {
    max-width: 40%;
  }
}

@media (min-width: 992px) {
  .message-text {
    max-width: 20%;
  }
}

.message-sender {
  /* align-self: flex-end; */
  font-size: 1rem;
  color: #fff;
  margin-bottom: 5px;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border-radius: 20px;
  border: none;
  outline: 0;
}

.chat-input button {
  padding: 10px;
  background-color: #50b0ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
</style>
