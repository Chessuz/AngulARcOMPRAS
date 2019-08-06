import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ListaItensPage } from "./lista-itens.page";
import { TabsCompraComponentModule } from "src/app/components/tabs-compra/tabs-compra.component-module";

const routes: Routes = [
    {
        path: "",
        component: ListaItensPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TabsCompraComponentModule
    ],
    declarations: [ListaItensPage]
})
export class ListaItensPageModule {}
