<template>
  <div class="scenarios">
    <div class="row" @click="run(scenarios[0])">
      <div class="button">
        <font-awesome-icon icon="play" />
        Restart
      </div>
    </div>
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
      <div class="scenario-deaths" v-if="oneScenarioHasRun">
        {{ scenario.completed ? scenario.deaths : "__" }}
      </div>
      <div class="scenario-death-label" v-if="oneScenarioHasRun">Deaths</div>
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
  oneScenarioHasRun = false;
  timers: number[] = [];

  clearTimers() {
    this.timers.forEach(t => {
      window.clearTimeout(t);
    });
  }

  scenarioIsActive(scenario: ScenarioItem) {
    if (!scenario) return false;
    return (
      scenario.name == this.currentScenario?.name &&
      !this.currentScenario.completed
    );
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
          this.oneScenarioHasRun = true;
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

  mounted() {
    this.run(scenarios[0]);
  }
}
</script>
<style lang="scss">
div.row {
  display: flex;
  align-items: center;

  div {
    margin-left: 5px;
  }

  .scenario-deaths {
    text-align: right;
  }

  div.button {
    &:hover,
    &.active {
      background-color: #073b4c;
    }

    background-color: #118ab2;
    font-weight: bold;
    color: white;
    padding: 5px;
    margin: 1px;
    cursor: pointer;
    display: inline-block;
    width: 300px;

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
