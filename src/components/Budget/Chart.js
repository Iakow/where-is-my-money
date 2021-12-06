import React from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const colors = ["#cdcdcdde", "#00C49F", "#cdcdcdde", "#FF8042"];

const Chart = ({ userData, type }) => {
  const { balance, budget, transactions } = userData;

  //TODO это можно делать один раз во время записи в бд и хранить это там в поле
  //TODO а если денег на самом деле больше чем было???? Надо таки писать начальное велью бюджета и юзать его как максимум для чарта
  const calculateMoneySpent = () => {
    const moneySpent = Math.abs(
      Object.values({ ...transactions })
        .filter(
          (transaction) =>
            transaction.date < budget.lastDate &&
            transaction.date > budget.firstDate &&
            transaction.sum < 0
        )
        .reduce((moneySpent, transaction) => moneySpent + transaction.sum, 0)
    );

    return moneySpent;
  };

  const pieData = {
    moneyInfo: [
      { name: "moneySpent", value: calculateMoneySpent() },
      { name: "moneyLeft", value: balance },
    ],
    timeInfo: [
      //TODO Нужна валидация дат в форме, чтобы стартовая не была больше финальной
      { name: "timeSpent", value: Date.now() - budget.firstDate },
      { name: "timeLeft", value: budget.lastDate - Date.now() },
    ],
  };

  const barData = [
    {
      moneyLeft: balance / (calculateMoneySpent() + balance),
      timeLeft:
        (budget.lastDate - Date.now()) / (budget.lastDate - budget.firstDate),
    },
  ];

  if (type === "mobile") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData.timeInfo}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="64%"
            fill="#8884d8"
            startAngle={90}
            endAngle={90 - 360}
            animationDuration={800}
            animationBegin={30}
          >
            <Cell
              fill={"transparent"}
              /* fill={colors[0]} */ stroke={false}
              strokeWidth={0.2}
            />
            <Cell fill={"grey"} stroke={false} />
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
              /* fill={colors[0]} */ stroke={"#40D1FF"}
              fill={"transparent"}
              strokeWidth={0.6}
            />
            <Cell fill={"#40D1FF" /* colors[1] */} stroke={false} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={barData}>
        <XAxis type="number" hide domain={[0, 1]} />
        <YAxis dataKey="name" hide type="category" />
        <Bar
          dataKey="moneyLeft"
          fill={colors[1]}
          barSize={10}
          background={{ fill: "black", fillOpacity: "0.2" }}
        />
        <Bar
          dataKey="timeLeft"
          fill={colors[1]}
          barSize={5}
          background={{ fill: "black", fillOpacity: "0.2" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
