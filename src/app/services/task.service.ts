import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {ApiResponse, DeleteApiResponse} from "@models/application";
import {Observable} from "rxjs";
import {Task, TaskStatus} from "@models/Task";
import {Tender} from "@models/tender";

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

  updateTaskStatus(task: TaskStatus): Observable<ApiResponse<TaskStatus>> {
    return this._http.patch<ApiResponse<TaskStatus>>(`${environment.api}/status/${task?.id}`, task);
  }

  updateTender(task: Tender): Observable<ApiResponse<Tender>> {

    const body = {status_id: task.tender_status[0].status_id, position: task.tender_status[0].position};

    return this._http.patch<ApiResponse<Tender>>(`${environment.api}/tender/${task?.id}/status`, body);
  }

  createTaskStatus(task: TaskStatus): Observable<ApiResponse<TaskStatus>> {
    return this._http.post<ApiResponse<TaskStatus>>(`${environment.api}/status/create`, task);
  }

  deleteTask(task: Task): Observable<ApiResponse<Task>> {
    return this._http.delete<ApiResponse<Task>>(`${environment.api}/task/${task?.id}`);
  }

  deleteTaskStatus(task: TaskStatus): Observable<ApiResponse<TaskStatus>> {
    return this._http.delete<ApiResponse<TaskStatus>>(`${environment.api}/status/${task?.id}`);
  }

  putTaskStatus(id: number, task: TaskStatus): Observable<ApiResponse<Task>> {
    return this._http.post<ApiResponse<Task>>(`${environment.api}/status/${id}update?_method=PATCH`, task);
  }

  public deleteFile(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/task/file/${id}`);
  }

  public deleteSubTask(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/task/subtask/${id}`);
  }

}
