import { Component, Input, OnInit, viewChild } from '@angular/core';
import { Juego } from '../../../shared/models/juego';
import { GameService } from '../../../shared/services/game.service'; 
import { RouterLinkWithHref } from '@angular/router';
import { StoreComponent } from '../../pages/store/store.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLinkWithHref, StoreComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  @viewChild('addGameModal') addGameModal: any;

  myBucket = "https://kzploqbzeinvymobweco.supabase.co/storage/v1/object/public/images/";
  file!: File;
  filePath: string = "";

  @Input({ required: true }) game!: Juego;

  games: Juego[] = [];

  constructor(private gameService: GameService) {}


  deleteGame(id: string) {
    this.gameService.deleteGame(id).subscribe(
      (deletedGames: Juego[]) => {
        console.log('Juego eliminado', deletedGames);
        this.games = this.games.filter(game => game.id !== id);
      },
      (error) => {
        console.error('Error al eliminar el juego', error);
      }
    );
  }

  editGame(game: Juego) {
    StoreComponent.addGameModal.patchValue({
      id: game.id,
      gameName: game.name,
      gamePrice: game.price,
      gamePlatform: game.platform,
      gameRating: game.rating,
      gameCategory: game.category,
      gameDescription: game.description,
    });
    const dialog: any = document.getElementById('addGameModal');
  }

/*
  editGame = new FormGroup({
    gameName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    gamePrice: new FormControl('', [Validators.required, Validators.min(1)]),
    gamePlatform: new FormControl(''),
    gameRating: new FormControl('', [Validators.required, Validators.min(1)]),
    gameCategory: new FormControl(''),
    gameDescription: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  submit() {
    let newGame: Juego = {
      name: this.editGame.value.gameName!,
      price: Number(this.editGame.value.gamePrice)!,
      platform: this.editGame.value.gamePlatform!,
      rating: Number(this.editGame.value.gameRating)!,
      category: this.editGame.value.gameCategory!,
      description: this.editGame.value.gameDescription!,
      image: `${this.myBucket}${this.filePath}`
    }
    this.gameService.editGame(newGame);

    this.editGame.controls.gameName.setValue("");
    this.editGame.controls.gamePrice.setValue("");
    this.editGame.controls.gamePlatform.setValue("");
    this.editGame.controls.gameRating.setValue("");
    this.editGame.controls.gameCategory.setValue("");
    this.editGame.controls.gameDescription.setValue("");

  };
*/

  async uploadPhoto(event: any) {

    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen')
      }

      this.file = event.target.files[0];
      this.filePath = `game_${Date.now()}.jpg`;
      this.gameService.upload('images', this.filePath, this.file);


    } catch (error) {
      console.log(error);
    }
  }

 

}
