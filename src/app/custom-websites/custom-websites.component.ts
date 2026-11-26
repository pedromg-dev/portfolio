import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
export class CustomWebsitesComponent implements OnInit, OnDestroy {
  formLoadedAt: number = Date.now();

  requestForm: FormGroup = this.fb.group({
    projectType: ['business', Validators.required],
    details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(40)]],
    company: ['', [Validators.maxLength(120)]],
    privacyPolicy: [false, Validators.requiredTrue],
    website: [''] // Honeypot field (hidden from real users, must stay empty)
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
    this.formLoadedAt = Date.now();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    this.updateSeo();
  }

  ngOnDestroy(): void {
    const script = this.document.getElementById('custom-web-jsonld');
    script?.remove();
  }

  updateSeo(): void {
    const lang = this.i18n.currentLang;
    const isEs = lang === 'es';

    const pageTitle = isEs
      ? 'Desarrollo de Páginas Web a Medida en Novelda y Online | Pedro Moya'
      : 'Custom Website Development in Novelda & Online | Pedro Moya';

    const pageDescription = isEs
      ? 'Diseño y desarrollo de páginas web a medida para empresas y autónomos. Servicio presencial en Novelda (Alicante) y telemático en toda España. Páginas web ultra-rápidas y optimizadas para Google.'
      : 'Bespoke website development for businesses and professionals. In-person service in Novelda (Alicante) and 100% remote across Spain and worldwide. Fast, secure, and Google-optimized.';

    const pageKeywords = isEs
      ? 'paginas web novelda, paginas web a medida, diseño web novelda, crear pagina web novelda, hacer pagina web novelda, programador web novelda, desarrollador web novelda, paginas web elda, paginas web elche, paginas web alicante, desarrollo web espana, diseno web profesional'
      : 'custom website novelda, web developer novelda, web design novelda, website development alicante, software engineer novelda, bespoke websites remote, web application development';

    const pageUrl = `${SITE_URL}/${lang}/custom-websites`;
    const imageUrl = `${SITE_URL}/assets/images/portfolio-image-project.png`;

    this.title.setTitle(pageTitle);

    // Standard Search Engine Tags
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ name: 'keywords', content: pageKeywords });
    this.meta.updateTag({ name: 'author', content: 'Pedro Antonio Moya García' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

    // Local SEO & Geo Tags for Novelda (Alicante)
    this.meta.updateTag({ name: 'geo.region', content: 'ES-A' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Novelda' });
    this.meta.updateTag({ name: 'geo.position', content: '38.3833;-0.7667' });
    this.meta.updateTag({ name: 'ICBM', content: '38.3833, -0.7667' });

    // OpenGraph Tags (Facebook, WhatsApp, LinkedIn, Slack, AI bots)
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: isEs ? 'Pedro Moya — Páginas Web en Novelda y Online' : 'Pedro Moya — Web Engineering' });
    this.meta.updateTag({ property: 'og:locale', content: isEs ? 'es_ES' : 'en_US' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: isEs ? 'en_US' : 'es_ES' });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:alt', content: pageTitle });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter Card Tags (X)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: pageDescription });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image:alt', content: pageTitle });

    this.injectStructuredData(isEs, pageUrl, pageDescription);
  }

  private injectStructuredData(isEs: boolean, pageUrl: string, pageDescription: string): void {
    const imageUrl = `${SITE_URL}/assets/images/portfolio-image-project.png`;

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LocalBusiness', 'ProfessionalService'],
          '@id': `${SITE_URL}/#localbusiness`,
          'name': isEs
            ? 'Pedro Moya — Desarrollo de Páginas Web a Medida'
            : 'Pedro Moya — Custom Website Development',
          'alternateName': [
            'Pedro Moya Desarrollo Web Novelda',
            'Páginas Web a Medida Novelda',
            'Diseño Web Novelda - Pedro Moya García'
          ],
          'url': pageUrl,
          'logo': imageUrl,
          'image': imageUrl,
          'description': pageDescription,
          'priceRange': '€€',
          'currenciesAccepted': 'EUR',
          'paymentAccepted': 'Cash, Credit Card, Bank Transfer',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Novelda',
            'addressLocality': 'Novelda',
            'postalCode': '03660',
            'addressRegion': 'Alicante',
            'addressCountry': 'ES'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 38.3833,
            'longitude': -0.7667
          },
          'areaServed': [
            { '@type': 'City', 'name': 'Novelda', 'sameAs': 'https://es.wikipedia.org/wiki/Novelda' },
            { '@type': 'City', 'name': 'Elda', 'sameAs': 'https://es.wikipedia.org/wiki/Elda' },
            { '@type': 'City', 'name': 'Petrer', 'sameAs': 'https://es.wikipedia.org/wiki/Petrer' },
            { '@type': 'City', 'name': 'Aspe', 'sameAs': 'https://es.wikipedia.org/wiki/Aspe' },
            { '@type': 'City', 'name': 'Monforte del Cid' },
            { '@type': 'City', 'name': 'Elche', 'sameAs': 'https://es.wikipedia.org/wiki/Elche' },
            { '@type': 'City', 'name': 'Alicante', 'sameAs': 'https://es.wikipedia.org/wiki/Alicante' },
            { '@type': 'AdministrativeArea', 'name': 'Comunidad Valenciana' },
            { '@type': 'Country', 'name': 'España' },
            { '@type': 'Country', 'name': 'Worldwide' }
          ],
          'provider': {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            'name': 'Pedro Antonio Moya García',
            'jobTitle': 'Senior Full-Stack & Web Developer',
            'url': SITE_URL
          },
          'knowsAbout': [
            'Páginas web a medida',
            'Páginas web en Novelda',
            'Diseño web profesional',
            'Desarrollo web telemático',
            'Posicionamiento SEO en Google',
            'Desarrollo frontend Angular',
            'Desarrollo backend .NET',
            'Tiendas online e-commerce',
            'Optimización Core Web Vitals'
          ],
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': isEs ? 'Servicios de Desarrollo Web' : 'Web Development Services',
            'itemListElement': [
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Páginas Web Corporativas a Medida' : 'Bespoke Corporate Websites',
                  'description': isEs
                    ? 'Sitios web profesionales multi-página para empresas y pymes en Novelda, Alicante y toda España.'
                    : 'Professional corporate websites for businesses locally and worldwide.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Landing Pages de Alta Conversión' : 'High-Converting Landing Pages',
                  'description': isEs
                    ? 'Páginas de captación optimizadas para posicionar en Google y captar clientes.'
                    : 'Lead generation landing pages optimized to rank on Google.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Tiendas Online (E-Commerce) a Medida' : 'Custom E-Commerce Stores',
                  'description': isEs
                    ? 'Comercio electrónico a medida con pasarelas de pago seguras para marcas y empresas.'
                    : 'Custom e-commerce stores with secure payment gateways.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Rediseño y Posicionamiento SEO en Google' : 'Website Redesign & Google SEO',
                  'description': isEs
                    ? 'Modernización y optimización de velocidad para salir el primero en Google en búsquedas locales y nacionales.'
                    : 'Speed optimization and technical SEO to rank #1 on Google.'
                }
              }
            ]
          }
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          'mainEntity': [
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Dónde ofreces tus servicios de desarrollo web?'
                : 'Where do you offer your web development services?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Trabajo de forma 100% telemática con clientes de toda España y el extranjero, y cuento con sede y atención presencial en Novelda (Alicante) y comarca del Vinalopó (Elda, Petrer, Aspe, Monforte del Cid, Elche). Puedes gestionar todo tu proyecto cómodamente a distancia o con reuniones presenciales si estás en la zona.'
                  : 'I work 100% remotely with clients across Spain and internationally, while offering in-person collaboration in Novelda (Alicante) and the Vinalopo region (Elda, Petrer, Elche). You can manage your entire project comfortably online or meet locally.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Cómo conseguir que mi página web salga la primera en Google?'
                : 'How can my website rank #1 on Google?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Implementando SEO técnico avanzado desde el primer día: arquitectura semántica limpia, datos estructurados Schema.org (con geolocalización para Novelda y Alicante y relevancia para búsquedas nacionales), tiempos de carga en milisegundos (Core Web Vitals), diseño móvil responsive y registro directo en Google Search Console.'
                  : 'By implementing advanced technical SEO from day one: clean semantic HTML, geolocated Schema.org structured data, sub-second load times (Google Core Web Vitals), 100% responsive mobile design, and Google Search Console indexing.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Por qué contratar a un desarrollador web independiente en vez de una agencia?'
                : 'Why work with an independent software engineer instead of an agency?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Obtienes trato directo con el ingeniero de software que programa tu web, sin intermediarios, comerciales ni sobrecostes de agencia. Máxima agilidad, código limpio y moderno (.NET, Angular, Tailwind) en lugar de plantillas genéricas lentas, y presupuesto cerrado garantizado.'
                  : 'You communicate directly with the engineer coding your project—no middlemen, no sales reps, and no agency overhead. Fast delivery, modern proprietary code (.NET, Angular, Tailwind) instead of bloated templates, and a transparent fixed-price quote.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Qué tipo de proyectos y páginas web desarrollas?'
                : 'What types of web projects do you develop?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Desarrollo desde landing pages de captación y sitios web corporativos para pymes y empresas hasta tiendas online (e-commerce) completas con pasarela de pago, aplicaciones web y portales a medida (SaaS), así como modernización completa de webs existentes.'
                  : 'From lead-generation landing pages and corporate websites to complete e-commerce stores with secure checkout, custom web apps/SaaS, and modernization of existing websites.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Cómo solicitar presupuesto para mi proyecto?'
                : 'How do I request a quote for my project?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Rellena el formulario de esta página indicando el tipo de web que necesitas y los detalles del proyecto. Tanto si estás en Novelda, Alicante o en cualquier otra ciudad, te responderé en menos de 24 horas laborables con una propuesta técnica y económica detallada sin compromiso.'
                  : 'Complete the form on this page with your project goals. Whether you are located in Novelda, Alicante, or anywhere else worldwide, you will receive a comprehensive technical proposal and fixed-scope quote within 24 business hours.'
              }
            }
          ]
        }
      ]
    };

    let script = this.document.getElementById('custom-web-jsonld') as HTMLScriptElement | null;
    if (script) {
      script.text = JSON.stringify(schemaData);
    } else {
      script = this.document.createElement('script');
      script.id = 'custom-web-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      this.document.head.appendChild(script);
    }
  }

  setProjectType(type: string): void {
    this.requestForm.patchValue({ projectType: type });
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
      '',
      'REQUERIMIENTOS Y OBJETIVOS:',
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
      subject,
      message: formattedMessage,
      website: raw.website || '',
      _timestamp: this.formLoadedAt
    };

    try {
      await firstValueFrom(this.http.post('/api/send-email', payload));
      this.submitSuccess = true;
      this.requestForm.reset({
        projectType: 'business',
        website: '',
        privacyPolicy: false
      });
      this.formLoadedAt = Date.now();
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

  getPrivacyLink(): string {
    const lang = this.i18n.currentLang || 'es';
    return `/${lang}/${lang === 'en' ? 'privacy-policy' : 'privacidad'}`;
  }
}
