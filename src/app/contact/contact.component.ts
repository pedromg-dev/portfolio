import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
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
      transition('void <=> *', animate(350)),
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
  isSendingEmail: boolean = false;
  justSentEmail: boolean = false;
  sendEmailError: string = '';
  isGeneratingAI: boolean = false;
  aiError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
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
      const raw = err?.error?.details || err?.error?.error || err?.message;
      let detailMsg = '';
      if (typeof raw === 'string') {
        detailMsg = raw;
      } else if (raw && typeof raw === 'object') {
        detailMsg = raw.message || raw.error || JSON.stringify(raw);
      } else {
        detailMsg = 'Error';
      }
      this.aiError = `${this.translate.instant('AIErrorNotification')} (${detailMsg})`;
    } finally {
      this.isGeneratingAI = false;
      this.cdr.detectChanges();
    }
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.sendEmail(e);
  }

  public async sendEmail(e: Event): Promise<void> {
    e.preventDefault();
    if (this.isSendingEmail) {
      return;
    }

    this.isSendingEmail = true;
    this.sendEmailError = '';
    this.showNotificationEmailSent = false;
    this.justSentEmail = false;
    this.cdr.detectChanges();

    const formValues = {
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      email: this.contactForm.value.email
    };

    try {
      await firstValueFrom(
        this.http.post('/api/send-email', formValues)
      );

      this.showNotificationEmailSent = true;
      this.justSentEmail = true;
      this.contactForm.reset();

      // Auto dismiss success animation on button after 4s
      setTimeout(() => {
        this.justSentEmail = false;
        this.cdr.detectChanges();
      }, 4000);

      // Auto dismiss banner after 8s
      setTimeout(() => {
        this.showNotificationEmailSent = false;
        this.cdr.detectChanges();
      }, 8000);
    } catch (error: any) {
      console.error('Send email error:', error);
      const raw = error?.error?.details || error?.error?.error || error?.message;
      let errorText = '';
      if (typeof raw === 'string') {
        errorText = raw;
      } else if (raw && typeof raw === 'object') {
        errorText = raw.message || raw.text || JSON.stringify(raw);
      } else {
        errorText = 'Error sending email';
      }
      this.sendEmailError = errorText;
    } finally {
      this.isSendingEmail = false;
      this.cdr.detectChanges();
    }
  }

  closeNotificationEmailSent(): void {
    this.showNotificationEmailSent = false;
    this.cdr.detectChanges();
  }
}
