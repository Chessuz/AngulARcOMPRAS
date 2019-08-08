import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { VariaveisService } from "./services/variaveis.service";

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.scss"]
})
export class AppComponent {
    public appPages = [
        {
            title: "Home",
            url: "/home",
            icon: "home"
        },
        {
            title: "Compras",
            url: "/lista-compras",
            icon: "list-box"
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private variaveisService: VariaveisService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    GetMenuIsDisabled(): boolean {
        return (
            this.variaveisService.GetMenuIsDisabled() &&
            !this.variaveisService.GetMenuIsOpen()
        );
    }

    menuOpened() {
        this.variaveisService.SetMenuIsOpen(true);
    }

    menuClosed() {
        this.variaveisService.SetMenuIsOpen(false);
    }
}
