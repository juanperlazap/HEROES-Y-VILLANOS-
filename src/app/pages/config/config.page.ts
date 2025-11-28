import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonToggle, 
  IonIcon 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [
    IonIcon, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonToggle,
    CommonModule, 
    FormsModule,
  ]
})
export class ConfigPage implements OnInit {
  temaOscuro: boolean = false;
  tamanoFuente: string = 'normal';

  constructor() {}

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    const temaGuardado = localStorage.getItem('temaOscuro');
    const fuenteGuardada = localStorage.getItem('tamanoFuente');

    this.temaOscuro = temaGuardado ? JSON.parse(temaGuardado) : false;
    this.tamanoFuente = fuenteGuardada || 'normal';

    this.aplicarTema();
    this.aplicarTamanoFuente();
  }

  onTemaCambiado(event: any) {
    this.temaOscuro = event.detail.checked;
    localStorage.setItem('temaOscuro', JSON.stringify(this.temaOscuro));
    this.aplicarTema();
  }

  // Nuevo método para cambiar el tamaño de fuente con botones
  cambiarTamanoFuente(tamano: string) {
    this.tamanoFuente = tamano;
    localStorage.setItem('tamanoFuente', this.tamanoFuente);
    this.aplicarTamanoFuente();
  }

  aplicarTema() {
    if (this.temaOscuro) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  aplicarTamanoFuente() {
    document.body.classList.remove('fuente-normal', 'fuente-grande');
    document.body.classList.add(`fuente-${this.tamanoFuente}`);
  }
}