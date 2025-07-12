import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

type PopupInput = {
  textContent: string;
  confirmText: string;
  confirmFunction: () => void | undefined;
  cancelText: string;
  cancelFunction: () => void | undefined;
  laterText: string | undefined;
  laterFunction: () => void | undefined;
};

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {
  textContent: string;
  confirmText: string;
  confirmFunction: () => void;
  cancelText: string;
  cancelFunction: () => void;
  laterText: string | undefined;
  laterFunction: () => void | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupInput) {
    this.textContent = data.textContent;
    this.confirmText = data.confirmText;
    this.confirmFunction = data.confirmFunction;
    this.cancelText = data.cancelText;
    this.cancelFunction = data.cancelFunction;
    this.laterText = data.laterText;
    this.laterFunction = data.laterFunction;
  }
}
