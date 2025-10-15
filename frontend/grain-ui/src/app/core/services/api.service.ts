import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User, Preferences, Dataset } from '../models'; // import shared Dataset
import {environment} from '../../../environments/environment';
export interface SubscribeRequest {
  userId: number;
  datasetId: number;
  frequency: 'daily' | 'weekly';
  aiEnabled?: boolean;
  // compatibility with older calls:
  useAi?: boolean;
}

export interface SubscribeResponse {
  id?: number;          // subscriptionId
  subscriptionId?: number;
  datasetId?: number;
  status?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  signup(user: { name: string; email: string; password?: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}users/create`, {
      name: user.name,
      email: user.email
    });
  }

  signin(payload: { email: string; name?: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}users/signin`, {
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

    return this.http.post<Dataset>(`${this.baseUrl}readCsv?${params}`, formData);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}users/${userId}`);
  }

  getDatasets(userId: number): Observable<Dataset[]> {
    return this.getUser(userId).pipe(
      map((u: any) => (u?.userDataSets ?? []).map((ds: any) => this.normalizeDataset(ds)))
    );
  }

  private normalizeDataset(ds: any): Dataset {
    const id = ds?.id ?? ds?.datasetId ?? ds?.userDataSetId ?? ds?.dataSetId;
    const topic = String(ds?.topic ?? ds?.name ?? '').trim();
    const itemCount = Number(ds?.itemCount ?? (Array.isArray(ds?.items) ? ds.items.length : 0)) || 0;
    const useAi = Boolean(ds?.useAi ?? ds?.aiEnabled ?? false);
    const progress = ds?.progress ?? ds?.userProgress ?? undefined;
    return { id, topic, itemCount, useAi, progress };
  }

  hasDatasetForTopic(userId: number, topic: string): Observable<boolean> {
    const t = (topic || '').trim().toLowerCase();
    return this.getDatasets(userId).pipe(
      map(list => list.some(d => (d.topic || '').trim().toLowerCase() === t))
    );
  }

  savePreferences(userId: number, prefs: Preferences): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}users/${userId}/preferences`, prefs);
  }

  testEmail(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}users/testMail`);
  }

  getPublicDatasets(): Observable<Dataset[]> {
    const url = `${this.baseUrl}datasets/public`;
    return this.http.get<any[]>(url).pipe(
      tap(() => console.log('[Api] GET', url)),
      map(list => (Array.isArray(list) ? list.map(ds => this.normalizeDataset(ds)) : []))
    );
  }

  getPublicTopics(): Observable<{ id: number; topic: string }[]> {
    return this.getPublicDatasets().pipe(
      map(list => (list || [])
        .filter(ds => (ds as any).id && ds.topic)
        .map(ds => ({ id: Number((ds as any).id), topic: ds.topic! }))
      )
    );
  }

  subscribeToDataset(payload: SubscribeRequest): Observable<SubscribeResponse> {
    const params = new HttpParams()
      .set('userId', String(payload.userId))
      .set('dataSetId', String(payload.datasetId)) // backend expects "dataSetId"
      .set('frequency', payload.frequency)          // include if backend supports it
      .set('aiEnabled', String(payload.aiEnabled ?? payload.useAi ?? false));

    const url = `${this.baseUrl}subscriptions`;
    return this.http.post<SubscribeResponse>(url, null, { params });
  }

  unsubscribeFromDataset(userId: number, datasetId: number): Observable<void> {
    const params = new HttpParams()
      .set('userId', String(userId))
      .set('dataSetId', String(datasetId)); // backend expects "dataSetId"
    const url = `${this.baseUrl}subscriptions`;
    return this.http.delete<void>(url, { params });
  }
}
