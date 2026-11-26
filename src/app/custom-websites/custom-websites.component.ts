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
      ? 'Diseño y Creación de Páginas Web en Novelda a Medida | Pedro Moya'
      : 'Custom Website Development in Novelda & Alicante | Pedro Moya';

    const pageDescription = isEs
      ? '¿Buscas a alguien para hacer tu página web en Novelda o Alicante? Desarrollo web profesional a medida para empresas y autónomos. Páginas web ultra-rápidas, modernas y optimizadas para salir el primero en Google. Pide presupuesto sin compromiso.'
      : 'Looking for a custom website in Novelda, Alicante or worldwide? High-performance web development, modern UX design, and top Google SEO ranking.';

    const pageKeywords = isEs
      ? 'paginas web novelda, crear pagina web novelda, hacer pagina web novelda, diseño web novelda, desarrollador web novelda, paginas web a medida novelda, diseñador web novelda, paginas web elda, paginas web elche, paginas web alicante, programador web novelda, desarrollo web novelda'
      : 'custom website novelda, web developer novelda, web design novelda, website development alicante, software engineer novelda, bespoke websites spain';

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
    this.meta.updateTag({ property: 'og:site_name', content: isEs ? 'Pedro Moya — Páginas Web en Novelda' : 'Pedro Moya — Web Engineering' });
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
            ? 'Pedro Moya — Diseño y Creación de Páginas Web en Novelda'
            : 'Pedro Moya — Custom Website Development in Novelda',
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
            'Páginas web en Novelda',
            'Diseño web en Novelda',
            'Creación de páginas web a medida',
            'Posicionamiento SEO local en Google',
            'Desarrollo frontend Angular',
            'Desarrollo backend .NET',
            'Tiendas online e-commerce',
            'Optimización Core Web Vitals'
          ],
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': isEs ? 'Servicios de Desarrollo Web en Novelda' : 'Web Development Services in Novelda',
            'itemListElement': [
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Páginas Web Corporativas en Novelda' : 'Corporate Websites in Novelda',
                  'description': isEs
                    ? 'Sitios web profesionales multi-página para empresas y pymes en Novelda y provincia de Alicante.'
                    : 'Professional corporate websites for businesses in Novelda and Alicante.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Landing Pages de Alta Conversión en Novelda' : 'High-Converting Landing Pages in Novelda',
                  'description': isEs
                    ? 'Páginas de captación optimizadas para posicionar en Google y conseguir clientes.'
                    : 'Lead generation landing pages optimized to rank on Google.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Tiendas Online (E-Commerce) en Novelda' : 'Online Stores (E-Commerce) in Novelda',
                  'description': isEs
                    ? 'Comercio electrónico a medida con pasarelas de pago seguras para comercios y marcas locales.'
                    : 'Custom e-commerce stores with secure payment gateways.'
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': isEs ? 'Rediseño y Posicionamiento SEO en Google' : 'Website Redesign & Google SEO',
                  'description': isEs
                    ? 'Modernización y optimización de velocidad para salir el primero en Google en búsquedas locales.'
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
                ? '¿Quién hace páginas web a medida en Novelda (Alicante)?'
                : 'Who builds custom websites in Novelda (Alicante)?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Pedro Moya (pedromg.dev) es ingeniero de software y desarrollador web profesional en Novelda (Alicante). Diseña y desarrolla páginas web a medida, tiendas online y aplicaciones web de alto rendimiento para empresas y autónomos de Novelda, Elda, Petrer, Elche y toda la provincia de Alicante.'
                  : 'Pedro Moya (pedromg.dev) is a professional software engineer based in Novelda (Alicante) specializing in bespoke websites, online stores, and web apps for businesses across Novelda, Elda, Elche, and Alicante.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Cómo conseguir que mi página web salga la primera en Google en Novelda?'
                : 'How can my website rank #1 on Google in Novelda?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Para posicionar el primero en Google en búsquedas locales en Novelda, Pedro Moya implementa arquitectura semántica limpia, datos estructurados Schema.org geolocalizados, optimización Core Web Vitals (carga en milisegundos), diseño adaptado a móviles e indexación directa en Google Search Console.'
                  : 'By implementing advanced technical SEO from day one: clean semantic HTML, geolocated Schema.org structured data, sub-second load times (Google Core Web Vitals), responsive mobile design, and Google Search Console indexing.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Por qué contratar a un desarrollador web local en Novelda en vez de una agencia?'
                : 'Why hire a local web developer in Novelda instead of an agency?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Trabajar directamente con Pedro Moya te garantiza trato directo y cercano con quien programa cada línea de código de tu web, sin intermediarios, comerciales ni sobrecostes de agencia. Presupuesto cerrado garantizado y código moderno (.NET, Angular, Tailwind).'
                  : 'You work directly with the actual engineer writing your code, with zero middlemen, no inflated agency fees, and modern proprietary technology (.NET, Angular, Tailwind).'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Qué tipo de páginas web se pueden crear en Novelda?'
                : 'What types of websites do you build in Novelda?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Landing pages de captación, páginas web corporativas para empresas y pymes, tiendas online (e-commerce) con pasarela de pago segura, aplicaciones web a medida (SaaS, portales de clientes) y rediseños de páginas web existentes.'
                  : 'High-converting landing pages, corporate websites for SMBs, e-commerce stores with payment gateways, bespoke web portals, and complete redesigns of existing websites.'
              }
            },
            {
              '@type': 'Question',
              'name': isEs
                ? '¿Cómo solicitar presupuesto para una página web en Novelda?'
                : 'How do I request a quote for a website in Novelda?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': isEs
                  ? 'Puedes rellenar el formulario de solicitud en pedromg.dev seleccionando el tipo de proyecto y describiendo tus necesidades. Recibirás una propuesta técnica detallada y presupuesto cerrado sin compromiso en menos de 24 horas laborables.'
                  : 'Fill out the form on pedromg.dev with your project requirements. You will receive a detailed technical proposal and fixed-price quote with zero commitment within 24 business hours.'
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

    const subject = `[Solicitud Web en Novelda / A Medida] ${projectTypeName} - ${raw.name}`;

    const formattedMessage = [
      '==============================================',
      'NUEVA SOLICITUD DE PÁGINA WEB A MEDIDA (NOVELDA / ONLINE)',
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
        website: ''
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
}
