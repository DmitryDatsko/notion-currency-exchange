const apiUrl = "https://api.monobank.ua/bank/currency";
const rateElement = document.getElementById('rate');
const FIRST_REQUEST_KEY = "firstrequestdone";
const RATE_BUY = "RATE_BUY";
const RATE_SELL = "RATE_SELL";

// Функция для получения курса
if(!localStorage.getItem(FIRST_REQUEST_KEY)){
    getExchangeRate();
    localStorage.setItem(FIRST_REQUEST_KEY, true)
}
else{
    rateElement.innerHTML = 
        `<p>Курс покупки: ${localStorage.getItem(RATE_BUY)} грн</p>
        <p>Курс продажи: ${localStorage.getItem(RATE_SELL)} грн</p>
    `;
}

async function getExchangeRate() {
    try {
        const response = await fetch(apiUrl);  
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        
        const data = await response.json();
        // Ищем запись с кодом USD/UAH
        const usdToUah = data.find(item => item.currencyCodeA === 840 && item.currencyCodeB === 980);
        console.log(usdToUah);

        if (usdToUah)
        {
            const { rateBuy, rateSell } = usdToUah;
            localStorage.setItem(RATE_BUY, rateBuy.toFixed(2));
            localStorage.setItem(RATE_SELL, rateSell.toFixed(2));
            rateElement.innerHTML = 
                `<p>Курс покупки: ${localStorage.getItem(RATE_BUY)} грн</p>
                <p>Курс продажи: ${localStorage.getItem(RATE_SELL)} грн</p>
            `;
        }
        else {
            rateElement.textContent = "Данные о курсе USD/UAH не найдены.";
            console.log("Данные о курсе USD/UAH не найдены.");
        }
    } catch (error) {
        console.error(error);
    }
}

setInterval(getExchangeRate, 300000);