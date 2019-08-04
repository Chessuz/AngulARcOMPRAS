import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'comprar', loadChildren: './pages/comprar/comprar.module#ComprarPageModule' },
  { path: 'lista-itens', loadChildren: './pages/lista-itens/lista-itens.module#ListaItensPageModule' },
  { path: 'lista-compras', loadChildren: './pages/lista-compras/lista-compras.module#ListaComprasPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
