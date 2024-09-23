import axiosInstance from "../axiosInstance";

export interface Career {
    id: number;
    name: string;
}

export interface Organization {
    id: number;
    name: string;
}

export enum Role {
    STUDENT = 0,
    TEACHER = 1,
    VOAE = 2,
}

export interface User {
    id: number;
    names: string;
    lastnames: string;
    accountNumber: number;
    role: number;
    email: string;
    career: Career;
    organizations: Organization[];
}

export const ObtenerDatosUsuarioIniciado = async (): Promise<User | null> => {
    try {
        const response = await axiosInstance.get(`/users/me`);
        return response.data ? response.data : null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};



