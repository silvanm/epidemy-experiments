<template>
  <div id="app">
    <h1>Epidemy-Experiments</h1>
    <p>
      This app allows us to simulate the spread of an infection like the
      Corona-Virus. Each dot represents a person. If the dot is gray, then the
      person is not infected yet. Once the person touches an infected person, it
      gets affected as well.
    </p>
    <p>
      Control the sliders and press on "Your scenario." Or click on any of the
      predefined scenarios to remote-control the sliders.
    </p>
    <p>
      Credit go to
      <a
        href="https://www.washingtonpost.com/graphics/2020/world/corona-simulator/"
        >this excellent article</a
      >
      in the Washington Post which influenced me heavily.
    </p>
    <router-view />
    <p><a href="https://muehlemann.com">Silvan Mühlemann</a>, 5. April 2020</p>
  </div>
</template>

<style lang="scss">
#app,
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
div {
  box-sizing: border-box;
}
#app {
  width: 1200px;
  margin: auto;
}

  a, a:visited {
    color: #118ab2;
  }

  a:hover {
    color: #073b4c;
  }
</style>
