import { Routes } from '@angular/router';
import { HomeComponent } from './domains/games/pages/home/home.component';
import { StoreComponent } from './domains/games/pages/store/store.component';
import { GameDetailsComponent } from './domains/games/pages/game-details/game-details.component';


export const routes: Routes = [
    {path: "", component:HomeComponent},
    {path: "home", component:HomeComponent},
    {path: "store", component:StoreComponent},
    {path: "details/:id", component:GameDetailsComponent}
];
