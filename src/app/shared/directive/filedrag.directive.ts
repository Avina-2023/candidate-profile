import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFiledrag]'
})
export class FiledragDirective {
  @Output() fileEmitter: EventEmitter<any> = new EventEmitter();
  constructor() { }
  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
     evt.preventDefault();
     evt.stopPropagation();
     }
     @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
        evt.preventDefault();
        evt.stopPropagation(); }
        @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
         evt.preventDefault();
         evt.stopPropagation();
        this.fileEmitter.emit(evt.dataTransfer.files)
        }
      }

