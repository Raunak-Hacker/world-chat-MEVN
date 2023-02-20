<template>
  <div class="body" :class="{ dark: dark }">
    <nav class="sidebar" :class="{ close: close }">
      <header>
        <div class="image-text">
          <!-- <span class="image">
            <img src="@/assets/logo.png" />
          </span> -->

          <div class="text logo-text" v-if="!close">
            <!-- <span class="name">ADMIN PANEL</span> -->
            <span class="profession">User: {{ name }}</span>
          </div>
        </div>

        <i class="bx bx-chevron-right toggle" @click="toggle"></i>
      </header>

      <div class="menu-bar">
        <div class="menu">
          <ul class="menu-links">
            <li class="mode" @click="darkMode">
              <div class="sun-moon">
                <i class="bx bx-moon icon moon" />
                <i class="bx bx-sun icon sun" />
              </div>
              <!-- <span class="mode-text text">
                <p v-if="dark">Light Mode</p>
                <p v-else>Dark Mode</p>
              </span> -->

              <div class="toggle-switch" v-if="!close">
                <span class="switch"></span>
              </div>
            </li>
            <li
              v-for="(item, index) in menuItems"
              :key="index"
              :class="{ selBox: activeState === index }"
              @click="setState(index)"
            >
              <a>
                <i :class="item.iconClass"></i>
                <span class="text nav-text">{{ item.label }}</span>
              </a>
            </li>
            <li @click="aboutPush">
              <a>
                <i class="bx bx-info-circle icon"></i>
                <span class="text nav-text">About</span>
              </a>
            </li>
            <li @click="">
              <a>
                <i class="bx bx-log-out icon"></i>
                <span class="text nav-text">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <section class="home">
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  created() {
    const continent = this.$route.params.id;
    if (continent != "europe") {
      const index = this.menuItems.findIndex((item) => item.label === continent);
      this.activeState = index;
    }
  },
  data() {
    return {
      name: localStorage.getItem("name"),
      close: true,
      dark: false,
      activeState: 0,
      menuItems: [
        {
          label: "europe",
          iconClass: "fa-solid fa-globe-europe icon",
        },
        {
          label: "asia",
          iconClass: "fa-solid fa-globe-asia icon",
        },
        {
          label: "australia",
          iconClass: "fa-solid fa-globe-oceania icon",
        },
        {
          label: "africa",
          iconClass: "fa-solid fa-earth-africa icon",
        },
        {
          label: "america",
          iconClass: "fa-solid fa-globe-americas icon",
        },
      ],
    };
  },
  methods: {
    aboutPush() {
      this.$router.push({ name: "about", query: { q: "chat" } });
    },
    logout() {
      this.$store.dispatch("logout");
    },
    toggle() {
      this.close = !this.close;
    },
    darkMode() {
      this.dark = !this.dark;
    },
    setState(index) {
      this.activeState = index;
      this.$router.push(this.menuItems[index].label.toLowerCase());
      this.$emit("change");
      // this.close = !this.close;
    },
  },
};
</script>

<style>
/* Google Font Import - Poppins */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

:root {
  --body-color: #e4e9f7;
  --sidebar-color: #fff;
  --primary-color: #695cfe;
  --primary-color-light: #f6f5ff;
  --toggle-color: #ddd;
  --text-color: #707070;
  --tran-03: all 0.2s ease;
  --tran-03: all 0.3s ease;
  --tran-04: all 0.3s ease;
  --tran-05: all 0.3s ease;
  --side-width: 11rem;
}

.body {
  height: 100vh;
  width: 100%;
  max-height: 100vh;
  max-width: 100%;
  background-color: var(--body-color);
  transition: var(--tran-05);
  display: flex;
}

::selection {
  background-color: var(--primary-color);
  color: #fff;
}

.body.dark {
  /* --body-color: #313f4d; */
  --body-color: #242526;
  --sidebar-color: #242526;
  --primary-color: #3a3b3c;
  --primary-color-light: #3a3b3c;
  --toggle-color: #fff;
  --text-color: #ccc;
}
.nav-text {
  text-transform: capitalize;
}
.home {
  position: fixed;
  height: 100vh;
  left: var(--side-width);
  width: calc(100% - var(--side-width));
  background-color: var(--body-color);
  transition: var(--tran-05);
}

.home .text {
  font-size: 1.87rem;
  font-weight: 500;
  color: var(--text-color);
  padding: 12px 60px;
}

.sidebar.close ~ .home {
  height: 100vh;
  left: 4.8rem;
  width: calc(100% - 4.8rem);
}

.body.dark .home .text {
  color: var(--text-color);
}
.sidebar {
  height: 100%;
  width: var(--side-width);
  padding: 0.6rem 0.85rem;
  background: var(--sidebar-color);
  transition: var(--tran-05);
  z-index: 1;
  /* overflow: auto; */
  /* overflow-x: auto; */
}
body::-webkit-scrollbar {
  display: none;
  width: 0;
}

.sidebar.close {
  width: 4.8rem;
}

.sidebar li {
  height: 3.1rem;
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 0.6rem;
  cursor: pointer;
}

.sidebar header .image,
.sidebar .icon {
  min-width: 3rem;
  border-radius: 6px;
}

.sidebar .icon {
  min-width: 3.25rem;
  border-radius: 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.sidebar .text,
.sidebar .icon {
  color: var(--text-color);
  transition: var(--tran-03);
}

.sidebar .text {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
  visibility: visible;
}

.sidebar.close .text {
  opacity: 0;
  visibility: hidden;
}

/* =========================== */

.sidebar {
  position: relative;
}

.sidebar header .image-text {
  /* display: flex; */
  /* align-items: space-around; */
}

.sidebar header .logo-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

header .image-text .name {
  margin-top: 2px;
  font-size: 1.15rem;
  font-weight: 600;
}

header .image-text .profession {
  font-size: 1rem;
  margin-top: 0.1rem;
  display: block;
}

.sidebar header .image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar header .image img {
  width: 2.5rem;
  border-radius: 6px;
}

.sidebar header .toggle {
  position: absolute;
  z-index: 5;
  top: 50%;
  right: -0.8rem;
  transform: translateY(-50%) rotate(180deg);
  height: 1.5rem;
  width: 1.5rem;
  background-color: var(--primary-color);
  color: var(--sidebar-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  transition: var(--tran-05);
}

.body.dark .sidebar header .toggle {
  color: var(--text-color);
}

.sidebar.close .toggle {
  transform: translateY(-50%) rotate(0deg);
}

.sidebar .menu {
  /* margin-top: 2.5rem; */
}

.selBox {
  border-radius: 6px;
  cursor: pointer;
  transition: var(--tran-05);
}

.sidebar li.search-box input {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  background-color: var(--primary-color-light);
  color: var(--text-color);
  border-radius: 6px;
  font-size: 17px;
  font-weight: 500;
  transition: var(--tran-05);
}

.sidebar li a {
  list-style: none;
  height: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  text-decoration: none;
  transition: var(--tran-03);
}

.sidebar li a:hover,
.selBox {
  background-color: var(--primary-color);
}

.sidebar li a:hover .icon,
.sidebar li a:hover .text,
.selBox .icon,
.selBox .text {
  color: var(--sidebar-color);
}

.body.dark .sidebar li a:hover .icon,
.body.dark .sidebar li a:hover .text,
.body.dark .selBox .icon,
.body.dark .selBox .text {
  color: var(--text-color);
}

.sidebar .menu-bar {
  /* height: 90%; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* overflow-y: scroll; */
}

.sidebar .menu-bar .mode {
  border-radius: 6px;
  background-color: var(--primary-color-light);
  position: relative;
  transition: var(--tran-05);
}
.body.dark .sidebar .menu-bar .mode {
  background-color: transparent;
}

.menu-bar .mode .sun-moon {
  height: 3.125rem;
  width: 3rem;
}

.mode .sun-moon i {
  position: absolute;
}

.mode .sun-moon i.sun {
  opacity: 0;
}

.body.dark .mode .sun-moon i.sun {
  opacity: 1;
}

.body.dark .mode .sun-moon i.moon {
  opacity: 0;
}

.menu-bar .toggle-switch {
  /* position: absolute; */
  /* right: 0; */
  /* height: 100%; */
  min-width: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
}

.toggle-switch .switch {
  position: relative;
  height: 22px;
  width: 2.5rem;
  border-radius: 1.5rem;
  background-color: var(--toggle-color);
  transition: var(--tran-05);
}

.switch::before {
  content: "";
  position: absolute;
  height: 0.93rem;
  width: 0.93rem;
  border-radius: 50%;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  background-color: var(--sidebar-color);
  transition: var(--tran-04);
}

.body.dark .switch::before {
  left: 1.4rem;
}
</style>
