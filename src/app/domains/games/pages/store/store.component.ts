import { Component,ViewChild,ElementRef,  inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GameComponent } from '../../components/game/game.component';
import { Juego } from '../../../shared/models/juego';
import { GameService } from '../../../shared/services/game.service'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [GameComponent, HeaderComponent, FooterComponent, ReactiveFormsModule,CommonModule, RouterLinkWithHref],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {



  listGames = signal<Juego[]>([]);
  private gameService = inject(GameService);
  filterString = signal<string>("");

  ngOnInit() {

    this.gameService.getGames();

    this.gameService.gameList$.subscribe({
      next: (changes) => {
        this.listGames.set(changes);
      }
    });

    this.gameService.filterString$.subscribe({
      next: (changes) => {
        this.filterString.set(changes);
      }
    });

  }

  myBucket = "https://ritzsrvumdycdatqkfxi.supabase.co/storage/v1/object/public/images/";
  file!: File;
  filePath: string = "";

  addGame = new FormGroup({
    gameID: new FormControl(''),
    gameName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    gamePrice: new FormControl('', [Validators.required, Validators.min(1)]),
    gamePlatform: new FormControl(''),
    gameRating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    gameCategory: new FormControl(''),
    gameDescription: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  submit() {
    /*
    let newGame: Juego = {
      id: this.addGame.value.gameID!,
      name: this.addGame.value.gameName!,
      price: Number(this.addGame.value.gamePrice)!,
      platform: this.addGame.value.gamePlatform!,
      rating: Number(this.addGame.value.gameRating)!,
      category: this.addGame.value.gameCategory!,
      description: this.addGame.value.gameDescription!,
      image: `${this.myBucket}${this.filePath}`
    }
    */
   
    let newGame: Juego = {
      id: this.addGame.value.gameID!,
      name: this.addGame.value.gameName!,
      price: Number(this.addGame.value.gamePrice)!,
      platform: this.addGame.value.gamePlatform!,
      rating: Number(this.addGame.value.gameRating)!,
      category: this.addGame.value.gameCategory!,
      description: this.addGame.value.gameDescription!,
    };
    
    // Verificar si el id no es nulo y el filePath no es nulo, vacío o indefinido
    if (newGame.id && this.filePath) {
      newGame.image = `${this.myBucket}${this.filePath}`;
    }

    this.gameService.addGame(newGame);

    this.addGame.controls.gameID.setValue("");
    this.addGame.controls.gameName.setValue("");
    this.addGame.controls.gamePrice.setValue("");
    this.addGame.controls.gamePlatform.setValue("");
    this.addGame.controls.gameRating.setValue("");
    this.addGame.controls.gameCategory.setValue("");
    this.addGame.controls.gameDescription.setValue("");

  };

  addGameForm(){
    this.addGame.setValue({
      gameID: '',
      gameName: '',
      gamePrice: '',
      gamePlatform: '',
      gameRating: '',
      gameCategory: '',
      gameDescription: ''
    });

  }

  editGame(game: Juego) {

    console.log(game.id);
    this.addGame.setValue({
      gameID: game.id || '',
      gameName: game.name || '',
      gamePrice: game.price !== undefined ? game.price.toString() : '',
      gamePlatform: game.platform || '',
      gameRating: game.rating !== undefined ? game.rating.toString() : '',
      gameCategory: game.category || '',
      gameDescription: game.description || ''
    });

    this.games = this.games.filter(game => game.id !== game.id);
    // Open the modal
    // this.addGameModal.nativeElement.showModal();
 
  }

  games: Juego[] = [];

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
  

  filter(event: Event) {
    let input = event.target as HTMLInputElement;
    this.gameService.filterString.set(input.value);
  }

}
