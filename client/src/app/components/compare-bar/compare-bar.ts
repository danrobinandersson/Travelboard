import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CompareService } from '../../services/compare-service';
import { CompareDialog } from '../compare-dialog/compare-dialog';

@Component({
  selector: 'app-compare-bar',
  imports: [MatIcon],
  templateUrl: './compare-bar.html',
  styleUrl: './compare-bar.scss',
})
export class CompareBar {
  protected readonly compare = inject(CompareService);
  private readonly dialog = inject(MatDialog);

  protected openDialog(): void {
    this.dialog.open(CompareDialog, {
      width: '48rem',
      maxWidth: '95vw',
    });
  }
}
