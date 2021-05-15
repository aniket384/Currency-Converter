import React, { useEffect, useState } from 'react';
import Convert from './convert'

const BASE_URL = 'http://api.exchangeratesapi.io/v1?access_key=6bf49fdf942706846ae8993638c61eb6'

export default function CurrencyRow  () {
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [fromCurrency, setFromCurrency] = useState()
    const [toCurrency, setToCurrency] = useState()
    const [exchangeRate, setExchangeRate] = useState()
    const [amount, setAmount] = useState(1)
    const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
    
    let toAmount, fromAmount
    if (amountInFromCurrency){
        fromAmount = amount
        toAmount = amount * exchangeRate
    } else {
        toAmount = amount
        fromAmount = amount / exchangeRate
    }
    useEffect(() => {
        fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            const firstCurrency = Object.keys(data.rates)[0]
            setCurrencyOptions([data.base, ...Object.keys(data.rates)])
            setFromCurrency(data.base)
            setToCurrency(firstCurrency)
            setExchangeRate(data.rates[firstCurrency])
        })
      }, [])

      useEffect(() => {
          if (fromCurrency != null && toCurrency != null){
            fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
                .then(res => res.json())
                .then(data => setExchangeRate(data.rates[toCurrency]))
          }
      }, [fromCurrency, toCurrency])
      function handleFromAmountChange(e){
          setAmount(e.target.value)
          setAmountInFromCurrency(true)
      }
      function handleToAmountChange(e){
        setAmount(e.target.value)
        setAmountInFromCurrency(false)
    }
    return (
        <div>
            <div className="top-bar-agile">
		
        </div>
        <div className="content-w3">
            <h1>Convert</h1>
            <Convert 
                currencyOptions = {currencyOptions}
                selectedCurrency={fromCurrency}
                onChangeCurrency={e => setFromCurrency(e.target.value)}
                onChangeAmount={handleFromAmountChange}
                amount={fromAmount}
            />
            <div className="equals"> = </div>
            <Convert 
                currencyOptions = {currencyOptions}
                selectedCurrency={toCurrency}
                onChangeCurrency={e => setToCurrency(e.target.value)}
                onChangeAmount={handleToAmountChange}
                amount={toAmount}
             />
            
            
        </div>
        <div className="footer-w3ls">
            <p> &copy; 2021 Digital Clock. All Rights Reserved | Design by Aniket Mishra</p>
        </div>
        </div>
    )
}
