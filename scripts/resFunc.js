class ResearchFunction {
    constructor(name, values) {
        this.name = name;
        this.values = values;
        this.minX = this.findMin(values.x)
        this.maxX = this.findMax(values.x)
        this.minY = this.findMin(values.y)
        this.maxY = this.findMax(values.y)
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getValues() {
        return this.values;
    }
    setValues(values) {
        this.values = values;
    }
    toJSON() {
        return JSON.stringify({name: this.name, values: this.values});
    }

    linearRegression() {
        // Подсчет сумм и средних значений
        const n = this.values.x.length;
        const sumX = this.values.x.reduce((acc, val) => acc + val, 0);
        const sumY = this.values.y.reduce((acc, val) => acc + val, 0);
        const meanX = sumX / n;
        const meanY = sumY / n;
    
        // Вычисление коэффициентов линейной регрессии
        let numerator = 0;
        let denominator = 0;
    
        for (let i = 0; i < n; i++) {
            numerator += (this.values.x[i] - meanX) * (this.values.y[i] - meanY);
            denominator += (this.values.x[i] - meanX) ** 2;
        }
    
        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;
    
        // Возвращаем объект с коэффициентами и функцией прогнозирования
        return {
            coefficients: {
                intercept: parseFloat(intercept.toFixed(2)),
                slope: parseFloat(slope.toFixed(2))
            }
        };
    }

    findMin(arr) {
        let min = arr[0];
        for(let i = 1; i < arr.length; i++) {
            if(arr[i] < arr) min == arr[i];
        }
        return min;
    }

    findMax(arr) {
        let max = arr[0];
        for(let i = 1; i < arr.length; i++) {
            if(arr[i] > arr) min == arr[i];
        }
        return max;
    }

    getLinearDataset() {
        const funcParam = this.linearRegression();
        const newX = [].concat(this.values.x);
        newX.sort((a, b) => a - b);
        const newY = new Array();

        newX.forEach(x => {
            newY.push(x * funcParam.coefficients.slope + funcParam.coefficients.intercept)
        });

        return {x: newX, y: newY}
    }

    getLinearVal(x) {
        const funcParam = this.linearRegression();
        return (x * funcParam.coefficients.slope + funcParam.coefficients.intercept).toFixed(2);
    }


    getDeterminator(matrix) {
        let plus = matrix[0][0] * matrix[1][1] * matrix[2][2] + matrix[0][1] * matrix[1][2] * matrix[2][0] + matrix[0][2] * matrix[1][0] * matrix[2][1];
        let minus = matrix[0][2] * matrix[1][1] * matrix[2][0] + matrix[0][1] * matrix[1][0] * matrix[2][2] + matrix[0][0] * matrix[1][2] * matrix[2][1];

        return plus - minus;
    }
    quadraticRegression() {
        const n = this.values.x.length;
        const xi4 = this.values.x.reduce((acc, val) => acc + val ** 4, 0)
        const xi3 = this.values.x.reduce((acc, val) => acc + val ** 3, 0)
        const xi2 = this.values.x.reduce((acc, val) => acc + val ** 2, 0)
        const xi = this.values.x.reduce((acc, val) => acc + val, 0)
        const yi = this.values.y.reduce((acc, val) => acc + val, 0)

        let temp1 = 0, temp2 = 0;
        for(let i = 0; i < n; i++) {
            temp1 += this.values.x[i] * this.values.x[i] * this.values.y[i]
            temp2 += this.values.x[i] * this.values.y[i];
        }

        const xi2yi = temp1;
        const xiyi = temp2;

        const det = this.getDeterminator([
            [xi4, xi3, xi2],
            [xi3, xi2, xi],
            [xi2, xi, n]
        ])

        const det1 = this.getDeterminator([
            [xi2yi, xi3, xi2],
            [xiyi, xi2, xi],
            [yi, xi, n]
        ])
        const det2 = this.getDeterminator([
            [xi4, xi2yi, xi2],
            [xi3, xiyi, xi],
            [xi2, yi, n]
        ])
        const det3 = this.getDeterminator([
            [xi4, xi3, xi2yi],
            [xi3, xi2, xiyi],
            [xi2, xi, yi]
        ])
        return {
            coefficients: {
                a: parseFloat((det1/det).toFixed(2)),
                b: parseFloat((det2/det).toFixed(2)),
                c: parseFloat((det3/det).toFixed(2))
            }
        };
    }

    getQuadraticDataset() {
        const funcParam = this.quadraticRegression();
        const newX = [].concat(this.values.x);
        newX.sort((a, b) => a - b);
        const newY = new Array();

        newX.forEach(x => {
            newY.push(x * x * funcParam.coefficients.a + x * funcParam.coefficients.b + funcParam.coefficients.c)
        });

        return {x: newX, y: newY}
    }
    getQuadraticVal(x) {
        const funcParam = this.quadraticRegression();
        return (x * x * funcParam.coefficients.a + x * funcParam.coefficients.b + funcParam.coefficients.c).toFixed(2);
    }
    
}