import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../models';
import { UpdateParticipantInputModel } from '../types';

// function for when participant logs in, to get the settings
export const findParticipantByParticipantNumber = async (participant_number: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Participants WHERE participant_number = ?;',
    [participant_number]
  );
  console.log(rows);
  return rows;
};

export const findParticipantById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Participants WHERE id = ?;', [id]);
  console.log(rows);
  return rows;
};

// create participant info (will have 2 functions, 1 for automatic creation and 1 for manual creation)
//   insert into Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) values (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval);
export const insertParticipant = async (participant_number: string, full_name: string) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Participants (participant_number, full_name) VALUES (?, ?);',
    [participant_number, full_name]
  );
  console.log(queryData);
  return queryData;
};

// update settings
//   update participant set task_duration = xxx, break_duration = xxx, break_count_interval = xxx, break_time_interval = xxx where participant_number = participant_number;
export const updateParticipantSettings = async (params: UpdateParticipantInputModel) => {
  const queryData = await pool.query<ResultSetHeader>(
    'UPDATE Participants SET task_duration_seconds = ?, break_duration_seconds = ?, break_count_interval = ?, break_time_interval_seconds = ?, break_interval_type = ?, session_timeout_seconds = ?, show_progress_toggle = ?, pause_on_break_toggle = ?, force_break = ?, time_bank_toggle = ?, show_time_bank = ?  WHERE participant_number = ?;',
    [
      params.task_duration_seconds,
      params.break_duration_seconds,
      params.break_count_interval,
      params.break_time_interval_seconds,
      params.break_interval_type,
      params.session_timeout_seconds,
      params.show_progress_toggle,
      params.pause_on_break_toggle,
      params.force_break,
      params.time_bank_toggle,
      params.show_time_bank,
      params.participant_number
    ]
  );
  console.log(queryData);
  return queryData;
};
