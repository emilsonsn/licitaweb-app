import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {ApiResponse, DeleteApiResponse} from "@models/application";
import {Observable} from "rxjs";
import {Task, TaskStatus} from "@models/Task";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  getTasks(): Observable<ApiResponse<Task[]>> {
    return this._http.get<ApiResponse<Task[]>>(`${environment.api}/task/search`);
  }

  getStatusTasks(): Observable<ApiResponse<TaskStatus[]>> {
    return this._http.get<ApiResponse<TaskStatus[]>>(`${environment.api}/status/all`);
  }

  updateTask(task: Task): Observable<ApiResponse<TaskStatus>> {
    return this._http.patch<ApiResponse<TaskStatus>>(`${environment.api}/status/${task?.id}`, task);
  }

  createTask(task: TaskStatus): Observable<ApiResponse<TaskStatus>> {
    return this._http.post<ApiResponse<TaskStatus>>(`${environment.api}/status/create`, task);
  }

  deleteTask(task: Task): Observable<ApiResponse<Task>> {
    return this._http.delete<ApiResponse<Task>>(`${environment.api}/task/${task?.id}`);
  }

  putTask(id: number, task: TaskStatus): Observable<ApiResponse<Task>> {
    return this._http.post<ApiResponse<Task>>(`${environment.api}/status/${id}update?_method=PATCH`, task);
  }

  public deleteFile(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/task/file/${id}`);
  }

  public deleteSubTask(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/task/subtask/${id}`);
  }

}
