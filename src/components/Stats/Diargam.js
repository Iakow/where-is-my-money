import React from 'react';
import { makeStyles, mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
  },
}));
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];

const Diagram = ({ data }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={250}>
          <Pie
            data={data.outcome}
            dataKey="sum"
            nameKey="name"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            animationDuration={800}
            animationBegin={30}
            label
          >
            {data.outcome.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={250}>
          <Pie
            data={data.income}
            dataKey="sum"
            nameKey="name"
            cx="50%"
            cy="50%"
            fill="#8884d8"
            animationDuration={800}
            animationBegin={30}
            label
          />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Diagram;
