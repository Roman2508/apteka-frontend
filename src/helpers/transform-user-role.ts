import type { UserRoleType } from "@/stores/auth.store";

export const transformUserRole = (role: UserRoleType) => {
    switch (role) {
        case "pharmacist":
            return "Асистент фармацевта"
        case "senior_pharmacist":
            return "Старший фармацевт"
        case "director":
            return "Завідувач аптеки"
        case "admin":
            return "Адміністратор"
        default:
            return "-"
    }
}