import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { Compra } from "src/app/classes/compra";
import { Item } from "src/app/classes/item";
import { tap, take } from "rxjs/operators";
import { Observable, Subscription, from } from "rxjs";
import { OverlayEventDetail } from "@ionic/core";
import {
    AlertController,
    ToastController,
    NavController
} from "@ionic/angular";
import { formatDate } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-comprar",
    templateUrl: "./comprar.page.html",
    styleUrls: ["./comprar.page.scss"]
})
export class ComprarPage implements OnInit, OnDestroy {
    @ViewChild("myNav", { static: false }) nav: NavController;

    public compras: Compra[];
    public compraAtual: Compra;
    public itensCompra: Item[];
    public proximoCorredor: number = 1;
    public itemAtual: Item;

    constructor(
        private databaseService: DatabaseService,
        public alertController: AlertController,
        public toastController: ToastController,
        public navCtrl: NavController,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                console.log(
                    "TESTE",
                    this.router.getCurrentNavigation().extras.state
                );
            }
        });
    }

    ngOnInit() {}

    ionViewWillEnter() {
        this.itemAtual = new Item();
        this.LimparItem();

        this.databaseService
            .GetCompras()
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(v => this.CarregaDadosCompra(v));
    }

    ngOnDestroy() {}

    CalcValorTotalItem() {
        this.itemAtual.ValorTotal =
            this.itemAtual.Valor * this.itemAtual.Quantidade;
    }

    CarregaDadosCompra(compras: Compra[]) {
        let ultimoIdCompra: number;

        if (!compras) {
            this.compraAtual = this.databaseService.CriarNovaCompra(0);
            this.compras = new Array();

            this.compras.push(this.compraAtual);
            this.InformarNomeCompra();

            this.databaseService.GravarComprasDB(this.compras);
        } else {
            this.compras = compras;
            this.compraAtual = this.databaseService.GetCompraAberta(
                this.compras
            );
            if (!this.compraAtual) {
                ultimoIdCompra = Math.max.apply(
                    Math,
                    compras.map((c: Compra) => c.Id)
                );
                this.compraAtual = this.databaseService.CriarNovaCompra(
                    ultimoIdCompra
                );
                this.compras.push(this.compraAtual);
                this.InformarNomeCompra();
            }
        }

        this.databaseService
            .GetProdutosCompra(this.compraAtual)
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(itens => this.CarredaDadosItens(itens));
    }

    CarredaDadosItens(itens: Item[]) {
        this.itensCompra = new Array(...itens);
        if (itens.length == 0) {
            this.proximoCorredor = 1;
            this.databaseService.GravarItensDB(
                this.itensCompra,
                this.compraAtual.Id
            );
        } else {
            this.proximoCorredor = this.databaseService.GetUltimoCorredor(
                this.itensCompra
            );
        }

        this.databaseService.SetCompraListaItens(
            this.compras,
            this.compraAtual,
            this.itensCompra
        );
    }

    DadosCarregados(): boolean {
        return this.compras !== undefined && this.itensCompra !== undefined;
    }

    InformarNomeCompra() {
        let observableFromPromise: Observable<OverlayEventDetail> = from(
            this.alertNomeCompra().then()
        );

        observableFromPromise
            .pipe(
                tap(),
                take(1)
            )
            .subscribe(retorno => {
                let retAlert: OverlayEventDetail;
                retAlert = retorno;
                this.compraAtual.Nome = retAlert.data.values.inpNomeCompra;
                this.databaseService.GravarComprasDB(this.compras);
            });
    }

    async alertNomeCompra(): Promise<OverlayEventDetail> {
        let data: any;
        let date: Date = new Date();
        let strDate: string = formatDate(date, "MMM/y", "pt").toUpperCase();

        const alert = await this.alertController.create({
            header: "Nova Compra",
            subHeader: "Informe nome da compra",
            inputs: [
                {
                    name: "inpNomeCompra",
                    id: "idNomeCompra",
                    value: strDate,
                    label: "teste"
                }
            ],
            buttons: [
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

    LimparItem() {
        this.itemAtual.Corredor = this.proximoCorredor;
        this.itemAtual.Id = 0;
        this.itemAtual.Produto = "";
        this.itemAtual.Quantidade = 1;
        this.itemAtual.Valor = 0;
        this.CalcValorTotalItem();

        if (this.compraAtual) this.itemAtual.idCompra = this.compraAtual.Id;
        else this.itemAtual.idCompra = 0;
    }

    GravarItem() {
        if (this.itemAtual.Corredor <= 0) {
            this.MostrarMensagemErroValidacao("Corredor invalido");
            return;
        }

        if (this.itemAtual.Produto == "") {
            this.MostrarMensagemErroValidacao("Produto sem nome");
            return;
        }

        if (this.itemAtual.Quantidade <= 0) {
            this.MostrarMensagemErroValidacao("Quantidade invalida");
            return;
        }

        if (this.itemAtual.Valor <= 0) {
            this.MostrarMensagemErroValidacao("Valor invalido");
            return;
        }

        let itemGravar: Item = new Item();
        this.itemAtual.idCompra = this.compraAtual.Id;

        Object.assign(itemGravar, this.itemAtual);

        this.itensCompra.push(itemGravar);
        this.databaseService.GravarItensDB(
            this.itensCompra,
            itemGravar.idCompra,
            this.compraAtual
        );
        this.databaseService.GravarComprasDB(this.compras, this.compraAtual);

        this.proximoCorredor = this.databaseService.GetUltimoCorredor(
            this.itensCompra
        );
        this.LimparItem();
    }

    MostrarMensagemErroValidacao(mensagem: string) {
        let observableFromPromise: Observable<HTMLIonToastElement> = from(
            this.presentToast(mensagem, "danger").then<HTMLIonToastElement>()
        );

        observableFromPromise
            .pipe(
                tap(),
                take(1)
            )
            .subscribe();
    }

    MostrarMensagemSimples(mensagem: string) {
        let observableFromPromise: Observable<HTMLIonToastElement> = from(
            this.presentToast(mensagem, "success").then<HTMLIonToastElement>()
        );

        observableFromPromise
            .pipe(
                tap(),
                take(1)
            )
            .subscribe();
    }

    async presentToast(mensagem: string, color: string) {
        const toast = await this.toastController.create({
            color: color,
            message: mensagem,
            duration: 1000
        });
        toast.present();
    }

    GravarCompra() {
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

                this.compraAtual.Finalizada = true;
                this.databaseService.GravarComprasDB(
                    this.compras,
                    this.compraAtual
                );

                this.navCtrl.pop();
                this.MostrarMensagemSimples("Compra finalizada");
            });
    }

    async presentAlertMultipleButtons(): Promise<OverlayEventDetail> {
        let data: any;

        const alert = await this.alertController.create({
            header: "Finalizar Compra",
            message: "Confirmar?",
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
