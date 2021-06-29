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
import { UploadFileService } from './upload/upload-file.service';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  answer:any;
  @Output('files') files: EventEmitter<FileHandle[]> = new EventEmitter();
  @HostBinding('style.background') private background = '#eee';
  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private service: UploadFileService) { }

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



      const file = evt.dataTransfer.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const urlBase = window.URL.createObjectURL(file);

      base64 = await this.toDataURL(urlBase);

      files.push({
        file,
        url
      });


    jSonImage = [
      {
        "key": "86a756afd5fa8ea0635be3f0a0c32897"
        , "image": base64
        , "type": 1
      }
    ];

    this.service.upload(jSonImage[0]).subscribe((response) => {
      console.log(response.classify['classe']);
    })

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
