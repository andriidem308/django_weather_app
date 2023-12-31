let currentPage = 1;
const pageSize = 30;

document.getElementById('get-weather').onclick = () => {
    const weatherRequest = new XMLHttpRequest();
    weatherRequest.onreadystatechange = function() {
        if (this.readyState != 4) return;

        const responseData = JSON.parse(this.responseText);

        if (this.status === 200) {
            const weatherTable = document.getElementById('weather-result-table');
            weatherTable.classList.remove('hidden');
            updateWeatherTable(responseData);
            updateWeatherCards(responseData);
            updatePagination(responseData);
        } else {
            errorWindowMessages = document.querySelectorAll('#error-window-body p');
            errorWindowMessages.forEach(function (element) {
                element.remove();
            });

            errorWindowBody = document.getElementById('error-window-body');
            errorMessage = document.createElement('p');
            errorMessage.textContent = responseData.message;
            errorWindowBody.appendChild(errorMessage);

            var errowWindow = document.getElementById('error-window');
            errowWindow.style.display = 'block';

            var inputCity = document.getElementById('input-city');
            var inputDateFrom = document.getElementById('input-date-from');
            var inputDateTo = document.getElementById('input-date-to');

            if (inputCity.value === '' || responseData.message === 'No matching location found.') {
                inputCity.classList.add('error');
            }

            if (inputDateFrom.value === '') {
                inputDateFrom.classList.add('error');
            }

            if (responseData.message === 'dateTo cannot be earlier than dateFrom') {
                inputDateFrom.classList.add('error');
                inputDateTo.classList.add('error');
            }
        }

    };

    const city = document.getElementById('input-city').value;
    const dateFrom = document.getElementById('input-date-from').value;
    const dateTo = document.getElementById('input-date-to').value;

    const url = `/get_weather_data/?city=${city}&dateFrom=${dateFrom}&dateTo=${dateTo}`;

    weatherRequest.open('GET', url);
    weatherRequest.send();
};

function updateWeatherTable(data) {
    const tableBody = document.getElementById('weather-table-data');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    data.data.results.slice(startIndex, endIndex).forEach(function (result) {
        addRow(tableBody, result);
    });
}

function updateWeatherCards(data) {
    const cardsBody = document.getElementById('weather-result-cards');
    cardsBody.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    data.data.results.slice(startIndex, endIndex).forEach(function (result) {
        addCard(cardsBody, result);
    });
}

function addRow(tableBody, rowData) {
    const row = tableBody.insertRow();

    const dateCell = row.insertCell(0);
    dateCell.textContent = rowData.day;

    const maxTempCell = row.insertCell(1);
    maxTempCell.textContent = rowData.max_temp + '°C';

    const minTempCell = row.insertCell(2);
    minTempCell.textContent = rowData.min_temp + '°C';

    const avgTempCell = row.insertCell(3);
    avgTempCell.textContent = rowData.avg_temp + '°C';

    const avgHumidityCell = row.insertCell(4);
    avgHumidityCell.textContent = rowData.humidity + '%';

    const sunriseCell = row.insertCell(5);
    sunriseCell.textContent = rowData.sunrise;

    const sunsetCell = row.insertCell(6);
    sunsetCell.textContent = rowData.sunset;
}

function addCard(cardsBody, cardData) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardDate = document.createElement('h1');
    cardDate.textContent = cardData.day;
    card.appendChild(cardDate);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const cardMaxTempLabel = document.createElement('p');
    cardMaxTempLabel.classList.add('card-label');
    cardMaxTempLabel.textContent = 'Maximum temperature: ';
    const cardMaxTempValue = document.createElement('span');
    cardMaxTempValue.classList.add('card-value');
    cardMaxTempValue.textContent = cardData.max_temp + '°C';
    cardMaxTempLabel.appendChild(cardMaxTempValue);
    cardInfo.appendChild(cardMaxTempLabel);

    const cardMinTempLabel = document.createElement('p');
    cardMinTempLabel.classList.add('card-label');
    cardMinTempLabel.textContent = 'Minimum temperature: ';
    const cardMinTempValue = document.createElement('span');
    cardMinTempValue.classList.add('card-value');
    cardMinTempValue.textContent = cardData.min_temp + '°C';
    cardMinTempLabel.appendChild(cardMinTempValue);
    cardInfo.appendChild(cardMinTempLabel);

    const cardAvgTempLabel = document.createElement('p');
    cardAvgTempLabel.classList.add('card-label');
    cardAvgTempLabel.textContent = 'Average temperature: ';
    const cardAvgTempValue = document.createElement('span');
    cardAvgTempValue.classList.add('card-value');
    cardAvgTempValue.textContent = cardData.avg_temp + '°C';
    cardAvgTempLabel.appendChild(cardAvgTempValue);
    cardInfo.appendChild(cardAvgTempLabel);

    const cardHumidityLabel = document.createElement('p');
    cardHumidityLabel.classList.add('card-label');
    cardHumidityLabel.textContent = 'Humidity: ';
    const cardHumidityValue = document.createElement('span');
    cardHumidityValue.classList.add('card-value');
    cardHumidityValue.textContent = cardData.humidity + '%';
    cardHumidityLabel.appendChild(cardHumidityValue);
    cardInfo.appendChild(cardHumidityLabel);

    const cardSunriseLabel = document.createElement('p');
    cardSunriseLabel.classList.add('card-label');
    cardSunriseLabel.textContent = 'Sunrise: ';
    const cardSunriseValue = document.createElement('span');
    cardSunriseValue.classList.add('card-value');
    cardSunriseValue.textContent = cardData.sunrise;
    cardSunriseLabel.appendChild(cardSunriseValue);
    cardInfo.appendChild(cardSunriseLabel);

    const cardSunsetLabel = document.createElement('p');
    cardSunsetLabel.classList.add('card-label');
    cardSunsetLabel.textContent = 'Sunset: ';
    const cardSunsetValue = document.createElement('span');
    cardSunsetValue.classList.add('card-value');
    cardSunsetValue.textContent = cardData.sunset;
    cardSunsetLabel.appendChild(cardSunsetValue);
    cardInfo.appendChild(cardSunsetLabel);

    card.appendChild(cardInfo);
    cardsBody.appendChild(card);
}

function updatePagination(data) {
    const totalPages = Math.ceil(data.data.results.length / pageSize);

    const paginationElement = document.getElementById('pagination');

    paginationElement.innerHTML = '';

    const leftButtons = document.createElement('div');

    const firstButton = document.createElement('button');
    const doubleArrowLeft = document.createElement('span');

    doubleArrowLeft.classList.add('material-icons');
    doubleArrowLeft.textContent = 'keyboard_double_arrow_left';
    firstButton.appendChild(doubleArrowLeft);
    firstButton.classList.add('button');
    firstButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage = 1;
            updateWeatherTable(data);
            highlightActivePage();
            hideFarButtons();
        }
    });
    leftButtons.appendChild(firstButton);

    const previousButton = document.createElement('button');
    const arrowLeft = document.createElement('span');
    arrowLeft.classList.add('material-icons');
    arrowLeft.textContent = 'chevron_left';
    previousButton.appendChild(arrowLeft);
    previousButton.classList.add('button');
    previousButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updateWeatherTable(data);
            highlightActivePage();
            hideFarButtons();
        }
    });
    leftButtons.appendChild(previousButton);

    paginationElement.appendChild(leftButtons);

    centerButtons = document.createElement('div');

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');

        pageButton.textContent = i;
        pageButton.classList.add('button');
        pageButton.addEventListener('click', function () {
            currentPage = i;

            updateWeatherTable(data);
            highlightActivePage();
            hideFarButtons();
        });
        centerButtons.appendChild(pageButton);
    }

    paginationElement.appendChild(centerButtons);

    const rightButtons = document.createElement('div');

    const nextButton = document.createElement('button');
    const arrowRight = document.createElement('span');
    arrowRight.classList.add('material-icons');
    arrowRight.textContent = 'chevron_right';
    nextButton.appendChild(arrowRight);
    nextButton.classList.add('button');
    nextButton.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            updateWeatherTable(data);
            highlightActivePage();
            hideFarButtons();
        }
    });
    rightButtons.appendChild(nextButton);

    const lastButton = document.createElement('button');
    const doubleArrowRight = document.createElement('span');
    doubleArrowRight.classList.add('material-icons');
    doubleArrowRight.textContent = 'keyboard_double_arrow_right';
    lastButton.appendChild(doubleArrowRight);
    lastButton.classList.add('button');
    lastButton.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage = totalPages;
            updateWeatherTable(data);
            highlightActivePage();
            hideFarButtons();
        }
    });
    rightButtons.appendChild(lastButton);

    paginationElement.appendChild(rightButtons);

    highlightActivePage();
    hideFarButtons();
}

function highlightActivePage() {
    const paginationButtons = document.querySelectorAll('#pagination .button');
    paginationButtons.forEach((button, index) => {
        if (index - 1 === currentPage) {
            button.classList.add('is-active');
        } else {
            button.classList.remove('is-active');
        }
    });
}

function hideFarButtons() {

    const paginationButtons = document.querySelectorAll('#pagination .button');
    let buttonsN = paginationButtons.length;

    paginationButtons.forEach((button, index) => {
        if (index > 1 && index < buttonsN - 2) {
            if (index < currentPage - 1 || index > currentPage + 3) {
                button.classList.add('hidden');
            } else {
                button.classList.remove('hidden');
            }

            if (index === currentPage - 1 || index === currentPage + 3) {
                button.textContent = '...';
            } else {
                button.textContent = (index - 1).toString();
            }
        }
    });

}

function closeErrorWindow() {
    var errowWindow = document.getElementById('error-window');
    errowWindow.style.display = 'none';

    errorWindowMessages = document.querySelectorAll('#error-window-body p');
    errorWindowMessages.forEach(function (element) {
        element.remove();
    });
}



document.getElementById('close-error-window').addEventListener('click', closeErrorWindow);

var inputCity = document.getElementById('input-city');
var inputDateFrom = document.getElementById('input-date-from');
var inputDateTo = document.getElementById('input-date-to');

inputCity.addEventListener('focus', function () {
    inputCity.classList.remove('error');
});

inputDateFrom.addEventListener('focus', function () {
    inputDateFrom.classList.remove('error');
});

inputDateTo.addEventListener('focus', function () {
    inputDateTo.classList.remove('error');
});

