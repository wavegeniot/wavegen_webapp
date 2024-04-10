import { Component, inject, signal, ViewChild } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChartConfiguration } from "chart.js"
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  private supabaseService = inject(SupabaseService)
  private formBuilder = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  devices = signal([])
  waveDataChart: number[] = []

  waves = [
    { id: 1, signal: 'Cuadrada' },
    { id: 2, signal: 'Seno' },
    { id: 3, signal: 'Sierra' },
  ]

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: Array(360).fill(0),
        label: 'Data',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: Array.from(Array(360).keys())
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        position: 'left',
      },
    },
  };


  waveDataForm = this.formBuilder.group({
    device: new FormControl<string>('-1'),
    type: new FormControl<number>(1),
    frequency: new FormControl<number>(10),
    amplitude: new FormControl<number>(3)
  })

  constructor() {
    this.supabaseService.subscribeChannel('wave_data', 'wave_data')
    this.getDevicesData()
  }

  printWave(amplitude: number, type: number) {
    for (let i = 0; i < 360; i++) {
      this.lineChartData.datasets[0].data[i] =
      this.generateNumber(i, type, amplitude)
    }
    console.log(this.lineChartData.datasets[0].data)
    this.chart?.update()
  }

  generateNumber(i: number, type: number, amplitude: number): number {
    if (type == 1) {
      return (i % 180 < 90 ? -amplitude : amplitude)
    }
    else if (type == 2) {
      return Math.sin(i * Math.PI / 180) * amplitude
    }
    else {
      return ((i % 180) / 90 -1) * amplitude
    }
  }

  signOut() {
    this.authService.signOut()
    this.router.navigate([''])
  }

  getDevicesData() {
    this.supabaseService.getDataDevices()
      .then((data: any) => {
        this.devices.set(data.data)
      })
  }

  sendData() {
    const id = this.waveDataForm.value.device as string
    const data = this.waveDataForm.value.type + ";" + this.waveDataForm.value.amplitude + ";" + this.waveDataForm.value.frequency as string
    const alertElement = <HTMLElement>document.getElementById('liveAlertPlaceholder')
    alertElement.innerHTML = ""
    if (id === "-1") {
      this.triggerAlert()
      return
    }
    this.printWave(this.waveDataForm.value.amplitude as number, this.waveDataForm.value.type as number)
    this.supabaseService.updateWaveData({ id, data })
  }

  triggerAlert() {
    this.appendAlert(" Seleccione un dispositivo", "warning")
  }

  appendAlert(message: string, type: string) {
    const alertElement = <HTMLElement>document.getElementById('liveAlertPlaceholder')
    const childElement = <HTMLElement>document.getElementById('alert-msg')

    if (childElement === null) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML =
        `<div class="alert alert-${type}" alert-dismissible" id="alert-msg" role="alert">
      <div class="row">
      <div class="col-1">
      <button type="button" class="btn-close float-right" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="col-8">
      ${message}
      </div>
      </div>
      </div>`

      alertElement.append(wrapper)
    }
  }
}