import { Component, Input, inject, signal } from '@angular/core';
import { GameService } from '../../../shared/services/game.service';
import { Juego } from '../../../shared/models/juego';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent {

  @Input() id?: string;
  
  private gameService = inject(GameService);

  gameDetails = signal<Juego | null>(null);

  ngOnInit(){
    if (this.id) {
      this.gameService.getGame(this.id).subscribe({
        next: (data) => {
          console.log(data);
          this.gameDetails.set(data[0]);
        }
      })
    }
  }

}
