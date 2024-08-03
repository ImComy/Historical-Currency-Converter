document.getElementById('currency-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let baseCurrency = document.getElementById('baseCurrency').value.toUpperCase();
    const amount = document.getElementById('amount').value;
    const output = document.getElementById('conversionType').value;
    const server = document.getElementById('servertype').value;

    let apiKey, currencies;
    if (server === "1") {
        apiKey = 'a58c31b168e589eb6dc838ce1c3d70a4';
    } else if (server === "2") {
        apiKey = '5aab7012a4d3649a06d3c934b6b8aad2';
    } else if (server === "3") {
        apiKey = 'ee27f3b21640b26c51dcebe4cefd1d13';
    }

    const apiUrl = 'https://api.metalpriceapi.com/v1/latest';
    const url = `${apiUrl}?api_key=${apiKey}&base=${baseCurrency}&currencies=EUR,XAU,XAG`;

    document.querySelector('.result-div1').style.display = 'none';
    document.querySelector('.result-div2').style.display = 'none';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.rates) {
                let errorElements = document.getElementsByClassName("error");
                for (let i = 0; i < errorElements.length; i++) {
                    errorElements[i].textContent = "There was a problem with the fetch operation. Please try another server.";
                }
                throw new Error('Rates data not available');
            }

            console.log('Rates data:', data.rates); 
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Second fetch data:', data); 

                    let rates = data.rates;
                    let XAU = rates[`${baseCurrency}XAU`];
                    let XAG = rates[`${baseCurrency}XAG`];

                    console.log('XAU rate:', XAU);
                    console.log('XAG rate:', XAG);

                    let result1 = 0;
                    if (output === "2") {
                        result1 = (0.150025 * XAU * 4.25) * amount;
                    } else if (output === "3") {
                        result1 = (0.150025 * XAG * 2.975) * amount;
                    }

                    document.querySelector('.result-div2').style.display = 'block';
                    document.querySelector(".result-div2").textContent = result1.toFixed(2);
                })
                .catch(error => {
                    console.error('Error fetching rates:', error);
                    let errorElements = document.getElementsByClassName("error");
                    for (let i = 0; i < errorElements.length; i++) {
                        errorElements[i].textContent = "There was a problem fetching rates. Please try another server.";
                    }
                });

            let result1_XAU = data.rates.XAU * 0.1499143 * amount;
            let result2_XAG = data.rates.XAG * 0.10494004 * amount;

            if (output === "1") {
                document.querySelector('.result-div1').style.display = 'block';
                document.querySelector(".result1").textContent = result1_XAU.toFixed(2);
                document.querySelector(".result2").textContent = result2_XAG.toFixed(2);
            }
        })
        .catch(error => {
            console.error('Error fetching initial data:', error);
            let errorElements = document.getElementsByClassName("error");
            for (let i = 0; i < errorElements.length; i++) {
                errorElements[i].textContent = "There was a problem with the fetch operation. Please try another server.";
            }
        });
});