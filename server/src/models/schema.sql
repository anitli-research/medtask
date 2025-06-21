CREATE DATABASE MedTask;
USE MedTask;

CREATE TABLE Participants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_number BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  task_duration_seconds INT UNSIGNED NOT NULL DEFAULT 1800,
  break_duration_seconds INT UNSIGNED NOT NULL DEFAULT 300,
  break_count_interval INT UNSIGNED NOT NULL DEFAULT 10,
  break_time_interval_seconds INT UNSIGNED NOT NULL DEFAULT 600,
  break_interval_type ENUM('time', 'count') NOT NULL DEFAULT 'count',

  session_timeout_seconds INT UNSIGNED NOT NULL DEFAULT 300,
  show_progress_toggle BOOLEAN NOT NULL DEFAULT false,
  pause_on_break_toggle BOOLEAN NOT NULL DEFAULT true;
  primary key (id),
  unique key (participant_number)
);

INSERT INTO Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) VALUES (166, 'John Doe', 1000, 100, 5, 100), (167, 'Jane Doe', 1111, 111, 6, 111);

CREATE TABLE Sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  participant_number BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  task_duration_seconds INT UNSIGNED NOT NULL,
  break_duration_seconds INT UNSIGNED NOT NULL,
  break_count_interval INT UNSIGNED NOT NULL,
  break_time_interval_seconds INT UNSIGNED NOT NULL,
  break_interval_type ENUM('time', 'count') NOT NULL,

  show_progress_toggle BOOLEAN NOT NULL DEFAULT false,
  primary key (id),
  foreign key (participant_number) references Participants(participant_number)
);

INSERT INTO Sessions (id, participant_number, duration) VALUES (1, 166, 1000), (2, 167, 1111);

CREATE TABLE Breaks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  has_accepted BOOLEAN NOT NULL,
  -- duration INT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  primary key (id),
  foreign key (session_id) references Sessions(id)
);

INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (1, true, 4), (1, false, 5), (2, true, 6), (2, false, 7);


CREATE TABLE Submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
  session_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  given_patient_id VARCHAR(255) NOT NULL,
  entered_patient_id VARCHAR(255) NOT NULL,
  given_interpretation ENUM('within range', 'out of range') NOT NULL,
  entered_interpretation ENUM('within range', 'out of range') NOT NULL,
  last_interaction INT UNSIGNED NOT NULL,
  is_valid BOOLEAN NOT NULL,
  primary key (id),
  foreign key (session_id) references Sessions(id)
  -- foreign key (given_patient_id) references Patients(id)
);

-- INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (1, 'pid-1', 'within range', 6, true), (1, 'pid-2', 'not within range', 22, true), (1, 'pid-3', 'within range', 100, false), (1, 'pid-4', 'within range', 100, true), (1, 'pid-5', 'within range', 100, true), (1, 'pid-5', 'within range', 100, true), (1, 'pid-6', 'not within range', 100, true), (2, 'pid-7', 'within range', 50, false );


-- This is the full query we are trying to create
select * from sessions left join submissions on sessions.id = submissions.session_id left join breaks on sessions.id = breaks.session_id where sessions.participant_number = participant_number;

-- sub query, join breaks, and submissions
select id as submission_id, session_id, created_at from submissions union all select id as break_id, session_id, created_at from breaks;


-- we will split into 2 queries, for submissions, and breaks
select * from sessions left join submissions on sessions.id = submissions.session_id where sessions.participant_number = ?; [participant_number]
select * from sessions left join breaks on sessions.id = breaks.session_id where sessions.participant_number = ?; [participant_number]

-- Add the time bank feature
ALTER TABLE Participants ADD time_bank_toggle BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE Participants ADD show_time_bank BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE Sessions ADD time_bank_toggle BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE Sessions ADD show_time_bank BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE Break ADD time_bank INT UNSIGNED DEFAULT NULL;

-- Add the force break toggle
ALTER TABLE Participants ADD force_break BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE Sessions ADD force_break BOOLEAN NOT NULL DEFAULT false;
