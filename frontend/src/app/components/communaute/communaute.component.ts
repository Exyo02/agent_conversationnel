import { Component } from '@angular/core';
import { CommunauteService } from '../../services/communaute.service';
import { DiscussionThread } from '../../discussion-thread';

@Component({
  standalone:true,
  selector: 'app-communaute',
  imports: [],
  templateUrl: './communaute.component.html',
  styleUrl: './communaute.component.css'
})

export class CommunauteComponent {
  discussionThreads: DiscussionThread[] = [];

  constructor(private communauteService: CommunauteService) { }

  ngOnInit(): void {
    this.loadDiscussionThreads();
  }

  loadDiscussionThreads(): void {
    this.communauteService.getDiscussionThreads().subscribe(
      threads => this.discussionThreads = threads,
      error => console.error('Erreur lors du chargement des fils de discussion:', error)
    );
  }

  onJoinThread(threadId: string): void {
    this.communauteService.joinThread(threadId).subscribe(
      () => this.loadDiscussionThreads(),
      error => console.error('Erreur lors de la tentative de rejoindre le fil:', error)
    );
  }

  onMaskThread(threadId: string): void {
    this.communauteService.maskThread(threadId).subscribe(
      () => this.loadDiscussionThreads(),
      error => console.error('Erreur lors de la tentative de masquer le fil:', error)
    );
  }

  onLeaveThread(threadId: string): void {
    this.communauteService.leaveThread(threadId).subscribe(
      () => this.loadDiscussionThreads(),
      error => console.error('Erreur lors de la tentative de quitter le fil:', error)
    );
  }
  onCreateNewThread(): void {
    console.log('Bouton Créer une nouvelle discussion cliqué !');
   // this.dialog.open(CreateThreadDialogComponent);
  }
}
