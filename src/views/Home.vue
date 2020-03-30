<template>
  <div class="home">
    <epidemy-canvas
      ref="canvas"
      width="800"
      height="400"
      :population="population"
      :radius="5"
      :duration-of-illness="durationOfIllness"
      :death-rate="deathRate"
      :death-rate-without-treatment="deathRateWithoutTreatment"
      :social-distancing-rate="socialDistancingRate"
      :hospital-capacity="hospitalCapacity"
    />
    <div id="controls">
      <div class="control-row">
        <label>Population</label>
        <vue-slider v-model="population" :min="0" :max="1000" width="200px" />
        <div>{{ population }}s</div>
      </div>
      <div class="control-row">
        <label>Duration of Illness</label>
        <vue-slider v-model="durationOfIllness" :min="0" :max="10" width="200px" />
        <div>{{ durationOfIllness }}s</div>
      </div>
      <div class="control-row">
        <label>Death Rate</label>
        <vue-slider v-model="deathRate" :min="0" :max="100" width="200px" />
        <div>{{ deathRate }}%</div>
      </div>
      <div class="control-row">
        <label>Death Rate without Treatment</label>
        <vue-slider v-model="deathRateWithoutTreatment" :min="0" :max="100" width="200px" />
        <div>{{ deathRateWithoutTreatment }}%</div>
      </div>
      <div class="control-row">
        <label>Hospital Capacity</label>
        <vue-slider v-model="hospitalCapacity" :min="0" :max="1000" width="200px" />
        <div>{{ hospitalCapacity }} ppl</div>
      </div>
      <div class="control-row">
        <label>Social Distancing Rate</label>
        <vue-slider v-model="socialDistancingRate" :min="0" :max="100" width="200px" />
        <div>{{ socialDistancingRate }}%</div>
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
      population: 100,
      durationOfIllness: 10,
      deathRate: 5,
      deathRateWithoutTreatment: 20,
      socialDistancingRate: 0,
      hospitalCapacity: 50
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
  margin: 5px;
  label, div {
    padding: 0 10px;
  }

  label {
    text-align: right;
    width: 200px
  }
}
</style>
