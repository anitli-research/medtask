import * as database from '../models';
import type { Request, Response } from 'express';
import { SessionInputModel, SubmissionInputModel, UpdateParticipantInputModel } from '../types';

export const getTables = async (req: Request, res: Response) => {
  try {
    const data = await database.showTables();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};
export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const data = await database.findAllSubmissions();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};

// make 2 functions to get all submissions by participant number
// and get all breaks by participant number
export const getAllSubmissionsByParticipantNumber = async (req: Request, res: Response) => {
  try {
    const data = await database.findAllSubmissionsByParticipantNumber(req.params.participant_number);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};
export const getAllBreaksByParticipantNumber = async (req: Request, res: Response) => {
  try {
    const data = await database.findAllBreaksByParticipantNumber(req.params.participant_number);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};

export const getAndCreateParticipantByParticipantNumber = async (req: Request, res: Response) => {
  try {
    // should check if the participant is already created, if not, we generate a new participant!!
    const data = await database.findParticipantByParticipantNumber(req.params.participant_number);

    let createdParticipant;
    // create new participant if not found
    if (data.length === 0) {
      const queryData = await database.insertParticipant(req.params.participant_number, '');
      createdParticipant = await database.findParticipantById(queryData[0].insertId.toString());
    }
    res.status(200).json(createdParticipant || data);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};

export const createBreak = async (req: Request, res: Response) => {
  try {
    const data = await database.insertBreak(req.body.session_id, req.body.has_accepted, req.body.time_bank);

    const createdBreak = await database.findBreakById(data[0].insertId.toString());
    res.status(201).json(createdBreak);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const params: SubmissionInputModel = { ...req.body };
    const data = await database.insertSubmission(params);

    const createdSubmission = await database.findSubmissionById(data[0].insertId.toString());
    res.status(201).json(createdSubmission);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};
export const createSession = async (req: Request, res: Response) => {
  try {
    const params: SessionInputModel = { ...req.body };
    const data = await database.insertSession(params);

    const createdSession = await database.findSessionById(data[0].insertId.toString());
    res.status(201).json(createdSession);
  } catch (err) {
    console.log(err);

    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};
export const updateParticipantSettings = async (req: Request, res: Response) => {
  try {
    const params: UpdateParticipantInputModel = { ...req.body };
    const data = await database.updateParticipantSettings(params);

    const updatedParticipant = await database.findParticipantByParticipantNumber(req.body.participant_number);
    res.status(201).json(updatedParticipant);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};
