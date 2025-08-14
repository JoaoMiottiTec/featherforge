const setNullable = (v) => v === null ? null : v === undefined ? undefined : v;
export function mapProfileCreate(input) {
    if (!input)
        return undefined;
    return {
        create: {
            age: input.age ?? undefined,
            sex: input.sex ?? undefined,
            heightCm: input.heightCm ?? undefined,
            weightKg: input.weightKg ?? undefined,
            targetWeightKg: input.targetWeightKg ?? undefined,
            activityLevel: input.activityLevel ?? undefined,
            goal: input.goal ?? undefined,
            injuries: input.injuries ?? undefined,
        },
    };
}
export function mapProfileUpsert(input) {
    if (!input)
        return undefined;
    const createData = {
        age: input.age ?? undefined,
        sex: input.sex ?? undefined,
        heightCm: input.heightCm ?? undefined,
        weightKg: input.weightKg ?? undefined,
        targetWeightKg: input.targetWeightKg ?? undefined,
        activityLevel: input.activityLevel ?? undefined,
        goal: input.goal ?? undefined,
        injuries: input.injuries ?? undefined,
    };
    const updateData = {
        age: setNullable(input.age),
        sex: setNullable(input.sex),
        heightCm: setNullable(input.heightCm),
        weightKg: setNullable(input.weightKg),
        targetWeightKg: setNullable(input.targetWeightKg),
        activityLevel: setNullable(input.activityLevel),
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
