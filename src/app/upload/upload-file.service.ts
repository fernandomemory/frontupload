import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

   // Http Options
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', 'http://localhost:8080/api/file/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get('http://localhost:8080/api/file/info');
  }

  getAllFiles(): Observable<any> {
    return this.http
      .get<any>('http://localhost:8080/api/file/info')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  upload(item):Observable<any>{
    return this.http
      .post<any>('https://api.radiomemory.com.br/ia/classify', (item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

}
