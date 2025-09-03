import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, Dataset, Preferences } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8838';

  constructor(private http: HttpClient) {}

  signup(user: { name: string; email: string; password?: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/create`, {
      name: user.name,
      email: user.email
    });
  }

  signin(payload: { email: string; name?: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/signin`, {
      name: payload.name || 'User',
      email: payload.email
    });
  }

  uploadDataset(userId: number, file: File, useAi: boolean, topic?: string): Observable<Dataset> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams({
      userId: String(userId),
      useAi: String(useAi)
    });
    if (topic) params.append('topic', topic);

    return this.http.post<Dataset>(`${this.baseUrl}/readCsv?${params}`, formData);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  getDatasets(userId: number): Observable<Dataset[]> {
    return this.getUser(userId).pipe(
      map((u: any) => (u?.userDataSets ?? []).map((ds: any) => this.normalizeDataset(ds)))
    );
  }

  private normalizeDataset(ds: any): Dataset {
    const topicRaw = ds?.topic ?? ds?.topicName ?? ds?.name ?? ds?.title ?? '';
    const topic = String(topicRaw).trim();

    const itemCount =
      Number(
        ds?.itemCount ??
        ds?.totalItems ??
        (Array.isArray(ds?.items) ? ds.items.length : 0)
      ) || 0;

    const progress = ds?.progress ?? ds?.userProgress ?? undefined;
    const useAi = Boolean(ds?.useAi ?? ds?.aiEnabled);
    const id = ds?.id ?? ds?.datasetId ?? ds?.dataSetId ?? undefined;

    return { id, topic, itemCount, useAi, progress } as Dataset;
  }

  hasDatasetForTopic(userId: number, topic: string): Observable<boolean> {
    const t = (topic || '').trim().toLowerCase();
    return this.getDatasets(userId).pipe(
      map(list => list.some(d => (d.topic || '').trim().toLowerCase() === t))
    );
  }

  savePreferences(userId: number, prefs: Preferences): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/preferences`, prefs);
  }

  testEmail(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/users/testMail`);
  }
}
