import Vue from "vue";
import Vuex from "vuex";
import { StatEntry } from "@/Stats";
import { HealthState } from "@/Person";
import { ScenarioItem, ScenarioItemStep } from "@/config/scenarios";

Vue.use(Vuex);

export interface StoreState {
  population: number;
  durationOfIllness: number;
  statEntries: StatEntry[];
  hospitalCapacity: number;
  deathRate: number;
  deathRateWithoutTreatment: number;
  borderClosingRate: number;
  socialDistancingRate: number;
  appTrackingPenetration: number;
  requestScenarioItemStep: ScenarioItemStep | null;
  currentScenario: ScenarioItem | null;
  isRunning: boolean;
  onCompletedCallback: Function | null;
}

export default new Vuex.Store({
  state: {
    population: 100,
    durationOfIllness: 10,
    statEntries: [] as StatEntry[],
    hospitalCapacity: 25,
    deathRate: 5,
    deathRateWithoutTreatment: 20,
    borderClosingRate: 10,
    socialDistancingRate: 0,
    appTrackingPenetration: 0,
    requestScenarioItemStep: null,
    currentScenario: null,
    isRunning: false,
    onCompletedCallback: null
  } as StoreState,
  getters: {
    lastState: state => {
      if (state.statEntries.length > 0) {
        return state.statEntries[state.statEntries.length - 1];
      } else {
        return null;
      }
    },
    hospitalBeds: state => {
      if (state.statEntries.length == 0) {
        return state.hospitalCapacity;
      }
      const lastStat = state.statEntries[state.statEntries.length - 1];
      return Math.max(
        state.hospitalCapacity - lastStat.populations[HealthState.Infected],
        0
      );
    }
  },
  mutations: {
    addStatEntry(state, entry: StatEntry) {
      state.statEntries.push(entry);
    },
    clearStats(state) {
      state.statEntries = [];
    },
    updateDurationOfIllness(state, value: number) {
      state.durationOfIllness = value;
    },
    updateHospitalCapacity(state, value: number) {
      state.hospitalCapacity = value;
    },
    updateDeathRateWithoutTreatment(state, value: number) {
      state.deathRateWithoutTreatment = value;
    },
    updateDeathRate(state, value: number) {
      state.deathRate = value;
    },
    updatePopulation(state, value: number) {
      state.population = value;
    },
    updateBorderClosingRate(state, value: number) {
      state.borderClosingRate = value;
    },
    updateSocialDistancingRate(state, value: number) {
      state.socialDistancingRate = value;
    },
    updateAppTrackingPenetration(state, value: number) {
      state.appTrackingPenetration = value;
    },
    updateCurrentScenario(
      state,
      value: { scenario: ScenarioItem; callback: Function }
    ) {
      state.currentScenario = value.scenario;
      state.onCompletedCallback = value.callback;
    },
    requestScenarioItemStep(state, value: ScenarioItemStep) {
      state.requestScenarioItemStep = value;
    },
    start(state) {
      state.isRunning = true;
    },
    stop(state) {
      state.isRunning = false;
      if (state.statEntries.length > 0 && state.onCompletedCallback !== null) {
        const lastState = state.statEntries[state.statEntries.length - 1];
        state.onCompletedCallback(lastState.populations[HealthState.Dead]);
      } else {
        return null;
      }
    }
  },
  modules: {}
});
