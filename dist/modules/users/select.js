export const profileSelect = {
    id: true,
    age: true,
    sex: true,
    heightCm: true,
    weightKg: true,
    targetWeightKg: true,
    activityLevel: true,
    goal: true,
    injuries: true,
    createdAt: true,
    updatedAt: true,
};
export const userSelect = {
    id: true,
    email: true,
    createdAt: true,
    profile: { select: profileSelect },
};
export const userWithPasswordSelect = {
    id: true,
    email: true,
    password: true,
    createdAt: true,
    profile: { select: profileSelect },
};
