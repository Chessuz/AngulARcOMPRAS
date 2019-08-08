import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "src/app/services/database.service";
import { tap, take } from "rxjs/operators";
import { Compra } from "src/app/classes/compra";
import { VariaveisService } from "src/app/services/variaveis.service";
import { NavController } from "@ionic/angular";
import { NavigationOptions } from "@ionic/angular/dist/providers/nav-controller";
import { NavigationExtras } from "@angular/router";
import { Item } from "src/app/classes/item";

@Component({
    selector: "app-lista-compras",
    templateUrl: "./lista-compras.page.html",
    styleUrls: ["./lista-compras.page.scss"]
})
export class ListaComprasPage implements OnInit {
    public compras: Compra[];

    constructor(
        private databaseService: DatabaseService,
        private variaveisService: VariaveisService,
        public navCtrl: NavController
    ) {}

    ngOnInit() {
        this.databaseService
            .GetCompras()
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(v => this.CarregaDadosCompra(v));
    }

    CarregaDadosCompra(compras: Compra[]) {
        if (!compras) {
            this.compras = new Array();
        } else {
            this.compras = compras;
        }
    }

    IconeCompraFinalizada(finalizada: boolean) {
        if (finalizada) return "checkbox";
        else return "square";
    }

    MostrarDetalhesVenda(compra: Compra) {
        this.databaseService
            .GetProdutosCompra(compra)
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(itens => {
                this.databaseService.SetCompraListaItens(
                    this.compras,
                    compra,
                    itens
                );

                let navigationExtras: NavigationExtras = {
                    state: {
                        origemEhListaCompra: true
                    }
                };
                this.navCtrl.navigateForward("/lista-itens", navigationExtras);
            });
    }
}
