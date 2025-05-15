import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

export type Button = {
  icon: string;
  name: string;
  color: string;
  link: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Deutsch-Server';

  apiKey: string = '';
  fetched: boolean = false;
  loading: boolean = true;

  nameValues = {
    default: 'Olomouc',
    searchName: '',
    display: 'Olomouc'
  }

  weatherData: any = {};
  
  weatherImages: {[key: string]: string} = {
    Clear: './images/sunny.png',
    Clouds: './images/cloudy.png',
    Rain: './images/rainy.png',
    Snow: './images/snowy.png',
    Haze: './images/cloudy.png',
    Mist: './images/cloudy.png',
  }
  backgroundImages: {[key: string]: string} = {
    Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
    Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
    Snow: 'linear-gradient(to right, #aff2ff, #fffff)',
    Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
  }

  currentDate = new Date()
  daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  async search() {
    if (this.nameValues.searchName.trim() == "") return
    this.loading = true;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.nameValues.searchName}&units=Metric&appid=${this.apiKey}`;
    const res = await fetch(url);

    this.nameValues.display = this.nameValues.searchName;
    this.nameValues.searchName = "";

    const searchData = await res.json();
    if (searchData.cod !== 200) this.weatherData = {notFound: true};
    else {
      this.weatherData = searchData;
    }
    this.loading = false;
  }
  async defaultRequest() {
    if (this.fetched) return;
    this.fetched = true;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.nameValues.default}&units=Metric&appid=${this.apiKey}`;
    const res = await fetch(url);

    const searchData = await res.json();
    if (searchData.cod !== 200) this.weatherData = {notFound: true};
    else {
      this.weatherData = searchData;
    }
    this.loading = false;
  }

  ngOnInit(): void {
    this.defaultRequest();
    this.updateWindowSize();
  }

  buttons = signal<Button[]>([
    { icon: 'svgs/Nextcloud_Logo.svg', name: 'Nextcloud', color: 'linear-gradient(to right, white, #87CEEB)', link: 'https://nextcloud.dojc.cc/' },
    { icon: 'svgs/CodeServer_Logo.svg', name: 'Code Server', color: 'linear-gradient(to right, #559CFC, #086BFD)', link: 'https://code.dojc.cc/' },
  ]);

  openLink(url: string) { window.open(url, '_blank'); }

  sliderBool1: boolean = true;
  sliderBool2: boolean = true;
  updateWindowSize() {
    if (window.innerWidth < 980 || window.innerHeight < 600) this.sliderBool2 = false;
  }

  changePage(direction: 'left' | 'right') {
    if ((direction === 'left' && this.sliderBool1) || (direction === 'right' && this.sliderBool2)) return;
    this.sliderBool1 = !this.sliderBool1;
    this.sliderBool2 = !this.sliderBool2;
  }
}
