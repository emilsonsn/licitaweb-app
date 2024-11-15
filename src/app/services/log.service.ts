import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {ApiResponse, ApiResponsePageable, PageControl} from "@models/application";
import {Utils} from "@shared/utils";
import {Log} from "@models/Log";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private readonly logUrl = `${environment.api}/log`;

  constructor(private readonly _http: HttpClient) {
  }

  getAllLogs(): Observable<ApiResponse<Log>> {
    return this._http.get<ApiResponse<Log>>(`${this.logUrl}/all`);
  }

  public getLogs(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<Log>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Log>>(`${this.logUrl}/search?${paginate}${filterParams}`);
  }
}
