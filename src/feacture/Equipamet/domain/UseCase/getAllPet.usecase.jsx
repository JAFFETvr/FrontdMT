import { petRepository } from "../../data/Repository/pet.repository";
import { PetStats } from "../Entities/pet.model";

export const getPetStats = async () => {
    const stats = await petRepository.getStats();
    return new PetStats(stats);
};
