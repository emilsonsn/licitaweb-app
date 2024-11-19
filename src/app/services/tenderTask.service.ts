import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {ApiResponse, ApiResponsePageable, PageControl} from "@models/application";
import {Observable} from "rxjs";
import {Task} from "@models/Task";
import {Utils} from "@shared/utils";

@Injectable({
  providedIn: 'root'
})
export class TenderTaskService {

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  getAll(): Observable<ApiResponse<Task[]>> {
    return this._http.get<ApiResponse<Task[]>>(`${environment.api}/task/all`);
  }

  search(): Observable<ApiResponse<Task[]>> {
    return this._http.get<ApiResponse<Task[]>>(`${environment.api}/task/search`);
  }

  create(task: Task): Observable<ApiResponse<Task>> {
    return this._http.post<ApiResponse<Task>>(`${environment.api}/task/create`, task);
  }

  update(task_id: number, task: Task): Observable<ApiResponse<Task>> {
    return this._http.patch<ApiResponse<Task>>(`${environment.api}/task/${task_id}`, task);
  }

  deleteTask(task_id: number): Observable<ApiResponse<Task>> {
    return this._http.delete<ApiResponse<Task>>(`${environment.api}/task/${task_id}`);
  }


  public searchTenderCard(pageControl: PageControl, filters?: any): Observable<any> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get(`${environment.apiLicita}?${paginate}${filterParams}`);
  }



}
