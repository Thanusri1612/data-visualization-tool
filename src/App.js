import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import './App.css';
import logo from "./assets/logos.svg";
 // Adjust if using SVG or different path

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
    <div className="App">
      <div className="header">
        <img src={logo} alt="ScientiFlow Logo" className="logo" />
        <h1 className="title">ScientiFlow Data Visualization Tool</h1>
      </div>

      <div className="upload-section">
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose CSV File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {columns.length > 0 && (
        <>
          <div className="dropdowns">
            <label>X-axis:</label>
            <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <label>Y-axis:</label>
            <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <label>Plot Type:</label>
            <select value={plotType} onChange={(e) => setPlotType(e.target.value)}>
              <option value="scatter">Scatter Plot</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

          <div id="plot-container" className="plot-container">
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

          <button className="download-btn" onClick={exportPlotAsPNG}>
            Download Plot as PNG
          </button>
        </>
      )}
    </div>
  );
}

export default App;
