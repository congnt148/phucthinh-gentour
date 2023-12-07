import logo from "./logo.svg";
import "./App.css";
import fs from "fs";
import path from "path";

function App() {
  const exportHTML = () => {
    const contentPath = path.join(process.cwd(), "./templater.html");
    const content = fs.readFileSync(contentPath, "utf-8");

    var source =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(content);
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = "document.doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => exportHTML()}>Gen</button>
      </header>
    </div>
  );
}

export default App;
