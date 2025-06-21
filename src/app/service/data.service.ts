// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import {
  BreakInputModel,
  ParticipantViewModel,
  SessionInputModel,
  SubmissionInputModel,
  UpdateParticipantInputModel
} from 'server/src/types';
import { generateRandomPatientData, PatientData } from 'src/utils/patientGenerator';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private apiUrl = 'https://medtask-2j1g.onrender.com/api';
  private apiUrl = 'https://medtask-server.onrender.com/api';
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getData(jsonPath: string): Observable<any> {
    return this.http.get<any>(jsonPath);
  }
  // dummy fetch data like a api call
  getRandomPatientData(): PatientData[] {
    return [generateRandomPatientData()];
  }

  getParticipantByParticipantNumber(participant_number: string): Observable<[ParticipantViewModel]> {
    return this.http.get<any>(`${this.apiUrl}/participantByParticipantNumber/${participant_number}`);
  }

  // this will be get csv file. need to fix this, needs session info
  getSubmissionsAndBreaksByParticipantNumber(participant_number: string): Observable<any> {
    return forkJoin([
      this.http.get<any>(`${this.apiUrl}/allSubmissionsByParticipantNumber/${participant_number}`),
      this.http.get<any>(`${this.apiUrl}/allBreaksByParticipantNumber/${participant_number}`)
    ]);
  }

  createBreak(values: BreakInputModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createBreak`, values);
  }
  createSubmission(values: SubmissionInputModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createSubmission`, values);
  }
  createSession(values: SessionInputModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createSession`, values);
  }

  updateParticipantSettings(values: UpdateParticipantInputModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateParticipantSettings`, values);
  }
}
