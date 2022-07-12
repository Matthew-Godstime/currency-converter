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

  // Get the from rate
  private getFromRate() {
    // Had to include the additional USD string to get the rate
    this.currentFromRate = this.rates['USD' + this.fromSymbol]
  }

  // Get thr To rate
  private getToRate() {
    // Had to include the additional USD string to get the rate
    this.currentToRate = this.rates['USD' + this.toSymbol]
  }

  // Calculate TO the given values
  public calculateToExchange() {
    this.toExchangeRate = this.fromValue * this.currentToRate;
    this.toValue = this.toExchangeRate.toLocaleString()
  }

  // Calculate From the given values
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

  // The API returned an additional USD to the string, I had to substring it.
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
