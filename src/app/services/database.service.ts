import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Compra } from "../classes/compra";
import { Item } from "../classes/item";
import { from, Observable } from "rxjs";
import { tap, take } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class DatabaseService {
    private ComprasListaItens: Compra[];
    private CompraListaItens: Compra;
    private ItensListaCompra: Item[];

    constructor(private storage: Storage) {}

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
        this.GravarComprasDB(compras);
    }

    MockDataItens() {
        const QTD_COMPRAS = 3;
        let qtdItens: number;
        let itens: Item[] = new Array();
        let item: Item;
        let itemId: number = 0;

        for (let idxCompra = 0; idxCompra < QTD_COMPRAS; idxCompra++) {
            qtdItens = Math.floor(Math.random() * 10) + 4;

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

            this.GravarItensDB(itens, idxCompra);
            itens = [];
        }
    }

    GetCompras(): Observable<Compra[]> {
        let observableFromPromise: Observable<Compra[]> = from(
            this.storage.get("Compras").then()
        );

        return observableFromPromise;
    }

    GetCompraAberta(compras: Compra[]): Compra {
        let compra: Compra;
        let ultimoIdCompra: number;
        compras.forEach(e => {
            if (!e.Finalizada) {
                compra = e;
                return;
            }
        });
        return compra;
    }

    GetProdutosCompra(compra: Compra): Observable<Item[]> {
        let observableFromPromise: Observable<Item[]> = from(
            this.storage
                .get(`Itens-Cp=${compra.Id}`)
                .then(data =>
                    !data ? (data = new Array()) : (data = new Array(...data))
                )
        );
        return observableFromPromise;
    }

    GetUltimoCorredor(Itens: Item[]): number {
        let ultimoCorredor: number = Math.max.apply(
            Math,
            Itens.map((i: Item) => i.Corredor)
        );
        return ultimoCorredor;
    }

    SetCompraListaItens(compras: Compra[], compra: Compra, itens: Item[]) {
        this.ComprasListaItens = compras;
        this.CompraListaItens = compra;
        this.ItensListaCompra = itens;
    }

    GetCompraListaItens(): Array<any> {
        let tempArray: Array<any> = new Array();

        tempArray.push(this.ComprasListaItens);
        tempArray.push(this.CompraListaItens);
        tempArray.push(this.ItensListaCompra);
        return tempArray;
    }

    SortItensByCorredor(itens: Item[]): Item[] {
        return itens.sort(function(a, b) {
            return a.Corredor - b.Corredor;
        });
    }

    CriarNovaCompra(ultimoIndex: number): Compra {
        let compra: Compra = new Compra();
        let myDate: Date;
        let index: number = ultimoIndex + 1;

        myDate = new Date();
        compra = new Compra();
        compra.Id = index;
        compra.Data = myDate.toJSON();
        compra.Nome = `Compra ${index}`;
        compra.ValorTotal = 0;
        compra.Finalizada = false;

        return compra;
    }

    GravarComprasDB(compras: Compra[], compra?: Compra) {
        if (compra) {
            compras.forEach(v => {
                if (v.Id == compra.Id) {
                    Object.assign(v, compra);
                }
            });
        }
        this.storage.set("Compras", compras);
    }

    GravarItensDB(itens: Item[], idxCompra: number, compra?: Compra) {
        this.storage.set(`Itens-Cp=${idxCompra}`, itens);

        if (compra) {
            compra.ValorTotal = 0;
            itens.forEach(v => (compra.ValorTotal += v.ValorTotal));
        }
    }
}
