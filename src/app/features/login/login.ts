import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  faMugHot = faMugHot;


}
