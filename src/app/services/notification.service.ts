import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Utils } from '@shared/utils';
import { Notification } from '@models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private sessionEndpoint: string = 'notification';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public create(notification: Notification): Observable<ApiResponse<Notification>> {
    return this._http.post<ApiResponse<Notification>>(`${environment.api}/${this.sessionEndpoint}/create`, notification);
  }

  public all(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<Notification>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Notification>>(`${environment.api}/${this.sessionEndpoint}/all?${paginate}${filterParams}`);
  }

  public search(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<Notification>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Notification>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public patch(id: number, notification: FormData): Observable<ApiResponse<Notification>> {
    return this._http.patch<ApiResponse<Notification>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, notification);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }


}
