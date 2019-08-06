import { Component, OnInit, Input } from "@angular/core";
import { Compra } from "src/app/classes/compra";
import { DatabaseService } from "src/app/services/database.service";
import { Item } from "src/app/classes/item";

@Component({
    selector: "app-lista-itens",
    templateUrl: "./lista-itens.page.html",
    styleUrls: ["./lista-itens.page.scss"]
})
export class ListaItensPage implements OnInit {
    @Input() origemEhListaCompra?: boolean = false;
    compra: Compra;
    itens: Item[];
    ultimoCorredor: number = 0;

    constructor(private databaseService: DatabaseService) {}

    ngOnInit() {
        let arrTemp: Array<any>;
        arrTemp = this.databaseService.GetCompraListaItens();
        this.compra = arrTemp[0];
        this.itens = this.databaseService.SortItensByCorredor(arrTemp[1]);
    }

    mostrarHeaderCorredor(item: Item): boolean {
        let mostrar: boolean = this.ultimoCorredor != item.Corredor;
        this.ultimoCorredor = item.Corredor;
        return mostrar;
    }
}
