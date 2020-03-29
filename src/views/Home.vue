<template>
  <div class="home">
    <epidemy-canvas
      ref="canvas"
      width="800"
      height="400"
      :population="100"
      :radius="5"
    />
    <div id="controls">
      <div class="control-row">
        <label>Duration of Illness</label>
        <vue-slider v-model="durationOfIllness" :min="0" :max="10" width="200px" />
        <div>{{ durationOfIllness }}s</div>
      </div>
      <div class="control-row">
        <button @click="start()">Start</button>
        <button @click="restart()">Restart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EpidemyCanvas from "@/components/EpidemyCanvas.vue";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import EventBus from "@/event-bus";

export default {
  name: "Home",
  components: {
    EpidemyCanvas,
    VueSlider
  },
  data() {
    return {
      durationOfIllness: 10
    };
  },
  methods: {
    start() {
      console.log("start");
      EventBus.$emit("start");
    },
    restart() {
      EventBus.$emit("restart");
    }
  }
};
</script>
<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap
}
#controls {
  width: 500px;
}
.control-row {
  display: flex;
  flex-direction: row;
  label, div {
    padding: 5px;
  }
}
</style>
