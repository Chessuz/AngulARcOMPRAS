import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { Compra } from "src/app/classes/compra";
import { Item } from "src/app/classes/item";

@Component({
    selector: "app-comprar",
    templateUrl: "./comprar.page.html",
    styleUrls: ["./comprar.page.scss"]
})
export class ComprarPage implements OnInit {
    public compras: Compra[];
    public compraAtual: Compra;
    public valorTotalAtual: number = 123.45;
    public itensCompra: Item[];
    public proximoCorredor: number;

    constructor(private databaseService: DatabaseService) {}

    async ngOnInit() {
        this.compras = await this.databaseService.GetCompras();
        this.compraAtual = this.databaseService.GetCompraAberta(this.compras);
        this.itensCompra = await this.databaseService.GetProdutosCompra(
            this.compraAtual
        );
        this.valorTotalAtual = this.compraAtual.ValorTotal;

        this.proximoCorredor = this.databaseService.GetUltimoCorredor(
            this.itensCompra
        );
    }

    GetProximoCorredor() {
        return this.proximoCorredor;
        // return this.databaseService.GetUltimoCorredor(this.itensCompra);
    }
}
