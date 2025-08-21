import type { SignupInput, UserUpdateInput } from './types.js';

const setNullable = <T>(v: T | null | undefined) =>
  v === null ? null : v === undefined ? undefined : v;

export function mapProfileCreate(input?: SignupInput['profile']) {
  if (!input) return undefined;
  return {
    create: {
      age: input.age ?? undefined,
      sex: input.sex ?? undefined,
      heightCm: input.heightCm ?? undefined,
      weightKg: input.weightKg ?? undefined,
      targetWeightKg: input.targetWeightKg ?? undefined,
      activityLvl: input.activityLvl ?? undefined,
      goal: input.goal ?? undefined,
      injuries: input.injuries ?? undefined,
    },
  };
}

export function mapProfileUpsert(input?: UserUpdateInput['profile']) {
  if (!input) return undefined;

  const createData = {
    age: input.age ?? undefined,
    sex: input.sex ?? undefined,
    heightCm: input.heightCm ?? undefined,
    weightKg: input.weightKg ?? undefined,
    targetWeightKg: input.targetWeightKg ?? undefined,
    activityLvl: input.activityLvl ?? undefined,
    goal: input.goal ?? undefined,
    injuries: input.injuries ?? undefined,
  };

  const updateData = {
    age: setNullable(input.age),
    sex: setNullable(input.sex),
    heightCm: setNullable(input.heightCm),
    weightKg: setNullable(input.weightKg),
    targetWeightKg: setNullable(input.targetWeightKg),
    activityLvl: setNullable(input.activityLvl),
    goal: setNullable(input.goal),
    injuries: input.injuries ?? undefined,
  };

  return {
    upsert: {
      create: createData,
      update: updateData,
    },
  };
}
