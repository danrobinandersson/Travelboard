import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavouritesService } from '../../services/favourites-service';

@Component({
  selector: 'app-favourites-page',
  imports: [RouterLink],
  templateUrl: './favourites-page.html',
})
export class FavouritesPage {
  protected readonly favourites = inject(FavouritesService);
}
