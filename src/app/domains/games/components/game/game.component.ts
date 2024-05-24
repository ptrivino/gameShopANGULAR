import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Juego } from '../../../shared/models/juego';
import { GameService } from '../../../shared/services/game.service'; 
import { RouterLinkWithHref } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  @ViewChild('addGameModal') addGameModal!: ElementRef;

  @ViewChild('gameID') gameID!: ElementRef;

  ngAfterViewInit() {}

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
    if (this.gameID) {
    //this.gameID.nativeElement.value = game.id;
    console.log(this.gameID.nativeElement);
    } else {
        console.error('gameID is undefinded')
    }
  }


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