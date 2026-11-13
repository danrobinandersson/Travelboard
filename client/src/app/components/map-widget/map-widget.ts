import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import * as L from 'leaflet';
import type { Country } from '../../models/country';
import type { Place } from '../../models/place';

// Map tiles from OpenStreetMap. Free to use for light traffic, and the credit below is required.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CITY_ZOOM = 11;

// Big countries need a map zoomed far out, small ones close up
function zoomFor(areaKm2: number | null): number {
  if (areaKm2 === null) return 5;
  if (areaKm2 > 5_000_000) return 3;
  if (areaKm2 > 1_000_000) return 4;
  if (areaKm2 > 300_000) return 5;
  if (areaKm2 > 50_000) return 6;
  if (areaKm2 > 10_000) return 7;
  if (areaKm2 > 1_000) return 9;
  return 10;
}

// Where the map looks and what the marker says
interface MapTarget {
  lat: number;
  lng: number;
  zoom: number;
  label: string;
}

@Component({
  selector: 'app-map-widget',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  templateUrl: './map-widget.html',
  styleUrl: './map-widget.scss',
})
export class MapWidget {
  readonly country = input.required<Country>();
  // A city picked by the user. null means "show the country's default point".
  readonly place = input<Place | null>(null);

  // The picked city if there is one, otherwise the capital (or the country's centre)
  private readonly target = computed<MapTarget | null>(() => {
    const place = this.place();
    if (place) {
      return { lat: place.latitude, lng: place.longitude, zoom: CITY_ZOOM, label: place.name };
    }

    const country = this.country();
    if (!country.coordinates) return null;
    return {
      lat: country.coordinates.lat,
      lng: country.coordinates.lng,
      zoom: zoomFor(country.areaKm2),
      label:
        country.coordinatesSource === 'capital' && country.capital ? country.capital : country.name,
    };
  });

  protected readonly hasTarget = computed(() => this.target() !== null);

  // The <div> Leaflet draws in. It only exists when there is somewhere to look at.
  private readonly mapElement = viewChild<ElementRef<HTMLDivElement>>('map');
  private map: L.Map | null = null;
  private marker: L.CircleMarker | null = null;
  private resizeObserver: ResizeObserver | null = null;
  // Used to tell "same country, new city" (fly there) from "new country" (jump there)
  private shownCountryCode: string | null = null;

  constructor() {
    effect(() => {
      const element = this.mapElement();
      const target = this.target();
      const countryCode = this.country().code;
      if (!element || !target) return;

      // The <div> can be recreated (e.g. a country without coordinates in between), so start over
      if (this.map && this.map.getContainer() !== element.nativeElement) {
        this.resizeObserver?.disconnect();
        this.map.remove();
        this.map = null;
      }

      const center: L.LatLngExpression = [target.lat, target.lng];

      if (!this.map) {
        this.map = L.map(element.nativeElement, {
          // Do not steal the page scroll, and do not trap touch scrolling on phones
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
        }).setView(center, target.zoom);
        L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(this.map);
        // Leaflet measures its box when it is created. If the layout settles a moment later
        // (or the window is resized), tell it to measure again, or the tiles end up shifted.
        this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
        this.resizeObserver.observe(element.nativeElement);
      } else if (this.shownCountryCode === countryCode) {
        // Same country, another city: fly there smoothly
        this.map.flyTo(center, target.zoom, { duration: 1.2 });
      } else {
        this.map.setView(center, target.zoom);
      }
      this.shownCountryCode = countryCode;

      // A round marker in the theme colour. (Leaflet's default pin image breaks in bundled apps.)
      this.marker?.remove();
      this.marker = L.circleMarker(center, {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#0f766e',
        fillOpacity: 1,
      })
        .addTo(this.map)
        .bindTooltip(target.label, { permanent: true, direction: 'top', offset: [0, -8] });
    });

    inject(DestroyRef).onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.map?.remove();
    });
  }
}
