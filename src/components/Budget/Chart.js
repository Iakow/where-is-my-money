import React, { useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";
import { makeStyles } from "@material-ui/core";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  money: {
    filter: "blur(1.5px)",
  },
}));

const colors = ["#a3a3a3", "#00C49F", "#6d5d51", "#FF8042"];

const Chart = ({ type }) => {
  const { balance, budget, transactions } = useContext(UserDataContext);
  const classes = useStyles();

  function calculateData() {
    let moneySpent = 0;
    Object.values(transactions)
      .filter(({ date }) => date < budget.lastDate && date > budget.firstDate)
      .forEach(({ sum }) => {
        if (sum < 0) moneySpent += Math.abs(sum);
      });

    const moneyLeft = balance;
    const timeLeft = budget.lastDate - Date.now();
    const timeSpent = Date.now() - budget.firstDate;
    const moneyLeftPercentage = moneyLeft / (moneySpent + moneyLeft);
    const timeLeftPercentage = timeLeft / (budget.lastDate - budget.firstDate);

    const barData = [{ moneyLeftPercentage, timeLeftPercentage }];
    const pieData = {
      moneyInfo: [
        { name: "moneySpent", value: moneySpent },
        { name: "moneyLeft", value: moneyLeft },
      ],
      timeInfo: [
        { name: "timeSpent", value: timeSpent },
        { name: "timeLeft", value: timeLeft },
      ],
    };

    const getPieColor = () => {
      const green = "#71D28D";
      const red = "#ff6060";
      const yellow = "#ffe664";

      const ratio = moneyLeftPercentage / timeLeftPercentage;

      if (ratio >= 0.8) {
        return green;
      } else if (ratio < 1.8 && ratio > 0.5) {
        return yellow;
      } else {
        return red;
      }
    };

    return { barData, pieData, color: getPieColor() };
  }

  if (type === "mobile" && !!budget) {
    const { pieData, color } = calculateData();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData.timeInfo}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="0%"
            outerRadius="88%"
            fill="#8884d8"
            startAngle={90}
            endAngle={90 - 360}
            animationDuration={800}
            animationBegin={30}
          >
            <Cell fill={"transparent"} stroke="false" strokeWidth={0.2} />
            <Cell fill="#f5fefd0d" stroke="false" />
          </Pie>

          <Pie
            data={pieData.moneyInfo}
            dataKey="value"
            cx="50%"
            animationDuration={600}
            animationBegin={20}
            cy="50%"
            innerRadius="66%"
            outerRadius="80%"
            fill="#82ca9d"
            /* label */
            startAngle={90}
            endAngle={90 - 360}
          >
            <Cell
              stroke={color}
              fill={"transparent"}
              strokeWidth={0.3}
            />
            <Cell
              className={classes.money}
              fill={color}
              stroke="false"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "mobile" && !budget)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{ name: "moneyLeft", value: 100 }]}
            dataKey="value"
            cx="50%"
            animationDuration={600}
            animationBegin={20}
            cy="50%"
            innerRadius="66%"
            outerRadius="80%"
            fill="#82ca9d"
            /* label */
            startAngle={90}
            endAngle={90 - 360}
          >
            <Cell
              /* fill={colors[0]} */ stroke="false"
              fill="#88888812"
              /* strokeWidth={0.3} */
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );

  if (!!budget && type === "desktop") {
    const { barData } = calculateData();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={barData}>
          <XAxis type="number" hide domain={[0, 1]} />
          <YAxis dataKey="name" hide type="category" />
          <Bar
            dataKey="moneyLeftPercentage"
            fill={colors[1]}
            barSize={10}
            background={{ fill: "black", fillOpacity: "0.2" }}
          />
          <Bar
            dataKey="timeLeftPercentage"
            fill={colors[0]}
            barSize={5}
            background={{ fill: "black", fillOpacity: "0.2" }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return "";
};

export default Chart;
