<template>
  <div id="app">
    <h1>Epidemy-Experiments</h1>
    <p>
      This app allows to picture the spread of an infection like the
      Corona-Virus. Each dot represents a person. If the dot is gray
      <span style="color: #D5E1C8">&#9679;</span>, then the person is not infected
      yet. Once the person touches an infected person <span style="color: #EF476F">&#9679;</span>, it gets affected as well.
      After the duration of the illness the person either recovers <span style="color: #06D6A0">&#9679;</span> or dies <span style="color: #000000">&#9679;</span>.
    </p>
    <p>
      Control the sliders and press on <span style="color: white;font-weight: bold;background-color: #118ab2;margin: 5px"> Custom scenario</span>. Or click on any of the
      predefined scenarios to remote-control the sliders.
    </p>
    <p>
      Credits go to
      <a
        href="https://www.washingtonpost.com/graphics/2020/world/corona-simulator/"
        >this excellent article</a
      >
      in the Washington Post which influenced me heavily.
    </p>
    <router-view />
    <p><a href="https://muehlemann.com">Silvan Mühlemann</a>, 5. April 2020. <a href="https://github.com/silvanm/epidemy-experiments">Source on Github</a>.</p>
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

@media only screen and (max-width: 500px) {

  #app {
    width: auto;
    font-size: 12px;
  }
}

a,
a:visited {
  color: #118ab2;
}

a:hover {
  color: #073b4c;
}
</style>
