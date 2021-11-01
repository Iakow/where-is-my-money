import React from 'react';
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
} from 'recharts';

const colors = ['#cdcdcdde', '#00C49F', '#cdcdcdde', '#FF8042'];

const Chart = ({ userData, type }) => {
  const { balance, budget, transactions } = userData;

  //TODO это можно делать один раз во время записи в бд и хранить это там в поле
  //TODO а если денег на самом деле больше чем было???? Надо таки писать начальное велью бюджета и юзать его как максимум для чарта
  const calculateMoneySpent = () =>
    Math.abs(
      Object.values({ ...transactions })
        .filter(
          transaction => transaction.date < budget.lastDate && transaction.date > budget.firstDate,
        )
        .reduce((moneySpent, transaction) => moneySpent + transaction.sum, 0),
    );

  const pieData = {
    moneyInfo: [
      { name: 'moneySpent', value: calculateMoneySpent() },
      { name: 'moneyLeft', value: balance },
    ],
    timeInfo: [
      //TODO Нужна валидация дат в форме, чтобы стартовая не была больше финальной
      { name: 'timeSpent', value: Date.now() - budget.firstDate },
      { name: 'timeLeft', value: budget.lastDate - Date.now() },
    ],
  };

  const barData = [
    {
      moneyLeft: balance / (calculateMoneySpent() + balance),
      timeLeft: (budget.lastDate - Date.now()) / (budget.lastDate - budget.firstDate),
    },
  ];

  if (type === 'mobile') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData.timeInfo}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="32%"
            fill="#8884d8"
            startAngle={90}
            endAngle={90 - 360}
            animationDuration={800}
            animationBegin={30}
          >
            <Cell fill={colors[0]} />
            <Cell fill={colors[3]} />
          </Pie>

          <Pie
            data={pieData.moneyInfo}
            dataKey="value"
            cx="50%"
            animationDuration={600}
            animationBegin={20}
            cy="50%"
            innerRadius="33%"
            outerRadius="46%"
            fill="#82ca9d"
            label
            startAngle={90}
            endAngle={90 - 360}
          >
            <Cell fill={colors[0]} />
            <Cell fill={colors[1]} />
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
          background={{ fill: 'black', fillOpacity: '0.2' }}
        />
        <Bar
          dataKey="timeLeft"
          fill={colors[1]}
          barSize={5}
          background={{ fill: 'black', fillOpacity: '0.2' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
