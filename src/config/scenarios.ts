export interface ScenarioItemStep {
  after: number;
  param: string;
  value: number;
}

export interface ScenarioItem {
  name: string;
  completed: boolean;
  deaths: number;
  steps: ScenarioItemStep[];
}

export const scenarios: ScenarioItem[] = [
  {
    name: "Custom Scenario",
    steps: [],
    deaths: 0,
    completed: false
  },
  {
    name: "Social Distancing",
    deaths: 0,
    completed: false,
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 5,
        param: "socialDistancingRate",
        value: 100
      }
    ]
  },
  {
    name: "Interrupted Social Distancing",
    deaths: 0,
    completed: false,
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 5,
        param: "socialDistancingRate",
        value: 100
      },
      {
        after: 20,
        param: "socialDistancingRate",
        value: 0
      }
    ]
  },
  {
    name: "Closing Borders",
    deaths: 0,
    completed: false,
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 5,
        param: "borderClosingRate",
        value: 90
      },
      {
        after: 0,
        param: "socialDistancingRate",
        value: 0
      }
    ]
  },
  {
    name: "Enable Contact Tracking",
    deaths: 0,
    completed: false,
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 0,
        param: "socialDistancingRate",
        value: 0
      },
      {
        after: 5,
        param: "appTrackingPenetration",
        value: 50
      }
    ]
  }
];
