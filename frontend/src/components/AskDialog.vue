<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Please enter your nickname</h3>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitName">
            <input
              type="text"
              v-model="name"
              placeholder="Your code-name"
              minlength="3"
              maxlength="7"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  created() {},
  methods: {
    submitName() {
      this.$emit("nameSubmitted", this.name);
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-size: 14px;
}

.modal-header {
  margin-bottom: 10px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="text"] {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 2px #ccc;
  font-size: 14px;
}

button[type="submit"] {
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 2px;
  background-color: #2ecc71;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
