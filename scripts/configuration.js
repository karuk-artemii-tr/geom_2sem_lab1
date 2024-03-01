let tempx = "", tempy = "";
for (let i = -0.5; i <= 0.7; i += 1.2/8) {
    tempx += i.toFixed(2) + ", ";
    tempy += (Math.log(i * i) + i).toFixed(2) + ", ";
}

console.log(tempx)
console.log(tempy)

const x = [-0.50, -0.35, -0.20, -0.05, 0.10, 0.25, 0.40, 0.55, 0.7];
const y = [-1.89, -2.45, -3.42, -6.04, -4.51, -2.52, -1.43, -0.65, 0.39];

// Создаем объект ResearchFunction
const researchFunction = new ResearchFunction('ln10(x^2)+x', { x, y });

// Ваши данные для графика
const trace1 = {
    x: x,
    y: y,
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

var graphData = [trace1, null, null]

// Настройки макета
const layout = {
    title: researchFunction.getName(),
    xaxis: { title: 'X' },
    yaxis: { title: 'Y' },
};

Plotly.newPlot('canvas', [trace1], layout, { scrollZoom: true });

setDatatoInputs(researchFunction);
