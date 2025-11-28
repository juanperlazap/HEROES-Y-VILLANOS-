import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { PersonajesService, Personaje } from '../../core/services/personajes';
import { FavoritosService } from '../../core/services/favoritos';
import { ConfiguracionService } from '../../core/services/configuracion'; // AÑADE ESTA IMPORTACIÓN

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    CommonModule, 
    FormsModule,
    RouterModule
  ]
})
export class ExplorarPage implements OnInit {
  personajes: Personaje[] = [];
  personajesFiltrados: Personaje[] = [];
  cargando: boolean = true;
  error: boolean = false;
  
  queryBusqueda: string = '';
  filtroUniverso: string = '';
  filtroAfiliacion: string = '';
  orden: string = 'nombre-asc';

  isDark: boolean = false; // AÑADE ESTA VARIABLE

  constructor(
    private personajesService: PersonajesService,
    private favoritosService: FavoritosService,
    private configuracionService: ConfiguracionService // AÑADE ESTO
  ) {}

  async ngOnInit() {
    // CARGA LA CONFIGURACIÓN DEL TEMA
    this.configuracionService.cargarConfiguracionInicial();
    this.isDark = this.configuracionService.obtenerTemaOscuro();
    
    this.cargarPersonajes();
    
    // ESCUCHA CAMBIOS EN EL LOCALSTORAGE (opcional, pero recomendado)
    window.addEventListener('storage', () => {
      this.configuracionService.cargarConfiguracionInicial();
      this.isDark = this.configuracionService.obtenerTemaOscuro();
    });
  }

  // ... el resto de tus métodos se mantiene igual ...
  cargarPersonajes() {
    this.cargando = true;
    this.error = false;
    
    this.personajesService.getPersonajes().subscribe({
      next: (personajes) => {
        this.personajes = personajes;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        this.error = true;
        this.cargando = false;
      }
    });
  }

  cambiarAfiliacion(event: any) {
    this.filtroAfiliacion = event.detail.value;
    this.aplicarFiltros();
  }

  cambiarUniverso(event: any) {
    this.filtroUniverso = event.detail.value;
    this.aplicarFiltros();
  }

  cambiarOrden(orden: string) {
    this.orden = orden;
    this.aplicarFiltros();
  }

  onBuscar(event: any) {
    this.queryBusqueda = event.target.value || '';
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultados = [...this.personajes];

    if (this.queryBusqueda) {
      const query = this.queryBusqueda.toLowerCase();
      resultados = resultados.filter(personaje =>
        personaje.name.toLowerCase().includes(query) ||
        personaje.aliases.some(alias => alias.toLowerCase().includes(query))
      );
    }

    if (this.filtroUniverso) {
      resultados = resultados.filter(personaje => personaje.universe === this.filtroUniverso);
    }

    if (this.filtroAfiliacion) {
      resultados = resultados.filter(personaje => personaje.affiliation === this.filtroAfiliacion);
    }

    resultados = this.ordenarPersonajes(resultados);
    this.personajesFiltrados = resultados;
  }

  ordenarPersonajes(personajes: Personaje[]): Personaje[] {
    if (this.orden === 'nombre-asc') {
      return personajes.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return personajes.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  getTextoAfiliacion(afiliacion: string): string {
    if (afiliacion === 'Hero') return 'Héroe';
    if (afiliacion === 'Villain') return 'Villano';
    return afiliacion;
  }

  limpiarFiltros() {
    this.queryBusqueda = '';
    this.filtroUniverso = '';
    this.filtroAfiliacion = '';
    this.orden = 'nombre-asc';
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroAfiliacion || this.filtroUniverso || this.queryBusqueda);
  }

  removerFiltro(tipo: string) {
    if (tipo === 'afiliacion') this.filtroAfiliacion = '';
    if (tipo === 'universo') this.filtroUniverso = '';
    if (tipo === 'busqueda') this.queryBusqueda = '';
    this.aplicarFiltros();
  }
}