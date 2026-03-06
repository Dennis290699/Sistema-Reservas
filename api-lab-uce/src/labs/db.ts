import { pool } from '../db';

export interface Lab {
    id: number;
    nombre: string;
    capacidad: number;
    estado?: string; // e.g., 'disponible', 'mantenimiento', 'inhabilitado'
}

export interface Reservation {
    id: number;
    lab_id: number;
    user_id: number;
    fecha: string; // ISO Date string
    hora_inicio: number;
    materia: string;
    creado_en: Date;
}

export const getLabs = async (): Promise<Lab[]> => {
    const result = await pool.query('SELECT * FROM laboratorios ORDER BY id ASC');
    return result.rows;
};

export const getReservationsByDateAndLab = async (date: string, labId: number): Promise<Reservation[]> => {
    const result = await pool.query(
        'SELECT * FROM reservas WHERE fecha = $1 AND lab_id = $2',
        [date, labId]
    );
    return result.rows;
};

export const createReservations = async (
    labId: number,
    userId: number,
    date: string,
    hours: number[],
    subject: string
): Promise<Reservation[]> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const reservations: Reservation[] = [];

        for (const hour of hours) {
            const result = await client.query(
                `INSERT INTO reservas (lab_id, user_id, fecha, hora_inicio, materia)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [labId, userId, date, hour, subject]
            );
            reservations.push(result.rows[0]);
        }

        await client.query('COMMIT');
        return reservations;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const getReservationsByUser = async (userId: number): Promise<Reservation[]> => {
    const result = await pool.query(
        `SELECT r.id, r.lab_id, r.user_id, TO_CHAR(r.fecha, 'YYYY-MM-DD') as fecha, r.hora_inicio, r.materia, r.creado_en, l.nombre as lab_nombre 
         FROM reservas r 
         JOIN laboratorios l ON r.lab_id = l.id 
         WHERE r.user_id = $1 
         ORDER BY r.fecha DESC, r.hora_inicio ASC`,
        [userId]
    );
    return result.rows;
};

export const getAllReservations = async (): Promise<Reservation[]> => {
    const result = await pool.query(
        `SELECT r.id, r.lab_id, r.user_id, TO_CHAR(r.fecha, 'YYYY-MM-DD') as fecha, r.hora_inicio, r.materia, r.creado_en, l.nombre as lab_nombre 
         FROM reservas r 
         JOIN laboratorios l ON r.lab_id = l.id 
         ORDER BY r.fecha DESC, r.hora_inicio ASC`
    );
    return result.rows;
};

export const deleteReservation = async (id: number, userId: number): Promise<boolean> => {
    const result = await pool.query(
        'DELETE FROM reservas WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
    return (result.rowCount ?? 0) > 0;
};
