import { Component, OnInit, Input } from "@angular/core";
import { Compra } from "src/app/classes/compra";
import { DatabaseService } from "src/app/services/database.service";
import { Item } from "src/app/classes/item";
import { AlertController } from "@ionic/angular";
import { OverlayEventDetail } from "@ionic/core";
import { from, Observable, pipe } from "rxjs";
import { tap, take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-lista-itens",
    templateUrl: "./lista-itens.page.html",
    styleUrls: ["./lista-itens.page.scss"]
})
export class ListaItensPage implements OnInit {
    @Input() origemEhListaCompra?: boolean = false;

    compras: Compra[];
    compra: Compra;
    itens: Item[];
    ultimoCorredor: number = 0;

    constructor(
        private databaseService: DatabaseService,
        public alertController: AlertController,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.queryParams.subscribe(params => {
            let dadState: any;
            if (this.router.getCurrentNavigation().extras.state) {
                dadState = this.router.getCurrentNavigation().extras.state;
                this.origemEhListaCompra = dadState.origemEhListaCompra;
            }
        });
    }

    ngOnInit() {
        let arrTemp: Array<any>;
        arrTemp = this.databaseService.GetCompraListaItens();

        this.compras = arrTemp[0];
        this.compra = arrTemp[1];
        this.itens = this.databaseService.SortItensByCorredor(arrTemp[2]);
    }

    mostrarHeaderCorredor(item: Item): boolean {
        let mostrar: boolean = this.ultimoCorredor != item.Corredor;
        this.ultimoCorredor = item.Corredor;
        return mostrar;
    }

    excluirItem(index: number) {
        let observableFromPromise: Observable<OverlayEventDetail> = from(
            this.presentAlertMultipleButtons().then()
        );

        observableFromPromise
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(retorno => {
                let retAlert: OverlayEventDetail;
                retAlert = retorno;
                if (retAlert.role != "confirm") return;
                this.itens.splice(index, 1);
                this.databaseService.GravarItensDB(
                    this.itens,
                    this.compra.Id,
                    this.compra
                );
                this.databaseService.GravarComprasDB(this.compras, this.compra);
            });
    }

    async presentAlertMultipleButtons(): Promise<OverlayEventDetail> {
        let data: any;

        const alert = await this.alertController.create({
            header: "Deletar",
            message: "Confirma?",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel",
                    cssClass: "secondary"
                },
                {
                    text: "Confirmar",
                    role: "confirm"
                }
            ]
        });
        await alert.present();

        data = await alert.onDidDismiss();
        return data;
    }
}
