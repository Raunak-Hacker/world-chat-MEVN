<template>
  <section id="aboutUs">
    <div class="headings">
      <h3>The Most Innovative Theme On Earth</h3>
      <br />
      <br />
      <h1>
        I built this Web App to connect people from all over the world and share their
        experiences.
      </h1>
      <br /><br />
    </div>

    <div class="photos">
      <div class="photo">
        <img src="../assets/Raunak.jpg" />
      </div>

      <div class="name">
        <strong>Raunak Sadhwani</strong>
        <p>Full Stack & UI/UX Developer</p>
      </div>
    </div>
  </section>
</template>

<script></script>

<style scoped>
* {
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  margin: 0;
  margin: auto;
}
#aboutUs {
  padding-top: 1rem;
  text-align: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
h1 {
  font-size: 1em;
  font-weight: 700;
  line-height: 1rem;
}
.headings {
  width: 55%;
  margin: auto;
  height: max-content;
}
.headings h3 {
  color: green;
}
.headings p {
  font-size: small;
}
strong {
  line-height: 1rem;
  font-size: 4rem;
}
p {
  font-family: "Montserrat", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  text-align: center;
  /* color: gray; */
  line-height: normal;
  vertical-align: middle;
}
.photos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  height: max-content;
  flex-wrap: wrap;
}

.photo img {
  border-radius: 5px;
  transition: 0.5s;
  height: 100%;
  display: block;
  margin: auto;
}
.photo {
  flex: 1;
  /* position: relative; */
}
img:hover {
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.8);
}
.body.dark h1 {
  color: var(--text-color);
}
.body.dark .name {
  color: rgba(255, 239, 213, 0.9);
}
.name {
  /* white-space: nowrap; */
  flex: 1;
  overflow-wrap: break-word;
  box-sizing: border-box;
  margin-right: 10%;
  border-radius: 10px 10px 0px 0px;
  line-height: 5rem;
  text-align: center;
  text-shadow: 0 1px 0 rgb(37, 37, 37), 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9,
    0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2),
    0 5px 5px rgba(0, 0, 0, 0.25), 0 10px 5px rgba(0, 0, 0, 0.2),
    0 10px 5px rgba(0, 0, 0, 0.15);
}
@media (min-width: 768px) {
  .photos {
    margin: 0;
  }
}
@media (max-width: 768px) {
  .headings {
    margin-top: 10%;
    width: 90%;
  }
  .headings p {
    width: 80%;
  }
  .photos {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .photo {
    flex-basis: 31%;
    border-radius: 10px;
    margin-bottom: 5%;
    box-sizing: border-box;
    transition: 0.5s;
    height: max-content;
    width: 100%;
  }
  .photo img {
    width: 80%;
  }
  .name {
    box-sizing: border-box;
    border-radius: 10px 10px 0px 0px;
    text-align: center;
    /* background-color: #fff; */
    height: 10%;
    margin: auto;
    width: 70%;
    bottom: -15%;
    left: 15%;
  }

  strong {
    line-height: 1rem;
    font-size: 1rem;
  }
  p {
    font-family: "Montserrat", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.7rem;
    text-align: center;
    line-height: normal;
    vertical-align: middle;
  }
}
</style>
