import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { I18nService, SITE_URL } from '../i18n.service';

@Component({
  selector: 'app-custom-websites',
  templateUrl: './custom-websites.component.html',
  styleUrl: './custom-websites.component.css'
})
export class CustomWebsitesComponent implements OnInit {
  requestForm: FormGroup = this.fb.group({
    projectType: ['business', Validators.required],
    timeline: ['normal', Validators.required],
    details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(40)]],
    company: ['', [Validators.maxLength(120)]]
  });

  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public translate: TranslateService,
    private i18n: I18nService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    this.updateSeo();
  }

  updateSeo(): void {
    const lang = this.i18n.currentLang;
    const isEs = lang === 'es';

    const pageTitle = isEs
      ? 'Desarrollo de Páginas Web a Medida | Pedro Moya — Presupuesto y Diseño'
      : 'Custom Website Development | Pedro Moya — Web Design & Quote';

    const pageDescription = isEs
      ? 'Solicita tu página web a medida: landing pages de alta conversión, webs corporativas, e-commerce y aplicaciones modernas optimizadas para SEO en Google.'
      : 'Request your custom-built modern website: high-converting landing pages, corporate websites, e-commerce and fast web apps optimized for Google SEO.';

    const pageUrl = `${SITE_URL}/${lang}/custom-websites`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: pageDescription });
  }

  setProjectType(type: string): void {
    this.requestForm.patchValue({ projectType: type });
  }

  setTimeline(timeline: string): void {
    this.requestForm.patchValue({ timeline });
  }

  goBackToHome(): void {
    this.router.navigate(['/', this.i18n.currentLang]).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  async onSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.submitSuccess = false;
    this.cdr.detectChanges();

    const raw = this.requestForm.value;
    const projectTypeName = this.getProjectTypeName(raw.projectType);
    const timelineName = this.getTimelineName(raw.timeline);

    const subject = `[Solicitud Web a Medida] ${projectTypeName} - ${raw.name}`;

    const formattedMessage = [
      '==============================================',
      'NUEVA SOLICITUD DE PÁGINA WEB A MEDIDA',
      '==============================================',
      `Nombre: ${raw.name}`,
      `Email: ${raw.email}`,
      `Teléfono: ${raw.phone || 'No especificado'}`,
      `Empresa / Web actual: ${raw.company || 'No especificado'}`,
      `Tipo de proyecto: ${projectTypeName}`,
      `Plazo estimado: ${timelineName}`,
      '',
      'DETALLES DEL PROYECTO / REQUERIMIENTOS:',
      '----------------------------------------------',
      raw.details,
      '=============================================='
    ].join('\n');

    const payload = {
      email: raw.email,
      name: raw.name,
      phone: raw.phone,
      company: raw.company,
      projectType: projectTypeName,
      timeline: timelineName,
      subject,
      message: formattedMessage
    };

    try {
      await firstValueFrom(this.http.post('/api/send-email', payload));
      this.submitSuccess = true;
      this.requestForm.reset({
        projectType: 'business',
        timeline: 'normal'
      });
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Error sending custom website request:', err);
      const rawErr = err?.error?.details || err?.error?.error || err?.message;
      let msg = '';
      if (typeof rawErr === 'string') {
        msg = rawErr;
      } else if (rawErr && typeof rawErr === 'object') {
        msg = rawErr.message || rawErr.text || JSON.stringify(rawErr);
      } else {
        msg = 'Error al enviar la solicitud';
      }
      this.errorMessage = msg;
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  private getProjectTypeName(type: string): string {
    const map: Record<string, string> = {
      landing: 'Landing Page / Captación',
      business: 'Web Corporativa / Empresa',
      ecommerce: 'Tienda Online (E-Commerce)',
      webapp: 'Aplicación Web / SaaS',
      redesign: 'Rediseño / Modernización'
    };
    return map[type] || type;
  }

  private getTimelineName(timeline: string): string {
    const map: Record<string, string> = {
      urgent: 'Urgente (< 2 semanas)',
      normal: '1 mes aprox.',
      medium: '1 a 3 meses',
      flexible: 'Flexible / Sin prisa'
    };
    return map[timeline] || timeline;
  }
}
