import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { saveBlobAsFile } from 'src/utils/file-saver';
import { unparseToCsvString } from 'src/utils/csvUtil';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  passwordForm!: FormGroup;
  adminForm!: FormGroup;
  isPasswordValid: boolean = false;
  isParticipantValid: boolean = false;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.initForms();

    // pings the server on startup to wake it up
    this.dataService.getParticipantByParticipantNumber('123').subscribe((participant) => {
      console.log('ping server on startup: ', participant);
    });
  }
  initForms() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^researcher2023$/)]]
    });

    this.adminForm = this.formBuilder.group({
      taskDurationSeconds: ['', Validators.required],
      breakDurationSeconds: ['', Validators.required],
      breakCountInterval: ['', Validators.required],
      breakTimeIntervalSeconds: ['', Validators.required],
      breakIntervalType: ['', Validators.required],
      participantNumber: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      sessionTimeoutSeconds: ['', Validators.required],
      showProgressToggle: ['', Validators.required],
      pauseOnBreakToggle: ['', Validators.required],
      forceBreak: ['', Validators.required],
      timeBankToggle: ['', Validators.required],
      showTimeBank: ['', Validators.required],
      showTimerToggle: ['', Validators.required],
    });

    // this will disable the update button when participant number changes
    this.adminForm.get('participantNumber')?.valueChanges.subscribe((participantNumber) => {
      // get the participant number, if we get a valid settings response, update the form values
      // with the data, and set the isParticipantValid to true
      this.isParticipantValid = false;
    });
  }

  checkPassword() {
    // switch ui to show the admin panel settings
    this.isPasswordValid = this.passwordForm.valid;

    if (!this.isPasswordValid) {
      alert('Incorrect Password!');
    }
  }

  downloadDataFromDatabase() {
    const participantNumber = this.adminForm.value.participantNumber;
    if (!participantNumber) {
      alert('Participant Number not found!! Unable to download data!!');
      return;
    }
    this.dataService.getSubmissionsAndBreaksByParticipantNumber(participantNumber.toString()).subscribe((data) => {
      console.log('get Submissions and break data from server: ', data);

      // Create CSV data
      const csvData: any[] = [];
      csvData.push(['', '']); // Empty row for separation
      csvData.push(['', 'Submissions']);
      csvData.push([
        'id',
        'session_id',
        'Timestamp',
        'Given Patient ID',
        'Entered Patient Id',
        'Is Patient Id Valid',
        'Given Interpretation',
        'Entered Interpretation',
        'Is Interpretation Valid',
        'Last Interaction'
      ]);

      // add submission data

      const submissionData = data[0];
      submissionData.forEach((submission: any) => {
        const formattedCreatedAt = this.formatTimestamp(submission.created_at);
        csvData.push([
          submission.id,
          submission.session_id,
          formattedCreatedAt,
          submission.given_patient_id,
          submission.entered_patient_id,
          submission.given_patient_id.toLowerCase() === submission.entered_patient_id.toLowerCase(),
          submission.given_interpretation,
          submission.entered_interpretation,
          submission.given_interpretation === submission.entered_interpretation,
          `${submission.last_interaction}`
        ]);
      });
      csvData.push(['', '']); // Empty row for separation
      csvData.push(['', 'Breaks']); // Empty row for separation
      csvData.push(['id', 'session_id', 'created_at', 'has_accepted', 'duration']); // Break Headers
      const breakData = data[1];
      breakData.forEach((breakEntry: any) => {
        let formattedCreatedAt = this.formatTimestamp(breakEntry.created_at);
        csvData.push([
          breakEntry.id,
          breakEntry.session_id,
          formattedCreatedAt,
          breakEntry.has_accepted ? 'true' : 'false',
          breakEntry.break_duration_seconds
        ]);
      });

      // Convert CSV data to a string
      const csvString = unparseToCsvString(csvData);

      // Convert the string to a Blob
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

      // Save the Blob as a CSV file
      // saveAs(blob, `participant_${participantNumber}_records_from_database.csv`);
      saveBlobAsFile(blob, `participant_${participantNumber}_records_from_database.csv`);
    });
  }
  fetchParticipantSettings() {
    // check if the participant number is valid
    if (this.adminForm.get('participantNumber')?.invalid) {
      alert(
        'Please double check the participant number and try again. it should be three digit between 100 to 999 inclusive.'
      );
      return;
    }
    this.dataService
      .getParticipantByParticipantNumber(this.adminForm.value.participantNumber)
      .subscribe((participant) => {
        if (participant) {
          console.log('Participant Data: ', participant);
          // update the form values with the participant data
          this.adminForm.patchValue({
            taskDurationSeconds: participant[0].task_duration_seconds,
            breakDurationSeconds: participant[0].break_duration_seconds,
            breakCountInterval: participant[0].break_count_interval,
            breakTimeIntervalSeconds: participant[0].break_time_interval_seconds,
            breakIntervalType: participant[0].break_interval_type,
            sessionTimeoutSeconds: participant[0].session_timeout_seconds,
            showProgressToggle: participant[0].show_progress_toggle ? 'on' : 'off',
            pauseOnBreakToggle: participant[0].pause_on_break_toggle ? 'on' : 'off',
            forceBreak: participant[0].force_break ? 'on' : 'off',
            timeBankToggle: participant[0].time_bank_toggle ? 'on' : 'off',
            showTimeBank: participant[0].show_time_bank ? 'on' : 'off',
            showTimerToggle: participant[0].show_timer_toggle ? 'on' : 'off'
          });
          // update if the participant is valid to allow the admin to update the participant's settings!!
          this.isParticipantValid = true;
        } else {
          alert('getParticipantByParticipantNumber had an error!');
        }
      });

    // if there is a error, throw an error!!
  }
  updateParticipantSettings() {
    // Implement logic for what to do when the settings trigger button is clicked
    console.log('Settings Triggered!', this.adminForm);

    // check if inputs have been changed
    if (
      this.adminForm.get('taskDurationSeconds')?.dirty ||
      this.adminForm.get('breakDurationSeconds')?.dirty ||
      this.adminForm.get('breakCountInterval')?.dirty ||
      this.adminForm.get('breakTimeIntervalSeconds')?.dirty ||
      this.adminForm.get('breakIntervalType')?.dirty ||
      this.adminForm.get('sessionTimeoutSeconds')?.dirty ||
      this.adminForm.get('showProgressToggle')?.dirty ||
      this.adminForm.get('pauseOnBreakToggle')?.dirty ||
      this.adminForm.get('forceBreak')?.dirty ||
      this.adminForm.get('timeBankToggle')?.dirty ||
      this.adminForm.get('showTimeBank')?.dirty ||
      this.adminForm.get('showTimerToggle')?.dirty
    ) {
      // check the api error code to see if the participant number entered is valid or not
      // update participant settings in the server
      this.dataService
        .updateParticipantSettings({
          participant_number: this.adminForm.value.participantNumber,
          task_duration_seconds: this.adminForm.value.taskDurationSeconds,
          break_duration_seconds: this.adminForm.value.breakDurationSeconds,
          break_count_interval: this.adminForm.value.breakCountInterval,
          break_time_interval_seconds: this.adminForm.value.breakTimeIntervalSeconds,
          break_interval_type: this.adminForm.value.breakIntervalType,
          session_timeout_seconds: this.adminForm.value.sessionTimeoutSeconds,
          show_progress_toggle: this.adminForm.value.showProgressToggle === 'on' ? true : false,
          pause_on_break_toggle: this.adminForm.value.pauseOnBreakToggle === 'on' ? true : false,
          force_break: this.adminForm.value.forceBreak === 'on' ? true : false,
          time_bank_toggle: this.adminForm.value.timeBankToggle === 'on' ? true : false,
          show_time_bank: this.adminForm.value.showTimeBank === 'on' ? true : false,
          show_timer_toggle: this.adminForm.value.showTimerToggle === 'on' ? true : false
        })
        .subscribe((updatedParticipant) => {
          console.log('Update Participant Data: ', updatedParticipant);
          alert('Participant settings updated successfully!');
          // remove items from the form
          this.adminForm.reset();
        });
    } else {
      alert('No changes detected!');
    }
  }
  formatTimestamp(timestamp: string) {
    let createdAt = new Date(timestamp);
    createdAt.setHours(createdAt.getHours() + 7); // convert to local time
    const formattedCreatedAt = `${createdAt.toDateString()} ${createdAt
      .getHours()
      .toString()
      .padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
    return formattedCreatedAt;
  }
}
