function setDatatoInputs(researchFunction) {
    $('#functionName').val(researchFunction.getName());
    let values = researchFunction.getValues();
    $('#intervalsNum').val(values.x.length);

    $('#intervals tbody').empty();
    $('#intervals tbody').append('<tr><th>X</th><th>Y</th></tr>');

    for (let i = 0; i < values.x.length; i++) {
        $('#intervals tbody').append('<tr><td>' +
            ' <input type="number" placeholder="x' + (i + 1) + '" value="' + values.x[i] + '"></td><td>' +
            '<input type="number" placeholder="y' + (i + 1) + '" value="' + values.y[i] + '"></td></tr>');
    }
}

function getNumericFromEnteredString(str) {
    const inputValues = str.split(',');
    return inputValues.map(value => parseFloat(value))
}

function getEnteredValues() {
    let xArray = [];
    let yArray = [];

    // Iterate through each row of the table, skipping the header row
    $('#intervals tbody tr').each(function (index, row) {
        const xValue = parseFloat($(this).find('input[type="number"]:first').val());
        const yValue = parseFloat($(this).find('input[type="number"]:last').val());

        // Check if the values are valid numbers before pushing to arrays
        if (!isNaN(xValue) && !isNaN(yValue)) {
            xArray.push(xValue);
            yArray.push(yValue);
        }
    });

    return (
        {
            name: $('#functionName').val(),
            values: {
                x: xArray,
                y: yArray
            }
        }
    )
}

function showCalculatedFunctions() {
    let line = "";
    let qadratic = "";

    const linereg = researchFunction.linearRegression();
    const qadreg = researchFunction.quadraticRegression();

    line += "[ k = " + linereg.coefficients.slope + "; b = " + linereg.coefficients.intercept + " ]";


    $('#lineReg').text(line);

    qadratic += "[ a = " + qadreg.coefficients.a + "; b = " + qadreg.coefficients.b + "; c = " + qadreg.coefficients.c + " ]";

    $('#qadReg').text(qadratic);

}

function updateGraph() {
    const funcValues = researchFunction.getValues()
    const linearDataset = researchFunction.getLinearDataset();
    const quadraticDataset = researchFunction.getQuadraticDataset();

    const updatedTrace1 = {
        x: funcValues.x,
        y: funcValues.y,
        type: 'scatter',
        mode: 'line',
        marker: { color: 'black', size: 10 },
        line: { shape: 'linear' },
        line: {
            dash: 'dashdot',
            width: 3,
            color: 'black'
        }
    };



    const updatedTrace2 = {
        x: linearDataset.x,
        y: linearDataset.y,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'orange' },
    };

    const updatedTrace3 = {
        x: quadraticDataset.x,
        y: quadraticDataset.y,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'blue', shape: 'spline' },
    };

    layout.title = researchFunction.getName();

    graphData[0] = updatedTrace1;
    graphData[1] = updatedTrace2;
    graphData[2] = updatedTrace3;

    Plotly.purge('canvas');

    // Создаем новый график с обновленными данными
    Plotly.newPlot('canvas', [updatedTrace1, updatedTrace2, updatedTrace3], layout, { scrollZoom: true });
}

function calculate() {
    const enteredValues = getEnteredValues();
    console.log(enteredValues)
    researchFunction.setName(enteredValues.name);
    researchFunction.setValues(enteredValues.values);
    $('.results').css('display', 'flex');
    showCalculatedFunctions();
}


$('#calculate').on('click', function () {
    calculate()
    updateGraph()
})

$('.clear').on('click', function () {
    $('.results').hide();
    $('#functionName').val("")
    $('#intervals tbody').empty();
    $('#intervalsNum').val(0)

})

$('.showGraph button').on('click', function () {
    $(this).toggleClass('onScreen');


    let newData = [];

    if ($('#showTest').hasClass('onScreen')) {
        newData.push(graphData[0])
    }
    if ($('#showLine').hasClass('onScreen')) {
        newData.push(graphData[1])
    }
    if ($('#showParab').hasClass('onScreen')) {
        newData.push(graphData[2])
    }
    // Уничтожаем старый график
    Plotly.purge('canvas');

    // Создаем новый график с обновленными данными
    Plotly.newPlot('canvas', newData, layout, { scrollZoom: true });
});

$('#saveToFile').on('click', function () {
    downloadJSON(researchFunction.toJSON(), researchFunction.getName())
})

function downloadJSON(jsonData, filename) {
    const blob = new Blob([jsonData], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    // Добавляем элемент в DOM, чтобы сработало событие "click"
    document.body.appendChild(a);

    // Нажимаем на элемент, чтобы начать скачивание
    a.click();

    // Удаляем элемент из DOM после скачивания
    document.body.removeChild(a);
}

// Функция для загрузки и парсинга JSON из файла
function loadAndParseJSON(callback) {
    const input = document.getElementById('file');

    // Просим пользователя выбрать файл
    input.addEventListener('change', function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            // Событие срабатывает после успешного чтения файла
            reader.onload = function (event) {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    callback(null, jsonData);
                } catch (error) {
                    callback(error, null);
                }
            };

            // Считываем содержимое файла
            reader.readAsText(file);
        }
    });
}

// Пример использования
loadAndParseJSON(function (error, data) {
    if (error) {
        console.error('Ошибка при загрузке и парсинге JSON:', error);
    } else {
        researchFunction.setName(data.name);
        researchFunction.setValues(data.values);
        setDatatoInputs(researchFunction);
    }
});

$('#findYbyX').on('input', function () {
    let x = $(this).val();
    const lineY = researchFunction.getLinearVal(parseFloat(x));
    const quadY = researchFunction.getQuadraticVal(parseFloat(x));

    $('#lineRegRes').text('[ ' + x + " ; " + lineY + " ]")
    $('#qadRegRes').text('[ ' + x + " ; " + quadY + " ]")

})

$('#intervalsNum').on('input', function () {
    const len = $(this).val();

    // Check if the entered value is greater than 0
    if (len <= 0) {
        // Clear tbody if the length is not positive
        $('#intervals tbody').empty();
        return;
    }

    // Clear previous data rows (without removing headers)
    $('#intervals tbody').empty();

    $('#intervals tbody').append('<tr><th>X</th><th>Y</th></tr>');
    for (let i = 1; i <= len; i++) {
        $('#intervals tbody').append('<tr><td><input type="number" placeholder = "x' + i + '"></td><td><input type="number" placeholder = "y' + i + '"></td></tr>');
    }
});
