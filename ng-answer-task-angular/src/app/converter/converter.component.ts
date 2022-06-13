import {Component, OnInit} from '@angular/core'
import { HttpClient } from '@angular/common/http'


@Component({
    selector: 'app-converter',
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.css']
})

export class ConverterComponent implements OnInit {
    sourceUrl = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
    //data from response
    response: any
    currentCourseOfUsd: number = 0
    currentCourseOfEur: number = 0
    currentData:string = ''
    //inputs value
    inputValueFrom:any
    inputValueTo:any
    //starting values for types
    inputTypeFrom:string = 'UAH'
    inputTypeTo:string = 'USD'
    
    toggle:boolean = false 

    //needs for working http request
    constructor(private http: HttpClient){

    }

    //correction method for values
    correction(value:number){
        return parseFloat(value.toFixed(2))
    }

    workingFuncNormal(){
        //input1 -> input2
        let value = this.inputValueFrom
        if(this.inputTypeFrom === 'UAH' && this.inputTypeTo === 'USD')
            this.inputValueTo = value / this.currentCourseOfUsd
        else if(this.inputTypeFrom === 'UAH' && this.inputTypeTo === 'EUR')
            this.inputValueTo = value / this.currentCourseOfEur

        else if(this.inputTypeFrom === 'USD' && this.inputTypeTo === 'UAH')
            this.inputValueTo = value * this.currentCourseOfUsd
        else if(this.inputTypeFrom === 'USD' && this.inputTypeTo === 'EUR')
            this.inputValueTo = value * (this.currentCourseOfUsd / this.currentCourseOfEur)

        else if(this.inputTypeFrom === 'EUR' && this.inputTypeTo === 'UAH')
            this.inputValueTo = value * this.currentCourseOfEur
        else if(this.inputTypeFrom === 'EUR' && this.inputTypeTo === 'USD')
            this.inputValueTo = value * (this.currentCourseOfEur / this.currentCourseOfUsd)

        else if(this.inputTypeFrom === 'UAH' && this.inputTypeTo === 'UAH' ||
                this.inputTypeFrom === 'USD' && this.inputTypeTo === 'USD' ||
                this.inputTypeFrom === 'EUR' && this.inputTypeTo === 'EUR')
            this.inputValueTo = this.inputValueFrom 
        else
            this.inputValueTo = 0
        if(this.inputValueTo !== 'undefined')
            this.inputValueTo = this.correction(this.inputValueTo)
    }

    workFuncBackwards(){
        let value = this.inputValueTo
            //input 1 <- input2
        if(this.inputTypeTo === 'UAH' && this.inputTypeFrom === 'USD')
            this.inputValueFrom = value / this.currentCourseOfUsd
        else if(this.inputTypeTo === 'UAH' && this.inputTypeFrom === 'EUR')
            this.inputValueFrom = value / this.currentCourseOfEur

        else if(this.inputTypeTo === 'USD' && this.inputTypeFrom === "UAH")
            this.inputValueFrom = value * this.currentCourseOfUsd
        else if(this.inputTypeTo === "USD" && this.inputTypeFrom === "EUR")
            this.inputValueFrom = value * (this.currentCourseOfUsd / this.currentCourseOfEur)

        else if(this.inputTypeTo === 'EUR' && this.inputTypeFrom === "UAH")
            this.inputValueFrom = value * this.currentCourseOfEur
        else if(this.inputTypeTo === "EUR" && this.inputTypeFrom === "USD")
            this.inputValueFrom = value * (this.currentCourseOfEur / this.currentCourseOfUsd)

        else if(this.inputTypeFrom === 'UAH' && this.inputTypeTo === 'UAH' ||
                this.inputTypeFrom === 'USD' && this.inputTypeTo === 'USD' ||
                this.inputTypeFrom === 'EUR' && this.inputTypeTo === 'EUR')
            this.inputValueFrom = this.inputValueTo
        else
            this.inputValueFrom = 0
        if(this.inputValueFrom !== 'undefined')
            this.inputValueFrom = this.correction(this.inputValueFrom)
    }

    //event works on 1st input value of currency
    inputFromHandler(event:any){
        this.inputValueFrom = event.target.value;
        this.workingFuncNormal()

    }

    //event works on 2nd input value of currency
    inputToHandler(event:any){
        this.inputValueTo = event.target.value
        this.workFuncBackwards()
    }

    //event works on 1st type of currency
    onInputConvertFromChange(event:any){
        this.inputTypeFrom = event.target.value
        this.workingFuncNormal()
    }

    //event works on 2nd type of currency
    onInputConvertToChange(event:any){
        this.inputTypeTo = event.target.value
        this.workFuncBackwards()
    }

    //geting info from bank APIs
    ngOnInit(): void {
        this.http.get(this.sourceUrl)
            .subscribe((response)=>{
                this.response = response;
                this.response.forEach((element:any): any => {
                if(element.cc === 'USD')
                    this.currentCourseOfUsd = element.rate
                if(element.cc === 'EUR')
                    this.currentCourseOfEur = element.rate
                this.currentData = element.exchangedate
                this.currentCourseOfUsd = parseFloat(this.currentCourseOfUsd.toFixed(2))
                this.currentCourseOfEur = parseFloat(this.currentCourseOfEur.toFixed(2))
                this.toggle = true
                });
            })
    }
    
}