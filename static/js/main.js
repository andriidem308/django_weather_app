let currentPage = 1;
const pageSize = 12;

document.getElementById('get-weather').onclick = () => {
    const weatherRequest = new XMLHttpRequest();
    weatherRequest.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status === 200) {
            const responseData = JSON.parse(this.responseText);
            updateWeatherTable(responseData);
            updatePagination(responseData);
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

function addRow(tableBody, rowData) {
    const row = tableBody.insertRow();

    // Create cells and fill them with data
    const dateCell = row.insertCell(0);
    dateCell.textContent = rowData.date;

    const maxTempCell = row.insertCell(1);
    maxTempCell.textContent = rowData.max_temp;

    const minTempCell = row.insertCell(2);
    minTempCell.textContent = rowData.min_temp;

    const avgTempCell = row.insertCell(3);
    avgTempCell.textContent = rowData.avg_temp;

    const avgHumidityCell = row.insertCell(4);
    avgHumidityCell.textContent = rowData.avg_humidity;

    const sunriseCell = row.insertCell(5);
    sunriseCell.textContent = rowData.sunrise;

    const sunsetCell = row.insertCell(6);
    sunsetCell.textContent = rowData.sunset;
}

function updatePagination(data) {
    const totalPages = Math.ceil(data.data.results.length / pageSize);

    // Assuming you have some element with an ID 'pagination' to display pagination controls
    const paginationElement = document.getElementById('pagination');

    // Clear existing pagination controls
    paginationElement.innerHTML = '';

    // Add previous button
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.classList.add('button');
    previousButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updateWeatherTable(data);
            highlightActivePage();
        }
    });
    paginationElement.appendChild(previousButton);

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('button');
        pageButton.addEventListener('click', function () {
            currentPage = i;
            updateWeatherTable(data);
            highlightActivePage();
        });
        paginationElement.appendChild(pageButton);
    }

    // Add next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('button');
    nextButton.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            updateWeatherTable(data);
            highlightActivePage();
        }
    });
    paginationElement.appendChild(nextButton);

    highlightActivePage();
}

function highlightActivePage() {
    const paginationButtons = document.querySelectorAll('#pagination .button');
    paginationButtons.forEach((button, index) => {
        if (index === currentPage) {
            button.classList.add('is-active');
        } else {
            button.classList.remove('is-active');
        }
    });
}
