import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiResponse, ApiResponsePageable} from '@models/application';
import { environment } from '@env/environment';
import {IEventTask} from "@models/Event";

@Injectable({
  providedIn: 'root'
})
export class EventTaskService {
  private readonly apiUrl = `${environment.api}/task`;

  constructor(
    private readonly _http: HttpClient
  ) {}

  // Rota para obter todas as tarefas
  getAllIEventTasks(): Observable<ApiResponsePageable<IEventTask>> {
    return this._http.get<ApiResponsePageable<IEventTask>>(`${this.apiUrl}/all`);
  }

  // Rota para buscar tarefas com query params
  searchIEventTasks(queryParams: any): Observable<ApiResponse<IEventTask[]>> {
    return this._http.get<ApiResponse<IEventTask[]>>(`${this.apiUrl}/search`, { params: queryParams });
  }

  // Rota para criar uma nova tarefa
  createIEventTask(IEventTaskData: IEventTask): Observable<ApiResponse<IEventTask>> {
    return this._http.post<ApiResponse<IEventTask>>(`${this.apiUrl}/create`, IEventTaskData);
  }

  // Rota para excluir uma tarefa pelo ID
  deleteIEventTask(id: number): Observable<ApiResponse<null>> {
    return this._http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
