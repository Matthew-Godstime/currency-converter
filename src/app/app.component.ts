import { Component, HostListener, OnInit } from '@angular/core';
import { ConverterService } from './converter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "Stime's Currency Converter";
  public fromValue: any = 1;
  public toValue: any = 0;
  public rates: any;
  public fromSymbol: string = 'USD';
  public toSymbol: string = 'NGN';
  public currentFromRate!: number
  public currentToRate!: number;
  private toExchangeRate!: number
  private fromExchangeRate!: number;

  constructor(private cs: ConverterService) {
    this.cs.getCurrentExchange().subscribe((value: any) => {
      this.rates = value.quotes
      this.getFromRate();
      this.getToRate();
      this.calculateToExchange();
      console.log(this.rates);
    })
   }

  @HostListener('keyup', ['$event']) CheckInput(event: KeyboardEvent) {
    if ((event.target as HTMLInputElement).name === 'currencyFrom') this.calculateToExchange();
    else this.calculateFromExchange();
  }

  @HostListener('click', ['$event']) checkSelect(event: Event) {
    if ((event.target as HTMLSelectElement).name == 'countryFrom' && (event.target as HTMLSelectElement).value !== 'USD') {
      this.getFromRate();
      this.calculateFromExchange();
      console.log((event.target as HTMLSelectElement).value);
    }
    if ((event.target as HTMLSelectElement).name == 'countryTo' && (event.target as HTMLSelectElement).value !== 'NGN') {
      this.getToRate();
      this.calculateToExchange();
      console.log((event.target as HTMLSelectElement).value);
    }
  }

  private getFromRate() {
    this.currentFromRate = this.rates['USD' + this.fromSymbol]
  }

  private getToRate() {
    this.currentToRate = this.rates['USD' + this.toSymbol]
  }

  public calculateToExchange() {
    this.toExchangeRate = this.fromValue * this.currentToRate;
    this.toValue = this.toExchangeRate.toLocaleString()
  }

  public calculateFromExchange() {
    this.fromExchangeRate = this.toValue * this.currentFromRate;
    this.fromValue = this.fromExchangeRate.toLocaleString();
  }


  public get fromRates(): string[] {
    return this.getRates();
  }

  public get toRates(): string[] {
    return this.getRates();
  }

  public getRates() {
    let keys: string[] = [];
    if (this.rates) {
      Object.keys(this.rates).forEach(el => {
        keys.push(el.substring(3))
      });
    }
    return keys;

    // let keys = Object.keys(this.rates);
    // return keys;
  }

  ngOnInit(): void {
    
  }
}
