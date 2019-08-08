import { Component } from "@angular/core";
import { VariaveisService } from "src/app/services/variaveis.service";
import { DatabaseService } from "src/app/services/database.service";
import { Observable, from } from "rxjs";
import { OverlayEventDetail } from "@ionic/core";
import { take, tap } from "rxjs/operators";
import { AlertController } from "@ionic/angular";
import { LayoutServiceService } from "src/app/shared/layout-service.service";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    constructor(
        private variaveisService: VariaveisService,
        private databaseService: DatabaseService,
        public alertController: AlertController,
        private layoutServiceService: LayoutServiceService
    ) {}

    ionViewWillEnter() {
        this.variaveisService.SetMenuIsDisabled(false);
    }

    ionViewWillLeave() {
        this.variaveisService.SetMenuIsDisabled(true);
    }

    AddTema() {
        this.layoutServiceService.addBodyClass("cao-theme");
    }

    RemoveTema() {
        this.layoutServiceService.removeBodyClass("cao-theme");
    }
}
