import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-pdf-downloader',
  templateUrl: './pdf-downloader.component.html',
  styleUrl: './pdf-downloader.component.css'
})
export class PdfDownloaderComponent {

  constructor(public translate: TranslateService) { }

  downloadPdf() {

    var path = 'assets/pdfs/CV-Pedro-Antonio-Moya.pdf';
    var documentName = 'CV-Pedro-Antonio-Moya.pdf';

    if(this.translate.currentLang === 'en') {
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
      })
      .catch((error) => console.error(error));
  }

  

  ngOnInit() {
  }
}
