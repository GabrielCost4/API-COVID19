google.charts.load('current', {
    'packages': ['corechart', 'geochart']
});

google.charts.setOnLoadCallback(carregarDadosGraficos);

function carregarDadosGraficos() {
    fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => {
            // Array para o mapa
            const dataMapa = new Array(dados.data.length + 1);
            dataMapa[0] = ['Country', 'Confirmed Cases']; // Cabeçalho para o gráfico de mapa

            // Variáveis para os totais de status
            let totalConfirmados = 0;
            let totalMortes = 0;
            let totalRecuperados = 0;

            // Preenche o array para o mapa e soma os valores para o gráfico de pizza
            for (let i = 0; i < dados.data.length; i++) {
                const item = dados.data[i];
                dataMapa[i + 1] = [item.country, item.confirmed];

                totalConfirmados += item.confirmed;
                totalMortes += item.deaths;
                totalRecuperados += item.recovered;
            }

            // Converte o array para o formato Google Charts para o mapa
            const dataTableMapa = google.visualization.arrayToDataTable(dataMapa);

            // Cria e desenha o mapa
            const mapChart = new google.visualization.GeoChart(document.getElementById('grafico-mapa'));
            const options = {
                colorAxis: { colors: ['orange', 'cyan', 'red', 'purple'] }
            };
            mapChart.draw(dataTableMapa, options);

            // Dados para o gráfico de pizza
            const dataPizza = google.visualization.arrayToDataTable([
                ['Status', 'Total'],
                ['Confirmados', totalConfirmados],
                ['Recuperados', totalRecuperados],
                ['Mortes', totalMortes]
            ]);

            // Cria e desenha o gráfico de pizza
            const pieChart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));
            pieChart.draw(dataPizza);
        })
        .catch(error => console.error('Erro ao carregar dados para os gráficos:', error));
}

function carregarDadosTabela() {
    fetch('https://covid19-brazil-api.vercel.app/api/report/v1/brazil/20200318')
        .then(response => response.json())
        .then(dados => {
            const linhas = document.getElementById('linhas');
            linhas.innerHTML = '';

            dados.data.forEach(item => {
                const elemento = `<tr>
                    <td>${item.uf}</td>
                    <td>${item.state}</td>
                    <td>${item.cases}</td>
                    <td>${item.deaths}</td>
                </tr>`;
                linhas.innerHTML += elemento;
            });
        })
        .catch(error => console.error('Erro ao carregar dados da tabela:', error));
}

document.addEventListener('DOMContentLoaded', function(event) {
    carregarDadosGraficos();
    carregarDadosTabela();
});