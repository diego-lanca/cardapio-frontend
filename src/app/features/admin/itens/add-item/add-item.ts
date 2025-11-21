import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAdd, faClose, faInfoCircle, faUsd, faImage, faPaperclip } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-item',
  imports: [
    FaIconComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './add-item.html',
  styleUrl: './add-item.css',
})
export class AddItem {
  faAdd = faAdd;
  faClose = faClose;
  faInfoCircle = faInfoCircle;
  faUsd = faUsd;
  faImage = faImage;
  faPaperclip = faPaperclip;

  fileName = '';
  activeItem = true;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('thumbnail', file);

      // const upload$ = this.http.post('/api/thumbnail-upload', formData);

      // upload$.subscribe();
    }
  }
}
