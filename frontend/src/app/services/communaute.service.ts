import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DiscussionThread } from '../discussion-thread';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommunauteService {
  private apiUrl = '/api/community';

  private mockThreads: DiscussionThread[] = [
    { id: '1', title: 'Discussions Générales', memberCount: 15, isMember: true, isMasked: false },
    { id: '2', title: 'Aide Angular', description: 'Posez vos questions sur Angular.', memberCount: 5, isMember: false, isMasked: false },
    { id: '3', title: 'Partage de Projets', memberCount: 10, isMember: true, isMasked: true },
    { id: '4', title: 'Offres d\'Emploi', memberCount: 2, isMember: false, isMasked: false }
  ];

  constructor(private http: HttpClient) { }

  getDiscussionThreads(): Observable<DiscussionThread[]> {
    return of(this.mockThreads).pipe(delay(500));
  }

  joinThread(threadId: string): Observable<any> {
    this.mockThreads = this.mockThreads.map(thread =>
      thread.id === threadId ? { ...thread, isMember: true } : thread
    );
    return of(null).pipe(delay(300));
  }

  maskThread(threadId: string): Observable<any> {
    this.mockThreads = this.mockThreads.map(thread =>
      thread.id === threadId ? { ...thread, isMasked: !thread.isMasked } : thread
    );
    return of(null).pipe(delay(300));
  }

  leaveThread(threadId: string): Observable<any> {
    this.mockThreads = this.mockThreads.map(thread =>
      thread.id === threadId ? { ...thread, isMember: false } : thread
    );
    return of(null).pipe(delay(300));
  }
}
