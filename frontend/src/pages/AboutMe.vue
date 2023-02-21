<template>
  <TheSidebar v-if="chat">
    <AboutComp />
  </TheSidebar>
  <AboutComp v-else />
</template>

<script>
import TheSidebar from "../components/TheSidebar.vue";
import AboutComp from "../components/AboutComp.vue";

export default {
  components: {
    AboutComp,
    TheSidebar,
  },
  created() {
    this.$store.commit("toggle", true);
  },
  computed: {
    chat() {
      return this.$route.query.q == "chat";
    },
  },
};
</script>
