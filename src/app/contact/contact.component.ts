import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import type { EmailJSResponseStatus } from '@emailjs/browser';
import { GlobalService } from '../global.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { firstValueFrom } from 'rxjs';

interface GeneratedEmailResponse {
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(400)),
    ]),
  ]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
    aiPrompt: ['']
  });

  showNotificationEmailSent: boolean = false;
  isGeneratingAI: boolean = false;
  aiError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private http: HttpClient,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {}

  applyQuickPrompt(presetKey: string): void {
    const promptText = this.translate.instant(presetKey);
    this.contactForm.patchValue({ aiPrompt: promptText });
    this.generateEmailWithAI();
  }

  async generateEmailWithAI(): Promise<void> {
    const promptValue = (this.contactForm.get('aiPrompt')?.value || '').trim();
    if (!promptValue || this.isGeneratingAI) {
      return;
    }

    this.isGeneratingAI = true;
    this.aiError = '';

    try {
      const lang = this.translate.currentLang || 'es';
      const response = await firstValueFrom(
        this.http.post<GeneratedEmailResponse>('/api/generate-email', {
          prompt: promptValue,
          language: lang
        })
      );

      if (response?.subject || response?.message) {
        this.contactForm.patchValue({
          subject: response.subject || this.contactForm.get('subject')?.value,
          message: response.message || this.contactForm.get('message')?.value
        });
      }
    } catch (err: any) {
      console.error('AI generate email error:', err);
      const serverDetails = err?.error?.details || err?.error?.error;
      this.aiError = serverDetails
        ? `${this.translate.instant('AIErrorNotification')} (${serverDetails})`
        : this.translate.instant('AIErrorNotification');
    } finally {
      this.isGeneratingAI = false;
    }
  }

  onSubmit(e: Event): void {
    if (this.contactForm.valid) {
      this.sendEmail(e);
    }
  }

  public async sendEmail(e: Event): Promise<void> {
    e.preventDefault();
    const emailjs = (await import('@emailjs/browser')).default;
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
          console.error('Error', (error as EmailJSResponseStatus).text);
        },
      );
  }

  closeNotificationEmailSent(): void {
    this.showNotificationEmailSent = false;
  }
}
