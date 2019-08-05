import { Component, OnInit, Input, ElementRef } from "@angular/core";

@Component({
    selector: "app-tabs-compra",
    templateUrl: "./tabs-compra.component.html",
    styleUrls: ["./tabs-compra.component.scss"]
})
export class TabsCompraComponent implements OnInit {
    public paiEhLista: boolean;

    constructor(elementRef: ElementRef) {
        this.paiEhLista =
            elementRef.nativeElement.localName == "app-lista-itens";
    }

    ngOnInit() {}
}
