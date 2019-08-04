import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Compra } from "../classes/compra";
import { Item } from "../classes/item";

@Injectable({
    providedIn: "root"
})
export class DatabaseService {
    constructor(private storage: Storage) {
        this.MockDataCompras();
        this.MockDataItens();
    }

    MockDataCompras() {
        const QTD_COMPRAS = 3;
        let compras: Compra[] = new Array();
        let compra: Compra;
        let myDate: Date;

        for (let index = 0; index < QTD_COMPRAS; index++) {
            myDate = new Date();
            compra = new Compra();
            compra.Id = index + 1;
            compra.Data = myDate.toJSON();
            compra.Nome = `Compra ${index}`;
            compra.ValorTotal = Math.floor(Math.random() * 100000) / 100;
            compra.Finalizada = index != QTD_COMPRAS - 1;

            compras.push(compra);
        }
        this.storage.set("Compras", compras);
    }

    MockDataItens() {
        const QTD_COMPRAS = 3;
        let qtdItens: number;
        let itens: Item[] = new Array();
        let item: Item;
        let itemId: number = 0;

        for (let idxCompra = 0; idxCompra < QTD_COMPRAS; idxCompra++) {
            qtdItens = Math.floor(Math.random() * 10) + 1;

            for (let index = 0; index < qtdItens; index++) {
                item = new Item();
                itemId++;

                item.Corredor = Math.floor(Math.random() * 10) + 1;
                item.Id = itemId;
                item.Produto = `Produto De Teste ${item.Id} - ${index}`;
                item.Valor = Math.floor(Math.random() * 10000) / 100;
                item.Quantidade = Math.floor(Math.random() * 10) + 1;
                item.ValorTotal = item.Valor * item.Quantidade;

                item.idCompra = idxCompra + 1;

                itens.push(item);
            }
        }

        console.log("QtdTotalItens", itens.length);
        this.storage.set("Itens", itens);
    }

    async GetCompras(): Promise<Compra[]> {
        let dados: any;
        let compras: Compra[];
        await this.storage
            .get("Compras")
            .then(data => (dados = data), error => console.error(error));

        compras = new Array(...dados);
        return compras;
    }

    GetCompraAberta(compras: Compra[]): Compra {
        let compra: Compra;

        compras.forEach(e => {
            if (!e.Finalizada) {
                compra = e;
                return;
            }
        });
        return compra;
    }

    async GetProdutosCompra(compra: Compra): Promise<Item[]> {
        let dados: any;
        let itens: Item[];
        await this.storage
            .get("Itens")
            .then(data => (dados = data), error => console.error(error));

        itens = new Array(...dados);
        console.log("QtdTotalItens", itens.length);

        itens = itens.filter(v => v.idCompra == compra.Id);
        console.log("QtdFiltrada", itens.length);

        return itens;
    }

    GetUltimoCorredor(Itens: Item[]): number {
        let corredores: number[] = new Array();

        corredores = Itens.map(v => v.Corredor).sort();
        return corredores[corredores.length - 1];
    }
}
