export interface Estudiante{
    cedula: string;
    nombre: string;
    apellido: string;
    Asistencia: number;
    nota1: number; // 
    nota2: number; // 
    promedio?: number; // Nuevo 
    condicion?: string; // Nuevo 
    estadoAsistencia?: string;

}