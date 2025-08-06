import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-pdf-downloader',
  templateUrl: './pdf-downloader.component.html',
  styleUrls: ['./pdf-downloader.component.css']
})
export class PdfDownloaderComponent implements OnInit, OnDestroy {

  private currentLang = 'es';
  private languageSub: Subscription = new Subscription;

  constructor(private languageService: LanguageService) { }

  ngOnInit() {
    this.languageSub = this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  downloadPdf() {
    var path = '';
    var documentName = '';
    if (this.currentLang === 'en') {
      path = 'assets/pdfs/CV-Pedro-Antonio-Moya.pdf';
      documentName = 'CV-Pedro-Antonio-Moya.pdf';
    }
    else {
      path = 'assets/pdfs/CV-Pedro-Antonio-Moya-ENG.pdf';
      documentName = 'Resume-Pedro-Antonio-Moya.pdf';
    }

    fetch(path)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  }

  ngOnDestroy() {
    if (this.languageSub) {
      this.languageSub.unsubscribe();
    }
  }
}