import { Component } from '@angular/core';
import {
  FileHandle
} from './file-handle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Download das imagens';
  description = 'Verifique logo em baixo';
  uploadedFiles: FileHandle[] | undefined;
  constructor() { }
  ngOnInit(): void { }
  filesDropped(files: FileHandle[]) {
    this.uploadedFiles = files;
  }
}
