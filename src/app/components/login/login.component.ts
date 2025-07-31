import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
    imports: [FormsModule ,CommonModule], 

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 username: string = '';
  password: string = '';
  loginResult: string = '';

  // Dummy user data
  users = [
    { userid: 1, username: 'user1', password: 'pass1', role: 'user' },
    { userid: 2, username: 'admin1', password: 'adminpass', role: 'admin' },
    { userid: 3, username: 'super1', password: 'superpass', role: 'superadmin' },
    { userid: 4, username: 'manager1', password: 'managerpass', role: 'manager' }
  ];

  login() {
    const matchedUser = this.users.find(
      user => user.username === this.username && user.password === this.password
    );

    if (matchedUser) {
      this.loginResult = `Login successful! Role: ${matchedUser.role}`;
    } else {
      this.loginResult = 'Invalid username or password';
    }
  
}

}
