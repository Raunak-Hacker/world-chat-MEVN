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
  computed: {
    chat() {
      return this.$route.query.q == "chat";
    },
  },
};
</script>

<style lang="scss" scoped></style>
