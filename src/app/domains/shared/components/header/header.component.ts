import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkWithHref],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private gameService = inject(GameService);

  filter(event: Event) {
    let input = event.target as HTMLInputElement;
    this.gameService.filterString.set(input.value);
  }

}
