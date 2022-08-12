import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConverterService } from './converter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = "G.Tech's Currency Converter";
  private fullCountryName = this.cs.getAllFullNames();
  public fromValue: string = '1';
  public toValue: string = '0';
  public rates: any;
  public fromSymbol: string = 'USD';
  public toSymbol: string = 'NGN';
  public currentFromRate!: number
  public currentToRate!: number;
  private toExchangeRate!: number
  private fromExchangeRate!: number;
  public isUpdating!: boolean;
  public isUpdatingFrom!: boolean;
  public isUpdatingTo!: boolean;
  public isExchangeRateUpdated: boolean = false;
  public isExchangeRateUpdateFailed: boolean = false;
  public errorDetails: any;
  public incorrectFrom: boolean = false;
  public incorrectTo: boolean = false;
  private subscription!: Subscription;
  constructor(private cs: ConverterService) {
    this.init();
  }
  private init() {
    this.subscription = this.cs.getCurrentExchange().subscribe(
      (next: any) => {
        this.rates = next.rates;
        // this.rates = next; // Remove For production
        if (this.rates) {
          this.getFromRate();
          this.getToRate();
          this.calculateToExchange();
          this.isExchangeRateUpdated = true;
        }
      },
      (error) => {
        this.isExchangeRateUpdateFailed = true
        this.errorDetails = new Error("Failed to Fetch the Exchange Rate. Check your Connection, and try again");
        throw this.errorDetails;
      }
    );
  }

  // Input event listener
  @HostListener('keyup', ['$event']) CheckInput(event: KeyboardEvent): void {
    let inputEvent = (event.target as HTMLInputElement);
    if (this.fromValue.startsWith("0")) this.fromValue = this.fromValue.substring(1);
    if (this.toValue.startsWith("0")) this.toValue = this.toValue.substring(1);
    if (this.fromValue === "") this.fromValue = "0";
    if (this.toValue === "") this.toValue = "0";
    if (inputEvent.name === 'currencyFrom') {
      if (this.checkIfChar(inputEvent.value, 'currencyFrom')) {
        this.isUpdating = true;
        this.isUpdatingTo = true;
        setTimeout(() => {
          this.calculateToExchange();
          this.isUpdating = false;
          this.isUpdatingTo = false;
        }, 500);
      }
    } else {
      if (this.checkIfChar(inputEvent.value, 'ToAmount')) {
        this.isUpdating = true;
        this.isUpdatingFrom = true;
        setTimeout(() => {
          this.calculateFromExchange();
          this.isUpdating = false;
          this.isUpdatingFrom = false;
        }, 500);
      }
    }

  }

  // Check if the Input is a Character
  private checkIfChar(value: string, target: string): boolean {
    let c = value[value.length - 1];
    let fromInput: HTMLInputElement = document.querySelector('#FromAmount')!;
    let toInput: HTMLInputElement = document.querySelector('#ToAmount')!;
    if (c === ".") return true;
    if (c !== undefined && isNaN(parseInt(c))) {
      if (target == 'currencyFrom') {
        fromInput.style.outlineColor = 'red'
        this.incorrectFrom = true;
        return false;
      } else if (target == 'ToAmount') {
        toInput.style.outlineColor = 'red'
        this.incorrectTo = true;
        return false;
      }
    }
    fromInput.style.outlineColor = '';
    toInput.style.outlineColor = ''
    this.incorrectFrom = false;
    this.incorrectTo = false;
    return true;
  }

  // Update Our Selection
  public checkSelect(event: Event): void {
    if ((event.target as HTMLSelectElement).name == 'countryFrom') {
      this.fromSymbol = (event.target as HTMLSelectElement).value;
      this.getFromRate();
      this.isUpdating = true;
      this.isUpdatingFrom = true;
      setTimeout(() => {
        this.calculateFromExchange();
        this.isUpdating = false;
        this.isUpdatingFrom = false;
      }, 500);
    }
    if ((event.target as HTMLSelectElement).name == 'countryTo') {
      this.toSymbol = (event.target as HTMLSelectElement).value
      this.getToRate();
      this.isUpdating = true;
      this.isUpdatingTo = true;
      setTimeout(() => {
        this.calculateToExchange();
        this.isUpdating = false;
        this.isUpdatingTo = false;
      }, 500);
    }
  }

  // Get the from rate
  private getFromRate(): void {
    this.currentFromRate = this.rates[this.fromSymbol];
  }

  // Get the To rate
  private getToRate(): void {
    this.currentToRate = this.rates[this.toSymbol];
  }

  // Get the Key of an Object via its value
  private getObjKey(obj: any, value: any) {
    return Object.keys(obj).find(key => obj[key] === value);
  }

  // Calculate TO the given values
  private calculateToExchange(): void {
    let ratePerUnit = (this.currentToRate / this.currentFromRate);
    this.toExchangeRate = ratePerUnit * parseFloat(this.removeStr(this.fromValue));
    this.toValue = this.toExchangeRate.toLocaleString();
  }

  // Calculate From the given values
  private calculateFromExchange(): void {
    let ratePerUnit = (this.currentFromRate / this.currentToRate);
    this.fromExchangeRate = ratePerUnit * parseFloat(this.removeStr(this.toValue));
    this.fromValue = this.fromExchangeRate.toLocaleString();
  }

  //  Remove All Comma in our previous value
  private removeStr(str: string): string {
    let result: string = '';
    for (const s of str) {
      if (s !== ",") {
        result += s;
      }
    }
    return result;
  }
  // Display the From symbol in the UI
  public get fromRates(): string[] {
    return this.getRates();
  }
  // Display the To symbol in the UI
  public get toRates(): string[] {
    return this.getRates();
  }

  // Use the symbol gotten from out rate API to display only the 
  // full name of the currency from another file
  private getRates(): string[] {
    let fullNameKeys: any[] = [];
    if (this.rates) {
      let keys = Object.keys(this.rates);
      keys.forEach(k => {
        fullNameKeys.push([k, this.fullCountryName[k]]);
      })
    }
    return fullNameKeys;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

  }
}
