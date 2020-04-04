<template>
  <div class="home">
    <epidemy-canvas
      ref="canvas"
      width="800"
      height="400"
      :population="population"
      :radius="5"
      :duration-of-illness="durationOfIllness"
      :social-distancing-rate="socialDistancingRate"
    />
    <div id="controls">
      <control :max="1000" label="Population" id="population" />
      <control
        :max="10"
        label="Duration of Illness"
        id="durationOfIllness"
        units="s"
      />
      <control :max="100" label="Death Rate" id="deathRate" units="%" />
      <control
        :max="100"
        label="Death Rate without Treatment"
        id="deathRateWithoutTreatment"
        units="%"
      />
      <control
        :max="1000"
        label="Available hospital beds"
        id="hospitalCapacity"
        units=" beds"
      />
      <control
        :max="100"
        label="Border Closing Rate"
        id="borderClosingRate"
        units="%"
      />
      <control
        :max="100"
        label="Social Distancing Rate"
        id="socialDistancingRate"
        units="%"
      />
      <control
        :max="100"
        label="App tracker penetration"
        id="appTrackingPenetration"
        units="%"
      />
      <div class="control-row">
        <button @click="start()">Start</button>
      </div>
    </div>
    <scenarios
      @start="start()"
      @scenario-item-step="scenarioItemStep"
    ></scenarios>
  </div>
</template>

<script lang="ts">
import EpidemyCanvas from "@/components/EpidemyCanvas.vue";
import "vue-slider-component/theme/antd.css";
import EventBus from "@/event-bus";
import { Store } from "vuex";
import Scenarios from "@/components/Scenarios.vue";
import { ScenarioItemStep } from "@/config/scenarios";
import { StoreState } from "@/store";
import Control from "@/components/Control.vue";

interface StoreAccessors {
  get(): number;
  set(value: number): void;
  $store: Store<StoreState>;
}

export default {
  name: "Home",
  components: {
    Control,
    Scenarios,
    EpidemyCanvas
  },
  computed: {
    population(): number {
      return this.$store.state.population;
    },
    durationOfIllness(): number {
      return this.$store.state.durationOfIllness;
    },
    socialDistancingRate(): number {
      return this.$store.state.socialDistancingRate;
    }
  } as any,
  methods: {
    start() {
      EventBus.$emit("start");
    },
    scenarioItemStep(e: ScenarioItemStep) {
      this.$refs[e.param].setValue(e.value);
    }
  } as any
};
</script>
<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
#controls {
  width: 500px;
}
</style>
