import { HttpClient,HttpHeaders,provideHttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService implements OnInit {
  private apiURL = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = 'E0fGoSyjsWkSv8ZyVoZsSigcaRAA73sa';

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    
  }

  envoi(message:string) : Observable<Object>{
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
    const body = {
      model: 'mistral-tiny',
      messages: [
        { role: 'user', content: message }
      ],
      temperature: 0.7
    };
    
    return this.http.post(this.apiURL, body,{headers:header});
  }
}
