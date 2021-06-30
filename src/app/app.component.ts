import { Component } from '@angular/core';
import {
  FileHandle
} from './file-handle';
import {
  DndDirective
} from './dnd.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  uploadedFiles: FileHandle[] | undefined;
  
  constructor() { }
  ngOnInit(): void { }
 
  filesDropped(files: FileHandle[]) {
    this.uploadedFiles = files;
  }
}
