import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { FileHandle } from '../file-handle';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  @Output('files') files: EventEmitter<FileHandle[]> = new EventEmitter();
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { }

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


  async pushFileToStorage(file: File){
    
    let files: FileHandle[] = [];
    let base64;
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    const urlBase = window.URL.createObjectURL(file);
    base64 = await this.toDataURL(urlBase);
    let classify;
    let jSonImage;
    jSonImage = [
      {
        "key": "86a756afd5fa8ea0635be3f0a0c32897"
        , "image": base64
        , "type": 1
      }
    ];

    this.upload(jSonImage[0]).subscribe((response) => {
      classify = response.classify['classe'];

      files.push({
        file,
        url,
        classify
      });
      if (files.length > 0) {
        this.files.emit(files);
      }
      
    })
    
    return files;
  }

  toDataURL(src: string): Promise<any> {

    return new Promise((resolve, reject) => {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('CANVAS');
        var ctx: any = canvas.getContext('2d');
        var dataURL;
        // canvas.height = this.naturalWidth;
        // canvas.width = this.naturalWidth;
        // canvas.height = 200;
        // canvas.width = 200;
        canvas.width = 200;
        canvas.height = 200;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 200, 200);
        dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.src = src;
    })
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
