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
      <div class="slider-box">
        <h2>Control the simulation parameters</h2>
        <control :max="1000" label="Population" id="population"
        description="Number of dots"/>
        <control
          :max="50"
          label="Duration of Illness"
          id="durationOfIllness"
          description="After how many seconds the person recovers or dies"
          units="s"
        />
        <control
          :max="100"
          label="Death Rate"
          id="deathRate"
          units="%"
          description="This is the likelihood that the person dies at the end of the illness duration."
        />
        <control
          :max="100"
          label="Death Rate without Hospital bed"
          id="deathRateWithoutTreatment"
          units="%"
          description="The likelihood that the person dies at the end of the illness duration if the person does not get a hospital bed."
        />
        <control
          :max="1000"
          label="Available hospital beds"
          id="hospitalCapacity"
          units=" beds"
          description="Number of hospital beds available"
        />
        <control
          :max="100"
          label="Border Closing Rate"
          id="borderClosingRate"
          units="%"
          description="Whether borders are closed or not"
        />
        <control
          :max="100"
          label="Social Distancing Rate"
          id="socialDistancingRate"
          units="%"
          description="The higher this rate, the more the person's movement is freezed to symbolize 'staying at home'"
        />
        <control
          :max="100"
          label="Contact tracker penetration"
          id="appTrackingPenetration"
          units="%"
          description="The higher, the more the people have enabled contact tracking which allows them to be notified if they had contact to infected people."
        />
      </div>
      <div class="scenario-box">
        <h2>Run a scenario</h2>
        <scenarios @start="start()"></scenarios>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EpidemyCanvas from "@/components/EpidemyCanvas.vue";
import "vue-slider-component/theme/antd.css";
import EventBus from "@/event-bus";
import { Store } from "vuex";
import Scenarios from "@/components/Scenarios.vue";
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
    }
  } as any
};
</script>
<style lang="scss">
.home {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
#controls {
  display: flex;
  flex-direction: row;

  .slider-box {
    width: 800px;
  }

  .scenario-box {
    width: 390px;
    padding: 0 0 0 10px;
  }
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
