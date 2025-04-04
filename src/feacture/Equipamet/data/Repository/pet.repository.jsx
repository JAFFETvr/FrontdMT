import { fetchPetStats } from "../DataSource/pet.api";
export const petRepository = { getStats: fetchPetStats };