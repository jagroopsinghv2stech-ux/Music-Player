import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addPlaylistModel',
  templateUrl: './addPlaylistModel.component.html',
  styleUrls: ['./addPlaylistModel.component.css'],
  imports: [ReactiveFormsModule]
})
export class AddPlaylistModelComponent implements OnInit {

  fb=inject(FormBuilder)
  constructor(
    public dialogRef: MatDialogRef<AddPlaylistModelComponent>
  ) {}



  ngOnInit() {
    
  }

    form = this.fb.group({
    id: ['', Validators.required],
    img: ['', Validators.required],
    artistName: ['', Validators.required],
    description: [''],
  });

    onSubmit() {
    if (this.form.valid) {
      console.log('Submitted Data:', this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }




}
