import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

import { Paper, Button } from "@mui/material";

const numRows = 30;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [1, -1],
  [-1, 1],
  [1, 1],
];

const EmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return EmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    // Simulation
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            // calulate no. of neighbors
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            // rules of neighbors is less than 2 or greater than 3 cell dies (0)
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              // if neighbors is to 3 cell lives
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper
        elevation={3}
        style={{ height: "10vh", margin: 20, marginBottom: 0, width: "1000px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          color="success"
          style={{
            height: "90px",
            width: "300px",
            marginRight: 15,
            marginLeft: 15,
          }}
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          <h1>{running ? "Stop" : "Start"}</h1>
        </Button>
        <Button
          color="error"
          size="large"
          style={{
            height: "90px",
            width: "300px",
            marginRight: 15,
            marginLeft: 15,
          }}
          onClick={() => {
            setGrid(EmptyGrid());
          }}
        >
          <h1>Clear</h1>
        </Button>
        <Button
          color="primary"
          style={{
            height: "90px",
            width: "300px",
            marginRight: 15,
            marginLeft: 15,
          }}
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }

            setGrid(rows);
          }}
        >
          <h1>Seed Random</h1>
        </Button>
      </Paper>
      <Paper
        elevation={3}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "1000px",
          margin: 20,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "grey" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </Paper>
    </div>
  );
};

export default App;
