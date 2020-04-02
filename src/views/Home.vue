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
      <div class="control-row">
        <label>Population</label>
        <vue-slider
          ref="population"
          v-model="population"
          :min="0"
          :max="1000"
          width="200px"
        />
        <div>{{ population }}s</div>
      </div>
      <div class="control-row">
        <label>Duration of Illness</label>
        <vue-slider
          ref="durationOfIllness"
          v-model="durationOfIllness"
          :min="0"
          :max="10"
          width="200px"
        />
        <div>{{ durationOfIllness }}s</div>
      </div>
      <div class="control-row">
        <label>Death Rate</label>
        <vue-slider
          ref="deathRate"
          v-model="deathRate"
          :min="0"
          :max="100"
          width="200px"
        />
        <div>{{ deathRate }}%</div>
      </div>
      <div class="control-row">
        <label>Death Rate without Treatment</label>
        <vue-slider
          ref="deathRateWithoutTreatment"
          v-model="deathRateWithoutTreatment"
          :min="0"
          :max="100"
          width="200px"
        />
        <div>{{ deathRateWithoutTreatment }}%</div>
      </div>
      <div class="control-row">
        <label>Hospital Capacity</label>
        <vue-slider
          ref="hospitalCapacity"
          v-model="hospitalCapacity"
          :min="0"
          :max="1000"
          width="200px"
        />
        <div>{{ hospitalCapacity }} ppl</div>
      </div>
      <div class="control-row">
        <label>Social Distancing Rate</label>
        <vue-slider
          ref="socialDistancingRate"
          v-model="socialDistancingRate"
          :min="0"
          :max="100"
          width="200px"
        />
        <div>{{ socialDistancingRate }}%</div>
      </div>
      <div class="control-row">
        <label>Border Closing Rate</label>
        <vue-slider
          ref="borderClosingRate"
          v-model="borderClosingRate"
          :min="0"
          :max="100"
          width="200px"
        />
        <div>{{ borderClosingRate }}%</div>
      </div>
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
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import EventBus from "@/event-bus";
import { Store } from "vuex";
import Scenarios from "@/components/Scenarios.vue";
import { ScenarioItemStep } from "@/config/scenarios";

interface StoreAccessors {
  get(): number;
  set(value: number): void;
  $store: Store<any>;
}

export default {
  name: "Home",
  components: {
    Scenarios,
    EpidemyCanvas,
    VueSlider
  },
  data() {
    return {
      durationOfIllness: 10,
      socialDistancingRate: 0
    };
  },
  computed: {
    hospitalCapacity: {
      get(): number {
        return this.$store.state.hospitalCapacity;
      },
      set(value: number) {
        this.$store.commit("updateHospitalCapacity", value);
      }
    } as StoreAccessors,
    deathRate: {
      get(): number {
        return this.$store.state.deathRate;
      },
      set(value: number) {
        this.$store.commit("updateDeathRate", value);
      }
    } as StoreAccessors,
    deathRateWithoutTreatment: {
      get(): number {
        return this.$store.state.deathRateWithoutTreatment;
      },
      set(value: number) {
        this.$store.commit("updateDeathRateWithoutTreatment", value);
      }
    } as StoreAccessors,
    population: {
      get(): number {
        return this.$store.state.population;
      },
      set(value: number) {
        this.$store.commit("updatePopulation", value);
      }
    } as StoreAccessors,
    borderClosingRate: {
      get(): number {
        return this.$store.state.borderClosingRate;
      },
      set(value: number) {
        this.$store.commit("updateBorderClosingRate", value);
      }
    } as StoreAccessors
  },
  methods: {
    start() {
      EventBus.$emit("start");
    },
    scenarioItemStep(e: ScenarioItemStep) {
      this.$refs[e.param].setValue(e.value);
    }
  }
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
.control-row {
  display: flex;
  flex-direction: row;
  margin: 5px;
  label,
  div {
    padding: 0 10px;
  }

  label {
    text-align: right;
    width: 200px;
  }
}
</style>
