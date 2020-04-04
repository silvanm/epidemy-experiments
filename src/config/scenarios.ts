export interface ScenarioItemStep {
  after: number;
  param: string;
  value: number;
}

export interface ScenarioItem {
  name: string;
  steps: ScenarioItemStep[];
}

export const scenarios: ScenarioItem[] = [
    {
    name: "Run",
    steps: []
  },
  {
    name: "Social Distancing",
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 10,
        param: "socialDistancingRate",
        value: 100
      }
    ]
  },
  {
    name: "Interrupted Social Distancing",
    steps: [
      {
        after: 0,
        param: "borderClosingRate",
        value: 5
      },
      {
        after: 10,
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
    steps: [
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
    name: "Enable AppTracking",
    steps: [
      {
        after: 5,
        param: "appTrackingPenetration",
        value: 50
      }
    ]
  }
];
