import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { Compra } from "src/app/classes/compra";

@Component({
    selector: "app-tabs-compra",
    templateUrl: "./tabs-compra.component.html",
    styleUrls: ["./tabs-compra.component.scss"]
})
export class TabsCompraComponent implements OnInit {
    @Input() paiEhLista: boolean;

    constructor() {}

    ngOnInit() {}
}
