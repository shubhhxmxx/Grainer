import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-subscribe-handler',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `<p>Processing your request...</p>`
})
export class SubscribeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const topic = this.route.snapshot.queryParamMap.get('topic') || '';
    if (!topic) { this.router.navigate(['/']); return; }

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/signup'], { queryParams: { redirect: `/subscribe?topic=${encodeURIComponent(topic)}` } });
      return;
    }

    const userId = this.auth.userId!;
    this.api.hasDatasetForTopic(userId, topic).subscribe((exists: boolean) => {
      if (exists) {
        this.snack.open('A dataset for this topic already exists.', 'Open', { duration: 4000 })
          .onAction().subscribe(() => this.router.navigate(['/dashboard']));
        this.router.navigate(['/dashboard']);
      } else {
        this.snack.open('Choose preferences for this topic.', 'Open', { duration: 3000 });
        this.router.navigate(['/preferences'], { queryParams: { prefillTopic: topic } });
      }
    });
  }
}
