import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { GeminiApiService } from './gemini-api.service';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { translations } from './translations';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'portfolio';

  currentLang = 'en';
  geminiButtonDisabled = false;
  geminiLoaderVisible = false;
  aiPromptPlaceholderText: string = '';
  messageTextareaValue: string = '';
  activeSection: string | null = 'hero'; // Para controlar el enlace de navegación activo
  isMobileMenuOpen = false; // Para controlar el estado del menú móvil

  // Referencias a elementos del DOM usando ViewChild
  @ViewChild('themeSwitcher') themeSwitcher!: ElementRef<HTMLButtonElement>;
  @ViewChild('langSwitcher') langSwitcher!: ElementRef<HTMLButtonElement>;
  @ViewChild('navbar') navbar!: ElementRef<HTMLElement>;
  @ViewChild('burgerMenu') burgerMenu!: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileNav') mobileNav!: ElementRef<HTMLElement>;
  @ViewChild('closeMenuBtn') closeMenuBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('geminiButton') geminiButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('geminiLoader') geminiLoader!: ElementRef<HTMLElement>;
  @ViewChild('aiPromptInput') aiPromptInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messageTextarea') messageTextarea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('matrixBg') matrixCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('particlesBg') particlesCanvas!: ElementRef<HTMLCanvasElement>;

  private matrixInterval: any;
  private particlesAnimationId: any;
  private lastScrollTop = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(private geminiApi: GeminiApiService, private languageService: LanguageService) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (this.navbar) {
      this.navbar.nativeElement.classList.toggle('scrolled', scrollTop > 50);
      if (scrollTop > this.lastScrollTop && scrollTop > this.navbar.nativeElement.offsetHeight) {
        this.navbar.nativeElement.classList.add('nav-hidden');
      } else {
        this.navbar.nativeElement.classList.remove('nav-hidden');
      }
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeCanvas();
    this.handleAnimations();
  }

  ngOnInit(): void {
    let currentLang = localStorage.getItem('language');

    if (!currentLang) {
      const browserLang = navigator.language.split('-')[0];
      currentLang = ['es', 'en'].includes(browserLang) ? browserLang : 'en';
    }
    this.languageService.changeLanguage(currentLang);
    this.updateLanguage(currentLang);
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.resizeCanvas();
    this.handleAnimations();
  }

  ngOnDestroy(): void {
    this.stopMatrix();
    this.stopParticles();
    this.subscriptions.unsubscribe();
  }

  updateLanguage(lang: string): void {
    this.currentLang = lang;
    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      if (key && (translations as any)[lang] && (translations as any)[lang][key]) {
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
          (element as HTMLInputElement).placeholder = (translations as any)[lang][key];
        } else if (element.tagName === 'P' && key === 'footerCopyright') {

          element.innerHTML = (translations as any)[lang][key];
        } else {
          element.textContent = (translations as any)[lang][key];
        }
      }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    this.aiPromptPlaceholderText = (translations as any)[this.currentLang]['aiHelperPlaceholder'];
  }


  toggleLanguage(): void {
    const newLang = this.currentLang === 'en' ? 'es' : 'en';
    this.languageService.changeLanguage(newLang);
    this.updateLanguage(newLang);
  }

  toggleTheme(): void {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    this.handleAnimations();
  }

  openMobileMenu(): void {
    this.isMobileMenuOpen = true;
    document.body.classList.add('mobile-menu-open');
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('mobile-menu-open');
  }

  setupIntersectionObserver(): void {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const id = entry.target.getAttribute('id');
          if (id && id !== 'hero') {
            this.activeSection = id;
          } else if (window.scrollY < 50) {
            this.activeSection = null;
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.content-section, .hero').forEach(section => observer.observe(section));
  }

  handleAnimations(): void {
    if (document.body.classList.contains('light-mode')) {
      this.stopMatrix();
      this.startParticles();
    } else {
      this.stopParticles();
      this.startMatrix();
    }
  }


  startMatrix(): void {
    if (!this.matrixCanvas || !this.matrixCanvas.nativeElement) return;
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    const w = canvas.width;
    const h = canvas.height;
    let cols = Math.floor(w / 20) + 1;
    let ypos = Array(cols).fill(0);


    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const matrixDraw = () => {
      if (!this.matrixCanvas || !this.matrixCanvas.nativeElement ||
        this.matrixCanvas.nativeElement.style.display === 'none' ||
        this.matrixCanvas.nativeElement.style.opacity === '0') {
        this.stopMatrix();
        return;
      }
      ctx.fillStyle = 'rgba(0,0,0,.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#00FF41';
      ctx.font = '15pt Roboto Mono';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    };

    if (this.matrixInterval) clearInterval(this.matrixInterval);
    this.matrixInterval = setInterval(matrixDraw, 50);
  }


  stopMatrix(): void {
    if (this.matrixInterval) clearInterval(this.matrixInterval);
    this.matrixInterval = null;
    if (this.matrixCanvas && this.matrixCanvas.nativeElement) {
      this.matrixCanvas.nativeElement.style.opacity = '0';
      setTimeout(() => {
        if (this.matrixCanvas) {
          this.matrixCanvas.nativeElement.style.display = 'none';
        }
      }, 500);
    }
  }

  startParticles(): void {
    if (!this.particlesCanvas || !this.particlesCanvas.nativeElement) return;
    const canvas = this.particlesCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    const w = canvas.width;
    const h = canvas.height;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; }[] = [];
    const particleCount = Math.floor(w / 20);
    const maxDist = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        radius: Math.random() * 2 + 1
      });
    }

    const drawParticles = () => {
      if (!this.particlesCanvas || !this.particlesCanvas.nativeElement ||
        this.particlesCanvas.nativeElement.style.display === 'none' ||
        this.particlesCanvas.nativeElement.style.opacity === '0') {
        this.stopParticles();
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#606770';

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 119, 182, ${1 - dist / maxDist})`;
            ctx.stroke();
          }
        }
      }
      this.particlesAnimationId = requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }


  stopParticles(): void {
    if (this.particlesAnimationId) cancelAnimationFrame(this.particlesAnimationId);
    this.particlesAnimationId = null;
    if (this.particlesCanvas && this.particlesCanvas.nativeElement) {
      this.particlesCanvas.nativeElement.style.opacity = '0';
      setTimeout(() => {
        if (this.particlesCanvas) {
          this.particlesCanvas.nativeElement.style.display = 'none';
        }
      }, 500);
    }
  }

  resizeCanvas(): void {
    if (this.matrixCanvas && this.matrixCanvas.nativeElement) {
      this.matrixCanvas.nativeElement.width = window.innerWidth;
      this.matrixCanvas.nativeElement.height = window.innerHeight;
      if (!document.body.classList.contains('light-mode')) {
        this.startMatrix();
      }
    }
    if (this.particlesCanvas && this.particlesCanvas.nativeElement) {
      this.particlesCanvas.nativeElement.width = window.innerWidth;
      this.particlesCanvas.nativeElement.height = window.innerHeight;
      if (document.body.classList.contains('light-mode')) {
        this.startParticles();
      }
    }
  }

  async generateMessageWithAI(): Promise<void> {
    const userInput = this.aiPromptInput.nativeElement.value;
    if (!userInput) {
      this.aiPromptInput.nativeElement.placeholder = this.currentLang === 'en' ? "Please enter some keywords." : "Por favor, introduce algunas palabras clave.";
      return;
    }

    this.geminiLoaderVisible = true;
    this.geminiButtonDisabled = true;

    const languageName = this.currentLang === 'en' ? 'English' : 'Spanish';

    this.subscriptions.add(
      this.geminiApi.generateMessage(userInput, languageName)
        .pipe(
          finalize(() => {
            this.geminiLoaderVisible = false;
            this.geminiButtonDisabled = false;
          })
        )
        .subscribe({
          next: (result: any) => {
            if (result.candidates && result.candidates.length > 0 &&
              result.candidates[0].content && result.candidates[0].content.parts &&
              result.candidates[0].content.parts.length > 0) {
              const text = result.candidates[0].content.parts[0].text;
              this.messageTextareaValue = text.trim();
            } else {
              this.messageTextareaValue = this.currentLang === 'en' ? "Error generating message. Invalid API response." : "Error al generar el mensaje. Respuesta de API inválida.";
            }
          },
          error: (err) => {
            console.error('Error en la suscripción de Gemini API:', err);
            this.messageTextareaValue = this.currentLang === 'en' ? "Error generating message. Please try again." : "Error al generar el mensaje. Por favor, inténtalo de nuevo.";
          }
        })
    );
  }
}
