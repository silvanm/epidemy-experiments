import { Person } from "@/Person";

export interface Position {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Vector | speed | The speed of an individual particle
 * @param  number  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(speed: Vector, angle: number) {
  const rotatedVelocities = {
    x: speed.x * Math.cos(angle) - speed.y * Math.sin(angle),
    y: speed.x * Math.sin(angle) + speed.y * Math.cos(angle)
  };
  return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Person | particle      | A particle object with x and y coordinates, plus speed
 * @param  Person | otherParticle | A particle object with x and y coordinates, plus speed
 * @return Null | Does not return a value
 */

export function resolveCollision(particle: Person, otherParticle: Person) {
  const xVelocityDiff = particle.speed.x - otherParticle.speed.x;
  const yVelocityDiff = particle.speed.y - otherParticle.speed.y;

  const xDist = otherParticle.position.x - particle.position.x;
  const yDist = otherParticle.position.y - particle.position.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.position.y - particle.position.y,
      otherParticle.position.x - particle.position.x
    );

    // Velocity before equation
    const u1 = rotate(particle.speed, angle);
    const u2 = rotate(otherParticle.speed, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u2.x * 2) / 2,
      y: u1.y
    };
    const v2 = {
      x: (u1.x * 2) / 2,
      y: u2.y
    };

    // Final speed after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.speed.x = vFinal1.x;
    particle.speed.y = vFinal1.y;

    otherParticle.speed.x = vFinal2.x;
    otherParticle.speed.y = vFinal2.y;
  }
}
