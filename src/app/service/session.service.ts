import { Injectable } from '@angular/core';
import { BreakIntervalType, SessionInputModel } from 'server/src/types';

export type SessionSettings =
  | {
    taskDurationSeconds: number;
    breakDurationSeconds: number;
    breakCountInterval: number;
    breakTimeIntervalSeconds: number;
    breakIntervalType: BreakIntervalType;
    productivityQuota: number;
    sessionTimeoutSeconds: number;
    showProgressToggle: boolean;
    pauseOnBreakToggle: boolean;
    forceBreak: boolean;
    timeBankToggle: boolean;
    showTimeBank: boolean;
    showTimerToggle: boolean;
    breakPopupText: string;
    completionPopupText: string;
  }
  | undefined;

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  protected participantNumber: string | undefined;
  protected sessionId: number | undefined;
  protected sessionSettings: SessionSettings;

  constructor() { }

  getParticipantNumber(): string | undefined {
    return this.participantNumber;
  }

  setParticipantNumber(participantNumber: string): void {
    this.participantNumber = participantNumber;
  }

  getSessionId(): number | undefined {
    return this.sessionId;
  }
  setSessionId(sessionId: number): void {
    this.sessionId = sessionId;
  }

  getSessionSettings(): SessionSettings | undefined {
    return this.sessionSettings;
  }
  setSessionSettings(sessionSettings: SessionSettings): void {
    this.sessionSettings = sessionSettings;
  }
}
