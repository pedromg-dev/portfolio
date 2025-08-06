import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'; // Importa el entorno
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private readonly apiKey = environment.geminiApiKey;
  private readonly apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

  constructor(private http: HttpClient) { }

  generateMessage(userInput: string, languageName: string): Observable<string> {
    const prompt = `You are a professional writing assistant. A recruiter or potential client wants to contact Pedro Moya García, a Full-Stack .NET Developer. Based on the following keywords, write a brief, professional, and friendly contact message in the first person for the user to send. The message must be in ${languageName}. Keywords: "${userInput}"`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(this.apiUrl, payload, httpOptions).pipe(

      catchError(error => {
        console.error('Error al llamar a la API de Gemini:', error);
        return throwError(() => new Error(`Error al generar el mensaje: ${error.message || 'Error desconocido'}`));
      })
    );
  }
}
