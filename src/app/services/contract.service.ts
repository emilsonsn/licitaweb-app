import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";
import {ApiResponsePageable} from "@models/application";
import {Utils} from "@shared/utils";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = `${environment.api}/contract`;

  constructor(private readonly _http: HttpClient) {
  }

  // Obter todos os contratos
  getAllContracts(): Observable<any> {
    return this._http.get(`${this.baseUrl}/all`);
  }

  // Buscar contratos
  public searchContracts(pageControl?: any, filters?: any): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

  // Criar contrato
  createContract(contractData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, contractData);
  }

  // Atualizar contrato
  updateContract(contractId: number, contractData: any): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${contractId}`, contractData);
  }

  // Deletar contrato
  deleteContract(contractId: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${contractId}`);
  }

  // Criar pagamento
  createPayment(contractId: number, paymentData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/${contractId}/payment`, paymentData);
  }

  // Deletar pagamento
  deletePayment(paymentId: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/payment/${paymentId}`);
  }

  // Deletar produto do contrato
  deleteContractProduct(contractProductId: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/product/${contractProductId}`);
  }

  // Deletar anexo do contrato
  deleteAttachment(attachmentId: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/attachment/${attachmentId}`);
  }
}
