import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-downloader',
  templateUrl: './pdf-downloader.component.html',
  styleUrl: './pdf-downloader.component.css'
})
export class PdfDownloaderComponent {

  downloadPdf() {
    fetch('assets/pdfs/CurriculumPedro.pdf')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV-Pedro-Antonio-Moya.pdf';
        a.click();
      })
      .catch((error) => console.error(error));

  }

  constructor() { }

  ngOnInit() {
  }
}
