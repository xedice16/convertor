
document.addEventListener("DOMContentLoaded", () => {
    
    const fromButtons = document.querySelectorAll(".left .btn");
    const toButtons = document.querySelectorAll(".right .btn");

    let fromCurrency = "RUB"; 
    let toCurrency = "USD";   

    
    const fromAmountInput = document.getElementById("num2");  
    const toAmountInput = document.getElementById("num4");    

    
    const fromRateDisplay = document.querySelector(".text1");
    const toRateDisplay = document.querySelector(".text2");

    
    const apiBase = "https://api.exchangerate-api.com/v4/latest";

   
    const activateButton = (buttons, selectedCurrency) => {
        buttons.forEach((button) => {
            if (button.value === selectedCurrency) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    };

    
    const fetchExchangeRates = async (baseCurrency) => {
        try {
            const response = await fetch(`${apiBase}/${baseCurrency}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();

            if (data && data.rates) {
                return data.rates;
            } else {
                throw new Error("Invalid API response");
            }
        } catch (error) {
            showNoInternetPopup();
            console.error(error);
            return null;
        }
    };

    
    const updateConversion = async () => {
        if (!fromCurrency || !toCurrency) return;

        if (fromCurrency === toCurrency) {
           
            toAmountInput.value = fromAmountInput.value;
            fromRateDisplay.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
            toRateDisplay.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
            return;
        }

        const rates = await fetchExchangeRates(fromCurrency);
        if (rates) {
            const rate = rates[toCurrency];
            const inverseRate = 1 / rate;
            const amount = parseFloat(fromAmountInput.value) || 0;
            toAmountInput.value = (amount * rate).toFixed(4);
            fromRateDisplay.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            toRateDisplay.textContent = `1 ${toCurrency} = ${inverseRate.toFixed(4)} ${fromCurrency}`;
        }
    };

    
    fromButtons.forEach((button) => {
        button.addEventListener("click", () => {
            fromCurrency = button.value;
            activateButton(fromButtons, fromCurrency);
            updateConversion(); 
        });
    });

    toButtons.forEach((button) => {
        button.addEventListener("click", () => {
            toCurrency = button.value;
            activateButton(toButtons, toCurrency);
            updateConversion(); 
        });
    });

    
    fromAmountInput.addEventListener("input", (event) => {
        let value = event.target.value;
        
        value = value.replace(/,/g, ".");
        
        value = value.replace(/[^0-9.]/g, "");
        
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        event.target.value = value;
        updateConversion(); 
    });

   
    const showNoInternetPopup = () => {
        const popup = document.createElement("div");
        popup.className = "no-internet-popup";
        popup.innerHTML = `
            <p>Проблемы с подключением к интернету. Проверьте свое соединение.</p>
        `;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 5000);
    };

   
    activateButton(fromButtons, fromCurrency);
    activateButton(toButtons, toCurrency);
    fromAmountInput.value = 1; 
    updateConversion();
});