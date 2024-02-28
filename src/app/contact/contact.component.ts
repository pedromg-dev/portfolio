import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });
  showNotificationEmailSent: boolean = true;

  constructor(private formBuilder: FormBuilder, 
    private globalService: GlobalService) { }

  ngOnInit() {

  }

  onSubmit(e: Event) {
    if (this.contactForm.valid) {
      this.sendEmail(e);
    }
  }

  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs.init(this.globalService.EMAIL_PUBLIC_ID);
    emailjs
      .send(this.globalService.EMAIL_SERVICE_ID, this.globalService.EMAIL_TEMPLATE_ID, {
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        email: this.contactForm.value.email,
      })
      .then(
        () => {
          this.showNotificationEmailSent = true;
          this.contactForm.reset();  
        },
        (error) => {
          console.log('Error', (error as EmailJSResponseStatus).text);
        },
      );
  }

  closeNotificationEmailSent() {
    this.showNotificationEmailSent = false;
  }
}