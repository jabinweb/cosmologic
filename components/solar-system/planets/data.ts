export interface PlanetData {
  name: string;
  size: number;
  color: string;
  orbitRadius: number;
  orbitDuration: number;
  rotationDuration: number;
  description: string;
}

export const PLANETS_DATA: PlanetData[] = [
  {
    name: "Mercury",
    size: 12,
    color: "#a67f59",
    orbitRadius: 60,
    orbitDuration: 40,
    rotationDuration: 20,
    description: "The smallest and fastest planet"
  },
  {
    name: "Venus",
    size: 15,
    color: "#e6b800",
    orbitRadius: 90,
    orbitDuration: 50,
    rotationDuration: 25,
    description: "The hottest planet"
  },
  {
    name: "Earth",
    size: 16,
    color: "#4169e1",
    orbitRadius: 120,
    orbitDuration: 60,
    rotationDuration: 30,
    description: "Our home planet"
  },
  {
    name: "Mars",
    size: 14,
    color: "#cd5c5c",
    orbitRadius: 150,
    orbitDuration: 70,
    rotationDuration: 35,
    description: "The red planet"
  }
];
