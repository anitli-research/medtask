import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../models';

export const findBreakById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Breaks WHERE id = ?;', [id]);
  console.log(rows);
  return rows;
};

// get break info
//   select b.id, b.session_id, b.has_accepted, b.duration, b.created_at from breaks b left join sessions s on b.session_id = s.id where s.participant_number = 167;
export const findAllBreaksByParticipantNumber = async (participant_number: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    `SELECT b.id, b.session_id, b.has_accepted, s.break_duration_seconds, b.created_at
    FROM Breaks b LEFT JOIN Sessions s ON b.session_id = s.id WHERE s.participant_number = ?;`,
    [participant_number]
  );
  console.log(rows);
  return rows;
};

// create break into
//   INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (1, true, 4)
export const insertBreak = async (session_id: number, has_accepted: boolean, time_bank: number | null = null) => {
  let queryData = undefined;
  if (time_bank !== null) {
    queryData = await pool.query<ResultSetHeader>('INSERT INTO Breaks (session_id, has_accepted, time_bank) VALUES (?, ?, ?);', [
      session_id,
      has_accepted,
      time_bank
    ]);
  } else {
    queryData = await pool.query<ResultSetHeader>('INSERT INTO Breaks (session_id, has_accepted) VALUES (?, ?);', [
      session_id,
      has_accepted
    ]);
  }

  console.log(queryData);
  return queryData;
};
