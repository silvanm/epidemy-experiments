import Vue from "vue";
import Vuex from "vuex";
import { StatEntry } from "@/Stats";
import { HealthState } from "@/Person";

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
    appTrackingPenetration: 0
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
    }
  },
  actions: {},
  modules: {}
});
