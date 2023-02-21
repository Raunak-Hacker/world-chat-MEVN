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
    <div class="online" @click="toggle">
      <div class="green-circ"></div>
      <div class="cont">
        <strong>{{ continent }}</strong> ||
      </div>
      <div class="online-count">
        <span>&nbsp;{{ membersOnline }}</span>
        <small> Online</small>
      </div>
    </div>
    <div class="chat-container">
      <div class="chat" ref="chat">
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
        <input type="text" placeholder="Type your message..." v-model="msg" required />
        <button type="submit">
          <i class="fas fa-paper-plane"></i>
        </button>
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
      socket: {},
      msg: "",
      messages: [],
      membersOnline: 0,
      socket: null,
      name: localStorage.getItem("name"),
      alert: null,
      // url: "ws://192.168.1.13:3000/",
      url: "wss://world-chat-mevn-production.up.railway.app/",
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
    const continents = ["africa", "asia", "europe", "america", "australia", "about"];
    if (!continents.includes(this.continent)) {
      this.$router.replace({ name: "not-found" });
    }
  },
  mounted() {
    this.socket = new WebSocket(this.url);
    this.socket.onerror = () => {
      this.msg = "You are not allowed to connect";
      this.alert = true;
    };
    this.socket.onopen = () => {
      this.getMessages();
    };
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
      } else if (message.type === "online") {
        this.membersOnline = message.online;
      } else {
        this.messages.push(message);
      }
      this.$nextTick(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
      });
    };
  },
  methods: {
    toggle() {
      this.$store.commit("toggle");
    },
    getMessages() {
      try {
        var msg = {
          get: true,
          continent: this.continent,
        };
        this.socket.send(JSON.stringify(msg));
      } catch (error) {
        this.msg = "You are not connected";
        this.alert = true;
      }
    },
    async sendMessage() {
      var msg = {
        message: this.msg,
        continent: this.continent,
        name: this.name,
      };
      this.socket.send(JSON.stringify(msg));
      this.messages.push(msg);
      this.msg = "";
      this.$nextTick(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
      });
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
.online {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--body-color);
  color: var(--text-color);
  text-transform: capitalize;
  display: flex;
  align-items: center;
  padding-left: 2%;
  height: 10%;
  width: 100%;
  z-index: 0;
}
.online-count {
  font-family: "Raleway", sans-serif;
  font-size: 1.1rem;
}
.online-count span {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #00ff00;
  font-weight: bolder;
}
.green-circ {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #00ff00;
  margin: 0 10px;
  margin-bottom: 3px;
}
.chat-container {
  padding-top: 5%;
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
  overflow-y: auto;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(135deg, #4965d5 10%, #7102f7 100%);
}
.body.dark .chat {
  background-image: url("../assets/hexa.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.chat::-webkit-scrollbar {
  width: 0.5rem;
}

.chat::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
}

.chat::-webkit-scrollbar-thumb {
  background-image: linear-gradient(180deg, #00c6ff 0%, #3931af 99%);
  /* background: -webkit-linear-gradient(left, #a71b63, #ffd500); */
  box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5);
  border-radius: 100px;
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
  width: max-content;
  word-wrap: break-word;
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
  /* border-top: 1px solid #ccc; */
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
  /* padding: 10px 15px; */
  background-color: #50b0ff;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
}
button i {
  margin-top: 2px;
  margin-right: 2.5px;
}

@media (max-width: 768px) {
  .chat-input {
    position: fixed;
    bottom: 0;
    background-color: var(--body-color);
  }
  .chat {
    padding-bottom: 15vh;
    padding-top: 10vh;
  }
  .chat-input input {
    margin: 0 10px;
    padding: 10px;
    border-radius: 20px;
    border: none;
    width: 80vw;
  }

  .chat-input button {
    height: 10vw;
    width: 10vw;
    font-size: 4.5vw;
    padding: 2%;
  }
  .chat::-webkit-scrollbar {
    width: 0rem;
  }
}
</style>
