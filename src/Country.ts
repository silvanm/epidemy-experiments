import { HealthState, Person } from "@/Person";
import { Position, Vector } from "@/Utils";
import { StatEntry } from "@/Stats";

export class Country {
  width: number;
  height: number;
  people: Person[];
  lastTs: number;

  constructor(width: number, height: number, people: Person[] = []) {
    this.people = people;
    this.width = width;
    this.height = height;
    this.lastTs = Date.now();
  }

  createPeople(population: number, radius: number): void {
    for (let i = 0; i < population; i++) {
      const position: Position = {
        x: Math.random() * this.width,
        y: Math.random() * this.height
      };

      const direction = Math.PI * 2 * Math.random();

      const speed: Vector = {
        x: Math.cos(direction) * 0.1,
        y: Math.sin(direction) * 0.1
      };
      const person = new Person(position, speed, radius);
      this.people.push(person);
    }
  }

  infectPeople(number: number): void {
    const arr = [];
    while (arr.length < number) {
      const r = Math.floor(Math.random() * this.people.length) + 1;
      if (arr.indexOf(r) === -1) {
        this.people[r].infect();
        arr.push(r);
      }
    }
  }

  static distance(p1: Person, p2: Person): number {
    return (
      Math.pow(p1.position.x - p2.position.x, 2) +
      Math.pow(p1.position.y - p2.position.y, 2)
    );
  }

  private checkCollisions(): void {
    for (let i = 0; i < this.people.length; i++) {
      for (let j = i + 1; j < this.people.length; j++) {
        if (
          Country.distance(this.people[i], this.people[j]) <
          Math.pow(this.people[i].radius, 2)
        ) {
          if (
            this.people[i].state == HealthState.Infected &&
            this.people[j].state == HealthState.Healthy
          )
            this.people[j].infect();

          if (
            this.people[j].state == HealthState.Infected &&
            this.people[i].state == HealthState.Healthy
          )
            this.people[i].infect();
        }
      }
    }
  }

  updatePosition(): void {
    const now = Date.now();
    const delta = now - this.lastTs;
    this.people.forEach((person: Person) => {
      person.position.x += person.speed.x * delta;
      person.position.y += person.speed.y * delta;

      if (person.position.y < person.radius) {
        person.position.y =
          -(person.position.y - person.radius) + person.radius;
        person.speed.y = -person.speed.y;
      }
      if (person.position.x < person.radius) {
        person.position.x =
          -(person.position.x - person.radius) + person.radius;
        person.speed.x = -person.speed.x;
      }
      if (person.position.x > this.width - person.radius) {
        person.position.x =
          2 * this.width - (person.position.x + person.radius) - person.radius;
        person.speed.x = -person.speed.x;
      }
      if (person.position.y > this.height - person.radius) {
        person.position.y =
          2 * this.height - (person.position.y + person.radius) - person.radius;
        person.speed.y = -person.speed.y;
      }
    });
    this.lastTs = now;

    this.checkCollisions();
  }

  getStats(): StatEntry {
    const stat: { [k: string]: number } = {};
    for (const healthState in HealthState) {
      stat[HealthState[healthState]] = this.people.filter((p: Person) => {
        return p.state.toString() == HealthState[healthState];
      }).length;
    }

    return {
      timestamp: Date.now(),
      populations: stat
    };
  }
}
