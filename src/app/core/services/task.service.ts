import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = `${environment.task_api}/tasks`;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    createTask(task: Partial<Task>): Observable<Task> {
        console.log('Creating task:', task);
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(id: string, task: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
    }

    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
