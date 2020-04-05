<template>
  <div class="scenarios">
    <h2>Pick a Scenario</h2>
    <div
      class="row"
      v-for="scenario in scenarios"
      :key="scenario.name"
      @click="run(scenario)"
    >
      <div v-bind:class="{ button: true, active: scenarioIsActive(scenario) }">
        <font-awesome-icon icon="play" />
        {{ scenario.name }}
      </div>
      <span v-if="scenario.completed"> {{ scenario.deaths }} Deaths </span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { scenarios, ScenarioItem, ScenarioItemStep } from "@/config/scenarios";
import { StoreState } from "@/store";
import VueSlider from "vue-slider-component";
import { HealthState } from "@/Person";

@Component
export default class Scenarios extends Vue {
  scenarios = scenarios;
  currentScenario: ScenarioItem | null = null;
  timers: number[] = [];

  clearTimers() {
    this.timers.forEach(t => {
      window.clearTimeout(t);
    });
  }

  scenarioIsActive(scenario: ScenarioItem) {
    if (!scenario) return false;
    return scenario.name == this.currentScenario?.name && !this.currentScenario.completed;
  }

  run(scenario: ScenarioItem) {
    this.clearTimers();
    this.currentScenario = scenario;
    scenario.completed = false;
    this.$store.commit("updateCurrentScenario", {
      scenario: scenario,
      callback: (deaths: number) => {
        if (this.currentScenario !== null) {
          this.currentScenario.completed = true;
          this.currentScenario.deaths = deaths;
        }
      }
    });
    scenario.steps.forEach((s: ScenarioItemStep) => {
      const t = window.setTimeout(() => {
        this.$store.commit("requestScenarioItemStep", s);
      }, s.after * 1000);
      this.timers.push(t);
    });
    this.$emit("start");
  }
}
</script>
<style lang="scss">
div.row {
  div.button {
    &:hover,
    &.active {
      background-color: #073b4c;
    }

    background-color: #118ab2;
    font-weight: bold;
    color: white;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    display: inline-block;
    width: 250px;

    &.active .fa-play {
      animation: blinker 1s linear infinite;
    }

    @keyframes blinker {
      50% {
        opacity: 0;
      }
    }
  }
}
</style>
