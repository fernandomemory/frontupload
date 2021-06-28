import {
  Directive, HostBinding, HostListener, EventEmitter,
  Output,
  ElementRef,
} from '@angular/core';
import {
  FileHandle
} from './file-handle';
import {
  DomSanitizer, SafeUrl
} from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output('files') files: EventEmitter<FileHandle[]> = new EventEmitter();
  @HostBinding('style.background') private background = '#eee';
  constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

  @HostListener('dragover', ['$event']) onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    this.background = '#999';
    if (files.length > 0) {

    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'

  }

  @HostListener('drop', ['$event']) public async onDrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
    evt.preventDefault();
    evt.stopPropagation();
    let files: FileHandle[] = [];
    let base64;
    let jSonImage;


    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const urlBase = window.URL.createObjectURL(file);

      let base64 = await this.toDataURL(urlBase);

      jSonImage = [
        { "key": "86a756afd5fa8ea0635be3f0a0c32897"
        , "image": base64
        , "type": 1 }
      ];





      files.push({
        file,
        url
      });
    }

    const req = new HttpRequest('POST', ' https://api.radiomemory.com.br/ia/classify', jSonImage, {
      reportProgress: true,
      responseType: 'text'
    });
    this.http.request(req).subscribe(req=> {
      console.log(req);
    });

   // console.log(req);
    //const headers = new HttpHeaders().set('Content-Type','text/plain');
    //headers.set('responseType', 'text');
    //this.http.post<any>('http://localhost:8080/api/file/upload', base64,{headers:headers}).subscribe(data => {
    //console.log(data);
    //});
    //const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // this.http.post('https://webhook.site/6aa3ad0a-b436-48d4-bbf2-8ccc15e8e350', JSON.stringify(jSonImage), { headers: headers })
    //   .subscribe(data => {
    //     console.log(data);
    //   });

    if (files.length > 0) {
      this.files.emit(files);
    }
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

}
