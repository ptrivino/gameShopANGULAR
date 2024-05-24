import { Injectable, signal } from '@angular/core';
import { environment } from './environment';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Juego } from '../models/juego';
import { Observable, from } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private supabase: SupabaseClient;

  gameList = signal<Juego[]>([]);
  gameList$ = toObservable(this.gameList);

  filterString = signal<string>("");
  filterString$ = toObservable(this.filterString);

  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  addGame(newGame: Juego) {
    if (newGame.id == ""){
      from(this.supabase
        .from('games') 
        .insert([
          { name: newGame.name, price: newGame.price, image: newGame.image, platform: newGame.platform, rating: newGame.rating, category: newGame.category, description: newGame.description },
        ])
        .select()
        .then(response => {
          let result = response.data as Juego[];
          this.gameList.update(currentGameList => [...currentGameList, result[0]]);
        })
      );
    } else {
      from(this.supabase
        .from('games')
        .update({ name: newGame.name, price: newGame.price, image: newGame.image, platform: newGame.platform, rating: newGame.rating, category: newGame.category, description: newGame.description})
        .eq('id', newGame.id)
        .then(response => {
          let result = response.data as unknown as Juego[];
          this.gameList.update(currentGameList => [...currentGameList, result[0]]);
        })
      );    
    }
  }

  deleteGame(id: string): Observable<Juego[]> {
    return from(this.supabase
      .from('games')
      .delete()
      .eq('id', id)
      .select()
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        let deletedGames = response.data as Juego[];
        this.gameList.update(currentGameList => currentGameList.filter(game => game.id !== id));
        return deletedGames;
      })
    );
  }

  getGames() {
    from(this.supabase
      .from('games')
      .select('*')
      .then(response => {
        let result = response.data as Juego[];
        this.gameList.set(result);
      })
    );
  }

  getGame(id: string): Observable<Juego[]> {
    return from(this.supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .then(response => response.data as Juego[])
    );
  }

  

  async upload(bucket: string, filePath: string, file: File) {
    const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file);
    return { data, error };
  }


}

