import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import html2canvas from "html2canvas";

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [plotType, setPlotType] = useState("scatter");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data);
        setColumns(Object.keys(results.data[0]));
        setXColumn(Object.keys(results.data[0])[0]);
        setYColumn(Object.keys(results.data[0])[1]);
      },
    });
  };

  const exportPlotAsPNG = () => {
    const plot = document.getElementById("plot-container");
    html2canvas(plot).then((canvas) => {
      const link = document.createElement("a");
      link.download = "plot.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const xValues = data.map((row) => row[xColumn]);
  const yValues = data.map((row) => row[yColumn]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Data Visualization Tool</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <br /><br />

      {columns.length > 0 && (
        <>
          <label>X-axis:</label>
          <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "10px" }}>Y-axis:</label>
          <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "10px" }}>Plot Type:</label>
          <select value={plotType} onChange={(e) => setPlotType(e.target.value)}>
            <option value="scatter">Scatter Plot</option>
            <option value="bar">Bar Chart</option>
          </select>

          <div id="plot-container" style={{ marginTop: "30px" }}>
            <Plot
              data={[
                {
                  x: xValues,
                  y: yValues,
                  type: plotType,
                  mode: plotType === "scatter" ? "markers" : undefined,
                  marker: { color: "blue" },
                },
              ]}
              layout={{ title: `${plotType.toUpperCase()} of ${yColumn} vs ${xColumn}` }}
            />
          </div>

          <button onClick={exportPlotAsPNG}>Download Plot as PNG</button>
        </>
      )}
    </div>
  );
}

export default App;
