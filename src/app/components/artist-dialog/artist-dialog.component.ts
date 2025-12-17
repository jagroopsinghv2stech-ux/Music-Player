import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-dialog',
  imports: [MatIconModule],
  templateUrl: './artist-dialog.component.html',
  styleUrl: './artist-dialog.component.css'
})
export class ArtistDialogComponent {
   constructor(
    @Inject(MAT_DIALOG_DATA) public artist: any,
    private dialogRef: MatDialogRef<ArtistDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
