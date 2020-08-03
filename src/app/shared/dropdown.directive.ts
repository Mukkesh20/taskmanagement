import { 
    Directive, 
    ElementRef,
    HostListener,
    HostBinding,
    
} from "@angular/core";

@Directive({
  selector: '[appDropdown]',
exportAs:'appDropdown'
})
export class DropdownDirective   {
  constructor(private elRef: ElementRef) {}
  
  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  
}
