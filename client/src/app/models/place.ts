export interface Place {
  id: number;
  name: string; // "Gothenburg"
  region: string | null; // "Västra Götaland County"
  latitude: number;
  longitude: number;
  population: number | null;
}
