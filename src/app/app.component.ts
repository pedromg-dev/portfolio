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

  // Listener para el evento de scroll de la ventana
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

  // Listener para el evento de redimensionamiento de la ventana
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeCanvas();
    this.handleAnimations(); // Vuelve a iniciar las animaciones con las nuevas dimensiones
  }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const savedLang = localStorage.getItem('language') || 'en';
    this.updateLanguage(savedLang);
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
    }
    // handleAnimations se llamará en ngAfterViewInit para asegurar que los canvas estén listos
  }

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.resizeCanvas(); // Redimensiona los canvas al inicio
    this.handleAnimations(); // Inicia las animaciones según el tema actual
  }

  // Método que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    this.stopMatrix();
    this.stopParticles();
    this.subscriptions.unsubscribe(); // Desuscribirse de todas las suscripciones
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
        this.languageService.changeLanguage(this.currentLang);
    this.updateLanguage(newLang);
  }

  toggleTheme(): void {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    this.handleAnimations();
  }
  
  /**
   * Abre el menú de navegación móvil.
   */
  openMobileMenu(): void {
    this.isMobileMenuOpen = true;
    document.body.classList.add('mobile-menu-open');
  }

  /**
   * Cierra el menú de navegación móvil.
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('mobile-menu-open');
  }

  /**
   * Configura el IntersectionObserver para detectar la visibilidad de las secciones
   * y actualizar el enlace de navegación activo.
   */
  setupIntersectionObserver(): void {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const id = entry.target.getAttribute('id');
          if (id && id !== 'hero') { // Evita activar el navlink del héroe a menos que la página esté en la parte superior
            this.activeSection = id;
          } else if (window.scrollY < 50) { // Si está en la parte superior, no hay sección activa
            this.activeSection = null;
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.content-section, .hero').forEach(section => observer.observe(section));
  }

  /**
   * Gestiona el inicio/parada de las animaciones de fondo (Matrix o Partículas)
   * según el tema actual.
   */
  handleAnimations(): void {
    if (document.body.classList.contains('light-mode')) {
      this.stopMatrix(); // Detiene Matrix si está corriendo
      this.startParticles(); // Inicia Partículas
    } else {
      this.stopParticles(); // Detiene Partículas si está corriendo
      this.startMatrix(); // Inicia Matrix
    }
  }

  /**
   * Inicia la animación de fondo estilo Matrix.
   */
  startMatrix(): void {
    if (!this.matrixCanvas || !this.matrixCanvas.nativeElement) return;
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Asegura que el canvas esté visible para dibujar
    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    const w = canvas.width;
    const h = canvas.height;
    let cols = Math.floor(w / 20) + 1;
    let ypos = Array(cols).fill(0);

    // Limpia y vuelve a dibujar el fondo
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const matrixDraw = () => {
      // Verifica si el canvas sigue visible antes de dibujar
      if (!this.matrixCanvas || !this.matrixCanvas.nativeElement ||
          this.matrixCanvas.nativeElement.style.display === 'none' ||
          this.matrixCanvas.nativeElement.style.opacity === '0') {
          this.stopMatrix(); // Detiene la animación si el canvas ya no es visible
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

  /**
   * Detiene la animación de fondo estilo Matrix.
   */
  stopMatrix(): void {
    if (this.matrixInterval) clearInterval(this.matrixInterval);
    this.matrixInterval = null;
    if (this.matrixCanvas && this.matrixCanvas.nativeElement) {
      this.matrixCanvas.nativeElement.style.opacity = '0'; // Inicia la transición de desvanecimiento
      // Oculta completamente después de que la transición termine
      setTimeout(() => {
        if (this.matrixCanvas) { // Vuelve a verificar en caso de que el componente se destruya durante el timeout
          this.matrixCanvas.nativeElement.style.display = 'none';
        }
      }, 500); // Coincide con la duración de la transición CSS
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
      // Si Matrix está activo, reinicia para redibujar con las nuevas dimensiones
      if (!document.body.classList.contains('light-mode')) {
        this.startMatrix();
      }
    }
    if (this.particlesCanvas && this.particlesCanvas.nativeElement) {
      this.particlesCanvas.nativeElement.width = window.innerWidth;
      this.particlesCanvas.nativeElement.height = window.innerHeight;
      // Si Particles está activo, reinicia para redibujar con las nuevas dimensiones
      if (document.body.classList.contains('light-mode')) {
        this.startParticles();
      }
    }
  }

  /**
   * Genera un mensaje de contacto utilizando la API de Gemini.
   */
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
