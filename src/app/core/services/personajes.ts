import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personaje {
  id: string;
  name: string;
  aliases: string[];
  universe: string;
  affiliation: string; 
  powerStats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  powers: string[];
  weaknesses: string[];
  firstAppearance: number;
  rating: number;
  image: string;
  biography: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonajesService {

  private listaPersonajes: Personaje[] = [];
  private datosCargados: boolean = false;

  constructor(private http: HttpClient) {}

  // Método principal para obtener personajes - más simple
  getPersonajes(): Observable<Personaje[]> {
    return new Observable(observer => {
   
      if (this.datosCargados) {
        observer.next(this.listaPersonajes);
        observer.complete();
        return;
      }

      // Si no, los cargamos del archivo
      this.http.get<Personaje[]>('assets/data/personajes.json').subscribe({
        next: (personajes) => {
          this.listaPersonajes = personajes;
          this.datosCargados = true;
          console.log('Personajes cargados:', personajes.length);
          observer.next(personajes);
          observer.complete();
        },
        error: (error) => {
          console.error('Error cargando personajes:', error);
          observer.error('No se pudieron cargar los personajes');
        }
      });
    });
  }

  getPersonajeById(id: string): Observable<Personaje | undefined> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          const personajeEncontrado = personajes.find(p => p.id === id);
          observer.next(personajeEncontrado);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  searchPersonajes(textoBusqueda: string): Observable<Personaje[]> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          if (!textoBusqueda) {
            observer.next(personajes);
            observer.complete();
            return;
          }

          const texto = textoBusqueda.toLowerCase();
          const resultados = personajes.filter(personaje => {
            if (personaje.name.toLowerCase().includes(texto)) {
              return true;
            }
            
  
            for (let alias of personaje.aliases) {
              if (alias.toLowerCase().includes(texto)) {
                return true;
              }
            }
            
            return false;
          });

          observer.next(resultados);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }


  filtrarPorUniverso(universo: string): Observable<Personaje[]> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          if (!universo) {
            observer.next(personajes);
            observer.complete();
            return;
          }

          const filtrados = personajes.filter(p => p.universe === universo);
          observer.next(filtrados);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }


  filtrarPorAfiliacion(afiliacion: string): Observable<Personaje[]> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          if (!afiliacion) {
            observer.next(personajes);
            observer.complete();
            return;
          }

          const filtrados = personajes.filter(p => p.affiliation === afiliacion);
          observer.next(filtrados);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getUniversos(): Observable<string[]> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          const universos = [...new Set(personajes.map(p => p.universe))];
          observer.next(universos);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }


  getAfiliaciones(): Observable<string[]> {
    return new Observable(observer => {
      this.getPersonajes().subscribe({
        next: (personajes) => {
          const afiliaciones = [...new Set(personajes.map(p => p.affiliation))];
          observer.next(afiliaciones);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}