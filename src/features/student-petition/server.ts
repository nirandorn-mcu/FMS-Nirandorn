import "server-only";

export {
  listPetitions,
  getPetitionStats,
  type StudentPetitionDto,
  type StudentPetitionLogDto,
  type PetitionStatsDto,
} from "./_internal/services";
export { PETITION_P, PETITION_PERMISSIONS } from "./permissions";
