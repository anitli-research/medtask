import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../models';
import { SessionInputModel } from '../types';

export const findSessionById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Sessions WHERE id = ?;', [id]);
  console.log(rows);
  return rows;
};

// get logging info
//   select count(id) from Sessions where participant_number = participant_number;
export const findSessionsByParticipantNumber = async (participant_number: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Sessions WHERE participant_number = ?;', [
    participant_number
  ]);
  console.log(rows);
  return rows;
};

// create logging info ()
//   insert into Sessions (participant_number, duration) values (participant_number, duration);
export const insertSession = async (params: SessionInputModel) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Sessions (participant_number, task_duration_seconds, break_duration_seconds, break_count_interval, break_time_interval_seconds, break_interval_type, show_progress_toggle, force_break, time_bank_toggle, show_time_bank, show_timer_toggle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
    [
      params.participant_number,
      params.task_duration_seconds,
      params.break_duration_seconds,
      params.break_count_interval,
      params.break_time_interval_seconds,
      params.break_interval_type,
      params.show_progress_toggle,
      params.force_break,
      params.time_bank_toggle,
      params.show_time_bank,
      params.show_timer_toggle
    ]
  );
  console.log(queryData);
  return queryData;
};
